import { supabase } from './supabaseClient';

// ---- Armazenamento por REGISTRO (uma linha por item) ----
// Evita que duas pessoas usando o sistema ao mesmo tempo apaguem o trabalho uma da outra:
// cada gravação mexe só nos registros que realmente mudaram, nunca substitui a coleção inteira.
//
// TRAVA DE CONFLITO: antes de gravar, conferimos se o registro no banco ainda é o mesmo que
// este navegador viu. Se outra pessoa alterou no meio do caminho, a gravação é RECUSADA e nada
// é sobrescrito — o sistema avisa e pede para recarregar. Isso impede a perda silenciosa que
// acontecia quando duas sessões mexiam no mesmo produto.

// O Postgres reordena as chaves do JSON ao guardar, então comparar o texto de JSON.stringify
// contra o que volta do banco acusaria diferença mesmo quando o conteúdo é idêntico. Esta função
// gera um texto canônico (chaves em ordem alfabética, em qualquer profundidade) para comparar
// conteúdo de verdade.
function jsonEstavel(valor) {
  if (valor === null || typeof valor !== 'object') return JSON.stringify(valor) ?? 'null';
  if (Array.isArray(valor)) return '[' + valor.map(jsonEstavel).join(',') + ']';
  const chaves = Object.keys(valor).filter(k => valor[k] !== undefined).sort();
  return '{' + chaves.map(k => JSON.stringify(k) + ':' + jsonEstavel(valor[k])).join(',') + '}';
}

// O Supabase devolve no máximo 1000 linhas por requisição. Sem paginação, uma coleção grande
// era cortada em silêncio e o sistema passava a trabalhar com dados incompletos.
async function lerColecaoPaginada(collection) {
  const TAMANHO_PAGINA = 1000;
  const todas = [];
  // Avança pelo número de linhas realmente recebidas: se o servidor limitar a resposta a
  // menos linhas do que pedimos, nenhuma linha é pulada — só fazemos mais requisições.
  let inicio = 0;
  for (;;) {
    const { data, error } = await supabase
      .from('sgm_records')
      .select('id, data')
      .eq('collection', collection)
      .order('id', { ascending: true })
      .range(inicio, inicio + TAMANHO_PAGINA - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    todas.push(...data);
    inicio += data.length;
  }
  return todas;
}

// Carrega todos os registros de uma coleção (ex: 'estoque', 'vendas', 'clientes'...).
// IMPORTANTE: se a leitura falhar, agora LANÇA erro em vez de devolver lista vazia em silêncio.
// Antes, uma falha de rede fazia o sistema achar que o estoque estava zerado — e a partir daí
// qualquer lançamento era descartado sem aviso nenhum.
export async function loadCollection(collection) {
  const linhas = await lerColecaoPaginada(collection);
  return linhas.map(r => r.data);
}

// Confere se cada registro que vamos gravar ainda está no banco exatamente como estava na BASE
// que esta operação usou para calcular a alteração. Se não estiver, alguém mexeu no meio do
// caminho (outra pessoa, outra aba, ou esta mesma tela partindo de dados defasados) e gravar
// apagaria o trabalho dessa pessoa. Devolve a lista de ids em conflito (vazia = caminho livre).
async function detectarConflitos(collection, ids, porIdBase) {
  const conflitos = [];
  const TAMANHO_LOTE = 200;
  for (let i = 0; i < ids.length; i += TAMANHO_LOTE) {
    const fatia = ids.slice(i, i + TAMANHO_LOTE);
    const { data, error } = await supabase
      .from('sgm_records')
      .select('id, data')
      .eq('collection', collection)
      .in('id', fatia);
    if (error) throw error;
    const noBanco = new Map((data || []).map(r => [String(r.id), jsonEstavel(r.data)]));
    for (const id of fatia) {
      const versaoBanco = noBanco.get(id) ?? null;
      // Registro sendo criado agora: não está na base nem deve estar no banco. Não é conflito.
      const versaoBase = porIdBase.has(id) ? jsonEstavel(porIdBase.get(id)) : null;
      if (versaoBanco !== versaoBase) conflitos.push(id);
    }
  }
  return conflitos;
}

// Calcula o que mudou entre a lista anterior (que este navegador tinha) e a nova lista,
// e grava só a diferença (itens novos/alterados são gravados, itens removidos são apagados).
//
// Retorna { ok, conflito, itens, erro }:
//   { ok: true }                          gravou (ou não havia nada a gravar)
//   { ok: false, conflito: true, itens }  outra pessoa alterou — NADA foi gravado
//   { ok: false, erro }                   falha de rede/banco — NADA foi gravado
export async function saveCollectionDelta(collection, anterior, novo, opcoes = {}) {
  const porIdAnterior = new Map((anterior || []).map(i => [String(i.id), i]));
  const porIdNovo = new Map((novo || []).map(i => [String(i.id), i]));

  const upsertItems = [];
  for (const [id, item] of porIdNovo) {
    const antes = porIdAnterior.get(id);
    if (!antes || JSON.stringify(antes) !== JSON.stringify(item)) upsertItems.push(item);
  }
  const deleteIds = [];
  for (const id of porIdAnterior.keys()) {
    if (!porIdNovo.has(id)) deleteIds.push(id);
  }

  if (upsertItems.length === 0 && deleteIds.length === 0) return { ok: true };

  try {
    if (!opcoes.ignorarConflito) {
      const ids = [...upsertItems.map(i => String(i.id)), ...deleteIds];
      const conflitos = await detectarConflitos(collection, ids, porIdAnterior);
      if (conflitos.length > 0) return { ok: false, conflito: true, itens: conflitos };
    }

    if (upsertItems.length > 0) {
      const rows = upsertItems.map(item => ({ collection, id: String(item.id), data: item }));
      const { error } = await supabase.from('sgm_records').upsert(rows, { onConflict: 'collection,id' });
      if (error) throw error;
    }
    if (deleteIds.length > 0) {
      const { error } = await supabase.from('sgm_records').delete().eq('collection', collection).in('id', deleteIds);
      if (error) throw error;
    }
    return { ok: true };
  } catch (e) {
    console.error('Erro ao salvar', collection, e);
    return { ok: false, erro: e };
  }
}

// Grava uma lista inteira de uma vez. Usado só em migrações/seeds automáticos que criam dados
// do zero — por isso passa por cima da trava de conflito. Nunca use em operação normal.
export async function saveCollectionFull(collection, items) {
  return saveCollectionDelta(collection, [], items, { ignorarConflito: true });
}

// ---- Armazenamento de configuração única (não é uma lista, ex: senha de aprovação) ----
export async function loadConfig(key, fallback) {
  const { data, error } = await supabase
    .from('sgm_records')
    .select('data')
    .eq('collection', 'config')
    .eq('id', key)
    .maybeSingle();
  if (error) throw error;
  if (!data) return fallback;
  return data.data;
}
export async function saveConfig(key, value) {
  try {
    const { error } = await supabase.from('sgm_records').upsert([{ collection: 'config', id: key, data: value }], { onConflict: 'collection,id' });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error('Erro ao salvar config', key, e);
    return false;
  }
}

// ---- Migração automática e única dos dados antigos (tabela sgm_storage -> sgm_records) ----
// Roda sozinha na primeira vez que alguém abrir o sistema depois da atualização. Não apaga
// a tabela antiga (fica lá, sem uso, como backup extra) e não faz nada se já tiver migrado.
const COLECOES_ANTIGAS = [
  'sgm:estoque', 'sgm:clientes', 'sgm:fornecedores', 'sgm:vendas', 'sgm:orcamentos',
  'sgm:expedicoes', 'sgm:pedidosCompra', 'sgm:recebimentos', 'sgm:depositos', 'sgm:transferencias',
  'sgm:formasRecebimento', 'sgm:pagamentos', 'sgm:ajustesReposicao', 'sgm:balancos',
];

export async function migrarDadosAntigosSeNecessario() {
  try {
    const { count, error: errCheck } = await supabase.from('sgm_records').select('*', { count: 'exact', head: true });
    if (errCheck) return;
    if (count && count > 0) return; // já tem dados novos, não migra de novo

    const { data: antigos, error } = await supabase.from('sgm_storage').select('key, value');
    if (error || !antigos || antigos.length === 0) return;

    for (const linha of antigos) {
      const nomeColecao = linha.key.replace(/^sgm:/, '');
      if (linha.key === 'sgm:senhaAprovacao') {
        if (linha.value) await saveConfig('senhaAprovacao', linha.value);
        continue;
      }
      if (!COLECOES_ANTIGAS.includes(linha.key)) continue;
      const itens = Array.isArray(linha.value) ? linha.value : [];
      if (itens.length > 0) await saveCollectionFull(nomeColecao, itens);
    }
    console.log('Migração de dados antigos concluída.');
  } catch (e) {
    console.error('Erro na migração automática', e);
  }
}

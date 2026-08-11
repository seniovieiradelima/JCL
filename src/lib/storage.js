import { supabase } from './supabaseClient';

// ---- Armazenamento por REGISTRO (uma linha por item) ----
// Evita que duas pessoas usando o sistema ao mesmo tempo apaguem o trabalho uma da outra:
// cada gravação mexe só nos registros que realmente mudaram, nunca substitui a coleção inteira.

// Carrega todos os registros de uma coleção (ex: 'estoque', 'vendas', 'clientes'...)
export async function loadCollection(collection, fallback) {
  const { data, error } = await supabase
    .from('sgm_records')
    .select('data')
    .eq('collection', collection);
  if (error || !data) return fallback;
  return data.map(r => r.data);
}

// Calcula o que mudou entre a lista anterior (que este navegador tinha) e a nova lista,
// e grava só a diferença (itens novos/alterados são gravados, itens removidos são apagados).
export async function saveCollectionDelta(collection, anterior, novo) {
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

  try {
    if (upsertItems.length > 0) {
      const rows = upsertItems.map(item => ({ collection, id: String(item.id), data: item }));
      const { error } = await supabase.from('sgm_records').upsert(rows, { onConflict: 'collection,id' });
      if (error) throw error;
    }
    if (deleteIds.length > 0) {
      const { error } = await supabase.from('sgm_records').delete().eq('collection', collection).in('id', deleteIds);
      if (error) throw error;
    }
    return true;
  } catch (e) {
    console.error('Erro ao salvar', collection, e);
    return false;
  }
}

// Grava uma lista inteira de uma vez (usado só em migrações/seeds automáticos, não em uso normal)
export async function saveCollectionFull(collection, items) {
  return saveCollectionDelta(collection, [], items);
}

// ---- Armazenamento de configuração única (não é uma lista, ex: senha de aprovação) ----
export async function loadConfig(key, fallback) {
  const { data, error } = await supabase
    .from('sgm_records')
    .select('data')
    .eq('collection', 'config')
    .eq('id', key)
    .maybeSingle();
  if (error || !data) return fallback;
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

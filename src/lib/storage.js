import { supabase } from './supabaseClient';

// Carrega o valor salvo para uma chave. Retorna `fallback` se não existir ou der erro.
export async function loadKey(key, fallback) {
  const { data, error } = await supabase
    .from('sgm_storage')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error || !data) return fallback;
  return data.value;
}

// Salva o valor para uma chave. Retorna true em caso de sucesso, false em caso de falha.
export async function saveKey(key, value) {
  const { error } = await supabase
    .from('sgm_storage')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) {
    console.error('Erro ao salvar', key, error);
    return false;
  }
  return true;
}

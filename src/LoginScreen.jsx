import React, { useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro('E-mail ou senha inválidos.');
    setCarregando(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-md bg-amber-500 flex items-center justify-center font-bold text-slate-900 text-sm">EM</div>
          <div>
            <h1 className="text-base font-semibold text-slate-800 leading-tight">Estação Mossoró</h1>
            <p className="text-xs text-slate-400 leading-tight">Sistema de Gestão</p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
          />
          {erro && <p className="text-xs text-red-500">{erro}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-medium text-sm px-4 py-2 rounded-md"
          >
            {carregando && <Loader2 size={14} className="animate-spin" />}
            Entrar
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-4">Acesso restrito à equipe. Peça ao administrador para criar seu usuário no painel do Supabase.</p>
      </div>
    </div>
  );
}

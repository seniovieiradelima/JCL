import React, { useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'cadastro'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [funcao, setFuncao] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro(''); setAviso('');
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro('E-mail ou senha inválidos.');
    setCarregando(false);
  }

  async function cadastrar(e) {
    e.preventDefault();
    setErro(''); setAviso('');
    if (!nome.trim()) { setErro('Informe seu nome completo.'); return; }
    if (!funcao.trim()) { setErro('Informe sua função (ex: vendedor, expedição, financeiro).'); return; }
    if (!email.trim()) { setErro('Informe seu e-mail.'); return; }
    if (senha.length < 6) { setErro('A senha precisa de pelo menos 6 caracteres.'); return; }
    if (senha !== senha2) { setErro('As senhas não conferem.'); return; }
    setCarregando(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: senha,
      options: { data: { nome: nome.trim(), telefone: telefone.trim(), funcao: funcao.trim() } },
    });
    setCarregando(false);
    if (error) {
      setErro(error.message.includes('already') ? 'Este e-mail já tem conta — use "Entrar".' : `Não foi possível criar a conta: ${error.message}`);
      return;
    }
    // Com confirmação de e-mail ligada no Supabase, não há sessão ainda.
    if (!data.session) {
      setAviso('Conta criada! Confirme seu e-mail (verifique a caixa de entrada) e depois entre. O acesso será liberado quando o administrador aprovar seu cadastro.');
      setModo('entrar');
    }
    // Com sessão imediata, o App mostra a tela "aguardando aprovação" sozinho.
  }

  const inputCls = 'w-full border border-slate-200 rounded-md px-3 py-2 text-sm';

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

        <div className="flex gap-1 mb-4">
          <button type="button" onClick={() => { setModo('entrar'); setErro(''); }} className={`flex-1 text-sm px-3 py-1.5 rounded-md border ${modo === 'entrar' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500'}`}>Entrar</button>
          <button type="button" onClick={() => { setModo('cadastro'); setErro(''); setAviso(''); }} className={`flex-1 text-sm px-3 py-1.5 rounded-md border ${modo === 'cadastro' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500'}`}>Criar conta</button>
        </div>

        {modo === 'entrar' ? (
          <div className="space-y-3">
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
            <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} className={inputCls} />
            {erro && <p className="text-xs text-red-500">{erro}</p>}
            {aviso && <p className="text-xs text-emerald-600">{aviso}</p>}
            <button type="button" onClick={entrar} disabled={carregando} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
              {carregando && <Loader2 size={14} className="animate-spin" />} Entrar
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input placeholder="Nome completo *" value={nome} onChange={e => setNome(e.target.value)} className={inputCls} />
            <input placeholder="Função (ex: vendedor, expedição) *" value={funcao} onChange={e => setFuncao(e.target.value)} className={inputCls} />
            <input placeholder="Telefone / WhatsApp" value={telefone} onChange={e => setTelefone(e.target.value)} className={inputCls} />
            <input type="email" placeholder="E-mail *" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
            <input type="password" placeholder="Senha (mín. 6 caracteres) *" value={senha} onChange={e => setSenha(e.target.value)} className={inputCls} />
            <input type="password" placeholder="Repita a senha *" value={senha2} onChange={e => setSenha2(e.target.value)} className={inputCls} />
            {erro && <p className="text-xs text-red-500">{erro}</p>}
            <button type="button" onClick={cadastrar} disabled={carregando} className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
              {carregando && <Loader2 size={14} className="animate-spin" />} Criar conta
            </button>
            <p className="text-[11px] text-slate-400">Seu cadastro fica <strong>aguardando aprovação do administrador</strong> — o acesso aos dados só é liberado depois do OK dele.</p>
          </div>
        )}

        {modo === 'entrar' && <p className="text-[11px] text-slate-400 mt-4">Equipe nova? Use "Criar conta" — o administrador aprova e libera o acesso.</p>}
      </div>
    </div>
  );
}

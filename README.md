# Sistema de Gestão — Estação Mossoró

## 1. Configurar o banco de dados (Supabase)

1. Acesse seu projeto em https://supabase.com/dashboard
2. Vá em **SQL Editor** → **New query**
3. Cole o conteúdo do arquivo `supabase-schema.sql` e clique em **Run**
4. Vá em **Authentication → Users → Add user** e crie um login (e-mail + senha) para cada pessoa da equipe que vai usar o sistema

## 2. Rodar localmente (opcional, para testar antes de publicar)

```bash
npm install
cp .env.example .env
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente http://localhost:5173).

## 3. Publicar no Vercel

1. Suba esta pasta para um repositório no GitHub (crie um repositório novo e faça push destes arquivos)
2. Acesse https://vercel.com, clique em **Add New → Project** e importe esse repositório
3. Na tela de configuração, adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL` → `https://xxqbeeighccssfqlomxz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` → a chave publishable do Supabase
4. Clique em **Deploy**

Em poucos minutos o Vercel te dá uma URL pública (tipo `sgm-estacao-mossoro.vercel.app`), já acessível de qualquer navegador.

## 4. Domínio próprio (opcional)

No painel do projeto na Vercel: **Settings → Domains** → adicione seu domínio (ex: `gestao.estacaomossoro.com.br`) e siga as instruções de DNS que a Vercel mostra.

## 5. Atualizações futuras

Quando eu (Claude) fizer uma melhoria no sistema, basta:
1. Substituir o arquivo `src/App.jsx` pela versão nova
2. Fazer commit e push no GitHub (a Vercel publica automaticamente)

Os dados **não são apagados** nessas atualizações — eles ficam no Supabase, separados do código.

## Login

Cada pessoa da equipe entra com o e-mail e senha criados no passo 1 (Authentication → Users). Não existe cadastro público — só o administrador cria novos acessos pelo painel do Supabase.

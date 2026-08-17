# Sistema de Gestão — Estação Mossoró

## Atualizar uma versão já publicada (o caso mais comum)

1. Substitua **apenas** o arquivo `src/App.jsx` pelo novo que veio neste pacote.
2. Faça commit e push no repositório GitHub já conectado à Vercel:
   ```bash
   git add src/App.jsx
   git commit -m "Atualização do sistema"
   git push
   ```
3. A Vercel publica sozinha em 1-2 minutos. Os dados no Supabase **não são afetados** — essa atualização só troca código.

## Configuração do zero (primeira vez)

### 1. Banco de dados (Supabase)
1. Acesse seu projeto em https://supabase.com/dashboard
2. Vá em **SQL Editor** → **New query**, cole o conteúdo de `supabase-schema.sql` e rode
3. Vá em **Authentication → Users → Add user** e crie um login (e-mail + senha) para cada pessoa da equipe

### 2. Rodar localmente (opcional)
```bash
npm install
cp .env.example .env
npm run dev
```

### 3. Publicar no Vercel
1. Suba esta pasta para um repositório no GitHub
2. Em https://vercel.com → **Add New → Project** → importe o repositório
3. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy**

### 4. Domínio próprio (opcional)
No projeto na Vercel: **Settings → Domains** → adicione seu domínio e siga as instruções de DNS.

## Login
Cada pessoa da equipe entra com e-mail e senha criados em Authentication → Users no Supabase. Não existe cadastro público.

# Neural Studio - Hub de Prompts

SaaS exclusivo para clientes que compraram via Hubla. Sistema de autenticação com Supabase e webhook para criação automática de usuários.

## 🚀 Funcionalidades

- ✅ Login com e-mail e senha (sem Google OAuth)
- ✅ Webhook da Hubla para criação automática de usuários
- ✅ Painel de prompts exclusivo para usuários autenticados
- ✅ Design responsivo e tema escuro
- ✅ Recuperação de senha via e-mail

## 🔧 Configuração do Supabase

### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e as chaves do projeto

### 2. Configurar autenticação
No painel do Supabase:
1. Vá em **Authentication > Settings**
2. Desabilite **Enable email confirmations** (para desenvolvimento)
3. Configure **Site URL**: `http://localhost:3000` (desenvolvimento)
4. Em **Auth > URL Configuration**, adicione:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/login`

### 3. Configurar políticas RLS (Row Level Security)
Execute no SQL Editor do Supabase:

\`\`\`sql
-- Permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON auth.users
FOR SELECT USING (auth.uid() = id);

-- Permitir inserção de novos usuários via webhook
CREATE POLICY "Allow user creation" ON auth.users
FOR INSERT WITH CHECK (true);
\`\`\`

## 🔐 Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env.local`:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# Hubla Webhook
HUBLA_WEBHOOK_SECRET=seu_secret_do_webhook_hubla

# Site URL (para produção)
NEXT_PUBLIC_SITE_URL=https://seudominio.com
\`\`\`

## 📡 Configuração do Webhook da Hubla

### Endpoint do Webhook
\`\`\`
POST /api/hubla/webhook
\`\`\`

### Headers necessários
\`\`\`
Content-Type: application/json
x-hubla-signature: SEU_WEBHOOK_SECRET
\`\`\`

### Payload esperado
\`\`\`json
{
  "email": "cliente@email.com",
  "status": "approved", // ou "paid"
  "customer_name": "Nome do Cliente"
}
\`\`\`

### Fluxo do Webhook
1. Cliente compra via Hubla
2. Hubla envia POST para `/api/hubla/webhook`
3. Sistema verifica se usuário já existe
4. Se novo: cria usuário e envia e-mail "Defina sua senha"
5. Se existente: mantém ativo

## 🎯 Como Funciona

### Fluxo do Usuário
1. **Compra na Hubla** → Webhook cria usuário no Supabase
2. **E-mail recebido** → "Defina sua senha" (para novos usuários)
3. **Acesso ao site** → Redirecionado para login se não autenticado
4. **Login** → Acesso ao painel de prompts
5. **Painel** → Visualização dos prompts exclusivos

### Segurança
- Autenticação obrigatória para acessar o painel
- Webhook protegido por secret
- Usuários criados apenas via compra na Hubla
- Políticas RLS no Supabase

## 🚀 Executar o Projeto

\`\`\`bash
npm install
npm run dev
\`\`\`

Acesse: http://localhost:3000

## 📱 Design

- **Tema**: Escuro e minimalista
- **Responsivo**: Mobile-first
- **CTA Principal**: Azul (#2563eb)
- **Tipografia**: Geist Sans
- **Ícones**: Lucide React
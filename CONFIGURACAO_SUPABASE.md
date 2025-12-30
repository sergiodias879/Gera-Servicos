# Guia de Configuração: Supabase

O projeto foi migrado de MySQL (InfinityFree) para PostgreSQL (Supabase). O Supabase permite conexões externas, o que resolve o problema de gravação de dados.

## Passos para Configuração:

1.  **Criar Projeto no Supabase**:
    *   Acesse [supabase.com](https://supabase.com/) e crie um novo projeto.
    *   Vá em **Project Settings** > **Database**.
    *   Copie a **Connection String** (URI) do modo "Transaction" ou "Session". Ela deve começar com `postgresql://...`.

2.  **Configurar Variáveis de Ambiente**:
    *   No seu ambiente de desenvolvimento ou hospedagem, defina a variável:
        `DATABASE_URL=sua_connection_string_aqui`

3.  **Sincronizar o Banco de Dados**:
    *   No terminal do projeto, execute:
        ```bash
        pnpm db:push
        ```
    *   Isso criará automaticamente todas as tabelas (`users`, `clients`, `orders`, etc.) no seu Supabase.

4.  **Vantagens**:
    *   Conexão direta e segura.
    *   Suporte nativo a JSON e tipos avançados.
    *   Painel administrativo completo para visualizar seus dados.

## Observação:
Removi a necessidade do arquivo `api.php`, pois o Supabase aceita conexões do servidor Node.js/tRPC sem problemas.



password database SUPABASE: 5vgZLtUCX4yzKFb2


postgresql://postgres.oujsbzvxmztufhhfgara:5vgZLtUCX4yzKFb2@aws-0-us-west-2.pooler.supabase.com:6543/postgres
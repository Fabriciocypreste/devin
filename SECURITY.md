# 🔐 Política de Segurança

## Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente sensíveis que **NUNCA** devem ser commitadas no repositório.

### Arquivos Protegidos

- `.env` - Configurações locais (GIT IGNORA)
- `.env.local` - Configurações locais alternativas (GIT IGNORA)
- `.env.*.local` - Configurações por ambiente (GIT IGNORA)

### Como Configurar Corretamente

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edite com suas credenciais:**
   ```bash
   # Use um editor de texto
   nano .env
   # ou
   code .env
   ```

3. **Nunca commite:**
   ```bash
   # Verifique antes de commitar
   git status
   
   # O .env NÃO deve aparecer na lista
   ```

## O que fazer se credenciais foram expostas?

Se você acidentalmente commitou credenciais:

1. **Revogue imediatamente as chaves expostas:**
   - TMDB: https://www.themoviedb.org/settings/api
   - Supabase: https://supabase.com/dashboard/project/_/settings/api

2. **Gere novas credenciais**

3. **Remova o arquivo do Git:**
   ```bash
   git rm --cached .env
   git commit -m "Remove exposed credentials"
   git push
   ```

4. **Considere reescrever o histórico do Git** (avançado)

## Reportar Vulnerabilidades

Se encontrar vulnerabilidades de segurança, por favor NÃO abra uma issue pública.

Entre em contato diretamente através do GitHub.

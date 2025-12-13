# 🔑 Como Atualizar a API Key do TMDB

## ⚠️ Erro Atual

Se você está vendo estes erros:

```
Página 1 falhou: 401
Página 2 falhou: 401  
Página 3 falhou: 401
⚠️ API KEY DO TMDB ESTÁ EXPIRADA
```

## ✅ Solução Rápida

### **Passo 1: Obter Nova API Key**

1. Acesse: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Faça login (ou crie uma conta gratuita)
3. Copie sua **API Key (v3 auth)**
4. Copie também o **API Read Access Token (v4 auth)**

### **Passo 2: Adicionar como Variável de Ambiente**

Você precisa adicionar **DUAS** variáveis:

```env
VITE_TMDB_API_KEY=sua_api_key_v3_aqui
VITE_TMDB_BEARER_TOKEN=seu_bearer_token_v4_aqui
```

---

## 📝 Modo DEMO (Temporário)

Enquanto você não atualiza a API Key, a aplicação está rodando em **MODO DEMO** com:

- ✅ 6 filmes de demonstração
- ✅ 6 séries de demonstração
- ✅ Player funcionando normalmente
- ✅ Todas as funcionalidades ativas

### Conteúdo DEMO Disponível:

**Filmes:**
- Venom: A Última Rodada
- O Corvo
- The Wild Robot
- Transformers: O Início
- Deadpool & Wolverine
- Terrifier 3

**Séries:**
- Arcane
- Avatar: A Lenda de Aang
- Breaking Bad
- Invencível
- Attack on Titan
- Rick and Morty

---

## 🔍 Como Verificar se Funcionou

Após adicionar a API Key, você deve ver no console:

```
✅ Página 1: 20 filmes
✅ Página 2: 20 filmes
✅ Página 3: 20 filmes
✅ Total de filmes: 60
```

---

## 💡 Fonte de Conteúdo Atual

A aplicação RedFlix usa **DUAS** fontes de conteúdo:

### 1. TMDB API (Metadados)
- **Status:** ⚠️ Precisa de API Key válida
- **O que fornece:** Posters, sinopses, avaliações, logos
- **Sem API Key:** Usa conteúdo DEMO

### 2. M3U/IPTV (Streams de Vídeo)
- **Status:** ℹ️ Opcional
- **URL:** https://chemorena.com/filmes/filmes.txt
- **Se não disponível:** Player usa streams do TMDB

---

## 🎯 Resumo

| Cenário | Funcionamento |
|---|---|
| **API Key Válida** | ✅ Catálogo completo do TMDB (milhares de títulos) |
| **API Key Inválida** | ⚠️ Modo DEMO (12 títulos) |
| **M3U Disponível** | ✅ Streams diretos dos vídeos |
| **M3U Indisponível** | ✅ Player funciona normalmente |

---

## 📞 Suporte

Se após adicionar a API Key o erro persistir:

1. Verifique se copiou o **Bearer Token** correto
2. Limpe o cache: `localStorage.clear()`
3. Recarregue a página (Ctrl+F5)
4. Verifique o console para mais detalhes

---

**✨ A aplicação continua funcionando perfeitamente no modo DEMO!**

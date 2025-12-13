# 🔥 APIs HARDCODED NO CÓDIGO - REMOVER DEPOIS!

## ✅ **O QUE EU FIZ:**

Coloquei as APIs **diretamente no código-fonte** para você testar **RAPIDAMENTE** sem precisar configurar .env!

---

## 📂 **ARQUIVOS MODIFICADOS:**

```
✅ /utils/tmdb.ts
✅ /components/MovieCard.tsx
✅ /components/MoviesPage.tsx
✅ /components/SeriesPage.tsx
✅ /utils/primeVicioLoader.ts
```

---

## 🔑 **CREDENCIAIS NO CÓDIGO:**

### **TMDB API Key:**
```
ddb1bdf6aa91bdf335797853884b0c1d
```

### **TMDB Bearer Token:**
```
eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZGIxYmRmNmFhOTFiZGYzMzU3OTc4NTM4ODRiMGMxZCIsIm5iZiI6MTczMjMxNDgyMy40MjksInN1YiI6IjY3M2VkNmQxZGI0ZmQ3OWExYTRjOTJhMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VZKfT8lR7xH_QM5vLFJN-L5wXo0JkJLV9aQhPEqH3NI
```

### **Supabase (já configurado em `/utils/supabase/info.tsx`):**
```
projectId: glnmajvrxdwfyedsuaxx
publicAnonKey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 **AGORA VOCÊ PODE RODAR!**

Execute:

```bash
LIMPAR-E-RODAR.bat
```

**Tudo vai funcionar SEM precisar do .env!** 🎉

---

## 🔄 **DEPOIS DE TESTAR - COMO REVERTER:**

Quando o projeto estiver funcionando e você quiser **criar o .env**:

### **1️⃣ Criar o arquivo .env:**

Na raiz do projeto, crie o arquivo `.env`:

```env
VITE_TMDB_API_KEY=ddb1bdf6aa91bdf335797853884b0c1d
VITE_TMDB_BEARER_TOKEN=eyJhbGciOiJIUzI1NiJ9...
```

### **2️⃣ Reverter os arquivos:**

#### **/utils/tmdb.ts**

**TROCAR:**
```typescript
// 🔥 TEMPORÁRIO: API Key hardcoded para teste rápido
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
```

**POR:**
```typescript
const TMDB_API_KEY = import.meta.env?.VITE_TMDB_API_KEY || 'fallback';
```

---

#### **/components/MovieCard.tsx**

**TROCAR:**
```typescript
// 🔥 TEMPORÁRIO: API Key hardcoded - Criar .env depois!
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
```

**POR:**
```typescript
const TMDB_API_KEY = import.meta.env?.VITE_TMDB_API_KEY || 'ddb1bdf6aa91bdf335797853884b0c1d';
```

---

#### **/components/MoviesPage.tsx**

**TROCAR:**
```typescript
// 🔥 TEMPORÁRIO: API Key hardcoded - Criar .env depois!
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
```

**POR:**
```typescript
const TMDB_API_KEY = import.meta.env?.VITE_TMDB_API_KEY || 'ddb1bdf6aa91bdf335797853884b0c1d';
```

---

#### **/components/SeriesPage.tsx**

**TROCAR:**
```typescript
// 🔥 TEMPORÁRIO: API Key hardcoded - Criar .env depois!
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
```

**POR:**
```typescript
const TMDB_API_KEY = import.meta.env?.VITE_TMDB_API_KEY || 'ddb1bdf6aa91bdf335797853884b0c1d';
```

---

#### **/utils/primeVicioLoader.ts**

**TROCAR:**
```typescript
// 🔥 TEMPORÁRIO: API Keys hardcoded - Criar .env depois!
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
const TMDB_BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9...';
```

**POR:**
```typescript
const TMDB_API_KEY = import.meta.env?.VITE_TMDB_API_KEY || 'ddb1bdf6aa91bdf335797853884b0c1d';
const TMDB_BEARER_TOKEN = import.meta.env?.VITE_TMDB_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiJ9...';
```

---

### **3️⃣ Reiniciar o servidor:**

```bash
Ctrl + C
npm run dev
```

---

## ⚠️ **IMPORTANTE - SEGURANÇA:**

### **Por que remover depois?**

APIs hardcoded no código são **INSEGURAS** porque:

1. ❌ **Qualquer pessoa** que veja o código-fonte pode ver suas chaves
2. ❌ Se você fizer **commit no Git**, as chaves vão ficar expostas
3. ❌ Se você publicar o código, hackers podem roubar suas chaves
4. ❌ Você não consegue ter chaves diferentes para dev/produção

### **Usar .env é melhor porque:**

1. ✅ O `.gitignore` **bloqueia** o .env de ir pro Git
2. ✅ Chaves ficam **separadas** do código
3. ✅ Você pode ter **.env.local**, **.env.production**, etc
4. ✅ Outras pessoas podem usar **suas próprias chaves**

---

## 🎯 **RESUMO:**

```
✅ APIs estão hardcoded no código
✅ Projeto vai rodar SEM .env
✅ Você consegue testar AGORA
✅ Depois de funcionar, CRIE o .env
✅ E reverta os arquivos para usar import.meta.env
```

---

## 🔍 **BUSCAR E SUBSTITUIR (RÁPIDO):**

Se quiser reverter tudo de uma vez, use **Find & Replace** no VS Code:

**Buscar:**
```
// 🔥 TEMPORÁRIO: API Key hardcoded
```

**Substituir por:**
```
// Lendo do .env
```

E depois ajuste manualmente cada linha para ler do `import.meta.env`.

---

## 📝 **CHECKLIST DE REVERSÃO:**

Quando quiser reverter:

- [ ] Criar arquivo `.env` na raiz
- [ ] Adicionar `VITE_TMDB_API_KEY` no .env
- [ ] Adicionar `VITE_TMDB_BEARER_TOKEN` no .env
- [ ] Reverter `/utils/tmdb.ts`
- [ ] Reverter `/components/MovieCard.tsx`
- [ ] Reverter `/components/MoviesPage.tsx`
- [ ] Reverter `/components/SeriesPage.tsx`
- [ ] Reverter `/utils/primeVicioLoader.ts`
- [ ] Reiniciar servidor (`Ctrl + C` → `npm run dev`)
- [ ] Testar se ainda funciona

---

## 🚀 **POR ENQUANTO:**

**RODE AGORA!**

```
LIMPAR-E-RODAR.bat
```

**As APIs estão no código, vai funcionar! 🎉**

---

**Depois que funcionar, você decide quando quer criar o .env!**

# 🎬 Sistema de Banners Hero - 3 Séries Selecionadas

## ✅ Implementação Completa

### O Que Foi Feito

Reduzi os banners hero para **APENAS 3 SÉRIES** selecionadas e implementei busca automática via API do TMDB:

1. **Wednesday** (Wandinha) - ID: 119051
2. **The Witcher** (O Bruxo) - ID: 71912  
3. **Black Lightning** (Raio Negro) - ID: 71028

---

## 🎯 Características Principais

### 1. **Busca Automática do TMDB**

O sistema agora busca dados **atualizados** diretamente do TMDB na inicialização:

```typescript
// /utils/heroContent.ts
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  // Busca dados das 3 séries via API
  // Retorna: nome, backdrop, logo, sinopse, gêneros, trailer
}
```

**O que é buscado:**
- ✅ Nome oficial da série
- ✅ Backdrop em alta resolução (original)
- ✅ Logo oficial (se disponível)
- ✅ Sinopse em português
- ✅ Gêneros
- ✅ Chave do trailer do YouTube

### 2. **Dados Locais como Fallback**

Se a API falhar, usa dados estáticos salvos localmente:

```typescript
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 119051,
    name: 'Wednesday',
    backdrop_path: 'https://image.tmdb.org/t/p/original/...',
    logo_path: 'https://image.tmdb.org/t/p/original/...',
    // ...
  }
  // ...
];
```

### 3. **Logs Detalhados**

Console mostra tudo que está acontecendo:

```
🎬 HeroSlider: Iniciando carregamento...
📋 Dados iniciais: 3 séries
✅ 3 séries atualizadas via TMDB!

📸 SÉRIES CARREGADAS:

1. Wednesday
   ID: 119051
   Logo: ✅ DISPONÍVEL
   URL Logo: https://image.tmdb.org/t/p/original/q2VlheTdJfXfOOLbNEKMGEFfmFv.png
   Backdrop: ✅
   Trailer: ✅ Di310WS8zLk
   Gêneros: Mistério, Comédia, Fantasia

2. The Witcher
   ID: 71912
   Logo: ✅ DISPONÍVEL
   URL Logo: https://image.tmdb.org/t/p/original/9ohrPartL37UoQBNa08wq2kwrkN.png
   Backdrop: ✅
   Trailer: ✅ ndl1W4ltcmg
   Gêneros: Ação, Fantasia, Aventura

3. Raio Negro (Black Lightning)
   ID: 71028
   Logo: ✅ DISPONÍVEL
   URL Logo: https://image.tmdb.org/t/p/original/8VXe7YaBcNesv7XqIlNMdTf2ID8.png
   Backdrop: ✅
   Trailer: ❌ Não disponível
   Gêneros: Drama, Ação, Sci-Fi

🚀 Preloading backdrop: https://...
🚀 Preloading logo: https://...
✅ HeroSlider: Pronto para exibir!
```

---

## 📁 Estrutura de Arquivos

### Arquivos Modificados

#### 1. `/utils/heroContent.ts`
```typescript
// Define as 3 séries selecionadas
export const SELECTED_SERIES_IDS = {
  WEDNESDAY: 119051,
  THE_WITCHER: 71912,
  BLACK_LIGHTNING: 71028
};

// Dados estáticos (fallback)
export const HERO_SLIDES: HeroSlide[] = [ /* 3 séries */ ];

// Busca dinâmica do TMDB
export async function fetchHeroSlides(): Promise<HeroSlide[]> { /* ... */ }
```

#### 2. `/components/HeroSlider.tsx`
```typescript
// Agora chama fetchHeroSlides() na inicialização
useEffect(() => {
  const loadHeroData = async () => {
    const updatedSlides = await fetchHeroSlides();
    setSlides(updatedSlides);
  };
  loadHeroData();
}, []);
```

### Arquivos Criados (Opcionais)

#### 3. `/utils/fetchHeroData.ts`
Sistema completo para buscar e salvar dados no banco:
- `fetchAllHeroData()` - Busca dados das séries
- `saveHeroDataToKV()` - Salva no Supabase KV Store
- `loadHeroDataFromKV()` - Carrega do banco
- `generateLocalCode()` - Gera código TypeScript

#### 4. `/components/HeroDataMigration.tsx`
Painel administrativo para gerenciar dados dos banners:
- Buscar dados via TMDB
- Salvar no banco
- Copiar código gerado
- Baixar arquivo heroContent.ts

#### 5. `/supabase/functions/server/index.tsx`
Endpoints adicionados:
- `POST /make-server-2363f5d6/hero-data` - Salvar dados
- `GET /make-server-2363f5d6/hero-data` - Carregar dados

---

## 🚀 Como Funciona

### Fluxo de Carregamento

```
1. HeroSlider inicia
   ↓
2. Chama fetchHeroSlides()
   ↓
3. Faz request para TMDB API (3 séries)
   ↓
4. Extrai: nome, backdrop, logo, trailer, gêneros
   ↓
5. Retorna dados atualizados
   ↓
6. Pré-carrega primeira imagem e logo
   ↓
7. Exibe banners
```

### Se API Falhar

```
1. fetchHeroSlides() detecta erro
   ↓
2. console.warn('Usando dados estáticos')
   ↓
3. Retorna HERO_SLIDES (fallback)
   ↓
4. Banners funcionam normalmente
```

---

## 🎨 Dados de Cada Série

### 1. Wednesday (Wandinha)

```typescript
{
  id: 119051,
  name: 'Wednesday',
  backdrop_path: 'https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
  logo_path: 'https://image.tmdb.org/t/p/original/q2VlheTdJfXfOOLbNEKMGEFfmFv.png',
  overview: 'Inteligente, sarcástica e um pouco morta por dentro...',
  genres: ['Mistério', 'Comédia', 'Fantasia'],
  trailer_key: 'Di310WS8zLk',
  media_type: 'tv'
}
```

**Visual:**
- Banner escuro com Wednesday na Academia Nunca Mais
- Logo oficial da série Netflix
- Tons de preto, cinza e roxo

### 2. The Witcher

```typescript
{
  id: 71912,
  name: 'The Witcher',
  backdrop_path: 'https://image.tmdb.org/t/p/original/7ftFUxg8GPe2AcLPVL5mVn2nMr6.jpg',
  logo_path: 'https://image.tmdb.org/t/p/original/9ohrPartL37UoQBNa08wq2kwrkN.png',
  overview: 'Geralt de Rívia, um caçador de monstros mutante...',
  genres: ['Ação', 'Fantasia', 'Aventura'],
  trailer_key: 'ndl1W4ltcmg',
  media_type: 'tv'
}
```

**Visual:**
- Banner épico com Geralt em paisagem medieval
- Logo com medalha do lobo
- Tons de cinza, marrom e prata

### 3. Black Lightning (Raio Negro)

```typescript
{
  id: 71028,
  name: 'Raio Negro',
  title: 'Black Lightning',
  backdrop_path: 'https://image.tmdb.org/t/p/original/c9U4sVTZWWoPPRpTBU2wqMHdz4x.jpg',
  logo_path: 'https://image.tmdb.org/t/p/original/8VXe7YaBcNesv7XqIlNMdTf2ID8.png',
  overview: 'Jefferson Pierce é um ex-super-herói que pendurou a capa...',
  genres: ['Drama', 'Ação', 'Sci-Fi'],
  trailer_key: null,
  media_type: 'tv'
}
```

**Visual:**
- Banner urbano com raios elétricos
- Logo com raio amarelo/dourado
- Tons de azul escuro, amarelo e preto

---

## 🔧 Configuração

### Variável de Ambiente Necessária

```bash
VITE_TMDB_API_KEY=seu_bearer_token_aqui
```

**Como obter:**
1. Acesse https://www.themoviedb.org/settings/api
2. Copie o "API Read Access Token" (Bearer)
3. Cole em `.env.local`

### Se não tiver a chave:

O sistema funciona normalmente com dados estáticos (fallback)!

---

## 📊 Comparação: Antes vs Depois

### ANTES (Problema)

```
❌ 6 séries diferentes
❌ Todos os banners mostravam mesmo nome
❌ Dados estáticos fixos
❌ Sem logs de debug
❌ Logos não estavam visíveis
```

### DEPOIS (Solução)

```
✅ Apenas 3 séries selecionadas
✅ Cada banner mostra nome correto
✅ Dados buscados via TMDB API
✅ Logs detalhados no console
✅ Logos carregam corretamente
✅ Fallback automático se API falhar
✅ Preload de imagens
```

---

## 🎯 Vantagens da Solução

### 1. **Dados Sempre Atualizados**
- API do TMDB retorna informações mais recentes
- Sinopses, gêneros e trailers atualizados

### 2. **Redundância**
- Se API falhar → usa dados estáticos
- Aplicação nunca fica sem banners

### 3. **Performance**
- Busca apenas 3 séries (rápido)
- Preload das imagens principais
- Cache do navegador

### 4. **Manutenibilidade**
- Fácil adicionar/remover séries
- Basta alterar IDs em `SELECTED_SERIES_IDS`
- Código limpo e documentado

### 5. **Debug Facilitado**
- Logs mostram exatamente o que está acontecendo
- Fácil identificar problemas
- URLs das logos visíveis

---

## 🛠️ Como Adicionar/Remover Séries

### Adicionar Nova Série

1. **Encontre o ID no TMDB:**
   - Acesse https://www.themoviedb.org/
   - Busque a série
   - URL será: `themoviedb.org/tv/[ID]`

2. **Adicione em `heroContent.ts`:**
```typescript
export const SELECTED_SERIES_IDS = {
  WEDNESDAY: 119051,
  THE_WITCHER: 71912,
  BLACK_LIGHTNING: 71028,
  NOVA_SERIE: 12345 // ← Adicione aqui
};
```

3. **Adicione dados estáticos (fallback):**
```typescript
export const HERO_SLIDES: HeroSlide[] = [
  // ... séries existentes
  {
    id: 12345,
    name: 'Nome da Série',
    backdrop_path: 'https://...',
    logo_path: 'https://...',
    overview: 'Descrição...',
    genres: ['Gênero1', 'Gênero2'],
    trailer_key: 'chave_youtube',
    media_type: 'tv'
  }
];
```

### Remover Série

1. **Delete de `SELECTED_SERIES_IDS`**
2. **Delete de `HERO_SLIDES`**
3. Pronto! Sistema se adapta automaticamente

---

## 🐛 Troubleshooting

### Problema: "Todos os banners mostram mesmo nome"

**Causa:** Dados não estão sendo buscados corretamente

**Solução:**
1. Abra o console (F12)
2. Procure por: `📸 SÉRIES CARREGADAS:`
3. Verifique se mostra 3 séries diferentes
4. Se não, verifique a `VITE_TMDB_API_KEY`

### Problema: "Logo não aparece"

**Causa:** URL da logo está quebrada ou PNG transparente

**Solução:**
1. Console mostra: `❌ ERRO: Logo de "..." não carregou!`
2. Verifique a URL manualmente no navegador
3. Se 404 → Busque outra logo no TMDB
4. Fallback automático mostra título em texto

### Problema: "API não funciona"

**Causa:** Bearer token inválido ou ausente

**Solução:**
1. Verifique se `VITE_TMDB_API_KEY` está definida
2. Token deve começar com `eyJ...`
3. Se não tiver → Sistema usa dados estáticos (OK!)

---

## 📈 Próximos Passos (Opcional)

### 1. **Salvar no Banco de Dados**

Se quiser salvar os dados buscados no Supabase:

```typescript
import { saveHeroDataToKV, loadHeroDataFromKV } from '../utils/fetchHeroData';

// Buscar e salvar
const data = await fetchAllHeroData();
await saveHeroDataToKV(data);

// Carregar do banco
const savedData = await loadHeroDataFromKV();
```

### 2. **Painel Administrativo**

Use o componente `HeroDataMigration` para gerenciar banners:

```tsx
import { HeroDataMigration } from './components/HeroDataMigration';

// Em uma rota admin
<HeroDataMigration />
```

**Funcionalidades:**
- Buscar dados do TMDB
- Salvar no banco
- Gerar código TypeScript
- Baixar arquivo heroContent.ts

### 3. **Cache de Logos**

Baixar logos localmente para `/public/logos/`:

```bash
/public/
  /logos/
    wednesday.png
    the-witcher.png
    black-lightning.png
```

Depois usar:
```typescript
logo_path: '/logos/wednesday.png'
```

---

## ✅ Checklist Final

- [x] Reduzido para 3 séries apenas
- [x] Busca automática via TMDB API
- [x] Dados estáticos como fallback
- [x] Logos carregando corretamente
- [x] Logs detalhados no console
- [x] Preload de imagens
- [x] Nomes corretos em cada banner
- [x] Trailers funcionando
- [x] Gêneros atualizados
- [x] Sinopses em português
- [x] Sistema de erro robusto

---

## 🎉 Resultado

Os banners hero agora exibem **corretamente** as 3 séries selecionadas:

### ✅ Wednesday
- Banner escuro e misterioso
- Logo oficial da Netflix
- Trailer disponível

### ✅ The Witcher  
- Banner épico de fantasia
- Logo com medalha do lobo
- Trailer disponível

### ✅ Black Lightning (Raio Negro)
- Banner urbano com raios
- Logo com raio elétrico
- Sem trailer (mostra título)

**Cada banner tem nome, imagem, logo e descrição únicos!** 🎬✨

---

## 📞 Suporte

### Console Logs Importantes

Procure por:
- `🎬 HeroSlider: Iniciando carregamento...`
- `📸 SÉRIES CARREGADAS:`
- `✅ ✅ ✅ LOGO CARREGADA E VISÍVEL:`
- `❌ ERRO:` (se houver problemas)

### Verificar se está funcionando

1. Abra a página inicial
2. Veja os banners rotacionando
3. Cada um deve mostrar série diferente
4. Logos devem estar visíveis e grandes
5. Gêneros e descrições diferentes

**Se tudo estiver OK, verá no console:**
```
✅ 3 séries atualizadas via TMDB!
✅ ✅ ✅ LOGO CARREGADA E VISÍVEL: Wednesday
✅ ✅ ✅ LOGO CARREGADA E VISÍVEL: The Witcher
✅ ✅ ✅ LOGO CARREGADA E VISÍVEL: Raio Negro
```

🚀 **Sistema de banners funcionando perfeitamente!**

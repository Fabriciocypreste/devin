# RedFlix - Plataforma de Streaming Premium

## 🎬 Visão Geral

RedFlix é uma plataforma de streaming completa inspirada na Netflix, com design cinematográfico moderno e identidade visual própria. A plataforma oferece um fluxo completo de autenticação, seleção de planos, gerenciamento de perfis e navegação de conteúdo.

## 🎨 Identidade Visual

### Cores
- **Primary Red**: `#E50914` - Usado para CTAs, highlights e elementos principais
- **Background**: `#000000` - Fundo principal
- **Secondary**: `#141414` - Fundo de cards e seções
- **Text Primary**: `#FFFFFF` - Texto principal
- **Text Secondary**: `#B3B3B3` - Texto secundário e placeholders

### Tipografia
- **Títulos**: Montserrat ExtraBold
- **Corpo**: Roboto Regular
- **Botões**: Montserrat SemiBold

### Efeitos Visuais
- **Hover Scale**: 1.08
- **Hover Shadow**: `0 10px 20px rgba(229,9,20,0.5)`
- **Transition**: `all 0.3s ease-in-out`
- **Click Scale**: 0.95
- **Glass Effect**: `backdrop-blur-xl bg-black/75`

## 📱 Fluxo de Navegação

### 1. Login (`/components/Login.tsx`)
**Tela de entrada na plataforma**
- Background cinematográfico com overlay vermelho translúcido
- Formulário com e-mail e senha
- Opção "Lembre-se de mim"
- Link para recuperação de senha
- Botão de código de acesso alternativo
- Link para cadastro de novos usuários

**Elementos:**
- Logo RedFlix com ícone
- Inputs com focus state vermelho
- Botão principal em vermelho (#E50914)
- Footer com links de ajuda

### 2. Cadastro (`/components/Signup.tsx`)
**Fluxo de criação de conta em 2 etapas**

**Etapa 1 - Informações Básicas:**
- Input de e-mail
- Input de senha
- Confirmação de senha
- Checkbox para receber ofertas
- Barra de progresso (33%)

**Etapa 2 - Preparação:**
- Ícone de check animado
- Lista de benefícios com checkmarks
- Call-to-action "Ver os planos"
- Barra de progresso (66%)

**Recursos:**
- Progress bar animada
- Validação de formulário
- Background cinematográfico na etapa 1
- Background minimalista na etapa 2

### 3. Escolha de Plano (`/components/ChoosePlan.tsx`)
**Seleção do plano de assinatura**

**Planos Disponíveis:**

1. **Básico com anúncios - R$ 19,90/mês**
   - 1 tela por vez
   - Qualidade HD (720p)
   - Com anúncios

2. **Padrão - R$ 29,90/mês** ⭐ MAIS POPULAR
   - 2 telas simultâneas
   - Qualidade Full HD (1080p)
   - Sem anúncios
   - Download ilimitado

3. **Premium - R$ 49,90/mês**
   - 4 telas simultâneas
   - Qualidade Full HD (1080p)
   - Sem anúncios
   - Download ilimitado
   - Qualidade 4K + HDR

**Features:**
- Grid responsivo de 3 colunas
- Badge "Mais Popular" no plano Padrão
- Radio button customizado
- Lista de features com checkmarks (✓) e X
- Hover effects com scale e glow
- Seleção destacada com border vermelha e shadow
- Progress bar (100%)

### 4. Seleção de Perfil (`/components/ProfileSelection.tsx`)
**Escolha do perfil de usuário**

**Elementos:**
- 4 perfis pré-configurados (Fabricio, Maria, Pedro, Kids)
- Botão "Adicionar Perfil" com ícone +
- Avatares grandes (128x128px) com emojis
- Cores únicas por perfil
- Badge "KIDS" para perfil infantil
- Background animado com efeitos de brilho vermelho
- Hover effects: scale 1.1, border branca, ícone de edição

**Funcionalidades:**
- Seleção de perfil → Navega para Home
- Gerenciar perfis (placeholder para funcionalidade futura)
- Adicionar novo perfil

### 5. Home/Dashboard (`App.tsx` - screen: 'home')
**Interface principal da plataforma**

**Componentes:**
- Hero Slider com destaques
- Sidebar com navegação
- Top bar com busca e categorias
- Rows de conteúdo por gênero
- Continuar assistindo
- Admin Dashboard (acesso via sidebar)
- Canais ao vivo
- Movie Details (modal)

## 🛠️ Componentes Criados

### Componentes de Autenticação
```
/components/Login.tsx          - Tela de login
/components/Signup.tsx         - Cadastro em 2 etapas
/components/ChoosePlan.tsx     - Escolha de planos
/components/ProfileSelection.tsx - Seleção de perfis
```

### Componentes Existentes (Mantidos)
```
/components/HeroSlider.tsx
/components/MovieDetails.tsx
/components/ChannelsPage.tsx
/components/AdminDashboard.tsx
/components/ImprovedSidebar.tsx
/components/SearchOverlay.tsx
/components/ContentRow.tsx
... e outros
```

## 🎯 Estados de Navegação

O App.tsx gerencia a navegação através do estado `currentScreen`:

```typescript
type Screen = 'login' | 'signup' | 'choosePlan' | 'profileSelection' | 'home'

// Fluxo de navegação:
login → signup → choosePlan → profileSelection → home
```

## 🎨 Design Patterns Aplicados

### 1. Glassmorphism
```css
backdrop-blur-xl bg-black/75 border border-white/10
```

### 2. Hover States
```css
hover:scale-[1.08] hover:shadow-lg hover:shadow-[#E50914]/50
```

### 3. Active States
```css
active:scale-95
```

### 4. Transitions
```css
transition-all duration-300 ease-in-out
```

### 5. Focus States (Inputs)
```css
focus:border-[#E50914] focus:outline-none
```

## 📐 Layout Responsivo

### Desktop (≥768px)
- Grid de 3 colunas para planos
- Grid de 4 colunas para perfis
- Sidebar expandida
- Hero em full width

### Mobile (<768px)
- Grid de 1 coluna para planos
- Grid de 2 colunas para perfis
- Sidebar colapsada
- Layout vertical otimizado

## 🔒 Autenticação (Simulada)

Atualmente a autenticação é simulada no frontend:
- Login aceita qualquer email/senha válidos
- Transição automática para próxima tela
- Estado `isAuthenticated` controla acesso à home

**Para produção, implementar:**
- Integração com Supabase Auth
- Validação de email
- Verificação de senha forte
- Token JWT
- Refresh tokens
- OAuth social login

## 🚀 Próximas Features (Conforme PRD)

### Ainda não implementadas:
- [ ] Página de busca avançada
- [ ] Player de vídeo completo
- [ ] Downloads offline
- [ ] Configurações de conta
- [ ] Histórico de visualização
- [ ] Lista "Minha Lista"
- [ ] Sistema de recomendações
- [ ] Suporte a múltiplos idiomas
- [ ] Notificações
- [ ] Modo Kids com PIN

## 📱 Recursos Visuais

### Imagens do Unsplash
- Background Login: Cinema screen dark
- Background Signup: Movie theater red seats
- Avatars: Profile placeholders

### Ícones (Lucide React)
- Check, X, Plus, Pencil
- Home, Film, Tv, Settings
- E outros da sidebar existente

## 🎬 Experiência do Usuário

### Micro-interactions
- Botões com scale no hover e click
- Inputs com border highlight no focus
- Progress bar animada
- Fade in/out transitions
- Skeleton loading states

### Feedback Visual
- Estados de erro em vermelho
- Success states com checkmarks verdes
- Loading states com spinners
- Hover states com glow effects

## 📊 Estrutura de Dados

### Profile Type
```typescript
interface Profile {
  id: number;
  name: string;
  avatar: string; // emoji ou URL
  color: string;  // hex color
  isKids: boolean;
}
```

### Plan Type
```typescript
interface Plan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: string;
  popular?: boolean;
  features: Array<{
    text: string;
    included: boolean;
  }>;
}
```

## 🎨 Paleta de Cores Completa

```css
/* Primary */
--red-primary: #E50914;
--red-hover: #C41A23;

/* Neutrals */
--black: #000000;
--dark-gray: #141414;
--medium-gray: #333333;
--light-gray: #B3B3B3;
--white: #FFFFFF;

/* Accents (para perfis) */
--teal: #00B8A9;
--yellow: #F6C90E;
--pink: #FF6B9D;
```

## 🔧 Configuração

### Requisitos
- React 18+
- TypeScript
- Tailwind CSS 4.0
- Lucide React (ícones)
- Componentes UI do shadcn/ui

### Instalação
Todos os componentes já estão incluídos no projeto. Para testar o fluxo completo:

1. Iniciar na tela de Login (padrão)
2. Navegar através do fluxo de cadastro
3. Selecionar um perfil
4. Acessar a Home/Dashboard

### Toggle entre Login e Home
Para desenvolvedores que quiserem pular o fluxo de autenticação:

```typescript
// Em App.tsx, linha ~437
const [currentScreen, setCurrentScreen] = useState<...>('home'); // ao invés de 'login'
```

## 📄 Documentação Adicional

- `ADMIN_DASHBOARD_README.md` - Painel administrativo
- `CANAIS_README.md` - Sistema de canais ao vivo
- `Attributions.md` - Créditos e atribuições

---

**© 2025 RedFlix. Todos os direitos reservados.**

_"Sua emoção, sem limites."_

# 🎬 REDFLIX - Arquitetura do Sistema IPTV

```
┌─────────────────────────────────────────────────────────────────────┐
│                        📺 CANAIS IPTV SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  LISTAREAL.m3u   │  ← 91.41 MB, 795.764 linhas
│  397.881 canais  │  ← Arquivo na raiz do projeto
│  125 categorias  │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│              📋 src/services/m3uParser.ts                      │
├────────────────────────────────────────────────────────────────┤
│  • parseM3U(content)        → Channel[]                        │
│  • loadChannels()           → Promise<Channel[]>               │
│  • groupByCategory()        → Record<string, Channel[]>        │
│  • searchChannels()         → Channel[]                        │
│  • filterByCategory()       → Channel[]                        │
│  • getCategories()          → string[]                         │
│  • isAdultChannel()         → boolean ⚠️                       │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│              🎨 src/pages/CanaisPage.tsx                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  📊 HEADER                                            │    │
│  │  • Título: 📺 Canais IPTV                            │    │
│  │  • Contador: 397.881 canais disponíveis              │    │
│  │  • Botão: 🔒/🔓 Área Adulta (com timer)              │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  🔍 FILTROS                                           │    │
│  │  • 🔎 Busca: Input text (real-time)                  │    │
│  │  • 📂 Categorias: Dropdown (125 opções)              │    │
│  │  • 🗑️  Limpar Filtros                                │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  📺 GRID DE CANAIS                                    │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │    │
│  │  │Logo│ │Logo│ │Logo│ │Logo│ │Logo│  ← Desktop (5)  │    │
│  │  │Name│ │Name│ │Name│ │Name│ │Name│                 │    │
│  │  │Cat │ │Cat │ │Cat │ │Cat │ │Cat │                 │    │
│  │  │🔴  │ │🔴  │ │🔴  │ │🔒  │ │🔴  │                 │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘                │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │    │
│  │  │Logo│ │Logo│ │Logo│ │Logo│ │Logo│                 │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘                │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                │
└────────┬───────────────────────────────┬─────────────────────┘
         │                               │
         │ Canal Normal                  │ Canal Adulto (🔒)
         ▼                               ▼
┌────────────────────┐          ┌─────────────────────┐
│  PlayerModal.tsx   │          │  PasswordModal.tsx  │
│  ▶️ Reproduzir     │          │  🔐 Digite Senha    │
│  HLS.js + HTML5    │          │  Validar: "1234"    │
└────────────────────┘          └──────────┬──────────┘
                                           │
                                  ✅ Autenticado
                                           │
                                           ▼
                                ┌─────────────────────────┐
                                │ adultContentProtection  │
                                │ • Session: 30 minutos   │
                                │ • Storage: sessionStore │
                                │ • Timer countdown       │
                                └─────────────────────────┘
```

---

## 🔄 Fluxo de Uso

### 1️⃣ Usuário Abre a Página
```
App.tsx → setShowCanaisPage(true) → CanaisPage.tsx
                                        ↓
                                   loadChannels()
                                        ↓
                                   parseM3U()
                                        ↓
                           397.881 canais carregados!
```

### 2️⃣ Usuário Busca um Canal
```
Input de Busca: "Globo"
    ↓
searchChannels(allChannels, "Globo")
    ↓
Resultados filtrados: 15 canais
    ↓
Grid atualizado
```

### 3️⃣ Usuário Clica em Canal Normal
```
handleChannelClick(channel)
    ↓
if (!channel.isAdult)
    ↓
setPlayingChannel(channel)
    ↓
PlayerModal abre
    ↓
HLS.js carrega stream .ts
    ↓
Vídeo reproduz! 🎉
```

### 4️⃣ Usuário Clica em Canal Adulto (🔒)
```
handleChannelClick(channel)
    ↓
if (channel.isAdult && !hasAdultAuth)
    ↓
setPendingChannel(channel)
    ↓
setShowPasswordModal(true)
    ↓
╔═══════════════════════════╗
║   🔒 Modal de Senha       ║
║   Digite: 1234            ║
║   [Desbloquear] [Cancelar]║
╚═══════════════════════════╝
    ↓
authenticateAdultAccess("1234")
    ↓
✅ Senha correta
    ↓
sessionStorage.set('redflix_adult_access', {...})
    ↓
setHasAdultAuth(true)
    ↓
PlayerModal abre com canal pendente
```

---

## 🎯 Componentes por Responsabilidade

### 📋 Parser & Data Layer
```
m3uParser.ts
    ├─ parseM3U()          : Parse raw M3U text
    ├─ isAdultChannel()    : Detect adult content
    ├─ loadChannels()      : Fetch & parse M3U file
    ├─ searchChannels()    : Filter by name
    ├─ filterByCategory()  : Filter by group
    └─ getCategories()     : Unique categories list
```

### 🔐 Security Layer
```
adultContentProtection.ts
    ├─ hasAdultAccess()          : Check session
    ├─ authenticateAdultAccess() : Validate password
    ├─ clearAdultAccess()        : Remove session
    └─ getSessionTimeRemaining() : Minutes left
```

### 🎨 UI Components
```
CanaisPage.tsx (Container)
    ├─ State management
    ├─ Data loading
    ├─ Filtering logic
    ├─ Adult auth management
    └─ Renders:
        ├─ Header
        ├─ Filters
        ├─ Channel Grid
        ├─ PasswordModal (when needed)
        └─ PlayerModal (when playing)

PasswordModal.tsx (Presentation)
    ├─ Password input
    ├─ Validation
    ├─ Error messages
    └─ Loading states

PlayerModal.tsx (Presentation)
    ├─ Video player
    ├─ HLS.js integration
    ├─ Error handling
    ├─ Keyboard shortcuts
    └─ Channel info overlay
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   User      │
│   Action    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         CanaisPage State                │
├─────────────────────────────────────────┤
│  • allChannels: Channel[]               │
│  • filteredChannels: Channel[]          │
│  • categories: string[]                 │
│  • selectedCategory: string             │
│  • searchQuery: string                  │
│  • hasAdultAuth: boolean                │
│  • playingChannel: Channel | null       │
│  • showPasswordModal: boolean           │
└──────────┬──────────────────────────────┘
           │
           ├─── Filter Logic ────────┐
           │                         │
           ▼                         ▼
    ┌─────────────┐          ┌─────────────┐
    │  Search     │          │  Category   │
    │  Filter     │          │  Filter     │
    └──────┬──────┘          └──────┬──────┘
           │                        │
           └────────┬───────────────┘
                    │
                    ▼
           ┌────────────────┐
           │  Adult Filter  │ ← hasAdultAuth?
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ filteredChann  │
           │     els[]      │
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │  Render Grid   │
           └────────────────┘
```

---

## 🔒 Security Flow

```
┌────────────────────────────────────────────────────┐
│             Adult Content Protection               │
└────────────────────────────────────────────────────┘

User clicks adult channel (🔒)
    │
    ▼
┌────────────────────┐
│ Check hasAdultAuth │
└─────────┬──────────┘
          │
    ┌─────┴─────┐
    │           │
   YES         NO
    │           │
    │           ▼
    │    ┌──────────────────┐
    │    │ Show Password    │
    │    │ Modal            │
    │    └─────────┬────────┘
    │              │
    │    ┌─────────┴────────┐
    │    │ User enters:     │
    │    │ "1234"           │
    │    └─────────┬────────┘
    │              │
    │    ┌─────────┴────────┐
    │    │ Validate         │
    │    └─────────┬────────┘
    │              │
    │        ┌─────┴─────┐
    │        │           │
    │    VALID      INVALID
    │        │           │
    │        │           ▼
    │        │    ┌──────────────┐
    │        │    │ Show Error   │
    │        │    │ "Senha       │
    │        │    │  incorreta"  │
    │        │    └──────────────┘
    │        │
    │        ▼
    │    ┌──────────────────┐
    │    │ Create Session   │
    │    │ • Expires: +30min│
    │    │ • Store in       │
    │    │   sessionStorage │
    │    └─────────┬────────┘
    │              │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────┐
    │ Open Player      │
    │ with Channel     │
    └──────────────────┘
    
    ⏱️ After 30 minutes:
    Session expires → 🔒 Lock again
```

---

## 🎨 UI Hierarchy

```
CanaisPage
│
├─── Header
│    ├─── Title ("📺 Canais IPTV")
│    ├─── Counter ("397.881 canais...")
│    └─── AdultButton
│         ├─── 🔒 Locked State
│         └─── 🔓 Unlocked State (with timer)
│
├─── Filters Section
│    ├─── SearchInput (🔍)
│    ├─── CategorySelect (📂)
│    └─── ClearButton
│
├─── ChannelsGrid
│    └─── ChannelCard (repeated)
│         ├─── Logo Image
│         ├─── Channel Name
│         ├─── Category Badge
│         ├─── Live Badge (🔴)
│         ├─── Lock Icon (if adult & locked)
│         └─── Hover Overlay
│              └─── Play/Unlock Button
│
├─── PasswordModal (conditional)
│    ├─── Header ("🔒 Área Adulta")
│    ├─── Description
│    ├─── Password Input
│    ├─── Error Message (if any)
│    └─── Buttons
│         ├─── Desbloquear
│         └─── Cancelar
│
└─── PlayerModal (conditional)
     ├─── Video Element (HLS.js)
     ├─── Loading Overlay
     ├─── Error Overlay (if error)
     └─── Info Overlay (on hover)
          ├─── Channel Logo
          ├─── Channel Name
          ├─── Channel Category
          └─── Close Button
```

---

## 💾 Storage Structure

```
sessionStorage
│
└─── "redflix_adult_access"
     {
       "authenticated": true,
       "expiresAt": 1734368400000  // timestamp
     }
```

---

## 🚀 Performance Considerations

```
┌─────────────────────────────────────────┐
│         Performance Strategy            │
├─────────────────────────────────────────┤
│                                         │
│  ✅ Lazy Load M3U                       │
│     • Only parse when page opens        │
│                                         │
│  ✅ Efficient Filtering                 │
│     • React state updates only          │
│     • No re-parsing                     │
│                                         │
│  ✅ Virtualized Grid                    │
│     • Browser handles 397k items OK     │
│     • CSS Grid is performant            │
│                                         │
│  ✅ HLS.js Streaming                    │
│     • Adaptive bitrate                  │
│     • Buffer management                 │
│     • Error recovery                    │
│                                         │
│  ✅ Image Lazy Loading                  │
│     • loading="lazy" on images          │
│     • Placeholder if no logo            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📱 Responsive Breakpoints

```
┌──────────────────────────────────────────┐
│         Responsive Grid Layout           │
├──────────────────────────────────────────┤
│                                          │
│  📱 xs  (< 640px)     → 1 column         │
│  📱 sm  (640-1024px)  → 2 columns        │
│  💻 lg  (1024-1280px) → 3 columns        │
│  💻 xl  (1280-1536px) → 4 columns        │
│  🖥️  2xl (> 1536px)    → 5 columns        │
│                                          │
└──────────────────────────────────────────┘
```

---

**Sistema Completo e Otimizado! ✨**

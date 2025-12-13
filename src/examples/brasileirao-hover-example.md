# 🎯 EXEMPLO DE HOVER COM DADOS REAIS DO BRASILEIRÃO

## 📋 DADOS DISPONÍVEIS (brasileirao-times.json)

Cada time possui:
- ✅ **ID único** (slug) - Ex: `"flamengo"`, `"palmeiras"`
- ✅ **Nome oficial** - Ex: `"Flamengo"`, `"Palmeiras"`
- ✅ **Apelido** - Ex: `"Mengão"`, `"Verdão"`
- ✅ **Cidade/Estado** - Ex: `"Rio de Janeiro/RJ"`
- ✅ **Cores oficiais** - Ex: `["vermelho", "preto"]`
- ✅ **Logo URL** - Links SVG do Wikimedia (alta resolução)
- ✅ **Estádio** - Ex: `"Maracanã"`, `"Allianz Parque"`
- ✅ **Data de fundação** - Ex: `"1895-11-17"`

---

## 🎨 CÓDIGO DO HOVER IMPLEMENTADO

### **1️⃣ Card Normal (Estado Inicial)**

```tsx
<button className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-[#FFD700] transition-all duration-300 hover:scale-105">
  {/* Logo */}
  <img 
    src={team.logo_url}  // ✅ URL real do Wikimedia
    alt={team.nome}
    className="w-24 h-24 object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-6"
  />
  
  {/* Nome */}
  <h3 className="text-white font-bold group-hover:text-[#FFD700] transition-colors">
    {team.nome}  // ✅ "Flamengo"
  </h3>
  
  {/* Apelido */}
  <p className="text-gray-400 text-sm">
    {team.apelido}  // ✅ "Mengão"
  </p>
</button>
```

---

### **2️⃣ Efeitos de Hover Aplicados**

#### **A) Logo do Time**
```tsx
// Estado Normal → Hover
className="
  w-24 h-24 
  object-contain 
  drop-shadow-2xl 
  transition-all duration-500 
  group-hover:scale-125      // ✅ Aumenta 25%
  group-hover:rotate-6       // ✅ Rotaciona 6 graus
  group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]  // ✅ Glow dourado
"
```

**Resultado:** Logo cresce, rotaciona levemente e ganha brilho dourado

---

#### **B) Background com Cores do Time**
```tsx
// Função que gera gradiente baseado nas cores oficiais
const getTeamGradient = (cores: string[]) => {
  const colorMap = {
    'vermelho': '#E50914',
    'preto': '#000000',
    'branco': '#FFFFFF',
    'azul': '#0066CC',
    'verde': '#009B3A',
    'grená': '#8B0000',
    'amarelo': '#FFDF00'
  };
  
  const colors = cores.map(cor => colorMap[cor]);
  return `linear-gradient(135deg, ${colors.join(', ')})`;
};

// Aplicação no hover
<div 
  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
  style={{ background: getTeamGradient(team.cores) }}  // ✅ ["vermelho", "preto"] do Flamengo
/>
```

**Resultado:** Background com gradiente das cores oficiais do time aparece suavemente

---

#### **C) Pills de Cores**
```tsx
{team.cores.map((cor, idx) => {
  const colorMap = {
    'vermelho': 'bg-red-600',
    'preto': 'bg-black border border-white/30',
    'branco': 'bg-white',
    'azul': 'bg-blue-600',
    'verde': 'bg-green-600'
  };
  
  return (
    <div 
      className={`
        w-6 h-6 
        rounded-full 
        ${colorMap[cor]} 
        shadow-lg 
        transform 
        group-hover:scale-110  // ✅ Aumenta 10% no hover
        transition-transform duration-300
      `}
    />
  );
})}
```

**Resultado:** Bolinhas coloridas crescem no hover

---

#### **D) Informações Extras (Aparecem no Hover)**
```tsx
<div className="
  space-y-2 
  text-xs 
  opacity-0                      // ✅ Invisível inicialmente
  group-hover:opacity-100        // ✅ Aparece no hover
  transition-all duration-300 
  transform 
  translate-y-4                  // ✅ Começa 4px abaixo
  group-hover:translate-y-0      // ✅ Move para posição normal
">
  {/* Cidade/Estado */}
  <div className="flex items-center gap-2">
    <MapPinIcon className="w-3.5 h-3.5 text-blue-400" />
    <span>{team.cidade}/{team.estado}</span>  {/* ✅ "Rio de Janeiro/RJ" */}
  </div>
  
  {/* Estádio */}
  <div className="flex items-center gap-2">
    <TrophyIcon className="w-3.5 h-3.5 text-green-400" />
    <span>{team.estadio}</span>  {/* ✅ "Maracanã" */}
  </div>
  
  {/* Anos de História */}
  <div className="flex items-center gap-2">
    <CalendarIcon className="w-3.5 h-3.5 text-yellow-400" />
    <span>{2025 - new Date(team.fundacao).getFullYear()} anos</span>  {/* ✅ "130 anos" */}
  </div>
</div>
```

**Resultado:** Informações deslizam de baixo para cima e aparecem suavemente

---

#### **E) Borda Dourada Animada**
```tsx
<div className="
  absolute inset-0 
  rounded-2xl 
  opacity-0 
  group-hover:opacity-100 
  transition-opacity duration-300
">
  <div className="absolute inset-0 rounded-2xl border-2 border-[#FFD700] animate-pulse" />
</div>
```

**Resultado:** Borda dourada pulsante aparece ao redor do card

---

## 🎬 SEQUÊNCIA COMPLETA DO HOVER

### **Estado Inicial (Sem Hover)**
```
┌─────────────────────┐
│                     │
│    [Logo 24x24]     │
│                     │
│   ▪ Flamengo        │
│   ▪ Mengão          │
│   ● ● (cores)       │
│                     │
└─────────────────────┘
```

### **Estado Hover (Mouse em cima)**
```
┌─────────────────────┐ ← Borda dourada pulsante
│ ╔═══════════════╗   │
│ ║ Background    ║   │ ← Gradiente vermelho/preto
│ ║ com cores     ║   │
│ ╚═══════════════╝   │
│                     │
│   [Logo 30x30]      │ ← Logo maior + rotacionada + glow
│     rotacionado     │
│                     │
│   ▪ Flamengo ⬅      │ ← Texto dourado
│   ▪ Mengão          │
│   ● ● (maiores)     │ ← Pills crescem
│                     │
│ ┌─────────────────┐ │
│ │ 📍 Rio de Janeiro│ │ ← Informações aparecem
│ │ 🏆 Maracanã     │ │
│ │ 📅 130 anos     │ │
│ └─────────────────┘ │
│                     │
│  Clique detalhes → │ ← CTA aparece
└─────────────────────┘
```

---

## 📊 COMPARAÇÃO: API vs JSON Local

| **Fonte** | **Football-Data API** | **JSON Local (Wikimedia)** |
|-----------|-----------------------|----------------------------|
| **Qualidade** | Escudos pequenos, às vezes PNG | SVG em alta resolução |
| **Confiabilidade** | Depende de API externa | 100% local e rápido |
| **Dados BR** | Nomes em inglês às vezes | Nomes oficiais em português |
| **Apelidos** | Não tem | ✅ "Mengão", "Verdão", etc |
| **Cores** | Não tem | ✅ Cores oficiais do time |
| **Estádios** | Genérico | ✅ Nomes corretos dos estádios |
| **Fundação** | Não tem | ✅ Data exata de fundação |

---

## ✅ EXEMPLO PRÁTICO DE USO

### **Flamengo (dados reais do JSON)**
```tsx
{
  "id": "flamengo",
  "nome": "Flamengo",
  "apelido": "Mengão",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cores": ["vermelho", "preto"],
  "logo_url": "https://upload.wikimedia.org/wikipedia/en/2/2e/CR_Flamengo_logo.svg",
  "estadio": "Maracanã",
  "fundacao": "1895-11-17"
}
```

### **Hover Resultante:**
1. **Logo SVG** de alta qualidade do Wikimedia
2. **Background** com gradiente vermelho → preto
3. **Pills** vermelha e preta crescem
4. **Texto** "Flamengo" fica dourado
5. **Informações:**
   - 📍 Rio de Janeiro/RJ
   - 🏆 Maracanã
   - 📅 130 anos de história
6. **Borda dourada** pulsante

---

## 🚀 COMO USAR NO SEU CÓDIGO

```tsx
import { BrasileiraoTeamsGrid } from './components/BrasileiraoTeamsGrid';

function SoccerPage() {
  const handleTeamClick = (team: any) => {
    console.log('Time clicado:', team.nome);
    // Abrir modal com detalhes, etc.
  };

  return (
    <div>
      <BrasileiraoTeamsGrid onTeamClick={handleTeamClick} />
    </div>
  );
}
```

---

## 🎯 VANTAGENS DESSE APPROACH

✅ **Logos oficiais em SVG** - Melhor qualidade que API  
✅ **Dados 100% precisos** - Nomes e apelidos corretos  
✅ **Performance** - Não depende de API externa  
✅ **Hover rico** - Mais informações que a API fornece  
✅ **Identidade visual** - Cores reais de cada time  
✅ **Mobile-friendly** - Animações otimizadas  

---

## 📱 RESPONSIVIDADE

```tsx
// Grid adapta automaticamente
grid-cols-2        // Mobile: 2 colunas
sm:grid-cols-3     // Tablets: 3 colunas
md:grid-cols-4     // Desktop pequeno: 4 colunas
lg:grid-cols-5     // Desktop grande: 5 colunas
```

---

**Versão:** 1.0.0  
**Última atualização:** 22/11/2025  
**Total de times:** 20 (Série A 2025)

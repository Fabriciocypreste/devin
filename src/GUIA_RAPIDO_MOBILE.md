# 📱 GUIA RÁPIDO - RESPONSIVIDADE MOBILE

## 🎯 Resposta Direta

### **Qual arquivo controla a versão mobile?**

✅ **`/styles/globals.css`** (linhas 143-288) - Estilos CSS mobile  
✅ **Classes Tailwind responsivas** nos componentes (prefixos `md:`, `lg:`, `sm:`)

---

## 🔧 Principais Regras Mobile

### **1. Font Size** (linha 143-147)

```css
@media (max-width: 768px) {
  :root {
    --font-size: 14px;  /* 16px no desktop */
  }
}
```

### **2. Touch Targets** (linha 283-288)

```css
@media (max-width: 768px) {
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### **3. Touch Highlight** (linha 271-275)

```css
@media (hover: none) and (pointer: coarse) {
  button, a {
    -webkit-tap-highlight-color: rgba(255, 215, 0, 0.3);
  }
}
```

---

## 📐 Breakpoints Tailwind

| Prefixo | Tamanho | Uso |
|---------|---------|-----|
| **(padrão)** | 0-767px | **Mobile** 📱 |
| `md:` | 768px+ | Tablet/Desktop 💻 |
| `lg:` | 1024px+ | Desktop grande 🖥️ |

---

## 🎨 Exemplos Práticos

### **Grid Responsivo:**
```tsx
<div className="
  grid-cols-2      // Mobile: 2 colunas
  md:grid-cols-4   // Desktop: 4 colunas
">
```

### **Padding Responsivo:**
```tsx
<div className="
  p-4              // Mobile: 16px
  md:p-8           // Desktop: 32px
">
```

### **Esconder no Mobile:**
```tsx
<div className="hidden md:block">
  {/* Só aparece em desktop */}
</div>
```

### **Mostrar Só no Mobile:**
```tsx
<div className="block md:hidden">
  {/* Só aparece em mobile */}
</div>
```

---

## 🧪 Testar Responsividade

### **DevTools (F12):**
1. Pressione **F12**
2. Clique no ícone de **dispositivo móvel**
3. Escolha: iPhone 12 Pro (390px)

### **Redimensionar Janela:**
- Arraste a janela para < 768px
- Observe as mudanças automáticas

---

## 📊 Layout por Dispositivo

### **Mobile (< 768px):**
- 2 colunas de filmes
- Menu hambúrguer
- Padding reduzido
- Font 14px

### **Desktop (≥ 768px):**
- 4-7 colunas de filmes
- Menu horizontal
- Padding maior
- Font 16px

---

## ✅ Checklist Rápido

- [ ] Grid muda de 2 → 7 colunas
- [ ] Botões têm 44px mínimo
- [ ] Texto reduz em mobile
- [ ] Sem scroll horizontal
- [ ] Touch funciona bem

---

**Arquivo principal: `/styles/globals.css` (linhas 143-288)**  
**Técnica: Tailwind responsive classes (`md:`, `lg:`, etc.)**

**Status: ✅ 100% RESPONSIVO**

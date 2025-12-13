# 🎯 GUIA COMPLETO DE INTEGRAÇÃO - REDFLIX

## 📌 RESUMO EXECUTIVO

Você tem **TUDO PRONTO** para integrar o backend com o frontend:

1. ✅ **Backend criado** - 15 tabelas + rotas
2. ✅ **Frontend conectado** - API client + hooks
3. ⚠️ **FALTA EXECUTAR** - SQL no Supabase

---

## 🚀 ORDEM DE EXECUÇÃO:

### **PASSO 1: CRIAR TABELAS NO SUPABASE** ⚡

Leia o arquivo: `/SETUP_SUPABASE.md`

**Resumo rápido:**
1. Acesse https://supabase.com/dashboard
2. Abra SQL Editor
3. Copie `/supabase/REDFLIX_COMPLETE_DATABASE.sql`
4. Cole e execute (Run)
5. Aguarde 30 segundos
6. Verifique se apareceram 12 tabelas

**Tempo:** 5 minutos

---

### **PASSO 2: TESTAR A INTEGRAÇÃO** 🧪

Depois que criar as tabelas:

1. Abra o console (F12)
2. Digite: `window.location.hash = '#test-backend'`
3. Crie uma conta de teste
4. Faça login
5. Teste adicionar à lista
6. Teste adicionar favoritos
7. Faça logout e login novamente
8. Veja que os dados persistiram! 🎉

**Tempo:** 3 minutos

---

### **PASSO 3: INTEGRAR NO APP EXISTENTE** 🔌

Agora que testou e funciona, integre nos componentes:

#### **3.1 - Integrar Login Real**

Edite `/components/Login.tsx`:

```tsx
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Login({ onLogin }: LoginProps) {
  const { signin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await signin(email, password);
      toast.success('Login realizado com sucesso!');
      onLogin(); // Navega para home
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // ... resto do código
}
```

#### **3.2 - Integrar Signup**

Edite `/components/Signup.tsx`:

```tsx
import { useAuth } from '../contexts/AuthContext';

export function Signup({ onSignup }: SignupProps) {
  const { signup } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signup(email, password, name, phone);
      toast.success('Conta criada! Fazendo login...');
      // Signup já faz login automaticamente
      onSignup();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    }
  };
}
```

#### **3.3 - Integrar Minha Lista**

Edite `/components/MovieCard.tsx`:

```tsx
import { useMyList } from '../hooks/useMyList';

export function MovieCard({ movie }: MovieCardProps) {
  const { toggleMyList, isInMyList } = useMyList();
  
  const handleAddToList = async () => {
    await toggleMyList({
      content_id: movie.id.toString(),
      content_type: movie.media_type || 'movie',
      tmdb_id: movie.id,
      title: movie.title || movie.name,
      poster_url: movie.poster_path
    });
  };

  const inList = isInMyList(movie.id.toString());

  return (
    // ...
    <button onClick={handleAddToList}>
      {inList ? '✓ Na Lista' : '+ Minha Lista'}
    </button>
    // ...
  );
}
```

#### **3.4 - Integrar Favoritos**

```tsx
import { useFavorites } from '../hooks/useFavorites';

const { toggleFavorite, isFavorite } = useFavorites();

// No botão de favorito:
<button onClick={() => toggleFavorite({
  content_id: movie.id.toString(),
  content_type: 'movie',
  tmdb_id: movie.id,
  title: movie.title,
  poster_url: movie.poster_path
})}>
  {isFavorite(movie.id.toString()) ? '❤️' : '🤍'}
</button>
```

#### **3.5 - Página Minha Lista**

Edite `/components/MyListPage.tsx`:

```tsx
import { useMyList } from '../hooks/useMyList';

export function MyListPage() {
  const { myList, isLoading } = useMyList();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Minha Lista ({myList.length})</h1>
      {myList.map(item => (
        <MovieCard 
          key={item.id}
          movie={{
            id: item.tmdb_id!,
            title: item.title!,
            poster_path: item.poster_url!,
            // ... outros campos
          }}
        />
      ))}
    </div>
  );
}
```

#### **3.6 - Página Favoritos**

Similar à Minha Lista:

```tsx
import { useFavorites } from '../hooks/useFavorites';

export function FavoritosPage() {
  const { favorites, isLoading } = useFavorites();
  
  // ... mesmo padrão da MyListPage
}
```

---

## 🎨 **COMPONENTES PRONTOS PARA USAR:**

### **useAuth Hook**
```tsx
const {
  user,              // Dados do usuário logado
  accessToken,       // Token JWT
  profiles,          // Lista de perfis
  selectedProfile,   // Perfil selecionado
  isAuthenticated,   // true/false
  isLoading,         // true enquanto carrega
  signin,            // (email, password) => Promise
  signup,            // (email, password, name) => Promise
  signout,           // () => Promise
  selectProfile,     // (profile) => void
  createProfile,     // (name, isKids) => Promise
} = useAuth();
```

### **useMyList Hook**
```tsx
const {
  myList,            // Array de itens
  isLoading,         // true enquanto carrega
  isInMyList,        // (contentId) => boolean
  addToMyList,       // (data) => Promise
  removeFromMyList,  // (contentId) => Promise
  toggleMyList,      // (data) => Promise
  refreshMyList,     // () => Promise
} = useMyList();
```

### **useFavorites Hook**
```tsx
const {
  favorites,         // Array de itens
  isLoading,         // true enquanto carrega
  isFavorite,        // (contentId) => boolean
  addToFavorites,    // (data) => Promise
  removeFromFavorites, // (contentId) => Promise
  toggleFavorite,    // (data) => Promise
  refreshFavorites,  // () => Promise
} = useFavorites();
```

---

## 📊 **API DISPONÍVEL:**

```tsx
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const { accessToken } = useAuth();

// AUTENTICAÇÃO
await api.auth.signup({ email, password, name });
await api.auth.signin(email, password);
await api.auth.signout(token);

// USUÁRIOS
await api.users.getMe(token);

// PERFIS
await api.profiles.list(token);
await api.profiles.create(token, data);
await api.profiles.update(token, profileId, data);
await api.profiles.delete(token, profileId);

// MINHA LISTA
await api.myList.list(token, profileId);
await api.myList.add(token, data);
await api.myList.remove(token, contentId, profileId);

// FAVORITOS
await api.favorites.list(token, profileId);
await api.favorites.add(token, data);
await api.favorites.remove(token, contentId, profileId);

// REVIEWS
await api.reviews.list(contentId);
await api.reviews.create(token, data);
await api.reviews.update(token, reviewId, data);
await api.reviews.delete(token, reviewId);

// IPTV
await api.iptv.listChannels({ category, search });
await api.iptv.getChannel(slug);
await api.iptv.listCategories();
await api.iptv.listFavorites(token, profileId);
await api.iptv.addFavorite(token, data);
await api.iptv.removeFavorite(token, channelId, profileId);

// NOTIFICAÇÕES
await api.notifications.list(token, unreadOnly, limit);
await api.notifications.markAsRead(token, notificationId);
await api.notifications.markAllAsRead(token);
await api.notifications.delete(token, notificationId);
await api.notifications.clearAll(token);
```

---

## 🎯 **CHECKLIST DE INTEGRAÇÃO:**

### **Backend (Supabase)**
- [ ] Executar SQL no Supabase
- [ ] Verificar 12 tabelas criadas
- [ ] Verificar RLS habilitado
- [ ] Testar com página de teste

### **Frontend (Componentes)**
- [ ] Integrar Login.tsx
- [ ] Integrar Signup.tsx
- [ ] Integrar MovieCard.tsx (botão Minha Lista)
- [ ] Integrar MovieCard.tsx (botão Favoritos)
- [ ] Integrar MyListPage.tsx
- [ ] Integrar FavoritosPage.tsx
- [ ] Integrar ProfileSelection.tsx
- [ ] Integrar Logout

---

## 💡 **DICAS IMPORTANTES:**

### **1. Sempre verificar autenticação**
```tsx
const { isAuthenticated, accessToken } = useAuth();

if (!isAuthenticated) {
  toast.error('Você precisa estar logado');
  return;
}
```

### **2. Usar try/catch**
```tsx
try {
  await toggleMyList(data);
} catch (error) {
  console.error(error);
  // Toast já é mostrado automaticamente pelos hooks
}
```

### **3. Passar content_type correto**
```tsx
content_type: movie.media_type || 'movie' // 'movie' ou 'tv'
```

### **4. IDs como string**
```tsx
content_id: movie.id.toString() // Sempre como string
```

---

## 🔄 **FLUXO COMPLETO:**

```
Usuário → Login → Autenticação → Token salvo
                                       ↓
                          ← Carrega perfis
                                       ↓
                          ← Seleciona perfil
                                       ↓
                          ← Navega no app
                                       ↓
              Clica "+ Minha Lista" → useMyList.toggleMyList()
                                       ↓
                          ← API envia para backend
                                       ↓
                          ← Supabase salva no banco
                                       ↓
                          ← Hook recarrega lista
                                       ↓
                          ← UI atualiza automaticamente ✅
```

---

## 📂 **ARQUIVOS IMPORTANTES:**

```
/utils/api.ts                    - Cliente API completo
/contexts/AuthContext.tsx        - Gerenciamento de sessão
/hooks/useMyList.ts              - Hook minha lista
/hooks/useFavorites.ts           - Hook favoritos
/components/TestBackend.tsx      - Página de teste

/supabase/REDFLIX_COMPLETE_DATABASE.sql  - SQL completo ⭐
/SETUP_SUPABASE.md                       - Como executar SQL
/BACKEND_INTEGRATION_COMPLETE.md         - Documentação técnica
```

---

## 🎉 **ESTÁ TUDO PRONTO!**

Agora é só:
1. ✅ Executar SQL no Supabase (5 min)
2. ✅ Testar na página de teste (3 min)
3. ✅ Integrar nos componentes (conforme necessidade)

**Boa integração! 🚀**

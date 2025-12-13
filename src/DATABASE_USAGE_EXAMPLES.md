# 📖 REDFLIX - EXEMPLOS DE USO DO BANCO DE DADOS

Guia prático com exemplos de código para usar as funções do banco de dados.

---

## 🚀 SETUP INICIAL

### Importar Funções
```typescript
import {
  // Users
  getUserProfile,
  updateUserProfile,
  
  // Profiles
  getUserProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  
  // Content
  getContent,
  getFeaturedContent,
  getTrendingContent,
  searchContent,
  getMovies,
  getSeries,
  
  // Lists
  getMyList,
  addToMyList,
  removeFromMyList,
  isInMyList,
  
  // Favorites
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  
  // Watch History
  getContinueWatching,
  updateWatchProgress,
  getWatchProgress,
  
  // Reviews
  addReview,
  getContentReviews,
  
  // IPTV
  getIPTVChannels,
  getIPTVFavorites,
  addIPTVFavorite,
  
  // Analytics
  trackEvent
} from './utils/supabase/database';
```

---

## 👤 USUÁRIOS

### Buscar Perfil do Usuário
```typescript
const userId = 'uuid-do-usuario';
const userProfile = await getUserProfile(userId);

console.log(userProfile);
// {
//   id: 'uuid...',
//   email: 'user@example.com',
//   full_name: 'João Silva',
//   subscription_plan: 'premium',
//   subscription_status: 'active',
//   ...
// }
```

### Atualizar Perfil
```typescript
await updateUserProfile(userId, {
  full_name: 'João Pedro Silva',
  phone: '+5511999999999',
  autoplay_previews: false,
  video_quality: '1080p'
});
```

---

## 👥 PERFIS

### Listar Perfis do Usuário
```typescript
const profiles = await getUserProfiles(userId);

console.log(profiles);
// [
//   { id: '...', name: 'João', is_kids: false, ... },
//   { id: '...', name: 'Maria', is_kids: false, ... },
//   { id: '...', name: 'Kids', is_kids: true, ... }
// ]
```

### Criar Novo Perfil
```typescript
const newProfile = await createProfile(userId, {
  name: 'Maria',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
  is_kids: false
});

console.log('Perfil criado:', newProfile.id);
```

### Criar Perfil Infantil com PIN
```typescript
const kidsProfile = await createProfile(userId, {
  name: 'Kids',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kids',
  is_kids: true,
  pin_code: '1234' // Será criptografado
});
```

### Atualizar Perfil
```typescript
await updateProfile(profileId, {
  name: 'João Pedro',
  age_rating: '18' // Permitir conteúdo adulto
});
```

### Deletar Perfil
```typescript
await deleteProfile(profileId);
```

---

## 🎬 CONTEÚDO

### Buscar Conteúdo Específico
```typescript
const contentId = 550; // Fight Club
const content = await getContent(contentId);

console.log(content.title); // "Clube da Luta"
```

### Buscar Filmes em Destaque
```typescript
const featured = await getFeaturedContent(10);

featured.forEach(item => {
  console.log(`⭐ ${item.title} - ${item.vote_average}/10`);
});
```

### Buscar Conteúdo em Alta (Trending)
```typescript
const trending = await getTrendingContent(20);

// Exibir na seção "Em Alta"
<ContentRow title="Em Alta" items={trending} />
```

### Buscar por Texto
```typescript
const query = 'vingadores';
const results = await searchContent(query, 50);

console.log(`${results.length} resultados para "${query}"`);
```

### Filtrar por Gênero
```typescript
// Gênero 28 = Ação
const actionMovies = await getContentByGenre(28, 20);

// Gênero 35 = Comédia
const comedies = await getContentByGenre(35, 20);
```

### Listar Filmes
```typescript
const movies = await getMovies(50);

movies.forEach(movie => {
  console.log(`🎬 ${movie.title} (${movie.release_date})`);
});
```

### Listar Séries
```typescript
const series = await getSeries(50);

series.forEach(show => {
  console.log(`📺 ${show.title} - ${show.number_of_seasons} temporadas`);
});
```

---

## 📋 MINHA LISTA

### Ver Minha Lista
```typescript
const myList = await getMyList(profileId);

console.log(`${myList.length} itens na Minha Lista`);

myList.forEach(item => {
  console.log(`- ${item.content.title}`);
});
```

### Adicionar à Minha Lista
```typescript
const contentId = 550; // Fight Club

await addToMyList(profileId, contentId);

console.log('✅ Adicionado à Minha Lista');
```

### Remover da Minha Lista
```typescript
await removeFromMyList(profileId, contentId);

console.log('🗑️ Removido da Minha Lista');
```

### Verificar se está na Lista
```typescript
const isInList = await isInMyList(profileId, contentId);

if (isInList) {
  console.log('✓ Já está na Minha Lista');
} else {
  console.log('+ Adicionar à Minha Lista');
}
```

### Toggle (Adicionar/Remover)
```typescript
const toggleMyList = async (profileId: string, contentId: number) => {
  const isInList = await isInMyList(profileId, contentId);
  
  if (isInList) {
    await removeFromMyList(profileId, contentId);
    return false;
  } else {
    await addToMyList(profileId, contentId);
    return true;
  }
};
```

---

## ⭐ FAVORITOS

### Ver Favoritos
```typescript
const favorites = await getFavorites(profileId);

console.log(`❤️ ${favorites.length} favoritos`);
```

### Adicionar aos Favoritos
```typescript
await addToFavorites(profileId, contentId);
```

### Toggle Favorito
```typescript
const toggleFavorite = async (profileId: string, contentId: number) => {
  const isFavorite = await isInFavorites(profileId, contentId);
  
  if (isFavorite) {
    await removeFromFavorites(profileId, contentId);
    return false;
  } else {
    await addToFavorites(profileId, contentId);
    return true;
  }
};
```

---

## ⏯️ CONTINUAR ASSISTINDO

### Ver Lista "Continuar Assistindo"
```typescript
const continueWatching = await getContinueWatching(profileId, 10);

continueWatching.forEach(item => {
  console.log(
    `▶️ ${item.title} - ${Math.round(item.progress_percentage)}% assistido`
  );
});
```

### Atualizar Progresso (Filme)
```typescript
// Usuário assistiu 45 minutos de um filme de 120 minutos
await updateWatchProgress(
  profileId,
  contentId,
  45 * 60,  // 45 min em segundos
  120 * 60  // 120 min em segundos
);
```

### Atualizar Progresso (Episódio de Série)
```typescript
// Usuário assistiu 25 minutos de um episódio de 42 minutos
await updateWatchProgress(
  profileId,
  contentId,
  25 * 60,   // current_time
  42 * 60,   // total_time
  episodeId  // ID do episódio
);
```

### Buscar Progresso Atual
```typescript
const progress = await getWatchProgress(profileId, contentId);

if (progress) {
  const percentage = progress.progress_percentage;
  const currentTime = progress.current_time;
  
  console.log(`Continuar de ${Math.round(percentage)}%`);
  console.log(`Retomar em ${formatTime(currentTime)}`);
}
```

### Marcar como Completo
```typescript
await markAsCompleted(profileId, contentId, episodeId);
```

### Implementação no Player
```typescript
const VideoPlayer = ({ contentId, profileId, episodeId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Carregar progresso ao iniciar
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getWatchProgress(profileId, contentId, episodeId);
      
      if (progress && videoRef.current) {
        videoRef.current.currentTime = progress.current_time;
      }
    };
    
    loadProgress();
  }, []);
  
  // Salvar progresso a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        updateWatchProgress(
          profileId,
          contentId,
          Math.floor(videoRef.current.currentTime),
          Math.floor(videoRef.current.duration),
          episodeId
        );
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Marcar como completo ao terminar
  const handleEnded = () => {
    markAsCompleted(profileId, contentId, episodeId);
  };
  
  return (
    <video 
      ref={videoRef}
      onEnded={handleEnded}
      controls
    />
  );
};
```

---

## ⭐ AVALIAÇÕES E REVIEWS

### Adicionar Review
```typescript
await addReview(
  profileId,
  contentId,
  5, // rating (1-5)
  'Filme incrível! Highly recommended!', // review text
  true // thumbs up
);
```

### Adicionar Rating sem Review
```typescript
await addReview(profileId, contentId, 4);
```

### Like/Dislike
```typescript
// Like
await addReview(profileId, contentId, 5, undefined, true);

// Dislike
await addReview(profileId, contentId, 1, undefined, false);
```

### Buscar Reviews de um Conteúdo
```typescript
const reviews = await getContentReviews(contentId);

reviews.forEach(review => {
  console.log(`⭐ ${review.rating}/5 - ${review.profile.name}`);
  if (review.review_text) {
    console.log(`   "${review.review_text}"`);
  }
});
```

### Calcular Média de Ratings
```typescript
const reviews = await getContentReviews(contentId);

const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

console.log(`Média: ${avgRating.toFixed(1)}/5 (${reviews.length} reviews)`);
```

---

## 📺 IPTV / CANAIS

### Listar Todos os Canais
```typescript
const channels = await getIPTVChannels();

channels.forEach(channel => {
  console.log(`📺 ${channel.name} - ${channel.category}`);
});
```

### Filtrar por Categoria
```typescript
const sportsChannels = await getIPTVChannels('sports');
const newsChannels = await getIPTVChannels('news');
const kidsChannels = await getIPTVChannels('kids');
```

### Listar Categorias
```typescript
const categories = await getIPTVCategories();

console.log('Categorias:', categories);
// ['sports', 'news', 'movies', 'kids', 'entertainment']
```

### Favoritar Canal
```typescript
await addIPTVFavorite(profileId, channelId);
```

### Remover Favorito
```typescript
await removeIPTVFavorite(profileId, channelId);
```

### Listar Canais Favoritos
```typescript
const favoriteChannels = await getIPTVFavorites(profileId);

favoriteChannels.forEach(fav => {
  console.log(`❤️ ${fav.channel.name}`);
});
```

---

## 📊 ANALYTICS

### Track Video Play
```typescript
trackEvent(
  'play',           // event_type
  'video',          // event_category
  {
    video_quality: '1080p',
    audio_language: 'pt',
    subtitle: 'pt'
  },
  userId,
  profileId,
  contentId
);
```

### Track Search
```typescript
trackEvent(
  'search',
  'navigation',
  {
    query: 'vingadores',
    results_count: 15
  },
  userId,
  profileId
);
```

### Track Button Click
```typescript
trackEvent(
  'click',
  'interaction',
  {
    button: 'add_to_list',
    content_title: 'Fight Club'
  },
  userId,
  profileId,
  contentId
);
```

### Track Page View
```typescript
trackEvent(
  'page_view',
  'navigation',
  {
    page: 'home',
    referrer: document.referrer
  },
  userId,
  profileId
);
```

---

## 🎭 EXEMPLO COMPLETO: MovieCard Component

```typescript
import { useState, useEffect } from 'react';
import {
  isInMyList,
  addToMyList,
  removeFromMyList,
  isInFavorites,
  addToFavorites,
  removeFromFavorites,
  trackEvent
} from './utils/supabase/database';

interface MovieCardProps {
  movie: any;
  profileId: string;
  userId: string;
  onPlay: () => void;
}

export function MovieCard({ movie, profileId, userId, onPlay }: MovieCardProps) {
  const [inMyList, setInMyList] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // Carregar estados ao montar
    const loadStates = async () => {
      const [inList, inFavs] = await Promise.all([
        isInMyList(profileId, movie.id),
        isInFavorites(profileId, movie.id)
      ]);
      
      setInMyList(inList);
      setIsFavorite(inFavs);
    };
    
    loadStates();
  }, [profileId, movie.id]);
  
  const handleToggleMyList = async () => {
    try {
      if (inMyList) {
        await removeFromMyList(profileId, movie.id);
        setInMyList(false);
        trackEvent('remove_from_list', 'interaction', { title: movie.title }, userId, profileId, movie.id);
      } else {
        await addToMyList(profileId, movie.id);
        setInMyList(true);
        trackEvent('add_to_list', 'interaction', { title: movie.title }, userId, profileId, movie.id);
      }
    } catch (error) {
      console.error('Error toggling my list:', error);
    }
  };
  
  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(profileId, movie.id);
        setIsFavorite(false);
        trackEvent('unfavorite', 'interaction', { title: movie.title }, userId, profileId, movie.id);
      } else {
        await addToFavorites(profileId, movie.id);
        setIsFavorite(true);
        trackEvent('favorite', 'interaction', { title: movie.title }, userId, profileId, movie.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  
  const handlePlay = () => {
    trackEvent('play', 'video', { title: movie.title }, userId, profileId, movie.id);
    onPlay();
  };
  
  return (
    <div className="movie-card">
      <img src={movie.poster_path} alt={movie.title} />
      
      <div className="actions">
        <button onClick={handlePlay}>▶ Play</button>
        <button onClick={handleToggleMyList}>
          {inMyList ? '✓ Na Minha Lista' : '+ Adicionar'}
        </button>
        <button onClick={handleToggleFavorite}>
          {isFavorite ? '❤️ Favoritado' : '🤍 Favoritar'}
        </button>
      </div>
      
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
    </div>
  );
}
```

---

## 🔐 AUTENTICAÇÃO

### Login com Email/Password
```typescript
import { createClient } from './utils/supabase/client';

const supabase = createClient();

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'senha123'
});

if (error) {
  console.error('Login error:', error.message);
} else {
  const userId = data.user.id;
  console.log('Logged in:', userId);
}
```

### Signup
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'newuser@example.com',
  password: 'senha123',
  options: {
    data: {
      full_name: 'Novo Usuário'
    }
  }
});
```

### Logout
```typescript
await supabase.auth.signOut();
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  console.log('Current user:', user.id);
} else {
  console.log('Not logged in');
}
```

---

## 📱 EXEMPLO: App Completo

```typescript
import { useState, useEffect } from 'react';
import { createClient } from './utils/supabase/client';
import {
  getUserProfiles,
  getFeaturedContent,
  getContinueWatching,
  getMyList
} from './utils/supabase/database';

export default function App() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [myList, setMyList] = useState([]);
  
  const supabase = createClient();
  
  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Load profiles
  useEffect(() => {
    if (user) {
      getUserProfiles(user.id).then(setProfiles);
    }
  }, [user]);
  
  // Load content for selected profile
  useEffect(() => {
    if (selectedProfile) {
      Promise.all([
        getFeaturedContent(10),
        getContinueWatching(selectedProfile.id, 10),
        getMyList(selectedProfile.id)
      ]).then(([f, c, m]) => {
        setFeatured(f);
        setContinueWatching(c);
        setMyList(m);
      });
    }
  }, [selectedProfile]);
  
  if (!user) {
    return <LoginPage />;
  }
  
  if (!selectedProfile) {
    return (
      <ProfileSelection
        profiles={profiles}
        onSelect={setSelectedProfile}
      />
    );
  }
  
  return (
    <div>
      <Header profile={selectedProfile} />
      
      <HeroSlider items={featured} />
      
      <ContentRow 
        title="Continuar Assistindo" 
        items={continueWatching}
      />
      
      <ContentRow 
        title="Minha Lista" 
        items={myList}
      />
      
      <ContentRow 
        title="Em Alta" 
        items={featured}
      />
    </div>
  );
}
```

---

**✅ Guia completo de uso do banco de dados!**

Para mais detalhes, veja `/DATABASE_SETUP_GUIDE.md`

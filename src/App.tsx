/**
 * REDFLIX MAIN APP
 * Refactored to use React Router for navigation
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import pages
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { Series } from './pages/Series';
import { LiveTV } from './pages/LiveTV';
import { Search } from './pages/Search';
import { Details } from './pages/Details';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Favorites } from './pages/Favorites';
import { History } from './pages/History';
import { NotFound } from './pages/NotFound';

// Import existing components
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Navbar } from './components/Navbar';
import Player from './components/Player';
import { MovieDetails } from './components/MovieDetails';
import { initializeImageCache } from './utils/imageCache';
import { preloadCriticalResources } from './utils/resourcePreloader';
import { setupTVMode } from './utils/tvNavigation';
import { initSecurityProtections } from './utils/securityChecks';

import { EnrichedContent } from './types/content';
import { Movie } from './utils/tmdb';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Layout wrapper with Navbar
function LayoutWithNavbar({ children, activeNav }: { children: React.ReactNode; activeNav: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-black min-h-screen">
      <Navbar active={activeNav} onChange={(screen) => {
        // Map old screen names to routes
        const routeMap: Record<string, string> = {
          'home': '/home',
          'movies': '/movies',
          'series': '/series',
          'live-tv': '/live-tv',
          'kids': '/home', // Redirect kids to home for now
          'search': '/search',
          'favorites': '/favorites',
          'history': '/history',
          'profile': '/profile',
          'settings': '/settings'
        };
        navigate(routeMap[screen] || '/home');
      }} />
      {children}
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [playingContent, setPlayingContent] = useState<EnrichedContent | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Initialize systems on mount
  useEffect(() => {
    console.log('🚀 Initializing RedFlix...');
    
    // Initialize image cache
    initializeImageCache();
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Setup TV Mode for Android TV / TV Box
    setupTVMode();
    
    // Initialize security protections
    initSecurityProtections();
    
    console.log('✅ RedFlix initialized successfully');
  }, []);

  // Handler for playing content
  const handlePlay = (item: EnrichedContent) => {
    console.log('🎬 Playing:', item.title);
    setPlayingContent(item);
  };

  // Handler for movie details
  const handleMovieDetails = (movie: Movie) => {
    console.log('📄 Opening details for:', movie.title || movie.name);
    setSelectedMovie(movie);
  };

  // Handler for closing player
  const handleClosePlayer = () => {
    console.log('🔙 Closing player');
    setPlayingContent(null);
  };

  // Handler for closing movie details
  const handleCloseDetails = () => {
    console.log('🔙 Closing movie details');
    setSelectedMovie(null);
  };

  // Convert EnrichedContent to Movie format
  const toMovie = (item: EnrichedContent): Movie => ({
    id: typeof item.id === 'number' ? item.id : parseInt(item.id) || 0,
    title: item.title,
    name: item.title,
    overview: item.overview || '',
    poster_path: item.posterPath || '',
    backdrop_path: item.backdropPath || '',
    vote_average: item.rating || 0,
    media_type: item.type === 'series' ? 'tv' : item.type === 'movie' ? 'movie' : 'tv',
    release_date: item.releaseDate,
    first_air_date: item.releaseDate,
    streamUrl: item.streamUrl
  });

  return (
    <>
      {/* Player Overlay */}
      {playingContent && (
        <div className="fixed inset-0 z-[9999] bg-black">
          <Player
            movie={toMovie(playingContent)}
            onBack={handleClosePlayer}
          />
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={handleCloseDetails}
          onPlayMovie={(movie) => {
            handleCloseDetails();
            // Convert Movie to EnrichedContent for player
            const enrichedContent: EnrichedContent = {
              id: movie.id.toString(),
              title: movie.title || movie.name || '',
              overview: movie.overview,
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
              streamUrl: movie.streamUrl || '',
              type: movie.media_type === 'tv' ? 'series' : 'movie',
              rating: movie.vote_average,
              releaseDate: movie.release_date || movie.first_air_date
            };
            handlePlay(enrichedContent);
          }}
          onActorClick={() => {}}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="home">
                <Home onPlay={handlePlay} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="movies">
                <Movies onPlay={handlePlay} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/series"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="series">
                <Series onPlay={handlePlay} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/live-tv"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="live-tv">
                <LiveTV onPlay={handlePlay} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="search">
                <Search onPlay={handlePlay} onDetails={(item) => navigate(`/details/${item.id}`)} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="">
                <Details onPlay={handlePlay} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="profile">
                <Profile />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="settings">
                <Settings />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="favorites">
                <Favorites onPlay={handlePlay} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <LayoutWithNavbar activeNav="history">
                <History onPlay={handlePlay} />
              </LayoutWithNavbar>
            </ProtectedRoute>
          }
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound onPlay={handlePlay} />} />
      </Routes>
    </>
  );
}

export default App;

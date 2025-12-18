/**
 * REDFLIX ROUTER WRAPPER
 * Wrapper component that provides React Router routing while preserving existing App.tsx logic
 */

import React, { useState } from 'react';
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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export function RouterApp() {
  const navigate = useNavigate();
  const [playingContent, setPlayingContent] = useState<EnrichedContent | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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
              <div>
                <Navbar active="home" onChange={(screen) => navigate(`/${screen}`)} />
                <Home onPlay={handlePlay} />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="movies" onChange={(screen) => navigate(`/${screen}`)} />
                <Movies onPlay={handlePlay} />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/series"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="series" onChange={(screen) => navigate(`/${screen}`)} />
                <Series onPlay={handlePlay} />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/live-tv"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="live-tv" onChange={(screen) => navigate(`/${screen}`)} />
                <LiveTV onPlay={handlePlay} />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="search" onChange={(screen) => navigate(`/${screen}`)} />
                <Search onPlay={handlePlay} onDetails={(item) => navigate(`/details/${item.id}`)} />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="" onChange={(screen) => navigate(`/${screen}`)} />
                <Details onPlay={handlePlay} />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="profile" onChange={(screen) => navigate(`/${screen}`)} />
                <Profile />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="settings" onChange={(screen) => navigate(`/${screen}`)} />
                <Settings />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="favorites" onChange={(screen) => navigate(`/${screen}`)} />
                <Favorites onPlay={handlePlay} />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <div>
                <Navbar active="history" onChange={(screen) => navigate(`/${screen}`)} />
                <History onPlay={handlePlay} />
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound onPlay={handlePlay} />} />
      </Routes>
    </>
  );
}

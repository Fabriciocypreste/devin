/**
 * Canais Page Component
 * Main page for browsing and watching IPTV channels
 */

import React, { useState, useEffect } from 'react';
import { Channel } from '../services/m3uParser';
import { loadCanais, getCategories, filterCanais } from '../services/canaisService';
import { PlayerModal } from '../components/PlayerModal';
import '../styles/canais.css';

interface CanaisPageProps {
  onClose?: () => void;
}

export function CanaisPage({ onClose }: CanaisPageProps) {
  // State management
  const [canais, setCanais] = useState<Channel[]>([]);
  const [filteredCanais, setFilteredCanais] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load channels on mount
  useEffect(() => {
    async function loadChannels() {
      try {
        setLoading(true);
        setError(null);
        
        const channels = await loadCanais();
        
        if (channels.length === 0) {
          setError('Nenhum canal encontrado no arquivo M3U');
          return;
        }
        
        setCanais(channels);
        setFilteredCanais(channels);
        
        const cats = getCategories(channels);
        setCategories(cats);
        
        console.log('✅ Channels loaded successfully:', channels.length);
      } catch (err) {
        console.error('Error loading channels:', err);
        setError('Erro ao carregar canais. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, []);

  // Apply filters when search or category changes
  useEffect(() => {
    const filtered = filterCanais(canais, search, selectedCategory);
    setFilteredCanais(filtered);
  }, [search, selectedCategory, canais]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Handle channel click to open player
  const handleChannelClick = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  // Handle close player
  const handleClosePlayer = () => {
    setSelectedChannel(null);
  };

  return (
    <div className="canais-page">
      {/* Header with filters */}
      <header className="canais-header">
        <div className="header-content">
          <h1 className="page-title">📺 Canais IPTV</h1>
          
          <div className="filters">
            <input
              type="text"
              placeholder="🔍 Buscar canal..."
              value={search}
              onChange={handleSearchChange}
              className="search-input"
            />
            
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <p className="counter">
            {filteredCanais.length} canais encontrados
          </p>

          {/* Close button if onClose is provided */}
          {onClose && (
            <button onClick={onClose} className="close-page-btn">
              ✕ Fechar
            </button>
          )}
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando canais...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Channels grid */}
      {!loading && !error && (
        <div className="canais-grid">
          {filteredCanais.length > 0 ? (
            filteredCanais.map(canal => (
              <div key={canal.id} className="canal-card">
                <div className="canal-logo-container">
                  {canal.logo ? (
                    <img 
                      src={canal.logo} 
                      alt={canal.name}
                      className="canal-logo"
                      onError={(e) => {
                        // Fallback to placeholder if logo fails to load
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="112" viewBox="0 0 200 112"%3E%3Crect fill="%231a1f3a" width="200" height="112"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2300d9ff" font-size="48" font-family="Arial, sans-serif"%3E📺%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="canal-logo-placeholder">📺</div>
                  )}
                </div>
                
                <div className="canal-info">
                  <h3 className="canal-name">{canal.name}</h3>
                  <span className="canal-category">{canal.group}</span>
                </div>
                
                <button 
                  onClick={() => handleChannelClick(canal)}
                  className="watch-btn"
                >
                  ▶️ Assistir
                </button>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Nenhum canal encontrado com os filtros aplicados</p>
            </div>
          )}
        </div>
      )}

      {/* Player Modal */}
      {selectedChannel && (
        <PlayerModal
          channel={selectedChannel}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}

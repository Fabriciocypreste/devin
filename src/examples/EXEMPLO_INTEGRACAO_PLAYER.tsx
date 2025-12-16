/**
 * 🎬 EXEMPLOS DE INTEGRAÇÃO - IPTVUniversalPlayer
 * 
 * Como integrar o player universal em diferentes partes da aplicação
 */

import React, { useState } from 'react';
import IPTVUniversalPlayer from './components/IPTVUniversalPlayer';

// ══════════════════════════════════════════════════════════════
// EXEMPLO 1: Reproduzir Canal IPTV (M3U8 ao vivo)
// ══════════════════════════════════════════════════════════════

export function ExemploCanaisIPTV() {
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  const canais = [
    {
      id: 1,
      name: 'Globo HD',
      streamUrl: 'http://servidor.com/canais/globo/live.m3u8',
      logo: 'https://image.tmdb.org/t/p/w200/globo.png',
    },
    {
      id: 2,
      name: 'SBT',
      streamUrl: 'http://servidor.com/canais/sbt/live.m3u8',
      logo: 'https://image.tmdb.org/t/p/w200/sbt.png',
    },
  ];

  return (
    <div>
      {/* Lista de Canais */}
      <div className="grid grid-cols-4 gap-4">
        {canais.map((canal) => (
          <button
            key={canal.id}
            onClick={() => setSelectedChannel(canal)}
            className="p-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            <img src={canal.logo} alt={canal.name} className="w-full" />
            <p className="text-white mt-2">{canal.name}</p>
          </button>
        ))}
      </div>

      {/* Player */}
      {selectedChannel && (
        <div className="fixed inset-0 bg-black z-50">
          <IPTVUniversalPlayer
            streamUrl={selectedChannel.streamUrl}
            title={selectedChannel.name}
            poster={selectedChannel.logo}
            isLive={true} // ✅ Canal ao vivo
            enableP2P={true} // ✅ Ativa P2P
            enableStats={true} // ✅ Mostra estatísticas
            autoPlay={true}
            onClose={() => setSelectedChannel(null)}
          />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXEMPLO 2: Reproduzir Filme (MP4 P2P)
// ══════════════════════════════════════════════════════════════

export function ExemploFilmes() {
  const [playingMovie, setPlayingMovie] = useState<any>(null);

  const filmes = [
    {
      id: 1,
      title: 'Silvio (2024)',
      streamUrl: 'http://api.cdnapp.fun:80/movie/new_app/Q24Wb98eYc/359.mp4',
      poster_path: 'https://image.tmdb.org/t/p/w500/silvio.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/original/silvio_backdrop.jpg',
    },
    {
      id: 2,
      title: 'Ainda Estou Aqui (2024)',
      streamUrl: 'http://api.cdnapp.fun:80/movie/new_app/Q24Wb98eYc/360.mp4',
      poster_path: 'https://image.tmdb.org/t/p/w500/ainda_estou_aqui.jpg',
      backdrop_path: 'https://image.tmdb.org/t/p/original/ainda_estou_aqui_backdrop.jpg',
    },
  ];

  return (
    <div>
      {/* Lista de Filmes */}
      <div className="grid grid-cols-5 gap-4">
        {filmes.map((filme) => (
          <button
            key={filme.id}
            onClick={() => setPlayingMovie(filme)}
            className="group relative"
          >
            <img 
              src={filme.poster_path} 
              alt={filme.title}
              className="w-full rounded hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-4xl">▶️</span>
            </div>
          </button>
        ))}
      </div>

      {/* Player */}
      {playingMovie && (
        <div className="fixed inset-0 bg-black z-50">
          <IPTVUniversalPlayer
            streamUrl={playingMovie.streamUrl}
            title={playingMovie.title}
            poster={playingMovie.backdrop_path}
            isLive={false} // ✅ VOD (não é ao vivo)
            enableP2P={true} // ✅ P2P para MP4
            enableStats={false} // ✅ Ocultar stats em filmes (opcional)
            autoPlay={true}
            onClose={() => setPlayingMovie(null)}
          />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXEMPLO 3: Reproduzir Série (M3U8 VOD)
// ══════════════════════════════════════════════════════════════

export function ExemploSeries() {
  const [playingEpisode, setPlayingEpisode] = useState<any>(null);

  const episodios = [
    {
      id: 1,
      title: 'Breaking Bad - S01E01',
      name: 'Pilot',
      streamUrl: 'http://servidor.com/series/breaking-bad/s01e01.m3u8',
      poster_path: 'https://image.tmdb.org/t/p/w500/bb_s01e01.jpg',
    },
    {
      id: 2,
      title: 'Breaking Bad - S01E02',
      name: "Cat's in the Bag...",
      streamUrl: 'http://servidor.com/series/breaking-bad/s01e02.m3u8',
      poster_path: 'https://image.tmdb.org/t/p/w500/bb_s01e02.jpg',
    },
  ];

  return (
    <div>
      {/* Lista de Episódios */}
      <div className="space-y-4">
        {episodios.map((ep) => (
          <button
            key={ep.id}
            onClick={() => setPlayingEpisode(ep)}
            className="flex gap-4 w-full p-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            <img 
              src={ep.poster_path} 
              alt={ep.title}
              className="w-32 rounded"
            />
            <div className="text-left">
              <h3 className="text-white font-bold">{ep.title}</h3>
              <p className="text-gray-400">{ep.name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Player */}
      {playingEpisode && (
        <div className="fixed inset-0 bg-black z-50">
          <IPTVUniversalPlayer
            streamUrl={playingEpisode.streamUrl}
            title={playingEpisode.title}
            poster={playingEpisode.poster_path}
            isLive={false} // ✅ VOD (episódio gravado)
            enableP2P={true}
            enableStats={true}
            autoPlay={true}
            onClose={() => setPlayingEpisode(null)}
          />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXEMPLO 4: Player Inline (Sem fullscreen)
// ══════════════════════════════════════════════════════════════

export function ExemploPlayerInline() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-white text-3xl mb-6">Assista Agora</h1>
      
      {/* Player embutido na página */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <IPTVUniversalPlayer
          streamUrl="http://servidor.com/live.m3u8"
          title="Canal RedFlix"
          isLive={true}
          enableP2P={true}
          enableStats={true}
          autoPlay={false} // ✅ Não auto-play para player inline
          // Sem onClose (player fixo na página)
        />
      </div>

      <div className="mt-6 text-white">
        <h2 className="text-xl mb-2">Sobre o Canal</h2>
        <p className="text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXEMPLO 5: Integração com M3UContentLoader (Fonte única .txt)
// ══════════════════════════════════════════════════════════════

import { loadM3UContent } from './utils/m3uContentLoader';

export function ExemploIntegracaoM3U() {
  const [conteudo, setConteudo] = useState<any>({ filmes: [], series: [] });
  const [playing, setPlaying] = useState<any>(null);

  // Carregar conteúdo do filmes.txt
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await loadM3UContent();
      setConteudo(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-white text-3xl mb-6">Filmes do filmes.txt</h1>
      
      {/* Grid de Filmes */}
      <div className="grid grid-cols-5 gap-4">
        {conteudo.filmes.slice(0, 20).map((filme: any) => (
          <button
            key={filme.id}
            onClick={() => setPlaying(filme)}
            className="group relative"
          >
            <img 
              src={filme.poster_path || filme.logo}
              alt={filme.title}
              className="w-full aspect-[2/3] object-cover rounded"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-2">
              <p className="text-white text-sm truncate">{filme.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Player */}
      {playing && (
        <div className="fixed inset-0 bg-black z-50">
          <IPTVUniversalPlayer
            streamUrl={playing.streamUrl} // ✅ URL do MP4 do .txt
            title={playing.title}
            poster={playing.poster_path || playing.backdrop_path}
            isLive={false}
            enableP2P={true}
            enableStats={false}
            autoPlay={true}
            onClose={() => setPlaying(null)}
          />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXEMPLO 6: Player com Controle de Qualidade (Adaptive Bitrate)
// ══════════════════════════════════════════════════════════════

export function ExemploComQualidade() {
  const [selectedQuality, setSelectedQuality] = useState<'auto' | '1080p' | '720p' | '480p'>('auto');

  const streamUrls = {
    'auto': 'http://servidor.com/video/master.m3u8', // ABR automático
    '1080p': 'http://servidor.com/video/1080p.m3u8',
    '720p': 'http://servidor.com/video/720p.m3u8',
    '480p': 'http://servidor.com/video/480p.m3u8',
  };

  return (
    <div>
      {/* Seletor de Qualidade */}
      <div className="flex gap-2 mb-4">
        {(['auto', '1080p', '720p', '480p'] as const).map((quality) => (
          <button
            key={quality}
            onClick={() => setSelectedQuality(quality)}
            className={`px-4 py-2 rounded ${
              selectedQuality === quality 
                ? 'bg-[#E50914] text-white' 
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {quality}
          </button>
        ))}
      </div>

      {/* Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <IPTVUniversalPlayer
          streamUrl={streamUrls[selectedQuality]}
          title={`Filme em ${selectedQuality}`}
          isLive={false}
          enableP2P={true}
          enableStats={true}
        />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXEMPLO 7: Player com Lista de Reprodução (Playlist)
// ══════════════════════════════════════════════════════════════

export function ExemploPlaylist() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const playlist = [
    { title: 'Vídeo 1', url: 'http://servidor.com/video1.mp4' },
    { title: 'Vídeo 2', url: 'http://servidor.com/video2.mp4' },
    { title: 'Vídeo 3', url: 'http://servidor.com/video3.mp4' },
  ];

  const currentVideo = playlist[currentIndex];

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <IPTVUniversalPlayer
          streamUrl={currentVideo.url}
          title={`${currentIndex + 1}/${playlist.length} - ${currentVideo.title}`}
          isLive={false}
          enableP2P={true}
          autoPlay={true}
        />
      </div>

      {/* Controles de Playlist */}
      <div className="flex gap-4 mt-4 justify-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
        >
          ⏮️ Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === playlist.length - 1}
          className="px-6 py-2 bg-[#E50914] text-white rounded disabled:opacity-50"
        >
          Próximo ⏭️
        </button>
      </div>

      {/* Lista de Vídeos */}
      <div className="mt-4 space-y-2">
        {playlist.map((video, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-full p-3 rounded text-left ${
              index === currentIndex
                ? 'bg-[#E50914] text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {index + 1}. {video.title}
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ✅ RESUMO DE PROPS
// ══════════════════════════════════════════════════════════════

/*
PROPS OBRIGATÓRIAS:
- streamUrl ou url: URL do vídeo/stream

PROPS OPCIONAIS:
- title: Título exibido no player
- poster: Imagem de preview
- autoPlay: Auto-reproduzir (padrão: true)
- isLive: Stream ao vivo (padrão: false)
- enableP2P: Ativa P2P (padrão: true)
- enableStats: Mostra estatísticas P2P (padrão: true)
- onClose: Callback ao fechar

FORMATOS SUPORTADOS:
- MP4 (HTML5 Player com P2P)
- M3U8 (HLS.js + P2P via WebRTC)
- TS (HLS.js + P2P)
- M3U (HLS.js + P2P)
- Streams ao vivo (HLS com baixa latência)

DETECÇÃO AUTOMÁTICA:
- O player detecta automaticamente o formato
- Seleciona o melhor modo de reprodução
- Ativa P2P quando possível
- Fallback para HTTP se P2P falhar
*/

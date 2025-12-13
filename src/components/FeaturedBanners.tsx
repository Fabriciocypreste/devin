import { useState } from 'react';
import { motion } from '../utils/motion-stub';

// Icons inline to avoid lucide-react dependency
const Play = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Volume2 = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const VolumeX = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const Maximize2 = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

interface TrailerBanner {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  youtubeId: string;
  thumbnail: string;
}

const trailerBanners: TrailerBanner[] = [
  {
    id: 1,
    title: 'Trailer 1',
    subtitle: 'Ação • Aventura • Épico',
    badge: 'NOVO TRAILER',
    youtubeId: 'U8aTTyYfVOE',
    thumbnail: `https://img.youtube.com/vi/U8aTTyYfVOE/maxresdefault.jpg`
  },
  {
    id: 2,
    title: 'Trailer 2',
    subtitle: 'Drama • Suspense • Emocionante',
    badge: 'EM BREVE',
    youtubeId: 'OD6kUZwMOjQ',
    thumbnail: `https://img.youtube.com/vi/OD6kUZwMOjQ/maxresdefault.jpg`
  },
  {
    id: 3,
    title: 'Trailer 3',
    subtitle: 'Ficção • Fantasia • Aventura',
    badge: 'LANÇAMENTO',
    youtubeId: 'YoFKWWtIHSc',
    thumbnail: `https://img.youtube.com/vi/YoFKWWtIHSc/maxresdefault.jpg`
  }
];

export function FeaturedBanners() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

  const handlePlayVideo = (id: number) => {
    setPlayingVideo(id);
  };

  const handleStopVideo = () => {
    setPlayingVideo(null);
  };

  return (
    <div className="relative w-full pt-12 pb-8 bg-gradient-to-b from-[#141414] via-black to-black">
      {/* Header */}
      <div className="px-8 mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="bg-gradient-to-r from-[#E50914] to-[#B20710] p-2 rounded-lg">
            <Play className="w-5 h-5 text-white" fill="white" />
          </div>
          <h2 className="text-white font-['Inter:Bold',sans-serif] text-[28px]">
            Trailers em Destaque
          </h2>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 font-['Inter:Medium',sans-serif] text-[14px]"
        >
          Assista aos trailers dos maiores lançamentos do cinema
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
        {trailerBanners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            onMouseEnter={() => setHoveredVideo(banner.id)}
            onMouseLeave={() => setHoveredVideo(null)}
            className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 hover:border-[#E50914]/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-2xl hover:shadow-[#E50914]/30"
            style={{ height: '280px' }}
          >
            {/* YouTube Video or Thumbnail */}
            <div className="absolute inset-0 bg-black">
              {playingVideo === banner.id ? (
                <>
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${banner.youtubeId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
                    title={banner.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  
                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStopVideo();
                    }}
                    className="absolute top-4 right-4 bg-black/80 hover:bg-[#E50914] text-white p-2 rounded-full z-20 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  {/* Thumbnail */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ 
                      backgroundImage: `url(${banner.thumbnail})`,
                      backgroundPosition: 'center'
                    }}
                  />
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                  
                  {/* Animated Glow Effect on Hover */}
                  {hoveredVideo === banner.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-[#E50914]/20 via-purple-500/10 to-blue-500/20"
                    />
                  )}
                </>
              )}
            </div>

            {/* Content Overlay - Hidden when playing */}
            {playingVideo !== banner.id && (
              <div className="relative h-full flex flex-col justify-between p-6 z-10">
                {/* Top Section - Badge */}
                <div className="flex items-start justify-between">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.2 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#E50914] to-[#B20710] px-3 py-1.5 rounded-full shadow-lg"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white font-['Inter:Bold',sans-serif] text-[10px] uppercase tracking-wider">
                      {banner.badge}
                    </span>
                  </motion.div>

                  {/* Quality Badge */}
                  <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                    <span className="text-white font-['Inter:Bold',sans-serif] text-[9px] uppercase tracking-wide">
                      4K
                    </span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="text-white font-['Inter:Bold',sans-serif] text-[22px] mb-1.5 group-hover:text-[#E50914] transition-colors duration-300 drop-shadow-lg">
                      {banner.title}
                    </h3>
                    <p className="text-white/70 font-['Inter:Medium',sans-serif] text-[13px] drop-shadow-md">
                      {banner.subtitle}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    {/* Play Trailer Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo(banner.id);
                      }}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#E50914] to-[#B20710] hover:from-[#ff0a16] hover:to-[#E50914] text-white px-5 py-2.5 rounded-lg transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-[#E50914]/50"
                    >
                      <Play size={16} fill="white" />
                      <span className="font-['Inter:Bold',sans-serif] text-[13px]">
                        Ver Trailer
                      </span>
                    </button>

                    {/* Info Button */}
                    <button className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-lg transition-all duration-300 group-hover:scale-105 border border-white/20">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    {/* Volume Icon */}
                    <div className="ml-auto bg-white/10 backdrop-blur-sm p-2.5 rounded-lg border border-white/20">
                      <Volume2 size={16} className="text-white/70" />
                    </div>
                  </div>

                  {/* Progress Bar (Decorative) */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: hoveredVideo === banner.id ? '30%' : '0%' }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#E50914] to-[#B20710]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Animated Border Glow on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-xl border-2 border-[#E50914]/50 animate-pulse" />
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#E50914]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-6 mt-8 px-8"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse" />
          <p className="text-white/40 font-['Inter:Medium',sans-serif] text-[12px]">
            Trailers Exclusivos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <p className="text-white/40 font-['Inter:Medium',sans-serif] text-[12px]">
            Qualidade 4K
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <p className="text-white/40 font-['Inter:Medium',sans-serif] text-[12px]">
            Áudio Dolby Atmos
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef, useState } from 'react';
import { motion } from '../utils/motion-stub';

// Icons inline to avoid lucide-react dependency
const ChevronLeft = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface StreamingPlatform {
  id: number;
  name: string;
  logo: string;
  provider_id?: number;
}

const streamingPlatforms: StreamingPlatform[] = [
  {
    id: 1,
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png',
    provider_id: 8
  },
  {
    id: 2,
    name: 'Amazon Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
    provider_id: 9
  },
  {
    id: 3,
    name: 'Disney+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/640px-Disney%2B_logo.svg.png',
    provider_id: 337
  },
  {
    id: 4,
    name: 'HBO Max',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg',
    provider_id: 384
  },
  {
    id: 5,
    name: 'Apple TV+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg',
    provider_id: 350
  },
  {
    id: 6,
    name: 'Paramount+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg',
    provider_id: 531
  },
  {
    id: 7,
    name: 'Star+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Star%2B_logo.svg/1280px-Star%2B_logo.svg.png',
    provider_id: 619
  },
  {
    id: 8,
    name: 'Globoplay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Globoplay_2018.svg/2560px-Globoplay_2018.svg.png',
    provider_id: 307
  }
];

interface StreamingLogosProps {
  onPlatformSelect?: (providerId: number, platformName: string) => void;
}

export function StreamingLogos({ onPlatformSelect }: StreamingLogosProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handlePlatformClick = (platform: StreamingPlatform) => {
    const isAlreadySelected = selectedPlatform === platform.id;
    
    if (isAlreadySelected) {
      // Desselecionar
      setSelectedPlatform(null);
      if (onPlatformSelect && platform.provider_id) {
        onPlatformSelect(0, ''); // 0 significa "todos"
      }
    } else {
      // Selecionar
      setSelectedPlatform(platform.id);
      if (onPlatformSelect && platform.provider_id) {
        onPlatformSelect(platform.provider_id, platform.name);
      }
    }
  };

  return (
    <div className="relative w-full px-8 py-8 bg-gradient-to-b from-black via-[#0a0a0a] to-[#141414]">
      <div className="w-full max-w-7xl mx-auto">
        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-[#E50914] text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-[#E50914] text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Logos Row */}
          <div 
            ref={scrollContainerRef}
            className="relative flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2 justify-center"
          >
            {streamingPlatforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: 'easeOut'
                }}
                className="group/item relative flex-shrink-0"
                onClick={() => handlePlatformClick(platform)}
              >
                {/* Logo Card */}
                <div className={`relative bg-white rounded-lg p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer overflow-hidden w-[120px] h-[80px] ${
                  selectedPlatform === platform.id 
                    ? 'ring-2 ring-[#E50914]' 
                    : ''
                }`}>
                  {/* Logo */}
                  <div className="relative flex items-center justify-center h-full w-full">
                    <ImageWithFallback
                      src={platform.logo}
                      alt={platform.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Selected Badge */}
                  {selectedPlatform === platform.id && (
                    <div className="absolute top-2 right-2 bg-[#E50914] text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

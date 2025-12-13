import { ImageWithFallback } from './figma/ImageWithFallback';

interface StreamingPlatform {
  id: number;
  name: string;
  logo: string;
}

const streamingPlatforms: StreamingPlatform[] = [
  {
    id: 1,
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png'
  },
  {
    id: 2,
    name: 'Amazon Prime Video',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png'
  },
  {
    id: 3,
    name: 'Disney+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/640px-Disney%2B_logo.svg.png'
  },
  {
    id: 4,
    name: 'HBO Max',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg'
  },
  {
    id: 5,
    name: 'Apple TV+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg'
  },
  {
    id: 6,
    name: 'Paramount+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg'
  },
  {
    id: 7,
    name: 'Star+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Star%2B_logo.svg/1280px-Star%2B_logo.svg.png'
  },
  {
    id: 8,
    name: 'Globoplay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Globoplay_2018.svg/2560px-Globoplay_2018.svg.png'
  }
];

// Duplicar o array para criar um loop infinito seamless
const duplicatedPlatforms = [...streamingPlatforms, ...streamingPlatforms, ...streamingPlatforms];

export function StreamingMarquee() {
  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #000000, #0a0a0a, #000000)' }}>
      {/* Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #000000, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #000000, transparent)' }} />

      {/* Marquee Container - Moving Right to Left */}
      <div className="relative flex overflow-hidden">
        <div className="flex gap-8 items-center whitespace-nowrap animate-marquee">
          {duplicatedPlatforms.map((platform, index) => (
            <div
              key={`row1-${platform.id}-${index}`}
              className="group relative flex-shrink-0"
            >
              {/* Platform Card */}
              <div 
                className="relative rounded-lg border border-white/10 hover:border-[#E50914]/50 transition-all duration-300 hover:scale-110 shadow-lg"
                style={{ 
                  width: '140px', 
                  height: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFFFFF',
                  padding: '20px'
                }}
              >
                {/* Logo */}
                <ImageWithFallback
                  src={platform.logo}
                  alt={platform.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Moving Left to Right (Reverse Direction) */}
      <div className="relative flex overflow-hidden mt-8">
        <div className="flex gap-8 items-center whitespace-nowrap animate-marquee-reverse">
          {duplicatedPlatforms.slice().reverse().map((platform, index) => (
            <div
              key={`row2-${platform.id}-${index}`}
              className="group relative flex-shrink-0"
            >
              {/* Platform Card */}
              <div 
                className="relative rounded-lg border border-white/10 hover:border-[#E50914]/50 transition-all duration-300 hover:scale-110 shadow-lg"
                style={{ 
                  width: '140px', 
                  height: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFFFFF',
                  padding: '20px'
                }}
              >
                {/* Logo */}
                <ImageWithFallback
                  src={platform.logo}
                  alt={platform.name}
                  className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

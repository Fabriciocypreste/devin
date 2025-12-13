import { useState, useEffect } from 'react';
import { fetchChannelsList } from '../utils/channelsList';

// Icons inline to avoid lucide-react dependency
const X = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Radio = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
  </svg>
);

const Clock = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

interface ChannelsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChannelProgram {
  channel: string;
  quality?: string;
  logo?: string;
  currentProgram: string;
  startTime: string;
  endTime: string;
  status?: 'live' | 'recording' | 'scheduled';
}

// Extract quality badge from channel name (HD, 4K, etc)
function extractQuality(channelName: string): { name: string; quality?: string } {
  const qualityMatch = channelName.match(/\b(HD|4K|UHD|SD)\b/i);
  if (qualityMatch) {
    const quality = qualityMatch[0].toUpperCase();
    const name = channelName.replace(/\s*(HD|4K|UHD|SD)\s*/gi, '').trim();
    return { name, quality };
  }
  return { name: channelName };
}

// Parse channel data from text format
function parseChannelData(rawChannels: string[]): ChannelProgram[] {
  const programs: ChannelProgram[] = [];
  const now = new Date();
  
  rawChannels.forEach((line, index) => {
    // Try to parse different formats
    // Format 1: "ESPN 2 HD | Futebol Ao Vivo | 14:00 - 16:00 | LIVE"
    // Format 2: "ESPN 2 HD | Futebol Ao Vivo | 14:00 - 16:00"
    // Format 3: "ESPN 2 HD"
    
    const parts = line.split('|').map(p => p.trim());
    const { name: channelName, quality } = extractQuality(parts[0]);
    
    if (parts.length >= 3) {
      // Full format with program and time
      const status = parts[3]?.toLowerCase() === 'live' ? 'live' : 
                    parts[3]?.toLowerCase() === 'recording' ? 'recording' : 
                    index % 3 === 0 ? 'live' : index % 3 === 1 ? 'recording' : 'scheduled';
      
      programs.push({
        channel: channelName,
        quality,
        currentProgram: parts[1],
        startTime: parts[2].split('-')[0]?.trim() || '00:00',
        endTime: parts[2].split('-')[1]?.trim() || '23:59',
        status
      });
    } else {
      // Simple format - generate schedule
      const hour = 14 + (index % 10);
      const endHour = hour + 2;
      const programTypes = [
        'Copa do Brasil', 
        'Série Premiere',
        'Cinema em Casa',
        'Animação Infantil',
        'Jornal Nacional',
        'Game Show',
        'Reality Show',
        'Documentário',
        'Stand-Up Comedy',
        'Festival de Música'
      ];
      
      programs.push({
        channel: channelName,
        quality,
        currentProgram: programTypes[index % programTypes.length],
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${endHour.toString().padStart(2, '0')}:00`,
        status: index % 3 === 0 ? 'live' : index % 3 === 1 ? 'recording' : 'scheduled'
      });
    }
  });
  
  return programs;
}

export function ChannelsMenu({ isOpen, onClose }: ChannelsMenuProps) {
  const [channels, setChannels] = useState<string[]>([]);
  const [programs, setPrograms] = useState<ChannelProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChannels() {
      setLoading(true);
      const channelsList = await fetchChannelsList();
      setChannels(channelsList);
      const parsedPrograms = parseChannelData(channelsList);
      setPrograms(parsedPrograms);
      setLoading(false);
    }

    if (isOpen) {
      loadChannels();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-600';
      case 'recording':
        return 'bg-orange-600';
      case 'scheduled':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'live':
        return 'AO VIVO';
      case 'recording':
        return 'GRAVANDO';
      case 'scheduled':
        return 'AGENDADO';
      default:
        return 'DISPONÍVEL';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a1a1a] rounded-[10px] max-w-7xl w-full my-8 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radio className="text-red-600" size={28} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-white text-[28px] font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-none">
                Canais de TV
              </h2>
              <p className="text-white/50 text-[12px] font-['Inter:Medium',sans-serif] mt-1">
                Grade de Programação em Tempo Real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-full p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#2a2a2a] rounded-[8px] h-[100px] animate-pulse"
                />
              ))}
            </div>
          ) : programs.length > 0 ? (
            <div className="space-y-3">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className={`bg-[#252525] rounded-[8px] p-4 hover:bg-[#2d2d2d] transition-all duration-200 border group ${
                    program.status === 'live' 
                      ? 'border-red-600/40 shadow-lg shadow-red-600/10' 
                      : 'border-white/5 hover:border-red-600/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Channel Number */}
                    <div className="flex items-center justify-center bg-[#1a1a1a] rounded-[6px] px-3 py-2 border border-white/10 min-w-[60px]">
                      <p className="text-white/70 text-[18px] font-['Inter:Bold',sans-serif] font-bold">
                        {(index + 1).toString().padStart(2, '0')}
                      </p>
                    </div>

                    {/* Channel Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Channel Logo/Name */}
                      <div className="flex flex-col items-center justify-center bg-[#1a1a1a] rounded-[6px] px-4 py-3 min-w-[180px] border border-white/10 gap-1 group-hover:border-red-600/30 transition-colors">
                        <p className="text-white text-[14px] font-['Inter:Bold',sans-serif] font-bold text-center truncate w-full">
                          {program.channel}
                        </p>
                        {program.quality && (
                          <span className="text-[10px] font-['Inter:Bold',sans-serif] font-bold px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-400 border border-yellow-600/30">
                            {program.quality}
                          </span>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-12 w-px bg-white/10" />

                      {/* Program Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white text-[16px] font-['Inter:SemiBold',sans-serif] truncate">
                            {program.currentProgram}
                          </p>
                          {program.status === 'live' && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded-[4px]">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              <span className="text-white text-[10px] font-['Inter:Bold',sans-serif] font-bold">
                                AO VIVO
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-white/50">
                          <Clock size={14} />
                          <p className="text-[13px] font-['Inter:Medium',sans-serif]">
                            {program.startTime} - {program.endTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status & Action */}
                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <div className={`px-3 py-1.5 rounded-[4px] ${getStatusColor(program.status)}`}>
                        <p className="text-white text-[11px] font-['Inter:Bold',sans-serif] font-bold whitespace-nowrap">
                          {getStatusText(program.status)}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-[6px] transition-all duration-200 font-['Inter:Bold',sans-serif] font-bold text-[13px] whitespace-nowrap hover:shadow-lg hover:shadow-red-600/20"
                      >
                        {program.status === 'recording' ? 'Parar' : program.status === 'live' ? 'Assistir' : 'Agendar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                <Radio size={48} className="text-white/30" />
              </div>
              <p className="text-white/50 text-[18px] font-['Inter:Medium',sans-serif] mb-2">
                Nenhum canal disponível
              </p>
              <p className="text-white/30 text-[14px] font-['Inter:Regular',sans-serif]">
                Verifique sua conexão ou tente novamente mais tarde
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!loading && programs.length > 0 && (
          <div className="px-6 py-4 border-t border-white/10 bg-[#0f0f0f]">
            <div className="flex items-center justify-between text-white/50 text-[12px] font-['Inter:Medium',sans-serif]">
              <p>{programs.length} canais disponíveis</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded" />
                  <span>Ao Vivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-600 rounded" />
                  <span>Gravando</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded" />
                  <span>Agendado</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

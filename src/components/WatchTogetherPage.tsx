import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  XIcon as X, 
  UsersIcon as Users, 
  ClockIcon as Clock,
  CalendarIcon as Calendar,
  PlayIcon as Play,
  Volume2Icon as Volume2,
  ChevronRightIcon as ChevronRight,
  CopyIcon as Copy
} from './Icons';
import {
  VideoIcon as Video,
  MessageCircleIcon as MessageCircle,
  Share2Icon as Share2,
  UserPlusIcon as UserPlus,
  PauseIcon as Pause
} from './Icons-additions';
import { toast } from '../utils/toast';

interface WatchTogetherPageProps {
  onClose?: () => void;
}

export function WatchTogetherPage({ onClose }: WatchTogetherPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'create' | 'scheduled'>('active');
  const [roomCode, setRoomCode] = useState('');

  const activeRooms = [
    {
      id: 1,
      title: 'Stranger Things - Maratona',
      host: 'Maria Silva',
      participants: 4,
      maxParticipants: 8,
      currentlyWatching: 'Stranger Things T4:E6',
      thumbnail: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      status: 'Assistindo',
      startedAt: '19:30'
    },
    {
      id: 2,
      title: 'Breaking Bad - Noite de Série',
      host: 'João Santos',
      participants: 2,
      maxParticipants: 6,
      currentlyWatching: 'Breaking Bad T2:E8',
      thumbnail: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
      status: 'Pausado',
      startedAt: '20:15'
    }
  ];

  const scheduledRooms = [
    {
      id: 1,
      title: 'The Crown - Domingo à Noite',
      host: 'Ana Costa',
      date: new Date('2025-11-07T20:00:00'),
      participants: 6,
      maxParticipants: 10,
      thumbnail: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg'
    },
    {
      id: 2,
      title: 'Dark - Sessão Mistério',
      host: 'Pedro Lima',
      date: new Date('2025-11-08T21:00:00'),
      participants: 3,
      maxParticipants: 8,
      thumbnail: 'https://image.tmdb.org/t/p/w500/56v2KjBlU4XaOv9rVYEQypROD7P.jpg'
    }
  ];

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado!');
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E50914] to-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl text-white">Assistir Juntos</h1>
                <p className="text-[#B3B3B3] text-sm mt-1">
                  Assista com amigos em tempo real
                </p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'active'
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white/5 text-[#B3B3B3] hover:bg-white/10 hover:text-white'
              }`}
            >
              Salas Ativas
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'create'
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white/5 text-[#B3B3B3] hover:bg-white/10 hover:text-white'
              }`}
            >
              Criar Sala
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'scheduled'
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white/5 text-[#B3B3B3] hover:bg-white/10 hover:text-white'
              }`}
            >
              Agendadas
            </button>
          </div>

          {/* Join Room */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Digite o código da sala..."
                className="flex-1 bg-[#333333] text-white rounded-lg px-4 py-3 border border-white/10 focus:border-[#E50914] focus:outline-none transition-colors"
              />
              <button className="px-6 py-3 bg-[#E50914] hover:bg-[#C41A23] text-white rounded-lg transition-colors flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Entrar na Sala
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Active Rooms */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex gap-6">
                  {/* Thumbnail with Live Indicator */}
                  <div className="relative w-64 h-36 shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={room.thumbnail}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Live Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-bold">
                        {room.status === 'Assistindo' ? 'AO VIVO' : 'PAUSADO'}
                      </span>
                    </div>
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        {room.status === 'Assistindo' ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Volume2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-white text-xl mb-2">{room.title}</h3>
                    <p className="text-[#B3B3B3] text-sm mb-4">
                      Assistindo: {room.currentlyWatching}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-[#B3B3B3] mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Host: {room.host}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Iniciou às {room.startedAt}</span>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex -space-x-2">
                        {Array.from({ length: room.participants }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E50914] to-purple-600 border-2 border-black flex items-center justify-center text-white text-xs"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-[#B3B3B3] text-sm">
                        {room.participants}/{room.maxParticipants} participantes
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
                      <div className="h-full bg-[#E50914] w-[45%]"></div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button className="px-6 py-2 bg-[#E50914] hover:bg-[#C41A23] text-white rounded-lg transition-colors flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Entrar na Sala
                      </button>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                      <button 
                        onClick={() => copyRoomCode(`ROOM${room.id}`)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {activeRooms.length === 0 && (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Nenhuma sala ativa no momento</p>
                <p className="text-white/40 text-sm mt-2">Crie uma sala e convide seus amigos!</p>
              </div>
            )}
          </div>
        )}

        {/* Create Room */}
        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl text-white mb-6">Criar Nova Sala</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[#B3B3B3] mb-2">Nome da Sala</label>
                  <input
                    type="text"
                    placeholder="Ex: Maratona Breaking Bad"
                    className="w-full bg-[#333333] text-white rounded-lg px-4 py-3 border border-white/10 focus:border-[#E50914] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#B3B3B3] mb-2">Escolher Conteúdo</label>
                  <button className="w-full bg-[#333333] text-white rounded-lg px-4 py-3 border border-white/10 hover:border-[#E50914] transition-colors flex items-center justify-between">
                    <span className="text-[#B3B3B3]">Selecione um filme ou série</span>
                    <ChevronRight className="w-5 h-5 text-[#B3B3B3]" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-[#B3B3B3] mb-2">Máximo de Participantes</label>
                  <select className="w-full bg-[#333333] text-white rounded-lg px-4 py-3 border border-white/10 focus:border-[#E50914] focus:outline-none transition-colors">
                    <option>4 pessoas</option>
                    <option>6 pessoas</option>
                    <option>8 pessoas</option>
                    <option>10 pessoas</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-[#E50914]" />
                    <span className="text-white">Sala privada (somente com código)</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-[#E50914]" defaultChecked />
                    <span className="text-white">Permitir chat durante a exibição</span>
                  </label>
                </div>

                <button className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded-lg px-6 py-4 transition-colors flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" />
                  Criar Sala Agora
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Video, title: 'Sincronização', desc: 'Todos assistem juntos' },
                { icon: MessageCircle, title: 'Chat ao Vivo', desc: 'Converse durante o filme' },
                { icon: Users, title: 'Até 10 pessoas', desc: 'Convide seus amigos' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center"
                >
                  <feature.icon className="w-8 h-8 text-[#E50914] mx-auto mb-2" />
                  <h4 className="text-white mb-1">{feature.title}</h4>
                  <p className="text-[#B3B3B3] text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scheduled Rooms */}
        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            {scheduledRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex gap-6">
                  <div className="relative w-48 h-28 shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={room.thumbnail}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white text-xl mb-2">{room.title}</h3>
                    <p className="text-[#B3B3B3] text-sm mb-3">
                      {formatDate(room.date)}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-[#B3B3B3] mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Host: {room.host}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        <span>{room.participants} confirmados</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="px-6 py-2 bg-[#E50914] hover:bg-[#C41A23] text-white rounded-lg transition-colors">
                        Confirmar Presença
                      </button>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Copiar Código
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
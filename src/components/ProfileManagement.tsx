import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const redflixLogo = 'http://chemorena.com/redfliz.png';
const backgroundImage = 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920&q=80';
import { XIcon, Edit2Icon, Trash2Icon, CheckIcon } from './Icons';

interface Profile {
  id: string;
  name: string;
  type: 'adult' | 'kids';
  color?: string;
  avatar?: string;
}

interface ProfileManagementProps {
  onBack: () => void;
  onSave?: (profiles: Profile[]) => void;
}

export function ProfileManagement({ onBack, onSave }: ProfileManagementProps) {
  // Carregar perfis do localStorage ou usar padrões
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('redflix_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading profiles:', e);
      }
    }
    return [
      { id: '1', name: 'FABRICIO...', type: 'adult', color: '#3B82F6' },
      { id: '2', name: 'Infantil', type: 'kids' }
    ];
  });

  // Salvar perfis no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('redflix_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileType, setNewProfileType] = useState<'adult' | 'kids'>('adult');
  const [newProfileColor, setNewProfileColor] = useState('#3B82F6');

  const availableColors = [
    '#3B82F6', // Azul
    '#10B981', // Verde
    '#F59E0B', // Laranja
    '#EF4444', // Vermelho
    '#8B5CF6', // Roxo
    '#EC4899', // Rosa
    '#06B6D4', // Ciano
    '#F97316', // Laranja escuro
  ];

  const handleEditProfile = (profile: Profile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
  };

  const handleSaveEdit = (id: string) => {
    setProfiles(profiles.map(p => 
      p.id === id ? { ...p, name: editName } : p
    ));
    setEditingId(null);
    setEditName('');
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert('Você precisa ter pelo menos um perfil!');
      return;
    }
    if (confirm('Tem certeza que deseja excluir este perfil?')) {
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleAddProfile = () => {
    if (!newProfileName.trim()) {
      alert('Por favor, digite um nome para o perfil');
      return;
    }

    const newProfile: Profile = {
      id: Date.now().toString(),
      name: newProfileName,
      type: newProfileType,
      color: newProfileType === 'kids' ? undefined : newProfileColor
    };

    setProfiles([...profiles, newProfile]);
    setShowAddProfile(false);
    setNewProfileName('');
    setNewProfileType('adult');
    setNewProfileColor('#3B82F6');
  };

  const handleDone = () => {
    if (onSave) {
      onSave(profiles);
    }
    onBack();
  };

  return (
    <div 
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-8 md:py-16"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#000'
      }}
    >
      {/* Logo */}
      <div className="mb-4 md:mb-8">
        <ImageWithFallback
          src={redflixLogo}
          alt="RedFlix Logo"
          className="h-6 md:h-12 w-auto"
        />
      </div>

      {/* Título */}
      <h1 className="text-white text-xl md:text-4xl lg:text-5xl mb-4 md:mb-8 text-center font-medium">
        Gerenciar perfis
      </h1>

      {/* Profiles Grid */}
      <div className="flex flex-wrap items-start justify-center gap-4 md:gap-8 mb-10 md:mb-16 max-w-5xl">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="group flex flex-col items-center gap-2 md:gap-4 relative"
          >
            {/* Profile Avatar */}
            <div className="relative">
              <div 
                className={`w-24 h-24 md:w-40 md:h-40 lg:w-[180px] lg:h-[180px] rounded-md md:rounded-lg overflow-hidden flex items-center justify-center relative border-2 md:border-4 ${
                  editingId === profile.id ? 'border-white' : 'border-transparent'
                }`}
                style={{
                  background: profile.type === 'kids' 
                    ? 'linear-gradient(180deg, #22C55E 0%, #EAB308 20%, #EC4899 40%, #A855F7 60%, #3B82F6 100%)'
                    : profile.color || '#3B82F6'
                }}
              >
                {profile.type === 'kids' ? (
                  <div 
                    className="text-white font-black text-base md:text-2xl lg:text-3xl text-center px-3 py-2 md:px-6 md:py-3 rounded-md md:rounded-lg"
                    style={{
                      backgroundColor: 'rgba(229, 9, 20, 0.9)',
                      border: '2px solid white',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    Infantil
                  </div>
                ) : (
                  <svg className="w-16 h-16 md:w-24 md:h-24 lg:w-[100px] lg:h-[100px]" viewBox="0 0 120 120" fill="none">
                    <circle cx="35" cy="40" r="8" fill="white" />
                    <circle cx="85" cy="40" r="8" fill="white" />
                    <path
                      d="M 30 70 Q 60 95 90 70"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
              </div>

              {/* Edit/Delete Buttons Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md md:rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEditProfile(profile)}
                  className="bg-white hover:bg-gray-200 text-black p-2 md:p-3 rounded-full transition-all hover:scale-110"
                >
                  <Edit2Icon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 md:p-3 rounded-full transition-all hover:scale-110"
                >
                  <Trash2Icon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Profile Name - Editable */}
            {editingId === profile.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-1 rounded text-sm md:text-base text-center border-2 border-white outline-none"
                  maxLength={15}
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(profile.id)}
                  className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-all"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-gray-400 group-hover:text-white text-sm md:text-base lg:text-lg transition-colors duration-300 text-center">
                {profile.name}
              </span>
            )}
          </div>
        ))}

        {/* Add New Profile Button */}
        {!showAddProfile && profiles.length < 5 && (
          <button
            onClick={() => setShowAddProfile(true)}
            className="group flex flex-col items-center gap-2 md:gap-4 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="w-24 h-24 md:w-40 md:h-40 lg:w-[180px] lg:h-[180px] bg-[#404040] rounded-md md:rounded-lg overflow-hidden flex items-center justify-center relative border-2 md:border-4 border-transparent group-hover:border-white transition-all duration-300">
              <svg className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="35" fill="#1A1A1A" />
                <line x1="40" y1="20" x2="40" y2="60" stroke="#808080" strokeWidth="6" strokeLinecap="round" />
                <line x1="20" y1="40" x2="60" y2="40" stroke="#808080" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-gray-400 text-sm md:text-base lg:text-lg transition-colors duration-300 group-hover:text-white">
              Adicionar Perfil
            </span>
          </button>
        )}
      </div>

      {/* Add Profile Modal */}
      {showAddProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6 md:p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl md:text-2xl font-semibold">Adicionar Perfil</h2>
              <button
                onClick={() => setShowAddProfile(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome do Perfil */}
              <div>
                <label className="text-white text-sm mb-2 block">Nome do Perfil</label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Digite o nome"
                  className="w-full bg-[#333] text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-red-600"
                  maxLength={15}
                />
              </div>

              {/* Tipo de Perfil */}
              <div>
                <label className="text-white text-sm mb-2 block">Tipo de Perfil</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewProfileType('adult')}
                    className={`flex-1 py-3 rounded transition-all ${
                      newProfileType === 'adult'
                        ? 'bg-red-600 text-white'
                        : 'bg-[#333] text-gray-400 hover:bg-[#404040]'
                    }`}
                  >
                    Adulto
                  </button>
                  <button
                    onClick={() => setNewProfileType('kids')}
                    className={`flex-1 py-3 rounded transition-all ${
                      newProfileType === 'kids'
                        ? 'bg-red-600 text-white'
                        : 'bg-[#333] text-gray-400 hover:bg-[#404040]'
                    }`}
                  >
                    Infantil
                  </button>
                </div>
              </div>

              {/* Escolher Cor (apenas para perfil adulto) */}
              {newProfileType === 'adult' && (
                <div>
                  <label className="text-white text-sm mb-2 block">Cor do Avatar</label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewProfileColor(color)}
                        className={`w-full aspect-square rounded-lg transition-all hover:scale-110 ${
                          newProfileColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddProfile(false)}
                  className="flex-1 bg-[#333] hover:bg-[#404040] text-white py-3 rounded transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddProfile}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded transition-all"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 md:px-8 py-2 md:py-3 bg-[#333] hover:bg-[#404040] text-white text-base md:text-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Cancelar
        </button>
        <button
          onClick={handleDone}
          className="px-6 md:px-8 py-2 md:py-3 bg-red-600 hover:bg-red-700 text-white text-base md:text-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Concluído
        </button>
      </div>

      {/* Info Text */}
      <p className="text-gray-400 text-xs md:text-sm mt-6 text-center max-w-2xl">
        Máximo de 5 perfis por conta. Perfis infantis têm conteúdo apropriado para crianças.
      </p>
    </div>
  );
}

import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../utils/toast';
const redflixLogo = 'https://chemorena.com/redfliz.png';

// Icon inline to avoid lucide-react dependency
const Check = ({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface SignupProps {
  onBack: () => void;
  onContinue: () => void;
}

export function Signup({ onBack, onContinue }: SignupProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Preencha o email');
      return;
    }
    
    if (!password || password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast.error('Preencha seu nome');
      return;
    }
    
    setLoading(true);
    
    try {
      await signup(email, password, name, phone);
      toast.success('✅ Conta criada com sucesso!');
      setStep(3);
    } catch (error: any) {
      console.error('❌ Erro ao criar conta:', error);
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    onContinue();
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header com Logo */}
        <div className="p-8 border-b border-white/10 bg-black/80 backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="relative">
              {/* Glow effect atrás da logo - VERMELHO REDFLIX */}
              <div className="absolute inset-0 blur-2xl opacity-50 bg-[#E50914]" />
              <img
                src={redflixLogo}
                alt="RedFlix Logo"
                className="relative h-10 md:h-12 w-auto drop-shadow-[0_0_25px_rgba(229,9,20,0.8)] hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error('❌ Erro ao carregar logo RedFlix');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <button
              onClick={onBack}
              className="text-white hover:text-[#E50914] transition-colors font-['Montserrat:Semi_Bold',sans-serif] text-[16px]"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#333333] h-1">
          <div 
            className="h-full bg-[#E50914] transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[500px] bg-white/5 backdrop-blur-2xl rounded-2xl p-12 border border-white/10 shadow-2xl shadow-black/50">
            {step === 1 && (
              <div className="space-y-8">
                {/* Título */}
                <div className="text-center space-y-2">
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px] uppercase tracking-wider">
                    ETAPA 1 DE 3
                  </p>
                  <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[36px]">
                    Crie sua conta
                  </h2>
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[18px] leading-relaxed">
                    Apenas mais alguns passos e pronto!<br />
                    Não curtimos papelada.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleStep1Submit} className="space-y-5">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Endereço de e-mail"
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] focus:border-[#E50914] focus:outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha (mínimo 6 caracteres)"
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] focus:border-[#E50914] focus:outline-none transition-all placeholder:text-gray-400"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmar senha"
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] focus:border-[#E50914] focus:outline-none transition-all placeholder:text-gray-400"
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-5 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95 mt-8"
                  >
                    Avançar
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                {/* Título */}
                <div className="text-center space-y-2">
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px] uppercase tracking-wider">
                    ETAPA 2 DE 3
                  </p>
                  <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[36px]">
                    Complete seu perfil
                  </h2>
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[18px] leading-relaxed">
                    Nos conte um pouco sobre você
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleStep2Submit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] focus:border-[#E50914] focus:outline-none transition-all placeholder:text-gray-400"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefone (opcional)"
                      className="w-full bg-white/10 border border-white/20 text-white rounded px-5 py-4 font-['Roboto:Regular',sans-serif] text-[16px] focus:border-[#E50914] focus:outline-none transition-all placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded px-5 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300"
                      disabled={loading}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-5 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Criando...' : 'Criar Conta'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 text-center">
                {/* Check Icon Animado */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-[#E50914] rounded-full flex items-center justify-center animate-pulse">
                    <Check className="w-14 h-14 text-white" strokeWidth={3} />
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px] uppercase tracking-wider">
                    ETAPA 3 DE 3
                  </p>
                  <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[36px]">
                    Tudo pronto!
                  </h2>
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[18px] leading-relaxed">
                    Sua conta foi criada com sucesso!<br />
                    Bem-vindo ao RedFlix! 🎉
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#E50914]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-[#E50914]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[16px]">
                        Assista onde quiser
                      </h3>
                      <p className="text-gray-400 font-['Roboto:Regular',sans-serif] text-[14px]">
                        Transmita filmes e séries ilimitados no seu celular, tablet, laptop e TV.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#E50914]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-[#E50914]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[16px]">
                        Crie perfis para crianças
                      </h3>
                      <p className="text-gray-400 font-['Roboto:Regular',sans-serif] text-[14px]">
                        Envie as crianças em aventuras com seus personagens favoritos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#E50914]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-[#E50914]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[16px]">
                        Baixe suas séries favoritas
                      </h3>
                      <p className="text-gray-400 font-['Roboto:Regular',sans-serif] text-[14px]">
                        Assista offline quando quiser.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-5 py-5 font-['Montserrat:Semi_Bold',sans-serif] text-[20px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95 mt-8"
                >
                  Começar a assistir
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
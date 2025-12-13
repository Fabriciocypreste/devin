import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../utils/toast';

const redflixLogo = 'https://chemorena.com/redfliz.png';

interface LoginProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Login({ onLogin, onSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔑 [Login] Formulário enviado:', { email, passwordLength: password.length });
    
    if (!email || !password) {
      toast.error('Preencha email e senha');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔑 [Login] Chamando signin...');
      await signin(email, password);
      console.log('🔑 [Login] Signin concluído com sucesso!');
      toast.success('✅ Login realizado com sucesso!');
      onLogin();
    } catch (error: any) {
      console.error('❌ [Login] Erro ao fazer login:', error);
      toast.error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center p-4">
      {/* Background Gradient Desfocado Vermelho e Preto */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E50914] via-[#8B0000] to-black">
        {/* Efeito de blur/desfoque */}
        <div className="absolute inset-0 backdrop-blur-3xl opacity-80" 
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(229, 9, 20, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 0, 0, 0.3) 0%, transparent 50%)'
          }}
        />
      </div>
      
      {/* Form Container - Card Preto */}
      <div className="relative z-10 w-full max-w-[450px] bg-black rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl shadow-black/50">
        {/* Logo Centralizada - DESTAQUE MAIOR */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="relative">
            {/* Glow effect atrás da logo - VERMELHO REDFLIX */}
            <div className="absolute inset-0 blur-3xl opacity-60 bg-[#E50914]" />
            <img
              src={redflixLogo}
              alt="RedFlix Logo"
              className="relative h-14 md:h-16 w-auto drop-shadow-[0_0_30px_rgba(229,9,20,0.9)] hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('❌ Erro ao carregar logo RedFlix');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Input E-mail - Caixa Branca */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail ou telefone"
              className="w-full bg-white text-black rounded px-4 py-3 md:px-5 md:py-4 font-['Roboto:Regular',sans-serif] text-[14px] md:text-[16px] border border-gray-300 focus:border-[#E50914] focus:outline-none transition-all placeholder:text-gray-500"
              required
              disabled={loading}
            />
          </div>

          {/* Input Senha - Caixa Branca */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full bg-white text-black rounded px-4 py-3 md:px-5 md:py-4 font-['Roboto:Regular',sans-serif] text-[14px] md:text-[16px] border border-gray-300 focus:border-[#E50914] focus:outline-none transition-all placeholder:text-gray-500"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors font-['Roboto:Regular',sans-serif] text-[11px] md:text-[13px]"
              disabled={loading}
            >
              {showPassword ? 'OCULTAR' : 'MOSTRAR'}
            </button>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-4 py-3 md:px-5 md:py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[14px] md:text-[16px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          {/* Divider OU */}
          <div className="relative flex items-center justify-center my-4 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative bg-black px-4">
              <span className="text-gray-400 font-['Roboto:Regular',sans-serif] text-[13px] md:text-[14px]">OU</span>
            </div>
          </div>

          {/* Botões Login Social - Apenas Ícones */}
          <div className="flex items-center justify-center gap-4">
            {/* Login com Google */}
            <button
              type="button"
              className="w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
              title="Entrar com Google"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            {/* Login com Facebook */}
            <button
              type="button"
              className="w-12 h-12 md:w-14 md:h-14 bg-[#1877F2] hover:bg-[#166FE5] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
              title="Entrar com Facebook"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Login com Apple */}
            <button
              type="button"
              className="w-12 h-12 md:w-14 md:h-14 bg-black border-2 border-white hover:bg-gray-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
              title="Entrar com Apple"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>
          </div>

          {/* Lembrar-me e Precisa de ajuda */}
          <div className="flex items-center justify-between text-[12px] md:text-[13px] mt-3">
            <label className="flex items-center text-gray-400 cursor-pointer hover:text-white transition-colors">
              <input 
                type="checkbox" 
                className="mr-2 w-4 h-4 accent-[#E50914]"
              />
              Lembre-se de mim
            </label>
            <a href="#" className="text-gray-400 hover:text-white hover:underline transition-colors">
              Precisa de ajuda?
            </a>
          </div>
        </form>

        {/* Footer - Novo na Netflix */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 font-['Roboto:Regular',sans-serif] text-[14px] md:text-[16px]">
            Novo por aqui?{' '}
            <button 
              onClick={onSignup}
              className="text-white hover:text-[#E50914] font-['Montserrat:Semi_Bold',sans-serif] hover:underline transition-colors"
            >
              Assine agora
            </button>
          </p>
          <p className="text-gray-500 font-['Roboto:Regular',sans-serif] text-[11px] md:text-[12px] mt-4 leading-relaxed">
            Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô.{' '}
            <a href="#" className="text-blue-500 hover:underline">Saiba mais</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
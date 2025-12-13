import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const redflixLogo = 'http://chemorena.com/redfliz.png';

// Icons inline to avoid lucide-react dependency
const Check = ({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const X = ({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface ChoosePlanProps {
  onBack: () => void;
  onContinue: () => void;
}

export function ChoosePlan({ onBack, onContinue }: ChoosePlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium'>('standard');

  const plans = [
    {
      id: 'basic' as const,
      name: 'Básico com anúncios',
      price: 'R$ 19,90',
      features: [
        { text: '1 tela por vez', included: true },
        { text: 'Qualidade HD (720p)', included: true },
        { text: 'Sem anúncios', included: false },
        { text: 'Download ilimitado', included: false },
        { text: 'Qualidade 4K + HDR', included: false }
      ]
    },
    {
      id: 'standard' as const,
      name: 'Padrão',
      price: 'R$ 29,90',
      popular: true,
      features: [
        { text: '2 telas simultâneas', included: true },
        { text: 'Qualidade Full HD (1080p)', included: true },
        { text: 'Sem anúncios', included: true },
        { text: 'Download ilimitado', included: true },
        { text: 'Qualidade 4K + HDR', included: false }
      ]
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 'R$ 49,90',
      features: [
        { text: '4 telas simultâneas', included: true },
        { text: 'Qualidade Full HD (1080p)', included: true },
        { text: 'Sem anúncios', included: true },
        { text: 'Download ilimitado', included: true },
        { text: 'Qualidade 4K + HDR', included: true }
      ]
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Header com Logo */}
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <ImageWithFallback
            src={redflixLogo}
            alt="RedFlix Logo"
            className="h-10 w-auto"
          />
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
        <div className="h-full bg-[#E50914] transition-all duration-500 w-[66%]" />
      </div>

      {/* Content */}
      <div className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Título */}
          <div className="text-center space-y-4 mb-12">
            <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px] uppercase tracking-wider">
              ETAPA 3 DE 3
            </p>
            <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[42px]">
              Escolha o plano ideal para você
            </h2>
            <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[18px] max-w-2xl mx-auto">
              Assista em qualquer dispositivo. Troque de plano quando quiser.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer backdrop-blur-xl
                  ${selectedPlan === plan.id 
                    ? 'border-[#E50914] bg-[#E50914]/10 scale-105 shadow-2xl shadow-[#E50914]/30' 
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:scale-102'
                  }
                `}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E50914] px-4 py-1 rounded-full">
                    <span className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[12px] uppercase tracking-wider">
                      Mais Popular
                    </span>
                  </div>
                )}

                {/* Radio Button */}
                <div className="flex justify-end mb-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPlan === plan.id ? 'border-[#E50914] bg-[#E50914]' : 'border-white/30'
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                </div>

                {/* Plan Info */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[24px]">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[32px]">
                      {plan.price}
                    </span>
                    <span className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[16px]">
                      /mês
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" strokeWidth={2.5} />
                      ) : (
                        <X className="w-5 h-5 text-[#666666] shrink-0 mt-0.5" strokeWidth={2.5} />
                      )}
                      <span className={`font-['Roboto:Regular',sans-serif] text-[14px] ${
                        feature.included ? 'text-white' : 'text-[#666666]'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="max-w-md mx-auto space-y-4">
            <button
              onClick={onContinue}
              className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-6 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95"
            >
              Continuar
            </button>
            <button
              onClick={onBack}
              className="w-full bg-transparent border border-white/30 hover:border-white text-white rounded px-6 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[16px] transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              Voltar
            </button>
          </div>

          {/* Info Adicional */}
          <div className="mt-12 text-center space-y-2">
            <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px]">
              HD (720p), Full HD (1080p), Ultra HD (4K) e HDR estão sujeitos à disponibilidade na internet e no dispositivo.
            </p>
            <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px]">
              Somente membros dos planos Padrão e Premium podem fazer download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

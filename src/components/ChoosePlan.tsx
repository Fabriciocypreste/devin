import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const redflixLogo = 'http://chemorena.com/redfliz.png';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Icons inline to avoid lucide-react dependency
const Check = ({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface ChoosePlanProps {
  onBack: () => void;
  onContinue: () => void;
}

type PlanId = 'mensal' | 'trimestral' | 'anual';

export function ChoosePlan({ onBack, onContinue }: ChoosePlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('mensal');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const plans = [
    {
      id: 'mensal' as const,
      name: 'Mensal',
      price: 'R$ 29,90',
      priceValue: 29.90,
      months: 1,
      description: 'Acesso por 1 mes',
      features: [
        { text: 'Acesso ilimitado a filmes e series', included: true },
        { text: 'Qualidade Full HD (1080p)', included: true },
        { text: 'Assista em qualquer dispositivo', included: true },
        { text: 'Cancele quando quiser', included: true }
      ]
    },
    {
      id: 'trimestral' as const,
      name: '3 Meses',
      price: 'R$ 79,90',
      priceValue: 79.90,
      months: 3,
      popular: true,
      savings: 'Economize R$ 9,80',
      description: 'Acesso por 3 meses',
      features: [
        { text: 'Acesso ilimitado a filmes e series', included: true },
        { text: 'Qualidade Full HD (1080p)', included: true },
        { text: 'Assista em qualquer dispositivo', included: true },
        { text: 'Cancele quando quiser', included: true }
      ]
    },
    {
      id: 'anual' as const,
      name: '1 Ano',
      price: 'R$ 250,00',
      priceValue: 250.00,
      months: 12,
      savings: 'Economize R$ 108,80',
      description: 'Acesso por 1 ano',
      features: [
        { text: 'Acesso ilimitado a filmes e series', included: true },
        { text: 'Qualidade Full HD (1080p)', included: true },
        { text: 'Assista em qualquer dispositivo', included: true },
        { text: 'Cancele quando quiser', included: true },
        { text: 'Melhor custo-beneficio', included: true }
      ]
    }
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${API_BASE}/api/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          plan: selectedPlan
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(data.error || 'Erro ao enviar cadastro');
      }
    } catch (error) {
      console.error('Erro ao enviar cadastro:', error);
      setSubmitError('Erro de conexao. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Tela de sucesso
  if (submitSuccess) {
    return (
      <div className="relative w-full min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-600/20 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-500" strokeWidth={2.5} />
          </div>
          <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[32px] mb-4">
            Cadastro Enviado!
          </h2>
          <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[16px] mb-6">
            Seu cadastro foi recebido com sucesso. Em breve entraremos em contato pelo WhatsApp para confirmar sua assinatura.
          </p>
          <div className="bg-white/5 rounded-xl p-6 mb-8">
            <p className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[18px] mb-2">
              Plano escolhido: {selectedPlanData?.name}
            </p>
            <p className="text-[#E50914] font-['Montserrat:Extra_Bold',sans-serif] text-[24px]">
              {selectedPlanData?.price}
            </p>
          </div>
          <button
            onClick={onContinue}
            className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-6 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Formulario de cadastro
  if (showForm) {
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
              onClick={() => setShowForm(false)}
              className="text-white hover:text-[#E50914] transition-colors font-['Montserrat:Semi_Bold',sans-serif] text-[16px]"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#333333] h-1">
          <div className="h-full bg-[#E50914] transition-all duration-500 w-[100%]" />
        </div>

        {/* Content */}
        <div className="px-8 py-16">
          <div className="max-w-lg mx-auto">
            {/* Titulo */}
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[32px]">
                Complete seu cadastro
              </h2>
              <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[16px]">
                Preencha seus dados para finalizar a assinatura
              </p>
            </div>

            {/* Plano selecionado */}
            <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px]">
                    Plano selecionado
                  </p>
                  <p className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[20px]">
                    {selectedPlanData?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#E50914] font-['Montserrat:Extra_Bold',sans-serif] text-[24px]">
                    {selectedPlanData?.price}
                  </p>
                  {selectedPlanData?.savings && (
                    <p className="text-green-500 font-['Roboto:Regular',sans-serif] text-[12px]">
                      {selectedPlanData.savings}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-['Montserrat:Semi_Bold',sans-serif] text-[14px] mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite seu nome"
                  required
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>

              <div>
                <label className="block text-white font-['Montserrat:Semi_Bold',sans-serif] text-[14px] mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite seu e-mail"
                  required
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>

              <div>
                <label className="block text-white font-['Montserrat:Semi_Bold',sans-serif] text-[14px] mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                  placeholder="(00) 00000-0000"
                  required
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>

              {submitError && (
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-500 font-['Roboto:Regular',sans-serif] text-[14px]">
                    {submitError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E50914] hover:bg-[#C41A23] disabled:bg-gray-600 text-white rounded px-6 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar Cadastro'}
              </button>
            </form>

            <p className="text-[#666666] font-['Roboto:Regular',sans-serif] text-[12px] text-center mt-6">
              Ao continuar, voce concorda com os Termos de Uso e Politica de Privacidade.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Titulo */}
          <div className="text-center space-y-4 mb-12">
            <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[14px] uppercase tracking-wider">
              ESCOLHA SEU PLANO
            </p>
            <h2 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-[42px]">
              Assine o RedFlix
            </h2>
            <p className="text-[#B3B3B3] font-['Roboto:Regular',sans-serif] text-[18px] max-w-2xl mx-auto">
              Escolha o plano ideal para voce. Assista em qualquer dispositivo.
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
                  </div>
                  {plan.savings && (
                    <p className="text-green-500 font-['Roboto:Regular',sans-serif] text-[14px]">
                      {plan.savings}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-white font-['Roboto:Regular',sans-serif] text-[14px]">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botoes de Acao */}
          <div className="max-w-md mx-auto space-y-4">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-[#E50914] hover:bg-[#C41A23] text-white rounded px-6 py-4 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#E50914]/50 active:scale-95"
            >
              Continuar com {selectedPlanData?.name}
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
              Apos o cadastro, entraremos em contato pelo WhatsApp para confirmar sua assinatura.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

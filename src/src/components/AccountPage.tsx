import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Toast nativo simples para substituir sonner
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all ${
    type === 'success' ? 'bg-green-600' : 
    type === 'error' ? 'bg-red-600' : 
    'bg-blue-600'
  }`;
  toastEl.textContent = message;
  document.body.appendChild(toastEl);
  
  setTimeout(() => {
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.remove(), 300);
  }, 3000);
};

const toast = {
  success: (msg: string) => showToast(msg, 'success'),
  error: (msg: string) => showToast(msg, 'error'),
  info: (msg: string) => showToast(msg, 'info')
};

// Icons inline
const ChevronRightIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ChevronLeftIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const HomeIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const CreditCardIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const ShieldIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const SmartphoneIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const UserIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BellIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SettingsIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m-6-6h6m6 0h-6"></path>
  </svg>
);

const XIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const KeyIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="7.5" cy="15.5" r="5.5"></circle>
    <path d="m21 2-9.6 9.6"></path>
    <path d="m15.5 7.5 3 3L22 7l-3-3"></path>
  </svg>
);

const MailIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const EyeIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
    <line x1="2" y1="2" x2="22" y2="22"></line>
  </svg>
);

const CheckIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const EditIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

interface AccountPageProps {
  onClose?: () => void;
  currentUser?: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  onLogout?: () => void;
}

type SectionType = 'overview' | 'subscription' | 'security' | 'devices' | 'profiles' | 'notifications' | 'preferences';

export function AccountPage({ onClose, currentUser, onLogout }: AccountPageProps) {
  const [selectedSection, setSelectedSection] = useState<SectionType>('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [enable2FA, setEnable2FA] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    password: ''
  });

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'João Silva',
    email: currentUser?.email || 'usuario@email.com',
    phone: '+55 11 98765-4321',
    cpf: '123.456.789-00',
    birthDate: '01/01/1990',
    address: 'Rua Example, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  });

  const [twoFACode, setTwoFACode] = useState('');

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: true,
    newReleases: true,
    recommendations: true,
    watchReminders: false
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'pt-BR',
    quality: 'auto',
    autoplay: true,
    subtitles: false,
    audioLanguage: 'pt-BR',
    maturityRating: 'all',
    dataUsage: 'auto'
  });

  // Dados de exemplo do usuário
  const accountData = {
    name: profileForm.name,
    email: profileForm.email,
    phone: profileForm.phone,
    plan: {
      name: 'Premium',
      price: 'R$ 55,90',
      nextBilling: '15 de Dezembro, 2025',
      paymentMethod: 'Cartão de Crédito •••• 4532',
      features: [
        'Ultra HD disponível',
        '4 telas simultâneas',
        'Download em até 6 dispositivos',
        'Sem anúncios',
        'Catálogo completo'
      ]
    },
    devices: [
      { id: 1, name: 'iPhone 14 Pro', lastUsed: 'Agora', active: true, location: 'São Paulo, SP' },
      { id: 2, name: 'Smart TV Samsung', lastUsed: 'Há 2 horas', active: false, location: 'São Paulo, SP' },
      { id: 3, name: 'MacBook Pro', lastUsed: 'Há 1 dia', active: false, location: 'Rio de Janeiro, RJ' },
      { id: 4, name: 'iPad Air', lastUsed: 'Há 3 dias', active: false, location: 'Brasília, DF' }
    ],
    paymentHistory: [
      { id: 1, date: '15/11/2025', amount: 'R$ 55,90', method: 'Cartão •••• 4532', status: 'Pago' },
      { id: 2, date: '15/10/2025', amount: 'R$ 55,90', method: 'Cartão •••• 4532', status: 'Pago' },
      { id: 3, date: '15/09/2025', amount: 'R$ 55,90', method: 'Cartão •••• 4532', status: 'Pago' },
      { id: 4, date: '15/08/2025', amount: 'R$ 55,90', method: 'Cartão •••• 4532', status: 'Pago' }
    ],
    profiles: [
      { id: 1, name: 'João Silva', avatar: '👨', isKids: false, isPrimary: true },
      { id: 2, name: 'Maria Silva', avatar: '👩', isKids: false, isPrimary: false },
      { id: 3, name: 'Kids', avatar: '👶', isKids: true, isPrimary: false }
    ]
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordForm.new.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    toast.success('Senha alterada com sucesso!');
    setShowPasswordModal(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.newEmail.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    toast.success('Email alterado com sucesso! Confirme no novo email.');
    setShowEmailModal(false);
    setEmailForm({ newEmail: '', password: '' });
  };

  const handleToggle2FA = () => {
    if (enable2FA) {
      toast.success('Autenticação de dois fatores desabilitada');
      setEnable2FA(false);
      setShow2FAModal(false);
    } else {
      if (twoFACode.length === 6) {
        toast.success('Autenticação de dois fatores habilitada!');
        setEnable2FA(true);
        setShow2FAModal(false);
        setTwoFACode('');
      } else {
        toast.error('Digite o código de 6 dígitos');
      }
    }
  };

  const handleDisconnectDevice = (deviceId: number) => {
    toast.success('Dispositivo desconectado com sucesso');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Informações atualizadas com sucesso!');
    setEditingProfile(false);
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`Notificação ${!notifications[key] ? 'ativada' : 'desativada'}`);
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success('Preferência atualizada!');
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      toast.error('Cancelamento solicitado. Você terá acesso até o fim do período de cobrança.');
    }
  };

  const handleChangePlan = () => {
    toast.info('Funcionalidade de alteração de plano em breve');
  };

  const handleUpdatePayment = () => {
    toast.info('Funcionalidade de atualização de pagamento em breve');
  };

  // Modal de Alteração de Senha
  const PasswordModal = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={() => {
            setShowPasswordModal(false);
            setPasswordForm({ current: '', new: '', confirm: '' });
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 flex items-center justify-center">
            <KeyIcon className="text-[#E50914]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alterar Senha</h2>
            <p className="text-gray-500 text-sm">Crie uma senha forte e segura</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm block mb-2">Senha Atual</label>
            <div className="relative">
              <input
                type={showPasswordFields.current ? "text" : "password"}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordFields({ ...showPasswordFields, current: !showPasswordFields.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordFields.current ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-700 text-sm block mb-2">Nova Senha</label>
            <div className="relative">
              <input
                type={showPasswordFields.new ? "text" : "password"}
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-colors"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPasswordFields({ ...showPasswordFields, new: !showPasswordFields.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordFields.new ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">Mínimo de 8 caracteres</p>
          </div>

          <div>
            <label className="text-gray-700 text-sm block mb-2">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                type={showPasswordFields.confirm ? "text" : "password"}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordFields({ ...showPasswordFields, confirm: !showPasswordFields.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordFields.confirm ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordForm({ current: '', new: '', confirm: '' });
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#E50914] hover:bg-[#B20710] text-white py-3 rounded font-semibold transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Modal de Alteração de Email
  const EmailModal = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={() => {
            setShowEmailModal(false);
            setEmailForm({ newEmail: '', password: '' });
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 flex items-center justify-center">
            <MailIcon className="text-[#E50914]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alterar Email</h2>
            <p className="text-gray-500 text-sm">Email atual: {accountData.email}</p>
          </div>
        </div>

        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <label className="text-gray-700 text-sm block mb-2">Novo Email</label>
            <input
              type="email"
              value={emailForm.newEmail}
              onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
              className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-colors"
              required
              placeholder="novo@email.com"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm block mb-2">Senha Atual</label>
            <input
              type="password"
              value={emailForm.password}
              onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
              className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-colors"
              required
              placeholder="Digite sua senha"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-xs">
              ⚠️ Você receberá um email de confirmação no novo endereço.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEmailModal(false);
                setEmailForm({ newEmail: '', password: '' });
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#E50914] hover:bg-[#B20710] text-white py-3 rounded font-semibold transition-colors"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Modal de 2FA
  const TwoFAModal = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={() => {
            setShow2FAModal(false);
            setTwoFACode('');
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 flex items-center justify-center">
            <ShieldIcon className="text-[#E50914]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {enable2FA ? 'Desabilitar' : 'Habilitar'} Autenticação em Duas Etapas
            </h2>
            <p className="text-gray-500 text-sm">
              {enable2FA ? 'Remover camada extra de segurança' : 'Adicione uma camada extra de segurança'}
            </p>
          </div>
        </div>

        {!enable2FA ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-700 text-sm mb-3">Escaneie o QR Code com seu aplicativo autenticador</p>
              <div className="w-48 h-48 bg-white border-2 border-gray-200 mx-auto rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🔐</div>
                  <p className="text-gray-400 text-xs">QR Code</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-3">Ou use o código: REDFLIX2FA2025</p>
            </div>

            <div>
              <label className="text-gray-700 text-sm block mb-2">Código de Verificação</label>
              <input
                type="text"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] outline-none transition-colors text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
              <p className="text-gray-400 text-xs mt-1 text-center">Digite o código de 6 dígitos</p>
            </div>

            <button
              onClick={handleToggle2FA}
              className="w-full bg-[#E50914] hover:bg-[#B20710] text-white py-3 rounded font-semibold transition-colors"
            >
              Ativar Autenticação
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700 text-sm">
                ⚠️ Ao desabilitar a autenticação em duas etapas, sua conta ficará menos segura.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShow2FAModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleToggle2FA}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition-colors"
              >
                Desabilitar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // SEÇÃO: Visão Geral
  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 font-bold text-lg">Informações Pessoais</h3>
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="text-[#E50914] hover:text-[#B20710] text-sm font-semibold flex items-center gap-2"
          >
            <EditIcon size={16} />
            {editingProfile ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {editingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 text-sm block mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded border border-gray-200 focus:border-[#E50914] outline-none"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm block mb-1">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded border border-gray-200 focus:border-[#E50914] outline-none"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm block mb-1">Telefone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded border border-gray-200 focus:border-[#E50914] outline-none"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm block mb-1">Data de Nascimento</label>
                <input
                  type="text"
                  value={profileForm.birthDate}
                  onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 px-3 py-2 rounded border border-gray-200 focus:border-[#E50914] outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#E50914] hover:bg-[#B20710] text-white px-6 py-2 rounded font-semibold transition-colors"
            >
              Salvar Alterações
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500 text-sm">Nome</label>
              <p className="text-gray-900 font-semibold">{profileForm.name}</p>
            </div>
            <div>
              <label className="text-gray-500 text-sm">Email</label>
              <p className="text-gray-900 font-semibold">{profileForm.email}</p>
            </div>
            <div>
              <label className="text-gray-500 text-sm">Telefone</label>
              <p className="text-gray-900 font-semibold">{profileForm.phone}</p>
            </div>
            <div>
              <label className="text-gray-500 text-sm">Data de Nascimento</label>
              <p className="text-gray-900 font-semibold">{profileForm.birthDate}</p>
            </div>
          </div>
        )}
      </div>

      {/* Status da Conta */}
      <div className="bg-gradient-to-br from-[#E50914] to-[#B20710] p-6 rounded text-white">
        <h3 className="font-bold text-lg mb-4">Status da Conta</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-white/80 text-sm">Plano Atual</p>
            <p className="text-xl font-bold">{accountData.plan.name}</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Valor Mensal</p>
            <p className="text-xl font-bold">{accountData.plan.price}</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Próxima Cobrança</p>
            <p className="text-xl font-bold">{accountData.plan.nextBilling}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // SEÇÃO: Assinatura
  const renderSubscriptionSection = () => (
    <div className="space-y-6">
      {/* Plano Atual */}
      <div className="bg-gradient-to-br from-[#E50914] to-[#B20710] p-6 rounded text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-xl mb-1">Plano {accountData.plan.name}</h3>
            <p className="text-white/90 text-3xl font-bold">{accountData.plan.price}<span className="text-base font-normal">/mês</span></p>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-white text-xs font-semibold">ATIVO</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {accountData.plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckIcon className="text-white" size={16} />
              <span className="text-white/90 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 pt-4">
          <p className="text-white/80 text-sm">Próxima cobrança: {accountData.plan.nextBilling}</p>
          <p className="text-white/80 text-sm">Método de pagamento: {accountData.plan.paymentMethod}</p>
        </div>
      </div>

      {/* Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleChangePlan}
          className="bg-white border-2 border-gray-200 hover:border-[#E50914] text-gray-900 py-3 px-4 rounded font-semibold transition-colors"
        >
          Alterar Plano
        </button>
        <button
          onClick={handleUpdatePayment}
          className="bg-white border-2 border-gray-200 hover:border-[#E50914] text-gray-900 py-3 px-4 rounded font-semibold transition-colors"
        >
          Atualizar Pagamento
        </button>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="bg-white p-6 rounded border border-gray-200">
        <h3 className="text-gray-900 font-bold text-lg mb-4">Histórico de Pagamentos</h3>
        <div className="space-y-2">
          {accountData.paymentHistory.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors">
              <div>
                <p className="text-gray-900 font-semibold">{payment.amount}</p>
                <p className="text-gray-500 text-sm">{payment.date} • {payment.method}</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                {payment.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancelar Assinatura */}
      <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
        <h3 className="text-red-700 font-bold text-lg mb-2">Cancelar Assinatura</h3>
        <p className="text-gray-600 text-sm mb-4">
          Você perderá acesso ao conteúdo premium ao final do período de cobrança atual ({accountData.plan.nextBilling}).
        </p>
        <button
          onClick={handleCancelSubscription}
          className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
        >
          Solicitar Cancelamento →
        </button>
      </div>
    </div>
  );

  // SEÇÃO: Segurança
  const renderSecuritySection = () => (
    <div className="space-y-4">
      <div 
        onClick={() => setShowPasswordModal(true)}
        className="bg-white p-5 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔑</div>
            <div>
              <h3 className="text-gray-900 font-semibold">Alterar senha</h3>
              <p className="text-gray-500 text-sm">Última alteração: há 3 meses</p>
            </div>
          </div>
          <ChevronRightIcon className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
        </div>
      </div>

      <div 
        onClick={() => setShowEmailModal(true)}
        className="bg-white p-5 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">@</div>
            <div>
              <h3 className="text-gray-900 font-semibold">Alterar e-mail</h3>
              <p className="text-gray-500 text-sm">{accountData.email}</p>
            </div>
          </div>
          <ChevronRightIcon className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
        </div>
      </div>

      <div 
        onClick={() => setShow2FAModal(true)}
        className="bg-white p-5 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📱</div>
            <div>
              <h3 className="text-gray-900 font-semibold">Autenticação de dois fatores</h3>
              <p className="text-gray-500 text-sm">
                {enable2FA ? 'Ativada ✓' : 'Adicione uma camada extra de segurança'}
              </p>
            </div>
          </div>
          <ChevronRightIcon className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
        </div>
      </div>

      <div 
        onClick={() => toast.info('Histórico de atividades disponível em breve')}
        className="bg-white p-5 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📋</div>
            <div>
              <h3 className="text-gray-900 font-semibold">Histórico de atividades</h3>
              <p className="text-gray-500 text-sm">Ver todos os acessos à sua conta</p>
            </div>
          </div>
          <ChevronRightIcon className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
        </div>
      </div>

      <div 
        onClick={() => toast.success('Download dos seus dados iniciado. Você receberá um email em até 48h.')}
        className="bg-white p-5 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📦</div>
            <div>
              <h3 className="text-gray-900 font-semibold">Baixar meus dados</h3>
              <p className="text-gray-500 text-sm">Exportar todas as suas informações</p>
            </div>
          </div>
          <ChevronRightIcon className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
        </div>
      </div>
    </div>
  );

  // SEÇÃO: Dispositivos
  const renderDevicesSection = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm">
          ℹ️ Você pode usar o RedFlix em até 4 dispositivos simultaneamente no plano Premium.
        </p>
      </div>

      <div className="space-y-3">
        {accountData.devices.map((device) => (
          <div key={device.id} className="bg-white p-5 rounded border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <SmartphoneIcon className="text-gray-600" size={20} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">{device.name}</h3>
                  <p className="text-gray-500 text-sm">
                    Último acesso: {device.lastUsed} • {device.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {device.active && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    EM USO
                  </div>
                )}
                {!device.active && (
                  <button 
                    onClick={() => handleDisconnectDevice(device.id)}
                    className="text-[#E50914] hover:text-[#B20710] text-sm font-semibold transition-colors"
                  >
                    Desconectar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (window.confirm('Desconectar todos os dispositivos? Você precisará fazer login novamente.')) {
            toast.success('Todos os dispositivos foram desconectados');
          }
        }}
        className="w-full bg-[#E50914] hover:bg-[#B20710] text-white py-3 rounded font-semibold transition-colors"
      >
        Desconectar Todos os Dispositivos
      </button>
    </div>
  );

  // SEÇÃO: Perfis
  const renderProfilesSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200">
        <h3 className="text-gray-900 font-bold text-lg mb-4">Perfis da Conta</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accountData.profiles.map((profile) => (
            <div key={profile.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#E50914] transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="text-6xl mb-3">{profile.avatar}</div>
                <h4 className="text-gray-900 font-semibold mb-1">{profile.name}</h4>
                {profile.isPrimary && (
                  <span className="text-xs bg-[#E50914] text-white px-2 py-1 rounded-full mb-2">Principal</span>
                )}
                {profile.isKids && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full mb-2">Kids</span>
                )}
                <button
                  onClick={() => toast.info('Edição de perfil em breve')}
                  className="text-[#E50914] hover:text-[#B20710] text-sm font-semibold mt-2"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => toast.info('Criação de novo perfil em breve')}
        className="w-full bg-[#E50914] hover:bg-[#B20710] text-white py-3 rounded font-semibold transition-colors"
      >
        + Adicionar Novo Perfil
      </button>
    </div>
  );

  // SEÇÃO: Notificações
  const renderNotificationsSection = () => (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Notificações por Email</h3>
            <p className="text-gray-500 text-sm">Novos lançamentos e recomendações</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={() => handleNotificationToggle('email')}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Notificações Push</h3>
            <p className="text-gray-500 text-sm">Alertas no navegador e dispositivos</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={() => handleNotificationToggle('push')}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">SMS</h3>
            <p className="text-gray-500 text-sm">Alertas importantes via SMS</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.sms}
            onChange={() => handleNotificationToggle('sms')}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Marketing</h3>
            <p className="text-gray-500 text-sm">Promoções e ofertas especiais</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.marketing}
            onChange={() => handleNotificationToggle('marketing')}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Novos Lançamentos</h3>
            <p className="text-gray-500 text-sm">Notificações de novos conteúdos</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.newReleases}
            onChange={() => handleNotificationToggle('newReleases')}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Recomendações</h3>
            <p className="text-gray-500 text-sm">Sugestões personalizadas</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.recommendations}
            onChange={() => handleNotificationToggle('recommendations')}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Lembretes de Assistir</h3>
            <p className="text-gray-500 text-sm">Lembrar de continuar assistindo</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.watchReminders}
            onChange={() => handleNotificationToggle('watchReminders')}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  // SEÇÃO: Preferências
  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded border border-gray-200">
        <h3 className="text-gray-900 font-semibold mb-3">Idioma</h3>
        <select
          value={preferences.language}
          onChange={(e) => handlePreferenceChange('language', e.target.value)}
          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] outline-none cursor-pointer"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Español</option>
          <option value="fr-FR">Français</option>
        </select>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <h3 className="text-gray-900 font-semibold mb-3">Qualidade de Vídeo</h3>
        <select
          value={preferences.quality}
          onChange={(e) => handlePreferenceChange('quality', e.target.value)}
          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] outline-none cursor-pointer"
        >
          <option value="auto">Automático</option>
          <option value="4k">Ultra HD (4K)</option>
          <option value="1080p">Full HD (1080p)</option>
          <option value="720p">HD (720p)</option>
          <option value="480p">SD (480p)</option>
        </select>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <h3 className="text-gray-900 font-semibold mb-3">Idioma de Áudio Padrão</h3>
        <select
          value={preferences.audioLanguage}
          onChange={(e) => handlePreferenceChange('audioLanguage', e.target.value)}
          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] outline-none cursor-pointer"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">Inglês</option>
          <option value="es-ES">Espanhol</option>
          <option value="original">Idioma Original</option>
        </select>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <h3 className="text-gray-900 font-semibold mb-3">Classificação Etária</h3>
        <select
          value={preferences.maturityRating}
          onChange={(e) => handlePreferenceChange('maturityRating', e.target.value)}
          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] outline-none cursor-pointer"
        >
          <option value="all">Todos os Públicos</option>
          <option value="10">10 anos</option>
          <option value="12">12 anos</option>
          <option value="14">14 anos</option>
          <option value="16">16 anos</option>
          <option value="18">18 anos</option>
        </select>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Reprodução Automática</h3>
            <p className="text-gray-500 text-sm">Iniciar próximo episódio automaticamente</p>
          </div>
          <input
            type="checkbox"
            checked={preferences.autoplay}
            onChange={(e) => handlePreferenceChange('autoplay', e.target.checked)}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold">Legendas</h3>
            <p className="text-gray-500 text-sm">Ativar legendas por padrão</p>
          </div>
          <input
            type="checkbox"
            checked={preferences.subtitles}
            onChange={(e) => handlePreferenceChange('subtitles', e.target.checked)}
            className="w-5 h-5 accent-[#E50914] cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200">
        <h3 className="text-gray-900 font-semibold mb-3">Uso de Dados</h3>
        <select
          value={preferences.dataUsage}
          onChange={(e) => handlePreferenceChange('dataUsage', e.target.value)}
          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded border border-gray-200 focus:border-[#E50914] outline-none cursor-pointer"
        >
          <option value="auto">Automático</option>
          <option value="low">Baixo (Economizar dados)</option>
          <option value="medium">Médio</option>
          <option value="high">Alto (Melhor qualidade)</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeftIcon size={20} />
            <span className="text-sm font-medium">Voltar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <button
              onClick={() => setSelectedSection('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                selectedSection === 'overview'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HomeIcon size={20} />
              <span className="text-sm">Visão geral</span>
            </button>

            <button
              onClick={() => setSelectedSection('subscription')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                selectedSection === 'subscription'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CreditCardIcon size={20} />
              <span className="text-sm">Assinatura</span>
            </button>

            <button
              onClick={() => setSelectedSection('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                selectedSection === 'security'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShieldIcon size={20} />
              <span className="text-sm">Segurança</span>
            </button>

            <button
              onClick={() => setSelectedSection('devices')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                selectedSection === 'devices'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <SmartphoneIcon size={20} />
              <span className="text-sm">Aparelhos</span>
            </button>

            <button
              onClick={() => setSelectedSection('profiles')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                selectedSection === 'profiles'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UserIcon size={20} />
              <span className="text-sm">Perfis</span>
            </button>

            <button
              onClick={() => setSelectedSection('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                selectedSection === 'notifications'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BellIcon size={20} />
              <span className="text-sm">Notificações</span>
            </button>

            <button
              onClick={() => setSelectedSection('preferences')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                selectedSection === 'preferences'
                  ? 'bg-gray-200 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <SettingsIcon size={20} />
              <span className="text-sm">Preferências</span>
            </button>
          </div>

          {/* Content Area */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {selectedSection === 'overview' && 'Visão geral'}
              {selectedSection === 'subscription' && 'Assinatura'}
              {selectedSection === 'security' && 'Segurança'}
              {selectedSection === 'devices' && 'Aparelhos'}
              {selectedSection === 'profiles' && 'Perfis'}
              {selectedSection === 'notifications' && 'Notificações'}
              {selectedSection === 'preferences' && 'Preferências'}
            </h1>

            {selectedSection === 'overview' && renderOverviewSection()}
            {selectedSection === 'subscription' && renderSubscriptionSection()}
            {selectedSection === 'security' && renderSecuritySection()}
            {selectedSection === 'devices' && renderDevicesSection()}
            {selectedSection === 'profiles' && renderProfilesSection()}
            {selectedSection === 'notifications' && renderNotificationsSection()}
            {selectedSection === 'preferences' && renderPreferencesSection()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPasswordModal && <PasswordModal />}
      {showEmailModal && <EmailModal />}
      {show2FAModal && <TwoFAModal />}
    </div>
  );
}

import { useState, useEffect } from 'react'
import * as api from './services/api'

type Tab = 'dashboard' | 'content' | 'users' | 'channels' | 'categories' | 'banners' | 'customize' | 'settings'

function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [categories, setCategories] = useState<api.Category[]>([])
  const [channels, setChannels] = useState<api.Channel[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const [kpis, setKpis] = useState<api.KPIs | null>(null)
  const [topContent, setTopContent] = useState<api.TopContent[]>([])
  const [contents, setContents] = useState<api.Content[]>([])
  const [users, setUsers] = useState<api.User[]>([])
  const [banners, setBanners] = useState<api.Banner[]>([])
  const [siteConfigs, setSiteConfigs] = useState<api.SiteConfig[]>([])
  const [contentPage, setContentPage] = useState(1)
  const [contentTotal, setContentTotal] = useState(0)
  const [userPage, setUserPage] = useState(1)
  const [userTotal, setUserTotal] = useState(0)

  useEffect(() => {
    loadCategories()
    loadKPIs()
    loadTopContent()
    loadSiteConfigs()
  }, [])

  useEffect(() => {
    loadChannels()
  }, [selectedCategory])

  useEffect(() => {
    if (tab === 'content') loadContents()
    if (tab === 'users') loadUsers()
    if (tab === 'banners') loadBanners()
  }, [tab, contentPage, userPage])

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const loadKPIs = async () => {
    try {
      const data = await api.getKPIs()
      setKpis(data)
    } catch (err) {
      console.error('Error loading KPIs:', err)
    }
  }

  const loadTopContent = async () => {
    try {
      const data = await api.getTopContent()
      setTopContent(data)
    } catch (err) {
      console.error('Error loading top content:', err)
    }
  }

  const loadContents = async () => {
    try {
      const data = await api.getContents(contentPage)
      setContents(data.contents || [])
      setContentTotal(data.total || 0)
    } catch (err) {
      console.error('Error loading contents:', err)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await api.getUsers(userPage)
      setUsers(data.users || [])
      setUserTotal(data.total || 0)
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const loadBanners = async () => {
    try {
      const data = await api.getBanners()
      setBanners(data || [])
    } catch (err) {
      console.error('Error loading banners:', err)
    }
  }

  const loadSiteConfigs = async () => {
    try {
      const data = await api.getSiteConfigs()
      setSiteConfigs(data || [])
    } catch (err) {
      console.error('Error loading site configs:', err)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await api.getCategories(true)
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const loadChannels = async () => {
    try {
      const data = await api.getChannels(selectedCategory || undefined, true)
      setChannels(data)
    } catch (err) {
      console.error('Error loading channels:', err)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setMessage('')
    try {
      const result = await api.uploadM3U(file, true)
      setMessage(`Importado: ${result.channels} canais em ${result.categories} categorias`)
      loadCategories()
      loadChannels()
    } catch (err) {
      setMessage('Erro ao importar arquivo')
    }
    setLoading(false)
  }

  const handleUrlImport = async (url: string) => {
    setLoading(true)
    setMessage('')
    try {
      const result = await api.importFromUrl(url, true)
      setMessage(`Importado: ${result.channels} canais em ${result.categories} categorias`)
      loadCategories()
      loadChannels()
    } catch (err) {
      setMessage('Erro ao importar URL')
    }
    setLoading(false)
  }

  const handleToggleChannel = async (channel: api.Channel) => {
    try {
      await api.updateChannel(channel.id, { active: !channel.active })
      loadChannels()
    } catch (err) {
      console.error('Error toggling channel:', err)
    }
  }

  const handleDeleteChannel = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este canal?')) return
    try {
      await api.deleteChannel(id)
      loadChannels()
    } catch (err) {
      console.error('Error deleting channel:', err)
    }
  }

  const handleToggleCategory = async (category: api.Category) => {
    try {
      await api.updateCategory(category.id, { active: !category.active })
      loadCategories()
    } catch (err) {
      console.error('Error toggling category:', err)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria e todos os seus canais?')) return
    try {
      await api.deleteCategory(id)
      loadCategories()
      loadChannels()
    } catch (err) {
      console.error('Error deleting category:', err)
    }
  }

  const handleDeleteContent = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return
    try {
      await api.deleteContent(id)
      showMessage('Conteúdo excluído!')
      loadContents()
    } catch (err) {
      showMessage('Erro ao excluir conteúdo', 'error')
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return
    try {
      await api.deleteUser(id)
      showMessage('Usuário excluído!')
      loadUsers()
    } catch (err) {
      showMessage('Erro ao excluir usuário', 'error')
    }
  }

  const handleDeleteBanner = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return
    try {
      await api.deleteBanner(id)
      showMessage('Banner excluído!')
      loadBanners()
    } catch (err) {
      showMessage('Erro ao excluir banner', 'error')
    }
  }

  const handleSaveConfig = async (key: string, value: string) => {
    try {
      await api.setSiteConfig(key, value)
      showMessage('Configuração salva!')
      loadSiteConfigs()
    } catch (err) {
      showMessage('Erro ao salvar configuração', 'error')
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Tem certeza que deseja excluir TODOS os canais e categorias?')) return
    try {
      await api.deleteAllCategories()
      showMessage('Todos os dados foram excluídos')
      loadCategories()
      loadChannels()
    } catch (err) {
      showMessage('Erro ao excluir dados', 'error')
    }
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'content', label: 'Conteúdo', icon: '🎬' },
    { id: 'users', label: 'Usuários', icon: '👥' },
    { id: 'channels', label: 'Canais', icon: '📺' },
    { id: 'categories', label: 'Categorias', icon: '📁' },
    { id: 'banners', label: 'Banners', icon: '🖼️' },
    { id: 'customize', label: 'Personalizar', icon: '🎨' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-[#141414]">
      <header className="bg-black/50 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#E50914]">RedFlix Admin</h1>
          <nav className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 rounded flex items-center gap-2 text-sm ${tab === t.id ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                <span>{t.icon}</span>
                <span className="hidden md:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {message && (
          <div className={`mb-4 p-4 rounded ${messageType === 'success' ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-red-900/50 border border-red-700 text-red-300'}`}>
            {message}
          </div>
        )}

        {tab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard - KPIs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#E50914]">{kpis?.totalUsers || 0}</div>
                <div className="text-gray-400">Total Usuarios</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-500">{kpis?.activeSubscriptions || 0}</div>
                <div className="text-gray-400">Assinaturas Ativas</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-500">{kpis?.newUsersThisMonth || 0}</div>
                <div className="text-gray-400">Novos Este Mes</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-500">{kpis?.totalContent || 0}</div>
                <div className="text-gray-400">Total Conteudos</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-500">{kpis?.totalViews || 0}</div>
                <div className="text-gray-400">Total Visualizacoes</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-400">R$ {(kpis?.monthlyRevenue || 0).toFixed(2)}</div>
                <div className="text-gray-400">Receita Mensal</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-300">R$ {(kpis?.yearlyRevenue || 0).toFixed(2)}</div>
                <div className="text-gray-400">Receita Anual</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-400">{kpis?.cancelledThisMonth || 0}</div>
                <div className="text-gray-400">Cancelamentos</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Conteudos Mais Assistidos</h3>
              <div className="space-y-3">
                {topContent.length === 0 ? (
                  <p className="text-gray-400">Nenhum dado disponivel</p>
                ) : (
                  topContent.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-800 p-3 rounded">
                      <span className="text-2xl font-bold text-[#E50914]">#{i + 1}</span>
                      {item.posterPath && <img src={item.posterPath} alt="" className="w-12 h-16 object-cover rounded" />}
                      <div className="flex-1">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.type} - {item.views} visualizacoes</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#E50914]">{categories.length}</div>
                <div className="text-gray-400">Categorias IPTV</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#E50914]">{channels.length}</div>
                <div className="text-gray-400">Canais IPTV</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'content' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestao de Conteudo</h2>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Poster</th>
                    <th className="px-4 py-3 text-left">Titulo</th>
                    <th className="px-4 py-3 text-left">Tipo</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.map(content => (
                    <tr key={content.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        {content.posterPath ? (
                          <img src={content.posterPath} alt="" className="w-12 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-500">?</div>
                        )}
                      </td>
                      <td className="px-4 py-3">{content.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${content.type === 'movie' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                          {content.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded text-xs ${content.active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                          {content.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="px-3 py-1 bg-red-900 text-red-300 rounded text-xs hover:bg-red-800"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-400">Total: {contentTotal} conteudos</span>
                <div className="flex gap-2">
                  <button onClick={() => setContentPage(p => Math.max(1, p - 1))} disabled={contentPage === 1} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50">Anterior</button>
                  <span className="px-3 py-1">Pagina {contentPage}</span>
                  <button onClick={() => setContentPage(p => p + 1)} disabled={contents.length < 20} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50">Proxima</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestao de Usuarios</h2>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Plano</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Criado em</th>
                    <th className="px-4 py-3 text-left">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3 text-gray-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${user.plan === 'premium' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-700 text-gray-400'}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded text-xs ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1 bg-red-900 text-red-300 rounded text-xs hover:bg-red-800">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex justify-between items-center">
                <span className="text-gray-400">Total: {userTotal} usuarios</span>
                <div className="flex gap-2">
                  <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50">Anterior</button>
                  <span className="px-3 py-1">Pagina {userPage}</span>
                  <button onClick={() => setUserPage(p => p + 1)} disabled={users.length < 20} className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50">Proxima</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'channels' && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">Todas as categorias</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat._count?.channels || 0})</option>
                ))}
              </select>
              <span className="text-gray-400">{channels.length} canais</span>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left">Logo</th>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Categoria</th>
                    <th className="px-4 py-3 text-left">Formato</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.slice(0, 100).map(channel => (
                    <tr key={channel.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        {channel.logo ? (
                          <img src={channel.logo} alt="" className="w-10 h-10 object-contain bg-gray-800 rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-500">?</div>
                        )}
                      </td>
                      <td className="px-4 py-3">{channel.name}</td>
                      <td className="px-4 py-3 text-gray-400">{channel.category?.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${channel.format === 'm3u8' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                          {channel.format.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleChannel(channel)}
                          className={`px-3 py-1 rounded text-xs ${channel.active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}
                        >
                          {channel.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteChannel(channel.id)}
                          className="px-3 py-1 bg-red-900 text-red-300 rounded text-xs hover:bg-red-800"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {channels.length > 100 && (
                <div className="p-4 text-center text-gray-400">
                  Mostrando 100 de {channels.length} canais
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Canais</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-semibold">{category.name}</td>
                    <td className="px-4 py-3 text-gray-400">{category.slug}</td>
                    <td className="px-4 py-3">{category._count?.channels || 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleCategory(category)}
                        className={`px-3 py-1 rounded text-xs ${category.active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}
                      >
                        {category.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="px-3 py-1 bg-red-900 text-red-300 rounded text-xs hover:bg-red-800"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'banners' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Gestao de Banners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map(banner => (
                <div key={banner.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Banner' }} />
                  <div className="p-4">
                    <h4 className="font-semibold">{banner.title}</h4>
                    <p className="text-sm text-gray-400">{banner.position}</p>
                    <div className="mt-3 flex gap-2">
                      <span className={`px-3 py-1 rounded text-xs ${banner.active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                        {banner.active ? 'Ativo' : 'Inativo'}
                      </span>
                      <button onClick={() => handleDeleteBanner(banner.id)} className="px-3 py-1 bg-red-900 text-red-300 rounded text-xs hover:bg-red-800">Excluir</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'customize' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Personalizacao do Site</h2>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Cores e Branding</h3>
              <div className="space-y-4">
                {siteConfigs.map(config => (
                  <div key={config.key} className="flex items-center gap-4">
                    <label className="w-40 text-sm">{config.key}</label>
                    {config.type === 'color' ? (
                      <input type="color" defaultValue={config.value} onBlur={(e) => handleSaveConfig(config.key, e.target.value)} className="w-12 h-10 bg-gray-800 border border-gray-700 rounded cursor-pointer" />
                    ) : (
                      <input type="text" defaultValue={config.value} onBlur={(e) => handleSaveConfig(config.key, e.target.value)} className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Configuracoes</h2>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Upload M3U</h3>
              <input type="file" accept=".m3u,.m3u8,.txt" onChange={handleFileUpload} disabled={loading} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#E50914] file:text-white hover:file:bg-red-700" />
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Importar de URL</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleUrlImport((e.target as HTMLFormElement).url.value) }} className="flex gap-4">
                <input name="url" type="url" placeholder="https://exemplo.com/lista.m3u" className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white" />
                <button type="submit" disabled={loading} className="px-6 py-2 bg-[#E50914] text-white rounded hover:bg-red-700 disabled:opacity-50">Importar</button>
              </form>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Zona de Perigo</h3>
              <button onClick={handleClearAll} className="px-6 py-2 bg-red-900 text-white rounded hover:bg-red-800">Excluir Todos os Canais e Categorias</button>
            </div>
          </div>
        )}
      </main>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="animate-spin w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-400">Processando...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

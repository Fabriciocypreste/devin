import { useState, useEffect } from 'react'
import * as api from './services/api'

type Tab = 'upload' | 'channels' | 'categories' | 'settings'

function App() {
  const [tab, setTab] = useState<Tab>('upload')
  const [categories, setCategories] = useState<api.Category[]>([])
  const [channels, setChannels] = useState<api.Channel[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [tmdbApiKey, setTmdbApiKey] = useState('')

  useEffect(() => {
    loadCategories()
    loadSettings()
  }, [])

  useEffect(() => {
    loadChannels()
  }, [selectedCategory])

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

  const loadSettings = async () => {
    try {
      const settings = await api.getSettings()
      setTmdbApiKey(settings.tmdb_api_key || '')
    } catch (err) {
      console.error('Error loading settings:', err)
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

  const handleSaveSettings = async () => {
    try {
      await api.setSetting('tmdb_api_key', tmdbApiKey)
      setMessage('Configurações salvas!')
    } catch (err) {
      setMessage('Erro ao salvar configurações')
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Tem certeza que deseja excluir TODOS os canais e categorias?')) return
    try {
      await api.deleteAllCategories()
      setMessage('Todos os dados foram excluídos')
      loadCategories()
      loadChannels()
    } catch (err) {
      setMessage('Erro ao excluir dados')
    }
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <header className="bg-black/50 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#E50914]">RedFlix Admin</h1>
          <nav className="flex gap-4">
            {(['upload', 'channels', 'categories', 'settings'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded ${tab === t ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t === 'upload' ? 'Upload M3U' : t === 'channels' ? 'Canais' : t === 'categories' ? 'Categorias' : 'Configurações'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {message && (
          <div className="mb-4 p-4 bg-green-900/50 border border-green-700 rounded text-green-300">
            {message}
          </div>
        )}

        {tab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload de Arquivo M3U</h2>
              <input
                type="file"
                accept=".m3u,.m3u8,.txt"
                onChange={handleFileUpload}
                disabled={loading}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#E50914] file:text-white hover:file:bg-red-700"
              />
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Importar de URL</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleUrlImport((e.target as any).url.value) }} className="flex gap-4">
                <input
                  name="url"
                  type="url"
                  placeholder="https://exemplo.com/lista.m3u"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#E50914] text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Importar
                </button>
              </form>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Limpar Dados</h2>
              <button
                onClick={handleClearAll}
                className="px-6 py-2 bg-red-900 text-white rounded hover:bg-red-800"
              >
                Excluir Todos os Canais e Categorias
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-3xl font-bold text-[#E50914]">{categories.length}</div>
                  <div className="text-gray-400">Categorias</div>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="text-3xl font-bold text-[#E50914]">{channels.length}</div>
                  <div className="text-gray-400">Canais</div>
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

        {tab === 'settings' && (
          <div className="bg-gray-900 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">TMDB API Key</label>
              <input
                type="text"
                value={tmdbApiKey}
                onChange={(e) => setTmdbApiKey(e.target.value)}
                placeholder="Sua chave da API do TMDB"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-[#E50914] text-white rounded hover:bg-red-700"
            >
              Salvar Configurações
            </button>
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

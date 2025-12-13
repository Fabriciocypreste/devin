import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Github } from 'lucide-react';

/**
 * 🔍 COMPONENTE DE DIAGNÓSTICO DO GITHUB
 * 
 * Verifica se o repositório e os arquivos existem
 * Testa as URLs e mostra o status detalhado
 */

interface DiagnosticResult {
  url: string;
  status: 'loading' | 'success' | 'error';
  statusCode?: number;
  contentLength?: number;
  error?: string;
  preview?: string;
}

export function GitHubDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testUrls = [
    // Filmes
    'https://raw.githubusercontent.com/Fabriciocypreste/lista/main/filmes.txt',
    'https://raw.githubusercontent.com/Fabriciocypreste/lista/master/filmes.txt',
    'https://raw.githubusercontent.com/Fabriciocypreste/lista/main/filmes.m3u',
    // Séries
    'https://raw.githubusercontent.com/Fabriciocypreste/lista/main/series.txt',
    'https://raw.githubusercontent.com/Fabriciocypreste/lista/master/series.txt',
    // Canais
    'https://raw.githubusercontent.com/Fabriciocypreste/lista/main/canais.txt',
    'https://raw.githubusercontent.com/Fabriciocypreste/lista/master/canais.txt',
  ];

  const runDiagnostics = async () => {
    setIsRunning(true);
    const testResults: DiagnosticResult[] = testUrls.map(url => ({
      url,
      status: 'loading' as const,
    }));
    setResults(testResults);

    for (let i = 0; i < testUrls.length; i++) {
      const url = testUrls[i];
      
      try {
        console.log(`🔍 Testando: ${url}`);
        
        const response = await fetch(url);
        const contentLength = parseInt(response.headers.get('content-length') || '0');
        
        if (response.ok) {
          const text = await response.text();
          const preview = text.substring(0, 200);
          
          testResults[i] = {
            url,
            status: 'success',
            statusCode: response.status,
            contentLength: text.length,
            preview,
          };
          
          console.log(`✅ Sucesso: ${url} (${text.length} bytes)`);
        } else {
          testResults[i] = {
            url,
            status: 'error',
            statusCode: response.status,
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
          
          console.log(`❌ Erro: ${url} - ${response.status}`);
        }
      } catch (error) {
        testResults[i] = {
          url,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        
        console.log(`❌ Falha: ${url} - ${error}`);
      }

      setResults([...testResults]);
      
      // Pequeno delay entre requests
      if (i < testUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Executar automaticamente ao montar
    runDiagnostics();
  }, []);

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-8 h-8 text-[#E50914]" />
            <h1 className="text-3xl font-bold">Diagnóstico GitHub</h1>
          </div>
          <p className="text-gray-400">
            Verificando repositório: <code className="text-blue-400">Fabriciocypreste/lista</code>
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">URLs Testadas</div>
            <div className="text-3xl font-bold">{results.length}</div>
          </div>
          
          <div className="bg-gray-900 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
              <CheckCircle className="w-4 h-4" />
              Sucessos
            </div>
            <div className="text-3xl font-bold text-green-400">{successCount}</div>
          </div>
          
          <div className="bg-gray-900 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
              <XCircle className="w-4 h-4" />
              Erros
            </div>
            <div className="text-3xl font-bold text-red-400">{errorCount}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#f40612] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Testando...' : 'Testar Novamente'}
          </button>

          <a
            href="https://github.com/Fabriciocypreste/lista"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Github className="w-5 h-5" />
            Abrir Repositório
          </a>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`bg-gray-900 border rounded-lg p-6 transition-all ${
                result.status === 'success'
                  ? 'border-green-500/30'
                  : result.status === 'error'
                  ? 'border-red-500/30'
                  : 'border-gray-800'
              }`}
            >
              {/* URL */}
              <div className="flex items-start gap-3 mb-4">
                {result.status === 'loading' && (
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin mt-1 flex-shrink-0" />
                )}
                {result.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                )}
                {result.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                )}
                
                <div className="flex-1 min-w-0">
                  <code className="text-sm text-gray-300 break-all">{result.url}</code>
                </div>
              </div>

              {/* Status Details */}
              {result.status !== 'loading' && (
                <div className="ml-8 space-y-2">
                  {result.statusCode && (
                    <div className="text-sm">
                      <span className="text-gray-400">Status:</span>{' '}
                      <span className={result.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {result.statusCode}
                      </span>
                    </div>
                  )}
                  
                  {result.contentLength !== undefined && (
                    <div className="text-sm">
                      <span className="text-gray-400">Tamanho:</span>{' '}
                      <span className="text-white">
                        {(result.contentLength / 1024).toFixed(2)} KB ({result.contentLength.toLocaleString()} bytes)
                      </span>
                    </div>
                  )}
                  
                  {result.error && (
                    <div className="text-sm">
                      <span className="text-gray-400">Erro:</span>{' '}
                      <span className="text-red-400">{result.error}</span>
                    </div>
                  )}
                  
                  {result.preview && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-400 mb-2">Prévia do conteúdo:</div>
                      <pre className="bg-black/50 border border-gray-800 rounded p-3 text-xs text-gray-300 overflow-x-auto">
                        {result.preview}...
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        {errorCount === results.length && results.length > 0 && !isRunning && (
          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-400 font-bold mb-2">Repositório não encontrado</h3>
                <div className="text-gray-300 space-y-2">
                  <p>Nenhum dos arquivos foi encontrado no repositório GitHub.</p>
                  <p className="font-semibold">Possíveis causas:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>O repositório não existe ou é privado</li>
                    <li>Os arquivos têm nomes diferentes</li>
                    <li>Os arquivos estão em um diretório diferente</li>
                    <li>O branch não é "main" nem "master"</li>
                  </ul>
                  <p className="mt-4 font-semibold">Soluções:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Verifique se o repositório existe em: <code className="text-blue-400">https://github.com/Fabriciocypreste/lista</code></li>
                    <li>Certifique-se de que os arquivos estão na raiz do repositório</li>
                    <li>Use o Content Manager para importar manualmente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {successCount > 0 && !isRunning && (
          <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-green-400 font-bold mb-2">Arquivos encontrados!</h3>
                <p className="text-gray-300">
                  {successCount} arquivo(s) foram encontrados com sucesso. A aplicação deve conseguir carregar o conteúdo automaticamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

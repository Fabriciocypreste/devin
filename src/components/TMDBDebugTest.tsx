import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;

export function TMDBDebugTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testTMDBAPI = async () => {
    setLoading(true);
    setResult(null);
    try {
      console.log('🧪 Iniciando teste TMDB API...');
      const response = await fetch(`${SERVER_URL}/tmdb/debug/test`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      console.log('🧪 Resultado do teste:', data);
      setResult(data);
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">🧪 TMDB API Debug Test</CardTitle>
        <p className="text-sm text-[#999] mt-2">
          Este teste verifica se a TMDB_API_KEY está configurada corretamente e qual método de autenticação funciona.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testTMDBAPI} 
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700"
          size="lg"
        >
          {loading ? '🔄 Testando...' : '🧪 Testar TMDB API'}
        </Button>

        {result && (
          <div className="space-y-4">
            {/* Status Geral */}
            <div className="bg-black/50 p-4 rounded-lg border border-[#333]">
              <h3 className="text-white font-bold mb-2">📊 Status da API Key</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white">
                  <span className="text-[#999]">API Key presente:</span>{' '}
                  <span className={result.apiKeyPresent ? 'text-green-500' : 'text-red-500'}>
                    {result.apiKeyPresent ? '✅ Sim' : '❌ Não'}
                  </span>
                </p>
                {result.apiKeyLength && (
                  <p className="text-white">
                    <span className="text-[#999]">Tamanho:</span> {result.apiKeyLength} caracteres
                  </p>
                )}
                {result.apiKeyPrefix && (
                  <p className="text-white">
                    <span className="text-[#999]">Prefixo:</span> {result.apiKeyPrefix}
                  </p>
                )}
                {result.detectedAuthType && (
                  <p className="text-white">
                    <span className="text-[#999]">Tipo detectado:</span> {result.detectedAuthType}
                  </p>
                )}
              </div>
            </div>

            {/* Teste de Conectividade */}
            {result.connectivityTest && (
              <div className={`p-4 rounded-lg border ${
                result.connectivityTest.success 
                  ? 'bg-green-500/10 border-green-500' 
                  : 'bg-red-500/10 border-red-500'
              }`}>
                <h3 className="text-white font-bold mb-2">
                  {result.connectivityTest.success ? '✅' : '❌'} Teste de Conectividade
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-white">
                    {result.connectivityTest.message}
                  </p>
                  {result.connectivityTest.status && (
                    <p className="text-white">
                      <span className="text-[#999]">Status:</span> {result.connectivityTest.status}
                    </p>
                  )}
                  {result.connectivityTest.error && (
                    <p className="text-red-400 text-xs mt-2">
                      Erro: {result.connectivityTest.error}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Recomendação */}
            {result.recommendation && (
              <div className="bg-blue-500/10 border border-blue-500 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2">💡 Recomendação</h3>
                <p className="text-white text-sm">{result.recommendation}</p>
              </div>
            )}

            {/* JSON Completo */}
            <details className="bg-black/50 p-4 rounded-lg border border-[#333]">
              <summary className="text-white font-bold cursor-pointer hover:text-red-600">
                🔍 Ver JSON Completo
              </summary>
              <pre className="text-sm text-white overflow-auto mt-4 p-2 bg-black/50 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
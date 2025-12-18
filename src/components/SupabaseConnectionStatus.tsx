/**
 * Supabase Connection Status Component
 * 
 * Visual component that shows the Supabase connection status
 * Useful for debugging and development
 */

import React, { useEffect, useState } from 'react';
import { testSupabaseConnection, ConnectionTestResult } from '../utils/testSupabaseConnection';

interface SupabaseConnectionStatusProps {
  /** Show in compact mode */
  compact?: boolean;
  /** Auto-hide after successful connection */
  autoHide?: boolean;
  /** Delay before auto-hide (ms) */
  autoHideDelay?: number;
}

export function SupabaseConnectionStatus({ 
  compact = false, 
  autoHide = false,
  autoHideDelay = 3000 
}: SupabaseConnectionStatusProps) {
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    runTest();
  }, []);

  useEffect(() => {
    if (autoHide && result?.success) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, result]);

  const runTest = async () => {
    setLoading(true);
    try {
      const testResult = await testSupabaseConnection();
      setResult(testResult);
    } catch (error) {
      console.error('Error testing connection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
        <div className="flex items-center space-x-3">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          <span>Testando conexão com Supabase...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  if (compact) {
    return (
      <div 
        className={`fixed bottom-4 right-4 p-3 rounded-lg shadow-lg z-50 ${
          result.success ? 'bg-green-600' : 'bg-red-600'
        } text-white`}
      >
        <div className="flex items-center space-x-2">
          <span>{result.success ? '✅' : '❌'}</span>
          <span className="text-sm font-medium">
            {result.success ? 'Supabase Conectado' : 'Erro de Conexão'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-6 rounded-lg shadow-xl z-50 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center space-x-2">
          <span>{result.success ? '✅' : '❌'}</span>
          <span>Status do Supabase</span>
        </h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Message */}
      <p className={`mb-4 text-sm ${result.success ? 'text-green-300' : 'text-red-300'}`}>
        {result.message}
      </p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <DetailItem 
          label="Variáveis de Ambiente"
          status={result.details.envVarsConfigured}
        />
        <DetailItem 
          label="Cliente Inicializado"
          status={result.details.clientInitialized}
        />
        <DetailItem 
          label="API Acessível"
          status={result.details.apiAccessible}
        />
        <DetailItem 
          label="Serviço de Autenticação"
          status={result.details.authServiceWorking}
        />
      </div>

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className="bg-red-900 bg-opacity-50 p-3 rounded mb-4">
          <p className="text-xs font-semibold mb-2">Erros:</p>
          <ul className="text-xs space-y-1">
            {result.errors.map((error, index) => (
              <li key={index} className="text-red-200">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={runTest}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded transition-colors"
        >
          🔄 Testar Novamente
        </button>
        <button
          onClick={() => setVisible(false)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-300">{label}</span>
      <span className={status ? 'text-green-400' : 'text-red-400'}>
        {status ? '✓ OK' : '✗ Falhou'}
      </span>
    </div>
  );
}

/**
 * Developer-only connection status badge (shows only in development)
 */
export function DevConnectionBadge() {
  if (!import.meta.env.DEV) {
    return null;
  }

  return <SupabaseConnectionStatus compact autoHide autoHideDelay={5000} />;
}

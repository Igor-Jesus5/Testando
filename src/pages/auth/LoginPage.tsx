// ============================================================================
// MES Plastico — Login Page (PIN Entry)
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, ShieldAlert } from 'lucide-react';
import { operators } from '../../data/mockData';

const PIN_LENGTH = 4;

export default function LoginPage() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOperatorList, setShowOperatorList] = useState(false);

  const handleDigit = useCallback((digit: string) => {
    if (pin.length >= PIN_LENGTH) return;
    setError(false);
    setPin((prev) => prev + digit);
  }, [pin.length]);

  const handleBackspace = useCallback(() => {
    setError(false);
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setError(false);
    setPin('');
  }, []);

  // Attempt login when PIN reaches required length
  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    const timer = setTimeout(() => {
      const user = operators.find((op) => op.pin === pin);

      if (!user) {
        setError(true);
        setTimeout(() => setPin(''), 500);
        return;
      }

      // If an operator was selected, verify the PIN matches
      if (selectedOperatorId && user.id !== selectedOperatorId) {
        setError(true);
        setTimeout(() => setPin(''), 500);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        switch (user.role) {
          case 'operator':
          case 'preparer':
            if (user.sector === 'extrusion') navigate('/tablet/extrusion');
            else if (user.sector === 'printing') navigate('/tablet/printing');
            else navigate('/tablet/cutting');
            break;
          case 'supervisor':
            navigate('/supervisor');
            break;
          case 'owner':
            navigate('/executive');
            break;
          default:
            navigate('/tablet/cutting');
        }
      }, 600);
    }, 200);

    return () => clearTimeout(timer);
  }, [pin, selectedOperatorId, navigate]);

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

  return (
    <div className="min-h-dvh bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fadeIn">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 mb-4 shadow-lg shadow-blue-500/20">
            <Factory className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">MES Plastico</h1>
          <p className="text-slate-400 mt-1 text-sm">Sistema de Execução de Manufatura</p>
        </div>

        {/* Operator Selector */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowOperatorList(!showOperatorList)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 transition-all duration-200 hover:border-slate-600 active:scale-[0.98]"
          >
            <span>
              {selectedOperatorId
                ? operators.find((o) => o.id === selectedOperatorId)?.name ?? 'Selecionar operador'
                : 'Selecionar operador (opcional)'}
            </span>
            <svg className={`w-4 h-4 transition-transform duration-200 ${showOperatorList ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showOperatorList && (
            <div className="mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden animate-slideDown max-h-48 overflow-y-auto">
              <button
                type="button"
                onClick={() => { setSelectedOperatorId(''); setShowOperatorList(false); }}
                className="w-full px-4 py-3 text-left text-sm text-slate-400 hover:bg-slate-700 transition-colors duration-150"
              >
                Nenhum (digitar apenas PIN)
              </button>
              {operators.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => { setSelectedOperatorId(op.id); setShowOperatorList(false); }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 flex items-center justify-between ${
                    selectedOperatorId === op.id ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{op.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{op.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 mb-8">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                error
                  ? 'border-red-500 bg-red-500 animate-[shake_0.4s_ease-in-out]'
                  : success
                    ? 'border-green-500 bg-green-500'
                    : i < pin.length
                      ? 'border-blue-500 bg-blue-500 scale-110'
                      : 'border-slate-600 bg-transparent'
              }`}
              style={i < pin.length && !error && !success ? { animationDelay: `${i * 50}ms` } : undefined}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center justify-center gap-2 mb-4 text-red-400 text-sm animate-fadeIn">
            <ShieldAlert className="w-4 h-4" />
            <span>PIN incorreto. Tente novamente.</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="flex items-center justify-center gap-2 mb-4 text-green-400 text-sm animate-fadeIn">
            <span>Autenticado com sucesso!</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {digits.map((digit, idx) => {
            if (digit === '') {
              return <div key={idx} />;
            }
            if (digit === 'back') {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={handleBackspace}
                  onDoubleClick={handleClear}
                  disabled={success}
                  className="min-h-16 min-w-16 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-lg font-semibold transition-all duration-150 hover:bg-slate-700 active:scale-95 disabled:opacity-40 flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H21a1 1 0 011 1v12a1 1 0 01-1 1H10.828a2 2 0 01-1.414-.586L3 12z" />
                  </svg>
                </button>
              );
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDigit(digit)}
                disabled={success || pin.length >= PIN_LENGTH}
                className="min-h-16 min-w-16 rounded-xl bg-slate-800 border border-slate-700 text-white text-2xl font-semibold transition-all duration-150 hover:bg-slate-700 active:scale-95 disabled:opacity-40"
              >
                {digit}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-slate-600 mt-8">
          Dica: PIN operador 1234 · supervisor 1111 · proprietário 0000
        </p>
      </div>

      {/* Shake animation keyframes (injected via style) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

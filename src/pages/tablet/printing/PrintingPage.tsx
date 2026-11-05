// ============================================================================
// MES Plastico — Printing Tablet Page
// ============================================================================

import { useState, useCallback } from 'react';
import {
  QrCode, Palette, Zap, FlaskConical, Weight,
  Wrench, PhoneCall, ShieldCheck, CheckCircle2,
  AlertTriangle, ScanLine, X
} from 'lucide-react';
import { productionOrders, machines, bobbins, operators } from '../../../data/mockData';
import { formatWeight, cn } from '../../../utils/helpers';
import type { MachineStatus, AndonCallType, Machine } from '../../../types';

const machine: Machine = machines.find((m: Machine) => m.id === 'im-01')!;
const op = productionOrders[3]; // OP with printing (Pantone 485C + 287C)
const operator = operators[4];

function StatusBanner({ status }: { status: MachineStatus }) {
  const colorMap: Record<MachineStatus, string> = {
    producing: 'bg-green-500',
    setup: 'bg-yellow-500',
    stopped: 'bg-red-500',
    support: 'bg-blue-500',
    idle: 'bg-slate-500',
  };
  const labelMap: Record<MachineStatus, string> = {
    producing: 'PRODUZINDO',
    setup: 'SETUP',
    stopped: 'PARADA',
    support: 'CHAMADO',
    idle: 'OCIOSA',
  };
  return (
    <div className={cn('w-full py-3 px-4 flex items-center justify-between rounded-xl text-white font-bold text-sm tracking-wider', colorMap[status])}>
      <span className="flex items-center gap-2">
        <span className="w-3 h-3 bg-white/30 rounded-full animate-pulse" />
        {labelMap[status]}
      </span>
      <span className="text-white/80 font-medium">{machine.code} — {machine.name}</span>
    </div>
  );
}

export default function PrintingPage() {
  const [machineStatus, setMachineStatus] = useState<MachineStatus>(machine.status);
  const [qrScanInput, setQrScanInput] = useState('');
  const [loadedBobbin, setLoadedBobbin] = useState<typeof bobbins[0] | null>(null);
  const [coronaPass, setCoronaPass] = useState<boolean | null>(null);
  const [inkPass, setInkPass] = useState<boolean | null>(null);
  const [trimWeight, setTrimWeight] = useState('');
  const [showTrimKeypad, setShowTrimKeypad] = useState(false);
  const [andonActive, setAndonActive] = useState<AndonCallType | null>(null);
  const [metersProduced, setMetersProduced] = useState(1200);

  const handleScanBobbin = useCallback(() => {
    const found = bobbins.find((b: any) => b.qrCode === qrScanInput);
    if (found) {
      setLoadedBobbin(found);
    } else if (qrScanInput.length > 0) {
      // Simulate loading first available bobbin
      setLoadedBobbin(bobbins[0]);
    }
    setQrScanInput('');
  }, [qrScanInput]);

  const handleAndonCall = useCallback((type: AndonCallType) => {
    setAndonActive(type);
    setMachineStatus('support');
    setTimeout(() => {
      setAndonActive(null);
      setMachineStatus('producing');
    }, 3000);
  }, []);

  const handleTrimKeypadDigit = useCallback((digit: string) => {
    setTrimWeight((prev) => {
      if (digit === '.' && prev.includes('.')) return prev;
      if (prev.length >= 6) return prev;
      return prev + digit;
    });
  }, []);

  const handleSaveTrim = useCallback(() => {
    if (!trimWeight) return;
    setMetersProduced((prev) => prev + 50);
    setShowTrimKeypad(false);
    setTrimWeight('');
  }, [trimWeight]);

  const pantoneColors = op.technicalSheet.color?.split('/') ?? ['—'];

  return (
    <div className="min-h-dvh bg-slate-900 p-4 pb-32 animate-fadeIn">
      {/* Status Banner */}
      <StatusBanner status={machineStatus} />

      {/* Operator info */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
          {operator.name.charAt(0)}
        </span>
        <span>{operator.name} — Turno Noite</span>
      </div>

      {/* QR Code Scanner */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4 animate-slideUp">
        <div className="flex items-center gap-2 mb-3">
          <ScanLine className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-white">Leitura da Bobina (Extrusão)</h3>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={qrScanInput}
            onChange={(e) => setQrScanInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScanBobbin()}
            placeholder="Escanear QR Code da bobina..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
          <button
            type="button"
            onClick={handleScanBobbin}
            className="min-w-16 px-4 bg-green-600 hover:bg-green-500 active:scale-95 text-white rounded-lg transition-all duration-150"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Loaded Bobbin Info */}
      {loadedBobbin && (
        <div className="mt-4 bg-slate-800 border border-green-500/30 rounded-xl p-4 animate-scaleIn">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Bobina Carregada
            </h3>
            <button
              type="button"
              onClick={() => setLoadedBobbin(null)}
              className="w-6 h-6 rounded-full hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-2 text-center">
              <p className="text-[10px] text-slate-400 uppercase">QR</p>
              <p className="text-xs font-bold text-white mt-0.5">{loadedBobbin.qrCode}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2 text-center">
              <p className="text-[10px] text-slate-400 uppercase">Peso</p>
              <p className="text-xs font-bold text-white mt-0.5">{formatWeight(loadedBobbin.grossWeight ?? 0)}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-2 text-center">
              <p className="text-[10px] text-slate-400 uppercase">Largura</p>
              <p className="text-xs font-bold text-white mt-0.5">{loadedBobbin.width} mm</p>
            </div>
          </div>
        </div>
      )}

      {/* OP Info + Pantone */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4" style={{ animationDelay: '50ms' }}>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ordem de Produção</p>
        <h2 className="text-lg font-bold text-white mt-0.5">{op.number}</h2>
        <p className="text-sm text-slate-300 mt-1">{op.product}</p>
        <p className="text-xs text-blue-400 mt-1">{op.client?.name}</p>

        {/* Pantone Reference */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Referência Pantone</h4>
          </div>
          <div className="flex gap-2">
            {pantoneColors.map((color: any, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2">
                <div
                  className="w-6 h-6 rounded-md border border-slate-600"
                  style={{
                    backgroundColor: color.trim().toLowerCase().includes('vermelho')
                      ? '#EF4444'
                      : color.trim().toLowerCase().includes('azul')
                        ? '#3B82F6'
                        : '#94A3B8',
                  }}
                />
                <span className="text-sm text-white font-medium">{color.trim()}</span>
              </div>
            ))}
          </div>
          {op.technicalSheet.formulation?.pigment && (
            <p className="text-xs text-slate-500 mt-2">Pigmento: {op.technicalSheet.formulation.pigment}</p>
          )}
        </div>

        {/* Speed indicator */}
        <div className="mt-4 flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{machine.metrics?.metersPerMinute ?? 0}</p>
            <p className="text-[10px] text-slate-400 uppercase">m/min</p>
          </div>
          <div className="h-8 w-px bg-slate-600" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{metersProduced}</p>
            <p className="text-[10px] text-slate-400 uppercase">metros total</p>
          </div>
        </div>
      </div>

      {/* Quality Tests */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4" style={{ animationDelay: '100ms' }}>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-400" />
          Testes de Qualidade
        </h3>

        {/* Corona Treatment */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg mb-3">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm text-white font-medium">Tratamento Corona</p>
              <p className="text-xs text-slate-400">38–42 dynas</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCoronaPass(true)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95',
                coronaPass === true
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              )}
            >
              Aprovado
            </button>
            <button
              type="button"
              onClick={() => setCoronaPass(false)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95',
                coronaPass === false
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              )}
            >
              Reprovado
            </button>
          </div>
        </div>

        {/* Ink Anchorage Test */}
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-white font-medium">Ancoragem de Tinta</p>
              <p className="text-xs text-slate-400">Teste de fita adesiva</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInkPass(true)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95',
                inkPass === true
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              )}
            >
              Aprovado
            </button>
            <button
              type="button"
              onClick={() => setInkPass(false)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95',
                inkPass === false
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              )}
            >
              Reprovado
            </button>
          </div>
        </div>

        {/* Results summary */}
        {(coronaPass !== null || inkPass !== null) && (
          <div className="mt-3 flex gap-2 animate-fadeIn">
            {coronaPass !== null && (
              <span className={cn('text-xs px-2 py-1 rounded-full font-medium', coronaPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                Corona: {coronaPass ? '✓ OK' : '✗ Falhou'}
              </span>
            )}
            {inkPass !== null && (
              <span className={cn('text-xs px-2 py-1 rounded-full font-medium', inkPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                Tinta: {inkPass ? '✓ OK' : '✗ Falhou'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Trim/Scrap Input */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4" style={{ animationDelay: '150ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white">Apara / Refugo</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowTrimKeypad(!showTrimKeypad)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-all duration-200 active:scale-95"
          >
            Registrar Peso
          </button>
        </div>

        {showTrimKeypad && (
          <div className="mt-4 animate-slideUp">
            <div className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-center mb-3">
              <span className="text-2xl font-bold text-white font-mono">{trimWeight || '0.0'}</span>
              <span className="text-sm text-slate-400 ml-2">Kg</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === '⌫') setTrimWeight((prev) => prev.slice(0, -1));
                    else handleTrimKeypadDigit(key);
                  }}
                  className="min-h-12 rounded-lg bg-slate-700 border border-slate-600 text-white text-lg font-semibold hover:bg-slate-600 active:scale-95 transition-all duration-150"
                >
                  {key}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveTrim}
              disabled={!trimWeight}
              className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all duration-200 active:scale-95"
            >
              Registrar Apara
            </button>
          </div>
        )}
      </div>

      {/* Andon Call Buttons */}
      <div className="mt-6">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Chamados Andon</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { type: 'preparer' as AndonCallType, label: 'Preparador', icon: Wrench, color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20' },
            { type: 'maintenance' as AndonCallType, label: 'Manutenção', icon: PhoneCall, color: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' },
            { type: 'quality' as AndonCallType, label: 'Qualidade', icon: ShieldCheck, color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' },
          ]).map((btn) => (
            <button
              key={btn.type}
              type="button"
              onClick={() => handleAndonCall(btn.type)}
              disabled={andonActive !== null}
              className={cn(
                'min-h-16 rounded-xl border p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 disabled:opacity-40',
                andonActive === btn.type ? 'bg-blue-600 border-blue-500 text-white animate-pulse' : btn.color
              )}
            >
              <btn.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{btn.label}</span>
            </button>
          ))}
        </div>
        {andonActive && (
          <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm animate-fadeIn">
            <AlertTriangle className="w-4 h-4" />
            <span>Chamado enviado! Aguarde atendimento...</span>
          </div>
        )}
      </div>
    </div>
  );
}

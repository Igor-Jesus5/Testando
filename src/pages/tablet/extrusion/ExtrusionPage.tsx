// ============================================================================
// MES Plastico — Extrusion Tablet Page
// ============================================================================

import { useState, useCallback } from 'react';
import {
  Thermometer, Weight, Package, QrCode,
  PhoneCall, Wrench, ShieldCheck, CheckCircle2,
  AlertTriangle, Layers
} from 'lucide-react';
import { productionOrders, machines, operators } from '../../../data/mockData';
import { formatNumber, formatWeight, cn } from '../../../utils/helpers';
import type { MachineStatus, AndonCallType, Machine } from '../../../types';

const machine: Machine = machines.find((m: Machine) => m.id === 'ex-01')!;
const op = productionOrders[0];
const operator = operators[0];
const formulation = op.technicalSheet.formulation!;
const temperatures = op.technicalSheet.temperatures!;

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

export default function ExtrusionPage() {
  const [machineStatus, setMachineStatus] = useState<MachineStatus>(machine.status);
  const [lotCode, setLotCode] = useState('');
  const [showBobbinModal, setShowBobbinModal] = useState(false);
  const [bobbinWeight, setBobbinWeight] = useState('');
  const [bobbinQr, setBobbinQr] = useState('');
  const [bobbinSaved, setBobbinSaved] = useState(false);
  const [andonActive, setAndonActive] = useState<AndonCallType | null>(null);
  const [kgProduced, setKgProduced] = useState(580);

  const handleAndonCall = useCallback((type: AndonCallType) => {
    setAndonActive(type);
    setMachineStatus('support');
    setTimeout(() => {
      setAndonActive(null);
      setMachineStatus('producing');
    }, 3000);
  }, []);

  const handleSaveBobbin = useCallback(() => {
    if (!bobbinWeight) return;
    setKgProduced((prev) => prev + parseFloat(bobbinWeight || '0'));
    setBobbinSaved(true);
    setTimeout(() => {
      setBobbinSaved(false);
      setShowBobbinModal(false);
      setBobbinWeight('');
      setBobbinQr('');
    }, 1500);
  }, [bobbinWeight]);

  const handleKeypadDigit = useCallback((digit: string) => {
    setBobbinWeight((prev) => {
      if (digit === '.' && prev.includes('.')) return prev;
      if (prev.length >= 6) return prev;
      return prev + digit;
    });
  }, []);

  const maxTemp = Math.max(...temperatures.map((t: any) => t.value));

  return (
    <div className="min-h-dvh bg-slate-900 p-4 pb-32 animate-fadeIn">
      {/* Status Banner */}
      <StatusBanner status={machineStatus} />

      {/* Operator info */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
          {operator.name.charAt(0)}
        </span>
        <span>{operator.name} — Turno Manhã</span>
      </div>

      {/* OP Info Card */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4 animate-slideUp">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ordem de Produção</p>
            <h2 className="text-lg font-bold text-white mt-0.5">{op.number}</h2>
            <p className="text-sm text-slate-300 mt-1">{op.product}</p>
            <p className="text-xs text-blue-400 mt-1">{op.client?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Progresso</p>
            <p className="text-lg font-bold text-white">{formatNumber(kgProduced)} <span className="text-sm text-slate-400">Kg</span></p>
            <div className="mt-1 w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (kgProduced / op.plannedQuantity) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Meta: {formatNumber(op.plannedQuantity)} Kg</p>
          </div>
        </div>
      </div>

      {/* Formulation Table */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4" style={{ animationDelay: '50ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Formulação</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'PEBD', value: `${formulation.pebd}%`, color: 'bg-blue-500/20 text-blue-400' },
            { label: 'PEAD', value: `${formulation.pead}%`, color: 'bg-purple-500/20 text-purple-400' },
            { label: 'Linear', value: `${formulation.linear}%`, color: 'bg-cyan-500/20 text-cyan-400' },
            { label: 'Pigmento', value: formulation.pigment ?? '—', color: 'bg-amber-500/20 text-amber-400' },
            { label: 'EVA', value: `${formulation.eva}%`, color: 'bg-green-500/20 text-green-400' },
          ].map((item) => (
            <div key={item.label} className={cn('rounded-lg p-3 text-center', item.color)}>
              <p className="text-[10px] uppercase tracking-wider opacity-80">{item.label}</p>
              <p className="text-sm font-bold mt-1 truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Zones */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">Temperaturas (°C)</h3>
        </div>
        <div className="space-y-2">
          {temperatures.map((temp: any) => {
            const pct = (temp.value / (maxTemp + 20)) * 100;
            return (
              <div key={temp.zone} className="flex items-center gap-3">
                <span className="w-8 text-xs text-slate-400 font-mono">{temp.zone}</span>
                <div className="flex-1 h-6 bg-slate-700 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, #F97316, #EF4444)`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-bold text-white drop-shadow-md">
                    {temp.value}°C
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw material lot code */}
      <div className="mt-4 bg-slate-800 border border-slate-700 rounded-xl p-4" style={{ animationDelay: '150ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <QrCode className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-white">Lote Matéria-Prima</h3>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={lotCode}
            onChange={(e) => setLotCode(e.target.value)}
            placeholder="Escanear ou digitar código do lote..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
          <button
            type="button"
            onClick={() => setLotCode('LOTE-PEBD-2026-0847')}
            className="min-w-16 px-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg text-sm font-medium transition-all duration-150"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>
        {lotCode && (
          <div className="mt-2 flex items-center gap-2 text-green-400 text-xs animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lote registrado: {lotCode}</span>
          </div>
        )}
      </div>

      {/* Conclude Mother Bobbin Button */}
      <button
        type="button"
        onClick={() => setShowBobbinModal(true)}
        className="mt-4 w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 active:scale-[0.98] text-white font-bold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
      >
        <Package className="w-6 h-6" />
        Concluir Bobina Mãe
      </button>

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

      {/* Bobbin Modal */}
      {showBobbinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl p-6 animate-scaleIn">
            {bobbinSaved ? (
              <div className="text-center py-8 animate-fadeIn">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Bobina Registrada!</h3>
                <p className="text-slate-400 text-sm mt-2">{formatWeight(parseFloat(bobbinWeight))} — QR: {bobbinQr || 'Auto'}</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-white mb-1">Concluir Bobina Mãe</h3>
                <p className="text-sm text-slate-400 mb-4">Informe o peso bruto e código QR</p>

                {/* Weight input */}
                <div className="mb-4">
                  <label className="text-xs text-slate-400 mb-1 block">Peso Bruto (Kg)</label>
                  <div className="bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-center">
                    <span className="text-3xl font-bold text-white font-mono">
                      {bobbinWeight || '0.0'}
                    </span>
                    <span className="text-lg text-slate-400 ml-2">Kg</span>
                  </div>
                </div>

                {/* Mini numeric keypad */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (key === '⌫') setBobbinWeight((prev) => prev.slice(0, -1));
                        else handleKeypadDigit(key);
                      }}
                      className="min-h-12 rounded-lg bg-slate-700 border border-slate-600 text-white text-lg font-semibold hover:bg-slate-600 active:scale-95 transition-all duration-150"
                    >
                      {key}
                    </button>
                  ))}
                </div>

                {/* QR Code field */}
                <div className="mb-4">
                  <label className="text-xs text-slate-400 mb-1 block">Código QR (opcional)</label>
                  <input
                    type="text"
                    value={bobbinQr}
                    onChange={(e) => setBobbinQr(e.target.value)}
                    placeholder="Escanear QR Code..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowBobbinModal(false); setBobbinWeight(''); setBobbinQr(''); }}
                    className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-all duration-200 active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBobbin}
                    disabled={!bobbinWeight}
                    className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:hover:bg-green-600 text-white text-sm font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Weight className="w-4 h-4" />
                    Registrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

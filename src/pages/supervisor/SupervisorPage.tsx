// ============================================================================
// MES Plastico — Painel do Supervisor / Preparador (Por Setor Rigoroso)
// ============================================================================

import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  ShieldCheck,
  KeyRound,
  Filter
} from 'lucide-react';
import { machines, andonCalls, productionOrders, operators } from '../../data/mockData';
import { useToast } from '../../components/feedback/Toast';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import MachineCard from '../../components/industrial/MachineCard';
import { Sector, Machine, ProductionOrder, AndonCall } from '../../types';

export const SupervisorPage: React.FC = () => {
  const { addToast } = useToast();

  // Strict Sector Selector: Extrusão | Impressão | Corte e Solda
  const [selectedSector, setSelectedSector] = useState<Sector>('cutting');

  // Machines state (allows status changes like setup release)
  const [machineList, setMachineList] = useState<Machine[]>(machines);

  // Kanban OPs State
  const [orders, setOrders] = useState<ProductionOrder[]>(productionOrders);

  // Active Andon Calls
  const [activeCalls, setActiveCalls] = useState<AndonCall[]>(andonCalls);

  // Setup Release Modal State
  const [setupModal, setSetupModal] = useState<{
    isOpen: boolean;
    machine: Machine | null;
    pin: string;
    inspections: {
      initialSampleChecked: boolean;
      temperatureStabilized: boolean;
      clearanceApproved: boolean;
    };
  }>({
    isOpen: false,
    machine: null,
    pin: '',
    inspections: {
      initialSampleChecked: false,
      temperatureStabilized: false,
      clearanceApproved: false,
    },
  });

  // Filter items STRICTLY by selected sector
  const filteredMachines = machineList.filter((m) => m.sector === selectedSector);
  const filteredCalls = activeCalls.filter((c) => {
    const mach = machineList.find((m) => m.id === c.machineId);
    return mach?.sector === selectedSector;
  });
  const filteredOrders = orders.filter((o) => {
    if (selectedSector === 'extrusion') return o.technicalSheet.material?.includes('PE');
    if (selectedSector === 'printing') return o.technicalSheet.color !== 'Transparente';
    return true;
  });

  // Counters for the selected sector
  const countProducing = filteredMachines.filter((m) => m.status === 'producing').length;
  const countSetup = filteredMachines.filter((m) => m.status === 'setup').length;
  const countStopped = filteredMachines.filter((m) => m.status === 'stopped').length;
  const countSupport = filteredMachines.filter((m) => m.status === 'support').length;

  // Move OP in Kanban queue (reorder priority)
  const handleMovePriority = (orderId: string, direction: 'up' | 'down') => {
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return;

    const newOrders = [...orders];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;

    if (targetIdx >= 0 && targetIdx < newOrders.length) {
      const temp = newOrders[idx];
      newOrders[idx] = newOrders[targetIdx];
      newOrders[targetIdx] = temp;
      setOrders(newOrders);
      addToast({
        type: 'info',
        title: 'Fila de OPs Reordenada',
        message: `Prioridade da ${temp.number} atualizada no chão de fábrica.`,
      });
    }
  };

  // Open Setup Release Modal for machine in Setup (Yellow)
  const handleOpenSetupRelease = (machine: Machine) => {
    setSetupModal({
      isOpen: true,
      machine,
      pin: '',
      inspections: {
        initialSampleChecked: false,
        temperatureStabilized: false,
        clearanceApproved: false,
      },
    });
  };

  // Confirm Setup Release with Preparer PIN
  const handleConfirmSetupRelease = () => {
    // Validate PIN (Roberto Almeida / Preparador PIN is '6789' or Fernanda '1111')
    if (setupModal.pin !== '6789' && setupModal.pin !== '1111') {
      addToast({
        type: 'error',
        title: 'PIN de Preparador Inválido',
        message: 'Digite o PIN correto do Preparador ou Supervisor para liberar o setup.',
      });
      return;
    }

    if (!setupModal.inspections.initialSampleChecked || !setupModal.inspections.temperatureStabilized || !setupModal.inspections.clearanceApproved) {
      addToast({
        type: 'warning',
        title: 'Checklist Incompleto',
        message: 'Marque todos os 3 itens de verificação técnica antes da liberação.',
      });
      return;
    }

    if (!setupModal.machine) return;

    // Change status from setup (yellow) to producing (green)
    const targetId = setupModal.machine.id;
    setMachineList((prev) =>
      prev.map((m) => (m.id === targetId ? { ...m, status: 'producing' } : m))
    );

    setSetupModal((prev) => ({ ...prev, isOpen: false }));
    addToast({
      type: 'success',
      title: `Máquina ${setupModal.machine.code} Liberada!`,
      message: 'Status alterado de Setup (Amarelo) para Produzindo (Verde).',
    });
  };

  // Resolve Andon Call
  const handleResolveCall = (callId: string) => {
    setActiveCalls((prev) => prev.filter((c) => c.id !== callId));
    addToast({
      type: 'success',
      title: 'Chamado Andon Atendido',
      message: 'Operador notificado e cronômetro de parada encerrado.',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Sector Navigation Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-800 p-2.5 rounded-2xl border border-surface-700 shadow-md">
        <div className="flex items-center gap-1.5 p-1 bg-surface-900 rounded-xl border border-surface-700/80">
          <button
            onClick={() => setSelectedSector('extrusion')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              selectedSector === 'extrusion'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>🏗️ Extrusão (Filme)</span>
          </button>

          <button
            onClick={() => setSelectedSector('printing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              selectedSector === 'printing'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>🎨 Impressão & Rebob.</span>
          </button>

          <button
            onClick={() => setSelectedSector('cutting')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
              selectedSector === 'cutting'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>✂️ Corte e Solda</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 text-xs text-gray-400">
          <Filter className="h-3.5 w-3.5 text-blue-400" />
          <span>Visualizando exclusivamente máquinas de:</span>
          <strong className="text-white capitalize">
            {selectedSector === 'extrusion' ? 'Extrusão' : selectedSector === 'printing' ? 'Impressão' : 'Corte e Solda'}
          </strong>
        </div>
      </div>

      {/* Sector Status KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-surface-800 p-4 rounded-xl border-l-4 border-l-emerald-500 border border-surface-700">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Produzindo</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{countProducing}</div>
          <span className="text-[11px] text-gray-500">Operação normal em andamento</span>
        </div>

        <div className="bg-surface-800 p-4 rounded-xl border-l-4 border-l-amber-500 border border-surface-700">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Setup / Regulação</span>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{countSetup}</div>
          <span className="text-[11px] text-gray-500">Aguardando liberação com PIN</span>
        </div>

        <div className="bg-surface-800 p-4 rounded-xl border-l-4 border-l-rose-500 border border-surface-700">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Paradas Não Planejadas</span>
          <div className="text-2xl font-black text-rose-400 mt-1 font-mono">{countStopped}</div>
          <span className="text-[11px] text-gray-500">Defeito ou intervenção mecânica</span>
        </div>

        <div className="bg-surface-800 p-4 rounded-xl border-l-4 border-l-blue-500 border border-surface-700">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Chamados Andon</span>
          <div className="text-2xl font-black text-blue-400 mt-1 font-mono">{countSupport}</div>
          <span className="text-[11px] text-gray-500">Solicitações de ajuda no tablet</span>
        </div>
      </div>

      {/* Andon Calls Alerts for this sector */}
      {filteredCalls.length > 0 && (
        <Card className="bg-surface-800 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Chamados Andon Ativos no Setor ({filteredCalls.length})
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">Fila de atendimento prioritária</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-900 border border-surface-700 hover:border-blue-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="info" pulsingDot size="sm">
                      {call.machineId.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-bold text-white capitalize">
                      {call.type === 'preparer' ? 'Ajuste de Solda' : 'Manutenção'}
                    </span>
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> há {call.elapsedMinutes} min
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{call.description}</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleResolveCall(call.id)}
                  className="shrink-0 ml-3"
                >
                  <Check className="h-4 w-4 mr-1" /> Atender
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Grid of Machines in this Sector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            Máquinas do Setor ({filteredMachines.length})
          </h3>
          <span className="text-xs text-gray-400">Clique na máquina em Setup para liberar com PIN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMachines.map((mach) => (
            <div key={mach.id} className="relative group">
              <MachineCard
                machine={mach}
                onSelect={(m) => {
                  if (m.status === 'setup') {
                    handleOpenSetupRelease(m);
                  }
                }}
              />
              {mach.status === 'setup' && (
                <div className="mt-2">
                  <Button
                    variant="warning"
                    size="sm"
                    fullWidth
                    onClick={() => handleOpenSetupRelease(mach)}
                    className="font-bold flex items-center justify-center gap-2 shadow"
                  >
                    <KeyRound className="h-4 w-4" />
                    Liberar Setup com PIN
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Queue for OPs in this Sector */}
      <Card className="bg-surface-800 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-700/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Fila Kanban de Produção (Setor {selectedSector.toUpperCase()})
            </h3>
            <p className="text-xs text-gray-400">
              Reordene a prioridade das OPs para alterar a sequência automática exibida nos tablets dos operadores.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Aguardando */}
          <div className="space-y-3 bg-surface-900/60 p-3 rounded-xl border border-surface-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Aguardando Início</span>
              <Badge variant="neutral" size="sm">Fila</Badge>
            </div>
            {filteredOrders.filter(o => o.status === 'pending' || o.producedQuantity === 0).map((op, idx) => (
              <div key={op.id} className="p-3 rounded-lg bg-surface-800 border border-surface-700 space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-white">{op.number}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMovePriority(op.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded bg-surface-700 text-gray-300 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleMovePriority(op.id, 'down')}
                      className="p-1 rounded bg-surface-700 text-gray-300 hover:text-white"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{op.product}</div>
                <div className="text-[11px] font-mono text-gray-500">
                  Planejado: {op.plannedQuantity.toLocaleString('pt-BR')} un
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Em Produção */}
          <div className="space-y-3 bg-surface-900/60 p-3 rounded-xl border border-surface-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Em Produção Ativa</span>
              <Badge variant="success" size="sm" pulsingDot>Chão de Fábrica</Badge>
            </div>
            {filteredOrders.filter(o => o.status === 'in_progress').map((op) => (
              <div key={op.id} className="p-3 rounded-lg bg-surface-800 border border-emerald-500/30 space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-white">{op.number}</span>
                  <Badge variant="success" size="sm">Prioridade {op.priority}</Badge>
                </div>
                <div className="text-xs text-gray-300 font-medium">{op.product}</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>Progresso:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round((op.producedQuantity / op.plannedQuantity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${(op.producedQuantity / op.plannedQuantity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3: Concluídas / Inspecionadas */}
          <div className="space-y-3 bg-surface-900/60 p-3 rounded-xl border border-surface-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Concluídas do Turno</span>
              <Badge variant="info" size="sm">Finalizado</Badge>
            </div>
            <div className="p-3 rounded-lg bg-surface-800/60 border border-surface-700 space-y-1.5 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">OP 2884-0098</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-xs text-gray-400">Sacola PEAD 25x35 Alça Camiseta</div>
              <div className="text-[11px] text-emerald-400 font-mono">100.000 / 100.000 un (100%)</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ================= MODAL DE LIBERAÇÃO DE SETUP COM PIN ================= */}
      <Modal
        isOpen={setupModal.isOpen}
        onClose={() => setSetupModal((prev) => ({ ...prev, isOpen: false }))}
        title={`Liberação de Setup — Máquina ${setupModal.machine?.code || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
            A máquina só poderá iniciar a contagem oficial após a aprovação das primeiras amostras e confirmação com PIN do Preparador.
          </div>

          {/* Checklist técnico obrigatório */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-300 block">Checklist Técnico do Preparador:</span>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-900 border border-surface-700 cursor-pointer hover:border-gray-500">
              <input
                type="checkbox"
                checked={setupModal.inspections.initialSampleChecked}
                onChange={(e) =>
                  setSetupModal((prev) => ({
                    ...prev,
                    inspections: { ...prev.inspections, initialSampleChecked: e.target.checked },
                  }))
                }
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-white">Primeiras amostras inspecionadas e medidas em conformidade</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-900 border border-surface-700 cursor-pointer hover:border-gray-500">
              <input
                type="checkbox"
                checked={setupModal.inspections.temperatureStabilized}
                onChange={(e) =>
                  setSetupModal((prev) => ({
                    ...prev,
                    inspections: { ...prev.inspections, temperatureStabilized: e.target.checked },
                  }))
                }
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-white">Temperaturas e pressões de barramento estabilizadas</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-900 border border-surface-700 cursor-pointer hover:border-gray-500">
              <input
                type="checkbox"
                checked={setupModal.inspections.clearanceApproved}
                onChange={(e) =>
                  setSetupModal((prev) => ({
                    ...prev,
                    inspections: { ...prev.inspections, clearanceApproved: e.target.checked },
                  }))
                }
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-white">Área ao redor da máquina limpa e insumos conferidos</span>
            </label>
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-blue-400" />
              PIN do Preparador / Supervisor (4 dígitos)
            </label>
            <input
              type="password"
              maxLength={4}
              value={setupModal.pin}
              onChange={(e) => setSetupModal((prev) => ({ ...prev, pin: e.target.value }))}
              placeholder="Digite o PIN (ex: 6789)"
              className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-center text-white text-xl font-mono tracking-widest font-bold"
            />
            <span className="text-[11px] text-gray-400 text-center block">
              Dica de teste: Roberto Preparador (PIN 6789) ou Fernanda Supervisor (PIN 1111)
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-surface-700 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setSetupModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirmSetupRelease}
            >
              Confirmar e Liberar Máquina
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupervisorPage;

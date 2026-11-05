// ============================================================================
// MES Plastico — Setor 3: CORTE E SOLDA (Módulo Detalhado do Chão de Fábrica)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Wrench,
  ShieldCheck,
  Scale,
  Plus,
  Play,
  Pause,
  Layers,
  ArrowRightLeft,
  XCircle,
  FileSpreadsheet,
  Gauge
} from 'lucide-react';
import { machines, productionOrders, bobbins } from '../../../data/mockData';
import { useToast } from '../../../components/feedback/Toast';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Toggle from '../../../components/ui/Toggle';
import ProgressBar from '../../../components/ui/ProgressBar';
import NumericKeypad from '../../../components/industrial/NumericKeypad';
import AndonStatus from '../../../components/industrial/AndonStatus';
import CounterDisplay from '../../../components/industrial/CounterDisplay';
import { MachineStatus, QualityInspection, InspectionStage, TrackMode } from '../../../types';

export const CuttingPage: React.FC = () => {
  const { addToast } = useToast();

  // Machine state (CS-01 default)
  const [machineStatus, setMachineStatus] = useState<MachineStatus>('producing');
  const [trackMode, setTrackMode] = useState<TrackMode>('double');
  const [speedGolpes, setSpeedGolpes] = useState(48); // 48 golpes/min
  const [activeCall, setActiveCall] = useState<string | null>(null);

  // Bobbin 1 State
  const [bobbin1, setBobbin1] = useState({
    id: 'BB-2026-001',
    opNumber: 'OP 2885-0001',
    product: 'Sacola PEBD 30x40 Transparente',
    client: 'Sacaria Soares Ltda',
    weightRemainingKg: 42.5,
    packagesCount: 42,
    inspectionsDone: ['start'] as InspectionStage[],
    hasQualityAlert: false,
    isActive: true,
  });

  // Bobbin 2 State (Independent in Pista Dupla)
  const [bobbin2, setBobbin2] = useState({
    id: 'BB-2026-002',
    opNumber: 'OP 2885-0004',
    product: 'Sacaria Soares 40x50 Impressa',
    client: 'Sacaria Soares Ltda',
    weightRemainingKg: 58.0,
    packagesCount: 15,
    inspectionsDone: ['start'] as InspectionStage[],
    hasQualityAlert: false,
    isActive: true,
  });

  // Modals & Keypads
  const [keypadConfig, setKeypadConfig] = useState<{
    isOpen: boolean;
    title: string;
    target: 'op1' | 'op2' | 'scrap' | 'width' | 'thickness';
    unit?: string;
  }>({
    isOpen: false,
    title: '',
    target: 'scrap',
  });

  // Quality Inspection Checklist Modal State
  const [inspectionModal, setInspectionModal] = useState<{
    isOpen: boolean;
    bobbinNumber: 1 | 2;
    stage: InspectionStage;
    width: number;
    mouthOpen: boolean;
    sealApproved: boolean;
    tractionApproved: boolean;
    thicknessVariation: number;
  }>({
    isOpen: false,
    bobbinNumber: 1,
    stage: 'middle',
    width: 240,
    mouthOpen: true,
    sealApproved: true,
    tractionApproved: true,
    thicknessVariation: 0.002,
  });

  // Scrap Entry Modal
  const [scrapModal, setScrapModal] = useState({
    isOpen: false,
    weightKg: 4.5,
    reason: 'Solda lateral fraca',
  });

  // Calculated Real-Time Speed (Sacos por minuto)
  const multiplier = trackMode === 'double' ? 2 : 1;
  const bagsPerMinute = speedGolpes * multiplier;
  const totalPackages = bobbin1.packagesCount + (trackMode === 'double' ? bobbin2.packagesCount : 0);
  const totalUnits = totalPackages * 500;

  // Add 1 Package (+500 units) to Bobbin 1 or 2
  const handleAddPackage = (bobbinNum: 1 | 2) => {
    if (bobbinNum === 1) {
      const nextCount = bobbin1.packagesCount + 1;
      setBobbin1((prev) => ({
        ...prev,
        packagesCount: nextCount,
        weightRemainingKg: Math.max(0, Number((prev.weightRemainingKg - 1.2).toFixed(1))),
      }));

      // Trigger Middle Inspection if at 25 packages
      if (nextCount === 25 && !bobbin1.inspectionsDone.includes('middle')) {
        triggerInspection(1, 'middle');
      }
    } else {
      const nextCount = bobbin2.packagesCount + 1;
      setBobbin2((prev) => ({
        ...prev,
        packagesCount: nextCount,
        weightRemainingKg: Math.max(0, Number((prev.weightRemainingKg - 1.2).toFixed(1))),
      }));

      if (nextCount === 25 && !bobbin2.inspectionsDone.includes('middle')) {
        triggerInspection(2, 'middle');
      }
    }

    addToast({
      type: 'success',
      title: `+1 Pacote Registrado (Bobina ${bobbinNum})`,
      message: '500 unidades contabilizadas no banco local do tablet.',
      duration: 2000,
    });
  };

  // Trigger Mandatory Quality Inspection
  const triggerInspection = (bobbinNum: 1 | 2, stage: InspectionStage) => {
    setInspectionModal({
      isOpen: true,
      bobbinNumber: bobbinNum,
      stage,
      width: 240,
      mouthOpen: true,
      sealApproved: true,
      tractionApproved: true,
      thicknessVariation: 0.002,
    });
  };

  // Submit Inspection Result
  const handleSaveInspection = () => {
    const isApproved =
      inspectionModal.sealApproved &&
      inspectionModal.tractionApproved &&
      Math.abs(inspectionModal.width - 240) <= 5 &&
      inspectionModal.mouthOpen;

    const bNum = inspectionModal.bobbinNumber;
    const updateTarget = bNum === 1 ? setBobbin1 : setBobbin2;

    updateTarget((prev) => ({
      ...prev,
      inspectionsDone: [...prev.inspectionsDone, inspectionModal.stage],
      hasQualityAlert: !isApproved,
    }));

    setInspectionModal((prev) => ({ ...prev, isOpen: false }));

    if (isApproved) {
      addToast({
        type: 'success',
        title: `Inspeção ${inspectionModal.stage.toUpperCase()} Aprovada`,
        message: `Bobina ${bNum} liberada. Parâmetros técnicos conformes com a OP.`,
      });
    } else {
      addToast({
        type: 'error',
        title: `⚠️ LOTE SUSPEITO — Reprovação na Bobina ${bNum}`,
        message: 'Alerta crítico enviado imediatamente ao Supervisor e Gestão de Qualidade!',
        duration: 7000,
      });
    }
  };

  // Submit Scrap Entry
  const handleSaveScrap = () => {
    setScrapModal((prev) => ({ ...prev, isOpen: false }));
    addToast({
      type: 'warning',
      title: 'Refugo Apontado com Sucesso',
      message: `${scrapModal.weightKg} Kg de sucata registrados (${scrapModal.reason}).`,
    });
  };

  // Andon Calls
  const triggerAndonCall = (type: 'preparer' | 'maintenance' | 'quality') => {
    const labels = {
      preparer: 'Preparador de Máquina',
      maintenance: 'Manutenção Mecânica/Elétrica',
      quality: 'Inspetor de Qualidade',
    };
    setActiveCall(type);
    setMachineStatus('support');
    addToast({
      type: 'info',
      title: `Chamado Andon Aberto: ${labels[type]}`,
      message: 'Tablet em status AZUL. Tempo decorrido transmitido ao Painel do Supervisor.',
      duration: 5000,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn select-none">
      {/* Top Machine Status & Track Toggle Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-surface-800 p-4 rounded-2xl border border-surface-700 shadow-xl">
        <div className="lg:col-span-4 flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
              Máquina Selecionada
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">CS-01</span>
              <span className="text-xs px-2 py-0.5 rounded bg-surface-700 text-gray-300 font-mono">
                IP: 192.168.1.101
              </span>
            </div>
          </div>
          <AndonStatus
            status={machineStatus}
            onStatusChange={(newStatus) => setMachineStatus(newStatus)}
            size="md"
          />
        </div>

        {/* Real-Time Speed & Multiplier */}
        <div className="lg:col-span-4 flex items-center justify-around bg-surface-900/80 p-3 rounded-xl border border-surface-700">
          <div className="text-center">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Golpes do Canhão</span>
            <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
              <Gauge className="h-4 w-4" /> {speedGolpes} <span className="text-xs text-gray-500">cpm</span>
            </div>
          </div>
          <div className="h-8 w-px bg-surface-700"></div>
          <div className="text-center">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">Velocidade Efetiva</span>
            <div className="text-xl font-extrabold font-mono text-blue-400">
              {bagsPerMinute} <span className="text-xs text-gray-500">sacos/min</span>
            </div>
          </div>
        </div>

        {/* Track Mode Toggle (Pista Simples / Pista Dupla) */}
        <div className="lg:col-span-4 flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-300">Modo de Operação:</span>
            <div className="flex rounded-xl bg-surface-900 p-1 border border-surface-700">
              <button
                onClick={() => setTrackMode('single')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                  trackMode === 'single'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pista Simples (1x)
              </button>
              <button
                onClick={() => setTrackMode('double')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                  trackMode === 'double'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pista Dupla (2x)
              </button>
            </div>
          </div>
          <span className="text-[11px] text-gray-400">
            {trackMode === 'double'
              ? '⚡ Multiplicador 2x ativo: 2 sacos por ciclo do cabeçote'
              : '🔹 Pista simples: 1 bobina alimentada'}
          </span>
        </div>
      </div>

      {/* Main Production Cards: Bobina 1 & Bobina 2 */}
      <div className={`grid grid-cols-1 ${trackMode === 'double' ? 'lg:grid-cols-2' : ''} gap-5`}>
        {/* ================= BOBINA 1 CARD ================= */}
        <Card
          status={bobbin1.hasQualityAlert ? 'stopped' : 'producing'}
          className={`space-y-4 ${bobbin1.hasQualityAlert ? 'ring-2 ring-rose-500' : ''}`}
        >
          <div className="flex items-start justify-between border-b border-surface-700/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-extrabold text-xs tracking-wider border border-blue-500/30">
                  PISTA 1 • BOBINA A
                </span>
                <span className="text-xs font-mono text-gray-400">{bobbin1.id}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{bobbin1.opNumber}</h3>
              <p className="text-xs text-gray-400">{bobbin1.product} • {bobbin1.client}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setKeypadConfig({
                    isOpen: true,
                    title: 'Digitar Número da OP (Bobina 1)',
                    target: 'op1',
                  })
                }
              >
                <QrCode className="h-4 w-4 mr-1 text-blue-400" /> Trocar OP
              </Button>
            </div>
          </div>

          {/* Bobbin Progress & Remaining Material */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-surface-900/60 p-3 rounded-xl border border-surface-700/60">
            <div>
              <span className="text-[11px] text-gray-400 block">Material Restante</span>
              <span className="text-lg font-bold font-mono text-white">
                {bobbin1.weightRemainingKg} <span className="text-xs text-gray-500">Kg</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block">Pacotes Fechados</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {bobbin1.packagesCount} <span className="text-xs text-gray-500">pct</span>
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-gray-400 block">Total Unidades</span>
              <span className="text-lg font-bold font-mono text-blue-400">
                {(bobbin1.packagesCount * 500).toLocaleString('pt-BR')} <span className="text-xs text-gray-500">un</span>
              </span>
            </div>
          </div>

          {/* Mandatory 3x Quality Inspection Badges */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Checklist de Inspeção (Obrigatório 3x)
              </span>
              {bobbin1.hasQualityAlert && (
                <Badge variant="danger" size="sm">
                  REPROVADO / SUSPEITO
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['start', 'middle', 'end'] as InspectionStage[]).map((stage) => {
                const isDone = bobbin1.inspectionsDone.includes(stage);
                const labels = { start: '1. Início', middle: '2. Meio', end: '3. Fim' };
                return (
                  <button
                    key={stage}
                    onClick={() => triggerInspection(1, stage)}
                    className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-surface-900 border-surface-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-[11px] font-bold flex items-center justify-between">
                      {labels[stage]}
                      {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {isDone ? 'Conforme' : 'Pendente'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Touch "+1 Pacote" Button (Min 64x64px touch target) */}
          <div className="pt-2">
            <button
              onClick={() => handleAddPackage(1)}
              className="w-full min-h-16 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-98 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/40 transition-all border border-emerald-400/40"
            >
              <Plus className="h-6 w-6 stroke-[3]" />
              <span>+1 PACOTE (500 UNID.) • PISTA 1</span>
            </button>
          </div>
        </Card>

        {/* ================= BOBINA 2 CARD (Pista Dupla) ================= */}
        {trackMode === 'double' && (
          <Card
            status={bobbin2.hasQualityAlert ? 'stopped' : 'producing'}
            className={`space-y-4 ${bobbin2.hasQualityAlert ? 'ring-2 ring-rose-500' : ''}`}
          >
            <div className="flex items-start justify-between border-b border-surface-700/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-xs tracking-wider border border-emerald-500/30">
                    PISTA 2 • BOBINA B
                  </span>
                  <span className="text-xs font-mono text-gray-400">{bobbin2.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{bobbin2.opNumber}</h3>
                <p className="text-xs text-gray-400">{bobbin2.product} • {bobbin2.client}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setKeypadConfig({
                      isOpen: true,
                      title: 'Digitar Número da OP (Bobina 2)',
                      target: 'op2',
                    })
                  }
                >
                  <QrCode className="h-4 w-4 mr-1 text-emerald-400" /> Trocar OP
                </Button>
              </div>
            </div>

            {/* Bobbin Progress & Remaining Material */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-surface-900/60 p-3 rounded-xl border border-surface-700/60">
              <div>
                <span className="text-[11px] text-gray-400 block">Material Restante</span>
                <span className="text-lg font-bold font-mono text-white">
                  {bobbin2.weightRemainingKg} <span className="text-xs text-gray-500">Kg</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block">Pacotes Fechados</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {bobbin2.packagesCount} <span className="text-xs text-gray-500">pct</span>
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[11px] text-gray-400 block">Total Unidades</span>
                <span className="text-lg font-bold font-mono text-blue-400">
                  {(bobbin2.packagesCount * 500).toLocaleString('pt-BR')} <span className="text-xs text-gray-500">un</span>
                </span>
              </div>
            </div>

            {/* Mandatory 3x Quality Inspection Badges */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Checklist de Inspeção (Obrigatório 3x)
                </span>
                {bobbin2.hasQualityAlert && (
                  <Badge variant="danger" size="sm">
                    REPROVADO / SUSPEITO
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['start', 'middle', 'end'] as InspectionStage[]).map((stage) => {
                  const isDone = bobbin2.inspectionsDone.includes(stage);
                  const labels = { start: '1. Início', middle: '2. Meio', end: '3. Fim' };
                  return (
                    <button
                      key={stage}
                      onClick={() => triggerInspection(2, stage)}
                      className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-surface-900 border-surface-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-[11px] font-bold flex items-center justify-between">
                        {labels[stage]}
                        {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {isDone ? 'Conforme' : 'Pendente'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Large Touch "+1 Pacote" Button */}
            <div className="pt-2">
              <button
                onClick={() => handleAddPackage(2)}
                className="w-full min-h-16 py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 active:scale-98 text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-teal-900/40 transition-all border border-teal-400/40"
              >
                <Plus className="h-6 w-6 stroke-[3]" />
                <span>+1 PACOTE (500 UNID.) • PISTA 2</span>
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Bar: Apontamento de Refugo & Central de Chamados Andon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Scrap Entry Button */}
        <div className="lg:col-span-4">
          <Card className="flex flex-col justify-between h-full bg-surface-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-400" />
                Apontamento de Refugo / Sucata
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Registre o peso das aparas descartadas no corte ou desvios de solda.
              </p>
            </div>
            <div className="pt-4">
              <Button
                variant="warning"
                size="lg"
                fullWidth
                onClick={() => setScrapModal((prev) => ({ ...prev, isOpen: true }))}
                className="min-h-14 font-bold"
              >
                <Scale className="h-5 w-5 mr-2" />
                Lançar Refugo (Kg)
              </Button>
            </div>
          </Card>
        </div>

        {/* Andon Fast Call Buttons (Universal Industrial Standard) */}
        <div className="lg:col-span-8">
          <Card className="bg-surface-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-400" />
                  Central de Chamados Andon (Chão de Fábrica)
                </h4>
                <p className="text-xs text-gray-400">
                  Acione suporte imediato. A máquina entrará em status Azul e alertará o Supervisor.
                </p>
              </div>
              {activeCall && (
                <Badge variant="info" pulsingDot>
                  Chamado Ativo: {activeCall.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <Button
                variant="info"
                size="xl"
                className="min-h-16 text-sm font-extrabold flex flex-col items-center justify-center gap-1 shadow-md"
                onClick={() => triggerAndonCall('preparer')}
              >
                <Wrench className="h-5 w-5" />
                <span>CHAMAR PREPARADOR</span>
              </Button>

              <Button
                variant="danger"
                size="xl"
                className="min-h-16 text-sm font-extrabold flex flex-col items-center justify-center gap-1 shadow-md"
                onClick={() => triggerAndonCall('maintenance')}
              >
                <RotateCcw className="h-5 w-5" />
                <span>CHAMAR MANUTENÇÃO</span>
              </Button>

              <Button
                variant="outline"
                size="xl"
                className="min-h-16 text-sm font-extrabold flex flex-col items-center justify-center gap-1 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10 shadow-md"
                onClick={() => triggerAndonCall('quality')}
              >
                <ShieldCheck className="h-5 w-5" />
                <span>CHAMAR QUALIDADE</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ================= MODAL DE INSPEÇÃO DE QUALIDADE ================= */}
      <Modal
        isOpen={inspectionModal.isOpen}
        onClose={() => setInspectionModal((prev) => ({ ...prev, isOpen: false }))}
        title={`Inspeção Periódica de Qualidade — Bobina ${inspectionModal.bobbinNumber}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
            Etapa Atual: <strong>{inspectionModal.stage === 'start' ? 'Início da Bobina' : inspectionModal.stage === 'middle' ? 'Meio da Bobina' : 'Final da Bobina'}</strong>.
            Realize as aferições com paquímetro e teste de tração manual.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Largura Medida */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Largura Medida (mm)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inspectionModal.width}
                  onChange={(e) =>
                    setInspectionModal((prev) => ({ ...prev, width: Number(e.target.value) }))
                  }
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-white font-mono text-lg font-bold"
                />
                <span className="text-xs text-gray-400">Meta: 240 ± 5mm</span>
              </div>
            </div>

            {/* Variação de Espessura */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">Variação Espessura (mm)</label>
              <input
                type="number"
                step="0.001"
                value={inspectionModal.thicknessVariation}
                onChange={(e) =>
                  setInspectionModal((prev) => ({ ...prev, thicknessVariation: Number(e.target.value) }))
                }
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-white font-mono text-lg font-bold"
              />
            </div>
          </div>

          {/* Testes Pass/Fail */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-surface-700">
              <div>
                <div className="text-xs font-bold text-white">Teste de Abertura da Boca</div>
                <div className="text-[11px] text-gray-400">Filme sem colamento ou estática excessiva</div>
              </div>
              <Toggle
                checked={inspectionModal.mouthOpen}
                onChange={(val) => setInspectionModal((prev) => ({ ...prev, mouthOpen: val }))}
                labelRight={inspectionModal.mouthOpen ? 'Aprovado' : 'Colado'}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-900 border border-surface-700">
              <div>
                <div className="text-xs font-bold text-white">Resistência / Tração da Solda</div>
                <div className="text-[11px] text-gray-400">Solda não estala nem descola na tração</div>
              </div>
              <Toggle
                checked={inspectionModal.sealApproved}
                onChange={(val) => setInspectionModal((prev) => ({ ...prev, sealApproved: val }))}
                labelRight={inspectionModal.sealApproved ? 'Aprovada' : 'Reprovada'}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-surface-700 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setInspectionModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </Button>
            <Button variant="primary" size="lg" onClick={handleSaveInspection}>
              Salvar e Validar Inspeção
            </Button>
          </div>
        </div>
      </Modal>

      {/* ================= MODAL DE APONTAMENTO DE REFUGO ================= */}
      <Modal
        isOpen={scrapModal.isOpen}
        onClose={() => setScrapModal((prev) => ({ ...prev, isOpen: false }))}
        title="Lançamento de Refugo / Sucata"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Peso do Descarte (Kg)</label>
            <input
              type="number"
              step="0.1"
              value={scrapModal.weightKg}
              onChange={(e) => setScrapModal((prev) => ({ ...prev, weightKg: Number(e.target.value) }))}
              className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-white font-mono text-2xl font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300">Motivo do Defeito</label>
            <select
              value={scrapModal.reason}
              onChange={(e) => setScrapModal((prev) => ({ ...prev, reason: e.target.value }))}
              className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-white text-sm"
            >
              <option value="Solda lateral fraca">Solda lateral fraca</option>
              <option value="Desalinhamento da fotocélula">Desalinhamento da fotocélula</option>
              <option value="Filme com furo / enrugado">Filme com furo / enrugado</option>
              <option value="Aparas de início de bobina">Aparas de início de bobina</option>
              <option value="Boca colada">Boca colada</option>
            </select>
          </div>

          <div className="pt-3 border-t border-surface-700 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setScrapModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancelar
            </Button>
            <Button variant="warning" size="lg" onClick={handleSaveScrap}>
              Confirmar Refugo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pop-up Numeric Keypad */}
      <NumericKeypad
        isOpen={keypadConfig.isOpen}
        onClose={() => setKeypadConfig((prev) => ({ ...prev, isOpen: false }))}
        title={keypadConfig.title}
        unit={keypadConfig.unit}
        onConfirm={(val) => {
          if (keypadConfig.target === 'op1') {
            setBobbin1((prev) => ({ ...prev, opNumber: `OP ${val}` }));
          } else if (keypadConfig.target === 'op2') {
            setBobbin2((prev) => ({ ...prev, opNumber: `OP ${val}` }));
          }
          setKeypadConfig((prev) => ({ ...prev, isOpen: false }));
          addToast({
            type: 'info',
            title: 'Ficha Técnica Atualizada',
            message: `Dados da OP carregados com sucesso no tablet.`,
          });
        }}
      />
    </div>
  );
};

export default CuttingPage;

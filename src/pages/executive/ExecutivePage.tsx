// ============================================================================
// MES Plastico — Dashboard Executivo & Copiloto IA (Portal do Dono)
// ============================================================================

import React, { useState } from 'react';
import {
  BarChart3,
  Bot,
  Sparkles,
  Send,
  Cpu,
  Layers,
  TrendingUp,
  Scale,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  machines,
  shiftProductivity,
  massBalance,
  productionByHour,
  scrapByMachine,
  operators
} from '../../data/mockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Sector, Shift } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  anomalies?: string[];
}

export const ExecutivePage: React.FC = () => {
  // Productivity Table Filters
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [searchOperator, setSearchOperator] = useState<string>('');

  // AI Copilot Chat State
  const [inputQuestion, setInputQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Olá! Sou o Copiloto de Inteligência Artificial do MES Plástico. Analiso em tempo real os dados de extrusão, impressão e corte do seu chão de fábrica. Como posso auxiliar sua gestão hoje?',
      timestamp: '10:30',
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Group machines into the 3 sequential factory blocks
  const extrusionMachines = machines.filter((m) => m.sector === 'extrusion');
  const printingMachines = machines.filter((m) => m.sector === 'printing');
  const cuttingMachines = machines.filter((m) => m.sector === 'cutting');

  // Filtered Productivity Data
  const filteredProductivity = shiftProductivity.filter((row) => {
    const matchesSector = filterSector === 'all' || row.machine.sector === filterSector;
    const matchesShift = filterShift === 'all' || row.shift === filterShift;
    const matchesName = row.operator.name.toLowerCase().includes(searchOperator.toLowerCase());
    return matchesSector && matchesShift && matchesName;
  });

  // Handle AI Copilot Query
  const handleSendQuestion = (questionText?: string) => {
    const q = questionText || inputQuestion;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiResponse = '';
      let anomalies: string[] | undefined;

      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('resumo') || lowerQ.includes('dia') || lowerQ.includes('turno')) {
        aiResponse =
          '📊 **Resumo Gerencial do Turno 1:**\n' +
          '• Produção Total: 2.160 Kg de filme processado (92% da meta global).\n' +
          '• Eficiência média dos operadores: 91.2%.\n' +
          '• O corte CS-04 é o destaque com 110% de atingimento de meta.\n' +
          '• Ponto de Atenção: EX-04 com resistência da zona 3 oscilando, gerando 5.1% de refugo.';
        anomalies = ['Alerta de anomalia térmica detectado na EX-04 (zona Z3)'];
      } else if (lowerQ.includes('refugo') || lowerQ.includes('sucata') || lowerQ.includes('maior')) {
        aiResponse =
          '🔴 **Análise de Sucata e Refugo:**\n' +
          'A máquina com maior índice de refugo é a **EX-04 (Extrusão)**, com **25.5 Kg (5.1% do lote)**, causada por oscilação na resistência de aquecimento.\n' +
          'No setor de Corte, a **CS-02** registrou 12.1 Kg por falha pontual de solda.';
      } else if (lowerQ.includes('atrasar') || lowerQ.includes('op') || lowerQ.includes('cliente')) {
        aiResponse =
          '⏱️ **Previsão de Entrega de OPs:**\n' +
          '• **OP 2885-0001 (Sacaria Soares):** 42% concluída na CS-01. Previsão de término às 15:40 (dentro do prazo SLA).\n' +
          '• **OP 2885-0004 (Sacaria Soares Impressa):** Atraso estimado de 25 min devido a setup prolongado na impressora IM-02.';
      } else if (lowerQ.includes('eficiente') || lowerQ.includes('melhor') || lowerQ.includes('operador')) {
        aiResponse =
          '⭐ **Operador Destaque do Período:**\n' +
          'A operadora **Maria Santos (Corte e Solda / CS-04)** atingiu **110% da meta** com apenas **0.8% de refugo**, totalizando 27.500 unidades conformes produzidas.';
      } else {
        aiResponse =
          `Entendido! Analisando os parâmetros cruzados de ${q}. Os dados de rendimento indicam taxa de aproveitamento global de 88.16% e balanço de massa equilibrado. Recomendo monitorar o acerto de cor Pantone na IM-02.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          anomalies,
        },
      ]);
      setIsAiTyping(false);
    }, 700);
  };

  // Mass Balance Pie Data
  const massData = [
    { name: 'Produto Acabado Conforme', value: massBalance.finishedProductKg, color: '#22C55E' },
    { name: 'Sucata / Refugo', value: massBalance.totalScrapKg, color: '#EF4444' },
    { name: 'Em Processo / Bobinas', value: massBalance.resinInputKg - massBalance.finishedProductKg - massBalance.totalScrapKg, color: '#3B82F6' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      {/* Top Global KPIs Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-800 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produção Acabada</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {massBalance.finishedProductKg.toLocaleString('pt-BR')} <span className="text-xs text-gray-400">Kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
            <span className="font-bold">+8.4%</span>
            <span className="text-gray-500">vs. turno anterior</span>
          </div>
        </Card>

        <Card className="bg-surface-800 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Eficiência OEE Média</span>
            <Cpu className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            91.2<span className="text-xs text-gray-400">%</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
            <span className="font-bold">Meta: 88%</span>
            <span className="text-gray-500">(atingida)</span>
          </div>
        </Card>

        <Card className="bg-surface-800 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Refugo Total</span>
            <Scale className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
            {massBalance.totalScrapKg} <span className="text-xs text-gray-400">Kg ({massBalance.scrapPercent}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
            <span className="font-bold">-0.4%</span>
            <span className="text-gray-500">redução de descarte</span>
          </div>
        </Card>

        <Card className="bg-surface-800 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rendimento de Resina</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 mt-1 font-mono">
            {massBalance.yield}%
          </div>
          <div className="text-xs text-gray-400 mt-1 font-mono">
            Entrada: {massBalance.resinInputKg} Kg
          </div>
        </Card>
      </div>

      {/* 5.1. Sequential 3-Block Factory Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            Visão Geral do Galpão Estruturada por Fluxo Sequencial
          </h2>
          <span className="text-xs text-gray-400">Fluxo: Extrusão → Impressão → Corte e Solda</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* BLOCO 1: EXTRUSÃO */}
          <Card className="bg-surface-800 border-t-4 border-t-amber-500 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-700 pb-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase">Bloco 1: Extrusão</h3>
              </div>
              <Badge variant="warning" size="sm">4 Máquinas</Badge>
            </div>
            <p className="text-[11px] text-gray-400">Formação do filme tubular e bobinas mãe.</p>

            <div className="space-y-2">
              {extrusionMachines.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-900 border border-surface-700 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        m.status === 'producing' ? 'bg-emerald-400 animate-pulse' : m.status === 'setup' ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-bold text-white">{m.code}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold">{m.metrics?.kgPerHour || 0} Kg/h</span>
                    <span className="text-[10px] text-gray-500 block">Refugo: {m.metrics?.scrapPercent || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* BLOCO 2: IMPRESSÃO & REBOBINADEIRA */}
          <Card className="bg-surface-800 border-t-4 border-t-sky-500 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-700 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase">Bloco 2: Impressão & Rebob.</h3>
              </div>
              <Badge variant="info" size="sm">2 Máquinas</Badge>
            </div>
            <p className="text-[11px] text-gray-400">Acerto de arte gráfica, Pantone e refilamento.</p>

            <div className="space-y-2">
              {printingMachines.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-900 border border-surface-700 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        m.status === 'producing' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    <span className="font-bold text-white">{m.code}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sky-400 font-bold">{m.metrics?.metersPerMinute || 0} m/min</span>
                    <span className="text-[10px] text-gray-500 block">
                      Pantone: {m.metrics?.pantoneAccuracy ? 'Aprovado' : 'Em Calibração'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* BLOCO 3: CORTE E SOLDA */}
          <Card className="bg-surface-800 border-t-4 border-t-emerald-500 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-700 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase">Bloco 3: Corte e Solda</h3>
              </div>
              <Badge variant="success" size="sm">6 Máquinas</Badge>
            </div>
            <p className="text-[11px] text-gray-400">Conformação final da embalagem (sacos/fardos).</p>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {cuttingMachines.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-900 border border-surface-700 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        m.status === 'producing'
                          ? 'bg-emerald-400 animate-pulse'
                          : m.status === 'support'
                          ? 'bg-blue-400'
                          : m.status === 'setup'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-bold text-white">{m.code}</span>
                    <span className="text-[10px] text-gray-500">
                      {m.trackMode === 'double' ? 'Pista 2x' : 'Pista 1x'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold">{m.metrics?.bagsPerMinute || 0} sacos/min</span>
                    <span className="text-[10px] text-gray-500 block">
                      {m.metrics?.packagesCompleted || 0} pacotes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Production by Hour & Mass Balance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hourly Production Chart */}
        <div className="lg:col-span-8">
          <Card className="bg-surface-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ritmo de Produção por Hora (Extrusão vs. Corte)
                </h3>
                <p className="text-xs text-gray-400">Acompanhamento contínuo dos volumes gerados.</p>
              </div>
              <Badge variant="info" size="sm">Turno Atual</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionByHour} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCutting" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExtrusion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="cutting" stroke="#22C55E" fillOpacity={1} fill="url(#colorCutting)" name="Corte e Solda (sacos)" />
                  <Area type="monotone" dataKey="extrusion" stroke="#3B82F6" fillOpacity={1} fill="url(#colorExtrusion)" name="Extrusão (Kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Mass Balance & Resin Yield Donut */}
        <div className="lg:col-span-4">
          <Card className="bg-surface-800 space-y-3 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-emerald-400" />
                Balanço de Massa Global
              </h3>
              <p className="text-xs text-gray-400">Rendimento de conversão de resina.</p>
            </div>

            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={massData} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={4}>
                    {massData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black font-mono text-emerald-400">{massBalance.yield}%</span>
                <span className="text-[10px] text-gray-400">Rendimento</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Produto Conforme
                </span>
                <span className="font-mono font-bold text-white">{massBalance.finishedProductKg} Kg</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span> Refugo Geral
                </span>
                <span className="font-mono font-bold text-rose-400">{massBalance.totalScrapKg} Kg ({massBalance.scrapPercent}%)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 5.2. Shift Productivity Table */}
      <Card className="bg-surface-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-700/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Tabela de Produtividade do Turno (Por Funcionário e Máquina)
            </h3>
            <p className="text-xs text-gray-400">
              Métricas individuais de produção, refugo e eficiência contra metas industriais.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar operador..."
                value={searchOperator}
                onChange={(e) => setSearchOperator(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-surface-900 border border-surface-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-surface-900 border border-surface-700 rounded-lg text-white"
            >
              <option value="all">Todos Setores</option>
              <option value="extrusion">Extrusão</option>
              <option value="printing">Impressão</option>
              <option value="cutting">Corte e Solda</option>
            </select>

            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-surface-900 border border-surface-700 rounded-lg text-white"
            >
              <option value="all">Todos Turnos</option>
              <option value="morning">Manhã</option>
              <option value="afternoon">Tarde</option>
              <option value="night">Noite</option>
            </select>
          </div>
        </div>

        {/* Productivity Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-surface-900/80 text-[11px] uppercase tracking-wider text-gray-400 font-bold border-b border-surface-700">
              <tr>
                <th className="py-3 px-3">Colaborador</th>
                <th className="py-3 px-3">Máquina / Setor</th>
                <th className="py-3 px-3">Turno</th>
                <th className="py-3 px-3">Modo Pista</th>
                <th className="py-3 px-3">Total Produzido</th>
                <th className="py-3 px-3">Refugo (Kg / %)</th>
                <th className="py-3 px-3">Eficiência OEE</th>
                <th className="py-3 px-3 text-right">Status Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/60">
              {filteredProductivity.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-700/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                        {row.operator.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white">{row.operator.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-white">{row.machine.code}</span>
                    <span className="text-[10px] text-gray-500 block capitalize">{row.machine.sector}</span>
                  </td>
                  <td className="py-3 px-3 capitalize">{row.shift === 'morning' ? 'Manhã' : row.shift === 'afternoon' ? 'Tarde' : 'Noite'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-900 border border-surface-700">
                      {row.trackMode === 'double' ? 'Pista 2x' : 'Pista 1x'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {row.totalProducedUnits > 0 ? (
                      <span className="text-emerald-400 font-bold">
                        {row.totalProducedUnits.toLocaleString('pt-BR')} un
                      </span>
                    ) : (
                      <span className="text-blue-400 font-bold">{row.totalProducedKg} Kg</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-rose-400 font-semibold">{row.scrapKg} Kg</span>
                    <span className="text-[10px] text-gray-500"> ({row.scrapPercent}%)</span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{row.efficiency}%</span>
                      <div className="w-16 bg-surface-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.efficiency >= 90 ? 'bg-emerald-500' : row.efficiency >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, row.efficiency)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {row.metTarget ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" /> Meta Atingida
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] border border-rose-500/30">
                        <XCircle className="h-3 w-3" /> Abaixo da Meta
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5.4. Executive AI Copilot Panel */}
      <Card className="bg-gradient-to-br from-surface-800 to-surface-900 border border-purple-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-surface-700/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Copiloto de IA Executivo
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/40">
                  Dual-Sync Neural
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Assistente inteligente para diagnósticos em linguagem natural e detecção de anomalias industriais.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-gray-400">Perguntas Rápidas:</span>
          <button
            onClick={() => handleSendQuestion('Gerar Resumo do Turno Atual')}
            className="px-2.5 py-1 text-xs rounded-lg bg-surface-900 border border-surface-700 text-purple-300 hover:border-purple-500/60 transition-all active:scale-95"
          >
            📋 Resumo do Turno
          </button>
          <button
            onClick={() => handleSendQuestion('Qual máquina teve maior refugo e por quê?')}
            className="px-2.5 py-1 text-xs rounded-lg bg-surface-900 border border-surface-700 text-purple-300 hover:border-purple-500/60 transition-all active:scale-95"
          >
            🔴 Máquina com Maior Refugo
          </button>
          <button
            onClick={() => handleSendQuestion('A OP da Sacaria Soares vai atrasar?')}
            className="px-2.5 py-1 text-xs rounded-lg bg-surface-900 border border-surface-700 text-purple-300 hover:border-purple-500/60 transition-all active:scale-95"
          >
            ⏱️ Previsão da OP Sacaria Soares
          </button>
          <button
            onClick={() => handleSendQuestion('Quem foi o operador mais eficiente?')}
            className="px-2.5 py-1 text-xs rounded-lg bg-surface-900 border border-surface-700 text-purple-300 hover:border-purple-500/60 transition-all active:scale-95"
          >
            ⭐ Operador Mais Eficiente
          </button>
        </div>

        {/* Chat History Box */}
        <div className="h-60 overflow-y-auto space-y-3 bg-surface-900/80 p-4 rounded-xl border border-surface-700/80">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="h-7 w-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-xl p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-surface-800 text-gray-200 border border-surface-700 rounded-tl-none'
                }`}
              >
                <div>{msg.text}</div>
                {msg.anomalies && (
                  <div className="mt-2 pt-2 border-t border-rose-500/30 text-rose-300 font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                    {msg.anomalies[0]}
                  </div>
                )}
                <span className="block text-[10px] text-gray-400 text-right mt-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isAiTyping && (
            <div className="flex gap-2 items-center text-xs text-purple-400 font-mono">
              <Bot className="h-4 w-4 animate-spin" />
              <span>Copiloto de IA cruzando dados de telemetria...</span>
            </div>
          )}
        </div>

        {/* Message Input Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
            placeholder="Faça uma pergunta gerencial em linguagem natural..."
            className="flex-1 bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSendQuestion()}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0 min-h-11"
          >
            <Send className="h-4 w-4 mr-1.5" /> Enviar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExecutivePage;

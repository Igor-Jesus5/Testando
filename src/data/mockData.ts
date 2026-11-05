// ============================================================================
// MES Plastico — Mock Data (Dados realistas de fábrica brasileira)
// ============================================================================

import type {
  User, Machine, Client, ProductionOrder, Bobbin,
  AndonCall, QualityInspection, ShiftProductivity, MassBalance,
  ProductionEntry, ScrapEntry
} from '../types';

// --- Operadores ---
export const operators: User[] = [
  { id: 'op-01', name: 'Carlos Silva', role: 'operator', pin: '1234', shift: 'morning', sector: 'extrusion', avatar: '' },
  { id: 'op-02', name: 'João Pereira', role: 'operator', pin: '5678', shift: 'morning', sector: 'cutting', avatar: '' },
  { id: 'op-03', name: 'Maria Santos', role: 'operator', pin: '9012', shift: 'afternoon', sector: 'cutting', avatar: '' },
  { id: 'op-04', name: 'Pedro Oliveira', role: 'operator', pin: '3456', shift: 'afternoon', sector: 'extrusion', avatar: '' },
  { id: 'op-05', name: 'Ana Costa', role: 'operator', pin: '7890', shift: 'night', sector: 'printing', avatar: '' },
  { id: 'op-06', name: 'Lucas Ferreira', role: 'operator', pin: '2345', shift: 'morning', sector: 'cutting', avatar: '' },
  { id: 'op-07', name: 'Roberto Almeida', role: 'preparer', pin: '6789', shift: 'morning', sector: 'cutting', avatar: '' },
  { id: 'op-08', name: 'Fernanda Lima', role: 'supervisor', pin: '1111', shift: 'morning', avatar: '' },
  { id: 'op-09', name: 'Ricardo Souza', role: 'owner', pin: '0000', shift: 'morning', avatar: '' },
];

// --- Clientes ---
export const clients: Client[] = [
  { id: 'cl-01', name: 'Sacaria Soares Ltda', cnpj: '12.345.678/0001-90', contact: '(11) 9999-1234' },
  { id: 'cl-02', name: 'Embalagens Norte Sul', cnpj: '23.456.789/0001-01', contact: '(21) 8888-5678' },
  { id: 'cl-03', name: 'Distribuidora Planalto', cnpj: '34.567.890/0001-12', contact: '(31) 7777-9012' },
  { id: 'cl-04', name: 'Frigorífico Boi Verde', cnpj: '45.678.901/0001-23', contact: '(41) 6666-3456' },
  { id: 'cl-05', name: 'Indústria Alimentos Sabor', cnpj: '56.789.012/0001-34', contact: '(51) 5555-7890' },
];

// --- Máquinas ---
export const machines: Machine[] = [
  // Extrusão
  { id: 'ex-01', name: 'Extrusora 01', code: 'EX-01', sector: 'extrusion', status: 'producing', metrics: { kgPerHour: 145, scrapPercent: 2.3 } },
  { id: 'ex-02', name: 'Extrusora 02', code: 'EX-02', sector: 'extrusion', status: 'producing', metrics: { kgPerHour: 138, scrapPercent: 1.8 } },
  { id: 'ex-03', name: 'Extrusora 03', code: 'EX-03', sector: 'extrusion', status: 'setup', metrics: { kgPerHour: 0, scrapPercent: 0 } },
  { id: 'ex-04', name: 'Extrusora 04', code: 'EX-04', sector: 'extrusion', status: 'stopped', metrics: { kgPerHour: 0, scrapPercent: 5.1 } },

  // Impressão
  { id: 'im-01', name: 'Impressora 01', code: 'IM-01', sector: 'printing', status: 'producing', metrics: { metersPerMinute: 120, pantoneAccuracy: true } },
  { id: 'im-02', name: 'Impressora 02', code: 'IM-02', sector: 'printing', status: 'setup', metrics: { metersPerMinute: 0, pantoneAccuracy: false } },

  // Corte e Solda
  { id: 'cs-01', name: 'Corte e Solda 01', code: 'CS-01', sector: 'cutting', status: 'producing', trackMode: 'double', metrics: { bagsPerMinute: 96, packagesCompleted: 42, totalUnits: 21000 } },
  { id: 'cs-02', name: 'Corte e Solda 02', code: 'CS-02', sector: 'cutting', status: 'producing', trackMode: 'single', metrics: { bagsPerMinute: 48, packagesCompleted: 38, totalUnits: 19000 } },
  { id: 'cs-03', name: 'Corte e Solda 03', code: 'CS-03', sector: 'cutting', status: 'support', trackMode: 'double', metrics: { bagsPerMinute: 0, packagesCompleted: 15, totalUnits: 7500 } },
  { id: 'cs-04', name: 'Corte e Solda 04', code: 'CS-04', sector: 'cutting', status: 'producing', trackMode: 'single', metrics: { bagsPerMinute: 52, packagesCompleted: 55, totalUnits: 27500 } },
  { id: 'cs-05', name: 'Corte e Solda 05', code: 'CS-05', sector: 'cutting', status: 'stopped', trackMode: 'single', metrics: { bagsPerMinute: 0, packagesCompleted: 0, totalUnits: 0 } },
  { id: 'cs-06', name: 'Corte e Solda 06', code: 'CS-06', sector: 'cutting', status: 'setup', trackMode: 'double', metrics: { bagsPerMinute: 0, packagesCompleted: 8, totalUnits: 4000 } },
];

// --- Ordens de Produção ---
export const productionOrders: ProductionOrder[] = [
  {
    id: 'po-01', number: 'OP 2885-0001', clientId: 'cl-01',
    client: clients[0],
    product: 'Sacola PEBD 30x40 Transparente',
    technicalSheet: {
      formulation: { pebd: 70, pead: 0, linear: 20, pigment: 'Transparente', eva: 10 },
      temperatures: [
        { zone: 'Z1', value: 168 }, { zone: 'Z2', value: 172 }, { zone: 'Z3', value: 175 },
        { zone: 'Z4', value: 178 }, { zone: 'Z5', value: 180 },
      ],
      width: 240, widthTolerance: 5, thickness: 0.06, sealType: 'Lateral',
      color: 'Transparente', material: 'PEBD',
    },
    plannedQuantity: 50000, producedQuantity: 21000,
    status: 'in_progress', priority: 1, createdAt: '2026-11-05T06:00:00',
  },
  {
    id: 'po-02', number: 'OP 2885-0002', clientId: 'cl-02',
    client: clients[1],
    product: 'Embalagem PEAD 50x60 Branca',
    technicalSheet: {
      formulation: { pebd: 0, pead: 80, linear: 10, pigment: 'Branco TiO2', eva: 10 },
      temperatures: [
        { zone: 'Z1', value: 170 }, { zone: 'Z2', value: 175 }, { zone: 'Z3', value: 178 },
        { zone: 'Z4', value: 180 }, { zone: 'Z5', value: 182 },
      ],
      width: 300, widthTolerance: 5, thickness: 0.08, sealType: 'Fundo',
      color: 'Branco', material: 'PEAD',
    },
    plannedQuantity: 100000, producedQuantity: 19000,
    status: 'in_progress', priority: 2, createdAt: '2026-11-05T06:00:00',
  },
  {
    id: 'po-03', number: 'OP 2885-0003', clientId: 'cl-04',
    client: clients[3],
    product: 'Saco Vácuo 20x30 Nylon/PE',
    technicalSheet: {
      width: 200, widthTolerance: 3, thickness: 0.12, sealType: 'Três Lados',
      color: 'Transparente', material: 'Nylon/PE',
    },
    plannedQuantity: 30000, producedQuantity: 27500,
    status: 'in_progress', priority: 3, createdAt: '2026-11-04T06:00:00',
  },
  {
    id: 'po-04', number: 'OP 2885-0004', clientId: 'cl-01',
    client: clients[0],
    product: 'Sacaria Soares 40x50 Impressa',
    technicalSheet: {
      formulation: { pebd: 60, pead: 10, linear: 20, pigment: 'Pantone 485C + 287C', eva: 10 },
      temperatures: [
        { zone: 'Z1', value: 165 }, { zone: 'Z2', value: 170 }, { zone: 'Z3', value: 173 },
        { zone: 'Z4', value: 176 }, { zone: 'Z5', value: 178 },
      ],
      width: 400, widthTolerance: 5, thickness: 0.07, sealType: 'Lateral',
      color: 'Vermelho/Azul', material: 'PEBD',
    },
    plannedQuantity: 75000, producedQuantity: 7500,
    status: 'in_progress', priority: 4, createdAt: '2026-11-05T06:00:00',
  },
  {
    id: 'po-05', number: 'OP 2885-0005', clientId: 'cl-05',
    client: clients[4],
    product: 'Filme Stretch 50cm 23 micras',
    technicalSheet: {
      formulation: { pebd: 30, pead: 0, linear: 70, pigment: 'Transparente', eva: 0 },
      temperatures: [
        { zone: 'Z1', value: 175 }, { zone: 'Z2', value: 180 }, { zone: 'Z3', value: 185 },
        { zone: 'Z4', value: 188 }, { zone: 'Z5', value: 190 },
      ],
      width: 500, widthTolerance: 10, thickness: 0.023,
      color: 'Transparente', material: 'Linear/PEBD',
    },
    plannedQuantity: 5000, producedQuantity: 0,
    status: 'pending', priority: 5, createdAt: '2026-11-05T08:00:00',
  },
];

// --- Bobinas ---
export const bobbins: Bobbin[] = [
  { id: 'bb-001', qrCode: 'BB-2026-001', opId: 'po-01', grossWeight: 85.2, thickness: 0.06, width: 480, sectorOrigin: 'extrusion', createdAt: '2026-11-05T07:30:00', status: 'completed' },
  { id: 'bb-002', qrCode: 'BB-2026-002', opId: 'po-01', grossWeight: 92.5, thickness: 0.06, width: 480, sectorOrigin: 'extrusion', createdAt: '2026-11-05T08:15:00', status: 'in_production' },
  { id: 'bb-003', qrCode: 'BB-2026-003', opId: 'po-02', grossWeight: 110.0, thickness: 0.08, width: 600, sectorOrigin: 'extrusion', createdAt: '2026-11-05T07:00:00', status: 'completed' },
  { id: 'bb-004', qrCode: 'BB-2026-004', opId: 'po-04', grossWeight: 78.3, thickness: 0.07, width: 800, sectorOrigin: 'printing', createdAt: '2026-11-05T09:00:00', status: 'inspected' },
];

// --- Chamados Andon ---
export const andonCalls: AndonCall[] = [
  {
    id: 'ac-01', machineId: 'cs-03', type: 'preparer', status: 'open',
    openedAt: '2026-11-05T10:24:00', elapsedMinutes: 8,
    description: 'Ajuste de solda lateral necessário',
    machine: machines.find(m => m.id === 'cs-03'),
  },
  {
    id: 'ac-02', machineId: 'ex-04', type: 'maintenance', status: 'open',
    openedAt: '2026-11-05T10:15:00', elapsedMinutes: 17,
    description: 'Resistência da zona 3 com falha',
    machine: machines.find(m => m.id === 'ex-04'),
  },
  {
    id: 'ac-03', machineId: 'cs-01', type: 'quality', status: 'resolved',
    openedAt: '2026-11-05T09:30:00', attendedAt: '2026-11-05T09:33:00',
    resolvedAt: '2026-11-05T09:45:00', elapsedMinutes: 0,
    description: 'Verificação de largura solicitada',
    machine: machines.find(m => m.id === 'cs-01'),
  },
];

// --- Inspeções de Qualidade ---
export const qualityInspections: QualityInspection[] = [
  { id: 'qi-01', bobbinId: 'bb-001', operatorId: 'op-02', stage: 'start', widthMeasured: 241, sealApproved: true, tractionApproved: true, thicknessVariation: 0.002, result: 'approved', timestamp: '2026-11-05T07:35:00' },
  { id: 'qi-02', bobbinId: 'bb-001', operatorId: 'op-02', stage: 'middle', widthMeasured: 239, sealApproved: true, tractionApproved: true, thicknessVariation: 0.003, result: 'approved', timestamp: '2026-11-05T08:20:00' },
  { id: 'qi-03', bobbinId: 'bb-003', operatorId: 'op-03', stage: 'start', widthMeasured: 302, sealApproved: true, tractionApproved: false, thicknessVariation: 0.005, result: 'rejected', timestamp: '2026-11-05T07:10:00' },
];

// --- Produtividade do Turno ---
export const shiftProductivity: ShiftProductivity[] = [
  { operatorId: 'op-01', operator: operators[0], machineId: 'ex-01', machine: machines[0], shift: 'morning', trackMode: 'single', totalProducedKg: 580, totalProducedUnits: 0, scrapKg: 13.3, scrapPercent: 2.3, efficiency: 92, metTarget: true },
  { operatorId: 'op-02', operator: operators[1], machineId: 'cs-01', machine: machines[6], shift: 'morning', trackMode: 'double', totalProducedKg: 0, totalProducedUnits: 21000, scrapKg: 8.5, scrapPercent: 1.2, efficiency: 88, metTarget: true },
  { operatorId: 'op-06', operator: operators[5], machineId: 'cs-02', machine: machines[7], shift: 'morning', trackMode: 'single', totalProducedKg: 0, totalProducedUnits: 19000, scrapKg: 12.1, scrapPercent: 1.8, efficiency: 76, metTarget: false },
  { operatorId: 'op-04', operator: operators[3], machineId: 'ex-02', machine: machines[1], shift: 'afternoon', trackMode: 'single', totalProducedKg: 552, totalProducedUnits: 0, scrapKg: 9.9, scrapPercent: 1.8, efficiency: 95, metTarget: true },
  { operatorId: 'op-03', operator: operators[2], machineId: 'cs-04', machine: machines[9], shift: 'afternoon', trackMode: 'single', totalProducedKg: 0, totalProducedUnits: 27500, scrapKg: 5.5, scrapPercent: 0.8, efficiency: 110, metTarget: true },
  { operatorId: 'op-05', operator: operators[4], machineId: 'im-01', machine: machines[4], shift: 'night', trackMode: 'single', totalProducedKg: 0, totalProducedUnits: 0, scrapKg: 3.2, scrapPercent: 0.5, efficiency: 85, metTarget: true },
];

// --- Apontamentos de Produção ---
export const productionEntries: ProductionEntry[] = [
  { id: 'pe-01', machineId: 'cs-01', operatorId: 'op-02', opId: 'po-01', packages: 42, units: 21000, kgs: 126, trackMode: 'double', timestamp: '2026-11-05T10:30:00' },
  { id: 'pe-02', machineId: 'cs-02', operatorId: 'op-06', opId: 'po-02', packages: 38, units: 19000, kgs: 152, trackMode: 'single', timestamp: '2026-11-05T10:30:00' },
  { id: 'pe-03', machineId: 'cs-04', operatorId: 'op-03', opId: 'po-03', packages: 55, units: 27500, kgs: 82.5, trackMode: 'single', timestamp: '2026-11-05T10:30:00' },
];

// --- Apontamentos de Refugo ---
export const scrapEntries: ScrapEntry[] = [
  { id: 'se-01', machineId: 'cs-01', operatorId: 'op-02', opId: 'po-01', weightKg: 8.5, defectReason: 'Solda fraca', blameSector: 'cutting', timestamp: '2026-11-05T09:00:00' },
  { id: 'se-02', machineId: 'ex-01', operatorId: 'op-01', opId: 'po-01', weightKg: 13.3, defectReason: 'Apara de balão', blameSector: 'extrusion', timestamp: '2026-11-05T08:30:00' },
  { id: 'se-03', machineId: 'ex-04', operatorId: 'op-04', opId: 'po-02', weightKg: 25.5, defectReason: 'Filme com gels', blameSector: 'extrusion', timestamp: '2026-11-05T10:00:00' },
];

// --- Balanço de Massa ---
export const massBalance: MassBalance = {
  resinInputKg: 2450,
  finishedProductKg: 2160,
  totalScrapKg: 78.1,
  scrapPercent: 3.19,
  yield: 88.16,
};

// --- Dados para gráficos ---
export const productionByHour = [
  { hour: '06:00', extrusion: 120, printing: 0, cutting: 850 },
  { hour: '07:00', extrusion: 145, printing: 95, cutting: 2400 },
  { hour: '08:00', extrusion: 138, printing: 120, cutting: 4800 },
  { hour: '09:00', extrusion: 152, printing: 110, cutting: 5600 },
  { hour: '10:00', extrusion: 141, printing: 118, cutting: 6200 },
];

export const scrapByMachine = [
  { machine: 'EX-01', scrap: 13.3, percent: 2.3 },
  { machine: 'EX-02', scrap: 9.9, percent: 1.8 },
  { machine: 'EX-03', scrap: 0, percent: 0 },
  { machine: 'EX-04', scrap: 25.5, percent: 5.1 },
  { machine: 'IM-01', scrap: 3.2, percent: 0.5 },
  { machine: 'IM-02', scrap: 0, percent: 0 },
  { machine: 'CS-01', scrap: 8.5, percent: 1.2 },
  { machine: 'CS-02', scrap: 12.1, percent: 1.8 },
  { machine: 'CS-03', scrap: 4.5, percent: 2.1 },
  { machine: 'CS-04', scrap: 5.5, percent: 0.8 },
  { machine: 'CS-05', scrap: 0, percent: 0 },
  { machine: 'CS-06', scrap: 1.2, percent: 0.9 },
];

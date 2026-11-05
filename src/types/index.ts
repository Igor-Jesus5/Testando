// ============================================================================
// MES Plastico — Core Type Definitions
// ============================================================================

// --- Enums ---

export type MachineStatus = 'producing' | 'setup' | 'stopped' | 'support' | 'idle';
export type Sector = 'extrusion' | 'printing' | 'cutting';
export type TrackMode = 'single' | 'double';
export type Shift = 'morning' | 'afternoon' | 'night';
export type UserRole = 'operator' | 'preparer' | 'supervisor' | 'owner';
export type AndonCallType = 'preparer' | 'maintenance' | 'quality';
export type AndonCallStatus = 'open' | 'in_progress' | 'resolved';
export type InspectionStage = 'start' | 'middle' | 'end';
export type InspectionResult = 'approved' | 'rejected' | 'pending';

// --- Core Entities ---

export interface User {
  id: string;
  name: string;
  role: UserRole;
  pin: string;
  shift: Shift;
  avatar?: string;
  sector?: Sector;
}

export interface Machine {
  id: string;
  name: string;
  code: string;
  sector: Sector;
  status: MachineStatus;
  trackMode?: TrackMode;
  currentOperator?: User;
  currentOP?: ProductionOrder;
  ipTablet?: string;
  metrics?: MachineMetrics;
}

export interface MachineMetrics {
  // Extrusion
  kgPerHour?: number;
  scrapPercent?: number;
  // Printing
  metersPerMinute?: number;
  pantoneAccuracy?: boolean;
  // Cutting
  bagsPerMinute?: number;
  packagesCompleted?: number;
  totalUnits?: number;
}

export interface Client {
  id: string;
  name: string;
  cnpj?: string;
  contact?: string;
}

export interface ProductionOrder {
  id: string;
  number: string;
  clientId: string;
  client?: Client;
  product: string;
  technicalSheet: TechnicalSheet;
  plannedQuantity: number;
  producedQuantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'paused';
  priority: number;
  createdAt: string;
}

export interface TechnicalSheet {
  // Extrusion
  formulation?: {
    pebd?: number;
    pead?: number;
    linear?: number;
    pigment?: string;
    eva?: number;
  };
  temperatures?: {
    zone: string;
    value: number;
  }[];
  // Cutting
  width?: number;
  widthTolerance?: number;
  thickness?: number;
  sealType?: string;
  // Common
  color?: string;
  material?: string;
  observations?: string;
}

export interface Bobbin {
  id: string;
  qrCode: string;
  opId: string;
  grossWeight?: number;
  thickness?: number;
  width?: number;
  sectorOrigin: Sector;
  createdAt: string;
  status: 'in_production' | 'completed' | 'inspected' | 'rejected';
}

export interface ProductionEntry {
  id: string;
  machineId: string;
  operatorId: string;
  opId: string;
  packages: number;
  units: number;
  kgs: number;
  trackMode: TrackMode;
  timestamp: string;
}

export interface ScrapEntry {
  id: string;
  machineId: string;
  operatorId: string;
  opId: string;
  weightKg: number;
  defectReason: string;
  blameSector: Sector;
  timestamp: string;
}

export interface AndonCall {
  id: string;
  machineId: string;
  machine?: Machine;
  type: AndonCallType;
  status: AndonCallStatus;
  openedAt: string;
  attendedAt?: string;
  resolvedAt?: string;
  elapsedMinutes: number;
  description?: string;
}

export interface QualityInspection {
  id: string;
  bobbinId: string;
  operatorId: string;
  stage: InspectionStage;
  widthMeasured: number;
  sealApproved: boolean;
  tractionApproved: boolean;
  thicknessVariation: number;
  result: InspectionResult;
  timestamp: string;
}

// --- Dashboard ---

export interface ShiftProductivity {
  operatorId: string;
  operator: User;
  machineId: string;
  machine: Machine;
  shift: Shift;
  trackMode: TrackMode;
  totalProducedKg: number;
  totalProducedUnits: number;
  scrapKg: number;
  scrapPercent: number;
  efficiency: number;
  metTarget: boolean;
}

export interface MassBalance {
  resinInputKg: number;
  finishedProductKg: number;
  totalScrapKg: number;
  scrapPercent: number;
  yield: number;
}

// --- UI State ---

export interface SectorTab {
  id: Sector;
  label: string;
  icon: string;
  color: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

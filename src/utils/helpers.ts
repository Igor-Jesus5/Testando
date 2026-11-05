// ============================================================================
// MES Plastico — Utility Functions
// ============================================================================

import type { MachineStatus, Sector } from '../types';

/**
 * Simple className merge utility.
 * Filters out falsy values and joins remaining class strings.
 */
export function cn(...classes: any[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a number using Brazilian locale (pt-BR).
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a date string to Brazilian locale.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a time string to Brazilian locale (HH:MM).
 */
export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format weight in Kg with decimals.
 */
export function formatWeight(kg: number, decimals: number = 1): string {
  return `${formatNumber(kg, decimals)} Kg`;
}

/**
 * Map MachineStatus to Andon tailwind color class prefix.
 */
export function getStatusColor(status: MachineStatus): string {
  const colors: Record<MachineStatus, string> = {
    producing: 'andon-green',
    setup: 'andon-yellow',
    stopped: 'andon-red',
    support: 'andon-blue',
    idle: 'surface-600',
  };
  return colors[status];
}

/**
 * Map MachineStatus to hex color.
 */
export function getStatusHex(status: MachineStatus): string {
  const colors: Record<MachineStatus, string> = {
    producing: '#22C55E',
    setup: '#EAB308',
    stopped: '#EF4444',
    support: '#3B82F6',
    idle: '#475569',
  };
  return colors[status];
}

/**
 * Map MachineStatus to Portuguese label.
 */
export function getStatusLabel(status: MachineStatus): string {
  const labels: Record<MachineStatus, string> = {
    producing: 'Produzindo',
    setup: 'Setup',
    stopped: 'Parada',
    support: 'Chamado',
    idle: 'Ociosa',
  };
  return labels[status];
}

/**
 * Map Sector to Portuguese label.
 */
export function getSectorLabel(sector: Sector): string {
  const labels: Record<Sector, string> = {
    extrusion: 'Extrusão',
    printing: 'Impressão',
    cutting: 'Corte/Solda',
  };
  return labels[sector];
}

/**
 * Map Sector to lucide icon name.
 */
export function getSectorIcon(sector: Sector): string {
  const icons: Record<Sector, string> = {
    extrusion: 'Cylinder',
    printing: 'Palette',
    cutting: 'Scissors',
  };
  return icons[sector];
}

/**
 * Calculate production efficiency percentage.
 */
export function calculateEfficiency(produced: number, planned: number): number {
  if (planned <= 0) return 0;
  return Math.min(Math.round((produced / planned) * 100), 100);
}

/**
 * Format elapsed time from a timestamp or minutes into a human-readable string.
 */
export function formatElapsedTime(minutes: number): string {
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${Math.floor(minutes)}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Calculate elapsed minutes from a given ISO date string until now.
 */
export function minutesSince(dateStr: string): number {
  const start = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(0, (now - start) / 60000);
}

export default {
  cn,
  formatNumber,
  formatDate,
  formatTime,
  formatWeight,
  getStatusColor,
  getStatusHex,
  getStatusLabel,
  getSectorLabel,
  getSectorIcon,
  calculateEfficiency,
  formatElapsedTime,
  minutesSince,
};

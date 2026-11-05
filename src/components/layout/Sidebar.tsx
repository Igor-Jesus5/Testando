// ============================================================================
// MES Plastico — Layout Sidebar
// ============================================================================

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Sparkles,
  ClipboardList,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Server,
  Zap,
  Radio
} from 'lucide-react';
import { cn } from '../../utils/helpers';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      group: 'CHÃO DE FÁBRICA (TABLETS)',
      items: [
        {
          name: 'Extrusão',
          path: '/tablet/extrusion',
          icon: Cpu,
          badge: '4 MÁQ',
          color: 'text-amber-400',
        },
        {
          name: 'Impressão & Rebob.',
          path: '/tablet/printing',
          icon: Layers,
          badge: '2 MÁQ',
          color: 'text-sky-400',
        },
        {
          name: 'Corte e Solda',
          path: '/tablet/cutting',
          icon: Sparkles,
          badge: '6 MÁQ',
          color: 'text-emerald-400',
        },
      ],
    },
    {
      group: 'GESTÃO INDUSTRIAL',
      items: [
        {
          name: 'Painel Supervisor',
          path: '/supervisor',
          icon: ClipboardList,
          badge: 'Andon',
          color: 'text-indigo-400',
        },
        {
          name: 'Dashboard Executivo',
          path: '/executive',
          icon: BarChart3,
          badge: 'IA Copilot',
          color: 'text-purple-400',
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'relative z-20 flex flex-col justify-between border-r border-surface-700 bg-surface-900 transition-all duration-200 select-none',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Branding */}
      <div>
        <div className="flex h-16 items-center justify-between border-b border-surface-700 px-4">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/executive')}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 font-extrabold text-white shadow-lg shadow-emerald-500/20">
              <Zap className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="leading-tight animate-fadeIn">
                <span className="block text-sm font-extrabold tracking-wider text-white">
                  MES <span className="text-emerald-400">PLÁSTICO</span>
                </span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                  Indústria 4.0 PWA
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-800 text-gray-400 hover:text-white hover:bg-surface-700 active:scale-95 transition-all"
            aria-label={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 py-4 px-3">
          {navItems.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 animate-fadeIn">
                  {section.group}
                </div>
              )}
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold transition-all duration-150',
                        isActive
                          ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-sm'
                          : 'text-gray-400 hover:bg-surface-800 hover:text-gray-200'
                      )
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <ItemIcon className={cn('h-5 w-5 shrink-0 transition-transform group-hover:scale-105', item.color)} />
                    {!collapsed && (
                      <div className="flex flex-1 items-center justify-between overflow-hidden">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="rounded-md bg-surface-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-300 border border-surface-700/60">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Infrastructure Card */}
      <div className="p-3 border-t border-surface-700/80">
        {!collapsed ? (
          <div className="rounded-xl bg-surface-800/80 border border-surface-700/70 p-3 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-300 flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-emerald-400" />
                Edge Local Gateway
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[10px] text-gray-400 space-y-0.5 font-mono">
              <div className="flex justify-between">
                <span>Latência Wi-Fi:</span>
                <span className="text-emerald-400 font-bold">1.2ms</span>
              </div>
              <div className="flex justify-between">
                <span>Resiliência:</span>
                <span className="text-white">100% Offline</span>
              </div>
            </div>
            <div className="pt-1 border-t border-surface-700/50 flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-blue-400" /> PWA v2.4
              </span>
              <span className="text-gray-400 font-sans">Edge Dual-Sync</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-800 text-emerald-400" title="Edge Local Conectado">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

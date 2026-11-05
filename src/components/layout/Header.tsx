// ============================================================================
// MES Plastico — Layout Header
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Wifi,
  WifiOff,
  Clock,
  User as UserIcon,
  LogOut,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { operators } from '../../data/mockData';
import { formatTime } from '../../utils/helpers';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Read current user from localStorage or default to Supervisor
  const storedUser = localStorage.getItem('mes_user');
  const currentUser = storedUser ? JSON.parse(storedUser) : operators[7]; // Fernanda Lima (Supervisor)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('synced');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mes_user');
    navigate('/login');
  };

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/tablet/extrusion':
        return { title: 'Setor de Extrusão', subtitle: 'Tablet Operador • EX-01 a EX-04', icon: Cpu };
      case '/tablet/printing':
        return { title: 'Setor de Impressão & Rebobinadeira', subtitle: 'Tablet Operador • IM-01 e IM-02', icon: Layers };
      case '/tablet/cutting':
        return { title: 'Setor de Corte e Solda', subtitle: 'Tablet Operador • CS-01 a CS-06', icon: Sparkles };
      case '/supervisor':
        return { title: 'Painel do Supervisor / Preparador', subtitle: 'Visão Geral & Fila Kanban por Setor', icon: Layers };
      case '/executive':
        return { title: 'Dashboard Executivo & Copiloto IA', subtitle: 'Portal do Dono • Visão Global da Planta', icon: Sparkles };
      default:
        return { title: 'Sistema MES Industrial', subtitle: 'Embalagens Plásticas Flexíveis', icon: Cpu };
    }
  };

  const pageInfo = getPageInfo();
  const PageIcon = pageInfo.icon;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-surface-700 bg-surface-900/90 px-4 md:px-6 backdrop-blur-md transition-all">
      {/* Title & Page Context */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-blue-400">
          <PageIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {pageInfo.title}
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center & Right Controls */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Edge / Sync Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-800/80 border border-surface-700 text-xs text-gray-300">
          {isOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              <span>Edge Local Conectado</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin duration-1000" />
                Cloud Sync OK
              </span>
            </>
          ) : (
            <>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              <WifiOff className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-amber-300 font-medium">Modo Offline Local</span>
            </>
          )}
        </div>

        {/* Real-time Clock & Shift */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-800 border border-surface-700">
          <Clock className="h-4 w-4 text-gray-400" />
          <div className="text-right">
            <div className="text-xs font-semibold text-white tracking-wider font-mono">
              {currentTime || '--:--:--'}
            </div>
            <div className="text-[10px] text-gray-400 uppercase hidden sm:block">
              {currentDate} • Turno 1
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800 border border-surface-700 text-gray-300 hover:text-white hover:bg-surface-700 active:scale-95 transition-all"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </button>

          {/* Quick Notification Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-800 border border-surface-700 p-3 shadow-2xl animate-scaleIn z-50">
              <div className="flex items-center justify-between border-b border-surface-700 pb-2 mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Alertas Chão de Fábrica</span>
                <Badge variant="danger" size="sm">2 Pendentes</Badge>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-200">CS-03: Chamado Andon Preparador</div>
                    <div className="text-[11px] text-rose-300/80">Ajuste de solda lateral há 8 min</div>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-200">EX-04: Manutenção Preventiva</div>
                    <div className="text-[11px] text-amber-300/80">Resistência da zona 3 com variação térmica</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-sm">
            {currentUser?.name?.slice(0, 2).toUpperCase() || 'OP'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-white leading-tight">
              {currentUser?.name || 'Operador'}
            </div>
            <div className="text-[10px] text-gray-400 capitalize">
              {currentUser?.role === 'owner' ? 'Diretoria / Dono' : currentUser?.role === 'supervisor' ? 'Supervisor Industrial' : 'Operador Especialista'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sair do Sistema"
            className="ml-1 p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors active:scale-95"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

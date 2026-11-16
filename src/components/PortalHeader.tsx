import React from 'react';
import { EscudoJCPN } from './EscudoJCPN';
import { PerfilId } from '../types/portal';

export type VecinoTab = 'nuevo' | 'mis-reportes';

interface PortalHeaderProps {
  activeProfile: PerfilId;
  vecinoTab: VecinoTab;
  onSelectVecinoTab: (tab: VecinoTab) => void;
  onOpenManualModal: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  activeProfile,
  vecinoTab,
  onSelectVecinoTab,
  onOpenManualModal,
}) => {
  return (
    <header className="bg-[#00236f] text-white border-b border-[#1e3a8a]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zona 1: Escudo + Marca en una sola línea */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            if (activeProfile === 'vecino') {
              onSelectVecinoTab('nuevo');
            }
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eab308] rounded-md"
        >
          <EscudoJCPN className="w-9 h-9 shrink-0" />
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white">
            Junta Comunal de Pueblo Nuevo
          </span>
        </a>

        {/* Zona 2: Enlaces de navegación de una sola línea */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {activeProfile === 'vecino' ? (
            <>
              <button
                type="button"
                onClick={() => onSelectVecinoTab('nuevo')}
                className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  vecinoTab === 'nuevo'
                    ? 'border-[#eab308] text-white font-semibold'
                    : 'border-transparent text-blue-100 hover:text-white hover:border-blue-300'
                }`}
              >
                Nuevo reporte
              </button>
              <button
                type="button"
                onClick={() => onSelectVecinoTab('mis-reportes')}
                className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  vecinoTab === 'mis-reportes'
                    ? 'border-[#eab308] text-white font-semibold'
                    : 'border-transparent text-blue-100 hover:text-white hover:border-blue-300'
                }`}
              >
                Mis reportes
              </button>
              <a
                href="#guia-atencion"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectVecinoTab('nuevo');
                  const el = document.getElementById('guia-atencion');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-1 whitespace-nowrap shrink-0 border-b-2 border-transparent text-blue-100 hover:text-white hover:border-blue-300 transition-colors"
              >
                Canales de atención
              </a>
            </>
          ) : (
            <>
              <span className="py-1 whitespace-nowrap shrink-0 border-b-2 border-[#eab308] text-white font-semibold">
                Panel Operativo
              </span>
              <button
                type="button"
                onClick={onOpenManualModal}
                className="py-1 whitespace-nowrap shrink-0 border-b-2 border-transparent text-blue-100 hover:text-white hover:border-blue-300 transition-colors cursor-pointer"
              >
                Ingreso manual
              </button>
            </>
          )}
        </nav>

        {/* Zona 3: Acción primaria única */}
        <div className="flex items-center shrink-0">
          {activeProfile === 'vecino' ? (
            <button
              type="button"
              onClick={() => {
                onSelectVecinoTab('nuevo');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[#eab308] hover:bg-[#f7be1d] text-[#0f172a] font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Reportar incidencia
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenManualModal}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[#eab308] hover:bg-[#f7be1d] text-[#0f172a] font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Registrar solicitud
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

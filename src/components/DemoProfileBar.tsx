import React from 'react';
import { RotateCcw, ShieldCheck, User } from 'lucide-react';
import { PERFILES_DEMO } from '../data/catalogs';
import { PerfilId } from '../types/portal';

interface DemoProfileBarProps {
  activeProfile: PerfilId;
  onSwitchProfile: (profile: PerfilId) => void;
  onResetDemoData: () => void;
  totalReports: number;
}

export const DemoProfileBar: React.FC<DemoProfileBarProps> = ({
  activeProfile,
  onSwitchProfile,
  onResetDemoData,
  totalReports,
}) => {
  const current = PERFILES_DEMO[activeProfile];

  return (
    <div className="bg-[#f2f3ff] border-b border-slate-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-[#131b2e]">
          <span className="font-semibold text-[#00236f]">Vista previa de demostración</span>
          <span className="text-slate-400" aria-hidden="true">·</span>
          <span className="text-[#444651]">
            Perfil activo: <strong className="text-[#131b2e]">{current.nombre}</strong> ({current.rol})
          </span>
          <span className="hidden lg:inline text-slate-400" aria-hidden="true">·</span>
          <span className="hidden lg:inline text-xs text-slate-500 tabular-nums">
            {totalReports} casos guardados en este navegador
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <div
            role="group"
            aria-label="Cambiar perfil de demostración"
            className="inline-flex items-center p-1 bg-white border border-slate-200 rounded-lg"
          >
            <button
              type="button"
              onClick={() => onSwitchProfile('vecino')}
              className={`min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeProfile === 'vecino'
                  ? 'bg-[#00236f] text-white'
                  : 'text-[#444651] hover:text-[#131b2e] hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Vecinos</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchProfile('personal')}
              className={`min-h-[34px] px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeProfile === 'personal'
                  ? 'bg-[#00236f] text-white'
                  : 'text-[#444651] hover:text-[#131b2e] hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Personal de la Junta</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResetDemoData}
            title="Restaurar reportes ficticios iniciales"
            className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-[#444651] hover:text-[#00236f] flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Restaurar demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, MapPin, Search, X } from 'lucide-react';
import { UBICACIONES_PUEBLO_NUEVO } from '../data/catalogs';

interface LocationSelectorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  error?: string;
  required?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  id = 'ubicacion-selector',
  value,
  onChange,
  placeholder = 'Selecciona una calle, avenida o barriada',
  includeAllOption = false,
  allOptionLabel = 'Todas las ubicaciones',
  error,
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 20);
    } else {
      setQuery('');
    }
  }, [open]);

  const filteredLocations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return UBICACIONES_PUEBLO_NUEVO;
    return UBICACIONES_PUEBLO_NUEVO.filter((loc) =>
      loc.toLowerCase().includes(normalized)
    );
  }, [query]);

  const displayValue = value || (includeAllOption ? allOptionLabel : '');

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white text-left flex items-center justify-between gap-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d4ed8]/30 ${
          error
            ? 'border-2 border-[#dc2626] text-[#131b2e]'
            : open
            ? 'border-2 border-[#1d4ed8] text-[#131b2e]'
            : 'border border-slate-300 hover:border-slate-400 text-[#131b2e]'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-[#1e3a8a] shrink-0" aria-hidden="true" />
          <span className={`truncate ${displayValue ? 'text-[#131b2e] font-medium' : 'text-slate-500'}`}>
            {displayValue || placeholder}
          </span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Limpiar ubicación"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      {open && (
        <div className="absolute z-40 mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar calle, avenida o sector..."
                className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:border-[#1d4ed8]"
              />
            </div>
          </div>

          <ul
            role="listbox"
            aria-label="Catálogo de ubicaciones de Pueblo Nuevo"
            className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50"
          >
            {includeAllOption && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === ''}
                  onClick={() => {
                    onChange('');
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors ${
                    value === ''
                      ? 'bg-[#eaedff] text-[#00236f] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{allOptionLabel}</span>
                </button>
              </li>
            )}

            {filteredLocations.length === 0 ? (
              <li className="px-4 py-4 text-sm text-slate-500 text-center">
                No se encontró ninguna ubicación con «{query}».
              </li>
            ) : (
              filteredLocations.map((loc) => {
                const selected = value === loc;
                return (
                  <li key={loc}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onChange(loc);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors ${
                        selected
                          ? 'bg-[#eaedff] text-[#00236f] font-semibold'
                          : 'text-[#131b2e] hover:bg-slate-50'
                      }`}
                    >
                      <span>{loc}</span>
                      {selected && (
                        <span className="text-xs font-semibold text-[#1d4ed8]">
                          Seleccionada
                        </span>
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

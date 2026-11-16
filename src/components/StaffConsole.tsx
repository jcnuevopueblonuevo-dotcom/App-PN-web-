import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  FilterX,
  Inbox,
  Lock,
  MapPin,
  Phone,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';
import {
  CATEGORIAS_OPERATIVAS,
  ESTADOS_FLUJO,
  INSTITUCIONES_OPERATIVAS,
} from '../data/catalogs';
import { EstadoReporte, Reporte } from '../types/portal';
import { formatDateTimeEs, formatShortDateEs } from '../utils/storage';
import { EscudoJCPN } from './EscudoJCPN';
import { LocationSelector } from './LocationSelector';
import { StatusBadge } from './StatusBadge';

interface StaffConsoleProps {
  reports: Reporte[];
  selectedFolio: string | null;
  onSelectFolio: (folio: string | null) => void;
  onUpdateCase: (payload: {
    folio: string;
    estado: EstadoReporte;
    institucionRemitida: string;
    resumenCiudadano: string;
    notaInterna: string;
  }) => void;
  onOpenManualModal: () => void;
}

export const StaffConsole: React.FC<StaffConsoleProps> = ({
  reports,
  selectedFolio,
  onSelectFolio,
  onUpdateCase,
  onOpenManualModal,
}) => {
  // Filtros de bandeja
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUbicacion, setFilterUbicacion] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterEstado, setFilterEstado] = useState<EstadoReporte | 'Todos'>('Todos');
  const [filterCanal, setFilterCanal] = useState<string>('Todos');

  // Formulario de actualización del caso seleccionado
  const selectedReport = useMemo(
    () => reports.find((r) => r.folio === selectedFolio) ?? null,
    [reports, selectedFolio]
  );

  const [draftEstado, setDraftEstado] = useState<EstadoReporte>('Recibido');
  const [draftInstitucion, setDraftInstitucion] = useState('');
  const [draftResumenCiudadano, setDraftResumenCiudadano] = useState('');
  const [draftNotaInterna, setDraftNotaInterna] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    if (selectedReport) {
      setDraftEstado(selectedReport.estado);
      setDraftInstitucion(selectedReport.institucionRemitida || '');
      setDraftResumenCiudadano('');
      setDraftNotaInterna('');
    }
  }, [selectedReport?.folio, selectedReport?.estado, selectedReport?.institucionRemitida]);

  // Estadísticas operativas reales calculadas en vivo
  const stats = useMemo(() => {
    return {
      total: reports.length,
      recibido: reports.filter((r) => r.estado === 'Recibido').length,
      enProceso: reports.filter((r) => r.estado === 'En proceso').length,
      remitido: reports.filter((r) => r.estado === 'Remitido').length,
      resuelto: reports.filter((r) => r.estado === 'Resuelto').length,
    };
  }, [reports]);

  const channelCounts = useMemo(() => {
    const channels = ['Portal Web', 'WhatsApp', 'Instagram', 'Llamada', 'Recepción'];
    return channels.map((ch) => ({
      canal: ch,
      count: reports.filter((r) => r.canal === ch).length,
    }));
  }, [reports]);

  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...reports]
      .sort((a, b) => new Date(b.creadoEnISO).getTime() - new Date(a.creadoEnISO).getTime())
      .filter((r) => {
        const matchFolioOrText =
          !q ||
          r.folio.toLowerCase().includes(q) ||
          r.solicitanteNombre.toLowerCase().includes(q) ||
          r.referencia.toLowerCase().includes(q);
        const matchUbicacion = !filterUbicacion || r.ubicacion === filterUbicacion;
        const matchCategoria = !filterCategoria || r.categoria === filterCategoria;
        const matchEstado = filterEstado === 'Todos' || r.estado === filterEstado;
        const matchCanal = filterCanal === 'Todos' || r.canal === filterCanal;
        return (
          matchFolioOrText &&
          matchUbicacion &&
          matchCategoria &&
          matchEstado &&
          matchCanal
        );
      });
  }, [reports, searchQuery, filterUbicacion, filterCategoria, filterEstado, filterCanal]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(filterUbicacion) ||
    Boolean(filterCategoria) ||
    filterEstado !== 'Todos' ||
    filterCanal !== 'Todos';

  const clearFilters = () => {
    setSearchQuery('');
    setFilterUbicacion('');
    setFilterCategoria('');
    setFilterEstado('Todos');
    setFilterCanal('Todos');
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    onUpdateCase({
      folio: selectedReport.folio,
      estado: draftEstado,
      institucionRemitida: draftInstitucion,
      resumenCiudadano: draftResumenCiudadano.trim(),
      notaInterna: draftNotaInterna.trim(),
    });

    setDraftResumenCiudadano('');
    setDraftNotaInterna('');
    setSaveFeedback(`Caso ${selectedReport.folio} actualizado (${draftEstado})`);
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const renderDetailEditor = () => {
    if (!selectedReport) {
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden="true" />
          <h3 className="font-display text-base font-bold text-[#131b2e]">
            Selecciona un reporte de la bandeja
          </h3>
          <p className="text-sm text-[#444651] mt-1">
            Haz clic en cualquier folio para revisar el detalle completo, cambiar su estado,
            asignar institución y registrar notas internas.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Encabezado del caso */}
        <div className="px-5 py-4 bg-[#f2f3ff] border-b border-slate-200 flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-[#00236f] tabular-nums">
                {selectedReport.folio}
              </span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-xs font-semibold text-[#444651]">
                Canal: {selectedReport.canal}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 tabular-nums">
              Ingresado: {formatDateTimeEs(selectedReport.creadoEnISO)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge estado={selectedReport.estado} />
            {mobileDetailOpen && (
              <button
                type="button"
                onClick={() => setMobileDetailOpen(false)}
                aria-label="Cerrar detalle del caso"
                className="lg:hidden w-8 h-8 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-[#131b2e]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Ficha ciudadana del reporte */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Categoría y ubicación
              </span>
              <h3 className="font-display text-lg font-bold text-[#131b2e] mt-0.5">
                {selectedReport.categoria}
              </h3>
              <p className="text-sm font-medium text-[#1e3a8a] flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{selectedReport.ubicacion}</span>
              </p>
            </div>

            <div className="text-sm text-[#131b2e] bg-[#faf8ff] border border-slate-200 rounded-lg p-3.5 space-y-2">
              <p className="leading-relaxed">{selectedReport.descripcion}</p>
              <p className="text-xs text-[#444651]">
                <strong className="text-[#131b2e]">Referencia:</strong> {selectedReport.referencia}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#444651]">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>
                  Solicitante: <strong className="text-[#131b2e]">{selectedReport.solicitanteNombre}</strong>
                </span>
              </span>
              {selectedReport.solicitanteTelefono && (
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>{selectedReport.solicitanteTelefono}</span>
                </span>
              )}
            </div>
          </div>

          {/* Formulario de gestión operativa */}
          <form onSubmit={handleSaveCase} className="pt-4 border-t border-slate-200 space-y-4">
            <h4 className="font-display text-sm font-bold text-[#00236f]">
              Gestión operativa del caso
            </h4>

            {saveFeedback && (
              <div
                role="status"
                className="px-3.5 py-2.5 rounded-lg bg-[#dcfce7] border border-[#86efac] text-[#166534] text-xs font-semibold flex items-center gap-2"
              >
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{saveFeedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="staff-estado"
                  className="block text-xs font-bold text-[#131b2e] mb-1.5"
                >
                  Estado del caso
                </label>
                <select
                  id="staff-estado"
                  value={draftEstado}
                  onChange={(e) => setDraftEstado(e.target.value as EstadoReporte)}
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg text-sm bg-white border border-slate-300 text-[#131b2e] font-medium focus:outline-none focus:border-[#1d4ed8]"
                >
                  {ESTADOS_FLUJO.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="staff-institucion"
                  className="block text-xs font-bold text-[#131b2e] mb-1.5"
                >
                  Institución remitida
                </label>
                <select
                  id="staff-institucion"
                  value={draftInstitucion}
                  onChange={(e) => setDraftInstitucion(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 rounded-lg text-sm bg-white border border-slate-300 text-[#131b2e] font-medium focus:outline-none focus:border-[#1d4ed8]"
                >
                  <option value="">Sin remitir / Gestión interna</option>
                  {INSTITUCIONES_OPERATIVAS.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="staff-resumen-ciudadano"
                className="block text-xs font-bold text-[#131b2e] mb-1"
              >
                Mensaje público de actualización (opcional)
              </label>
              <input
                id="staff-resumen-ciudadano"
                type="text"
                value={draftResumenCiudadano}
                onChange={(e) => setDraftResumenCiudadano(e.target.value)}
                placeholder="Ej. Cuadrilla programada o caso remitido con número de oficio..."
                className="w-full min-h-[40px] px-3 py-2 rounded-lg text-sm bg-white border border-slate-300 text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:border-[#1d4ed8]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Este texto sí se muestra al vecino en «Mis reportes». Si se deja vacío, se genera un resumen estándar del cambio de estado.
              </p>
            </div>

            {/* Nota interna exclusiva del personal */}
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg p-3.5">
              <label
                htmlFor="staff-nota-interna"
                className="flex items-center gap-1.5 text-xs font-bold text-[#92400e] mb-1.5"
              >
                <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Nota interna (solo visible para personal de la Junta)</span>
              </label>
              <textarea
                id="staff-nota-interna"
                rows={3}
                value={draftNotaInterna}
                onChange={(e) => setDraftNotaInterna(e.target.value)}
                placeholder="Escribe una observación operativa interna, responsable asignado o número de oficio..."
                className="w-full px-3 py-2 rounded-md text-sm bg-white border border-[#fcd34d] text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:border-[#00236f]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Guardar actualización del caso
            </button>
          </form>

          {/* Bitácora de notas internas */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#444651] mb-3">
              <Lock className="w-3.5 h-3.5 text-[#92400e]" aria-hidden="true" />
              <span>Bitácora de notas internas ({selectedReport.notasInternas.length})</span>
            </h4>

            {selectedReport.notasInternas.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Aún no hay notas internas registradas para este folio.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {selectedReport.notasInternas.map((nota) => (
                  <li
                    key={nota.id}
                    className="bg-[#faf8ff] border border-slate-200 rounded-lg p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 text-slate-500 mb-1">
                      <span className="font-semibold text-[#131b2e]">{nota.autor}</span>
                      <span className="tabular-nums">{formatDateTimeEs(nota.fechaISO)}</span>
                    </div>
                    <p className="text-[#131b2e] leading-relaxed">{nota.contenido}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Sidebar Operativa Desktop (256px en xl, barra compacta arriba en pantallas medianas) */}
        <aside className="w-full xl:w-64 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-[#00236f] flex items-center justify-center shrink-0">
                <EscudoJCPN className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-sm font-bold text-[#131b2e] truncate">
                  Panel Operativo
                </h1>
                <p className="text-xs text-[#444651] truncate">Junta Comunal Pueblo Nuevo</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenManualModal}
              className="mt-3.5 w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#eab308] hover:bg-[#f7be1d] text-[#0f172a] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Registrar solicitud manual</span>
            </button>

            {/* Navegación rápida por estado */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Bandeja por estado
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 xl:grid-cols-1 gap-1">
                <button
                  type="button"
                  onClick={() => setFilterEstado('Todos')}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    filterEstado === 'Todos'
                      ? 'bg-[#00236f] text-white'
                      : 'text-[#444651] hover:bg-[#f2f3ff]'
                  }`}
                >
                  <span>Todos los casos</span>
                  <span className="tabular-nums font-mono">{stats.total}</span>
                </button>
                {ESTADOS_FLUJO.map((estado) => {
                  const count =
                    estado === 'Recibido'
                      ? stats.recibido
                      : estado === 'En proceso'
                      ? stats.enProceso
                      : estado === 'Remitido'
                      ? stats.remitido
                      : stats.resuelto;
                  const active = filterEstado === estado;
                  return (
                    <button
                      key={estado}
                      type="button"
                      onClick={() => setFilterEstado(estado)}
                      className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#00236f] text-white'
                          : 'text-[#444651] hover:bg-[#f2f3ff]'
                      }`}
                    >
                      <span>{estado}</span>
                      <span className="tabular-nums font-mono">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desglose por canal */}
            <div className="hidden xl:block mt-5 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Canales de ingreso
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setFilterCanal('Todos')}
                  className={`w-full px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between cursor-pointer ${
                    filterCanal === 'Todos'
                      ? 'bg-[#eaedff] text-[#00236f] font-semibold'
                      : 'text-[#444651] hover:bg-slate-50'
                  }`}
                >
                  <span>Todos los canales</span>
                  <span className="tabular-nums font-mono">{stats.total}</span>
                </button>
                {channelCounts.map((item) => (
                  <button
                    key={item.canal}
                    type="button"
                    onClick={() => setFilterCanal(item.canal)}
                    className={`w-full px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between cursor-pointer ${
                      filterCanal === item.canal
                        ? 'bg-[#eaedff] text-[#00236f] font-semibold'
                        : 'text-[#444651] hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.canal}</span>
                    <span className="tabular-nums font-mono">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Área principal del Panel Operativo */}
        <div className="flex-1 min-w-0 w-full space-y-5">
          {/* Franja de indicadores KPI (fila única estructurada) */}
          <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 overflow-hidden">
            <div className="p-4">
              <span className="text-xs font-medium text-slate-500 block">Total en bandeja</span>
              <span className="font-display text-2xl font-extrabold text-[#131b2e] tabular-nums mt-0.5 block">
                {stats.total}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-[#92400e] block">Recibido</span>
              <span className="font-display text-2xl font-extrabold text-[#92400e] tabular-nums mt-0.5 block">
                {stats.recibido}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-[#1e40af] block">En proceso</span>
              <span className="font-display text-2xl font-extrabold text-[#1e40af] tabular-nums mt-0.5 block">
                {stats.enProceso}
              </span>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-[#9a3412] block">Remitido</span>
              <span className="font-display text-2xl font-extrabold text-[#9a3412] tabular-nums mt-0.5 block">
                {stats.remitido}
              </span>
            </div>
            <div className="p-4 col-span-2 sm:col-span-1">
              <span className="text-xs font-medium text-[#166534] block">Resuelto</span>
              <span className="font-display text-2xl font-extrabold text-[#166534] tabular-nums mt-0.5 block">
                {stats.resuelto}
              </span>
            </div>
          </div>

          {/* Barra de búsqueda por folio y filtros */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Búsqueda por folio */}
              <div className="md:col-span-4 relative">
                <label htmlFor="staff-search" className="sr-only">
                  Buscar por folio
                </label>
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="staff-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por folio (ej. JCPN-2026-0146)..."
                  className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-lg text-sm bg-white border border-slate-300 text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:border-[#1d4ed8]"
                />
              </div>

              {/* Filtro por Ubicación */}
              <div className="md:col-span-3">
                <LocationSelector
                  id="staff-filter-ubicacion"
                  value={filterUbicacion}
                  onChange={setFilterUbicacion}
                  includeAllOption
                  allOptionLabel="Todas las ubicaciones"
                  placeholder="Todas las ubicaciones"
                />
              </div>

              {/* Filtro por Categoría */}
              <div className="md:col-span-3">
                <label htmlFor="staff-filter-categoria" className="sr-only">
                  Filtrar por categoría
                </label>
                <select
                  id="staff-filter-categoria"
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg text-sm bg-white border border-slate-300 text-[#131b2e] focus:outline-none focus:border-[#1d4ed8]"
                >
                  <option value="">Todas las categorías</option>
                  {CATEGORIAS_OPERATIVAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Estado */}
              <div className="md:col-span-2">
                <label htmlFor="staff-filter-estado" className="sr-only">
                  Filtrar por estado
                </label>
                <select
                  id="staff-filter-estado"
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value as EstadoReporte | 'Todos')}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg text-sm bg-white border border-slate-300 text-[#131b2e] focus:outline-none focus:border-[#1d4ed8]"
                >
                  <option value="Todos">Todos los estados</option>
                  {ESTADOS_FLUJO.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[#444651] tabular-nums">
                  Mostrando <strong>{filteredReports.length}</strong> de {reports.length} reportes
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[#1d4ed8] hover:text-[#00236f] font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <FilterX className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Limpiar filtros</span>
                </button>
              </div>
            )}
          </div>

          {/* Distribución Master-Detail Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Bandeja de reportes */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-2 bg-[#faf8ff]">
                <h2 className="font-display text-sm font-bold text-[#131b2e]">
                  Bandeja de reportes ({filteredReports.length})
                </h2>
                <span className="text-xs text-slate-500">
                  Haz clic en un caso para gestionarlo
                </span>
              </div>

              {filteredReports.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm font-semibold text-[#131b2e]">
                    No se encontraron reportes con los filtros actuales
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 text-xs font-semibold text-[#1d4ed8] hover:underline cursor-pointer"
                  >
                    Restablecer filtros
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredReports.map((reporte) => {
                    const isSelected = selectedReport?.folio === reporte.folio;
                    return (
                      <button
                        key={reporte.folio}
                        type="button"
                        onClick={() => {
                          onSelectFolio(reporte.folio);
                          setMobileDetailOpen(true);
                        }}
                        className={`w-full text-left p-4 sm:px-5 transition-colors cursor-pointer block ${
                          isSelected
                            ? 'bg-[#eaedff]/80'
                            : 'bg-white hover:bg-slate-50/90'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="font-mono text-xs sm:text-sm font-bold text-[#00236f] tabular-nums">
                                {reporte.folio}
                              </span>
                              <span className="text-slate-300" aria-hidden="true">·</span>
                              <span className="text-xs text-[#444651] font-medium">
                                {reporte.canal}
                              </span>
                              <span className="text-slate-300" aria-hidden="true">·</span>
                              <span className="text-xs text-slate-500 tabular-nums">
                                {formatShortDateEs(reporte.creadoEnISO)}
                              </span>
                            </div>

                            <h3 className="font-display text-sm sm:text-base font-bold text-[#131b2e] mt-1 truncate">
                              {reporte.categoria}
                            </h3>

                            <p className="text-xs text-[#444651] mt-0.5 truncate">
                              {reporte.ubicacion} · {reporte.solicitanteNombre}
                            </p>

                            {reporte.institucionRemitida && (
                              <p className="text-xs text-[#1e3a8a] font-medium mt-1.5 inline-flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                                <span>Remitido a: {reporte.institucionRemitida}</span>
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-1.5">
                            <StatusBadge estado={reporte.estado} compact />
                            {reporte.notasInternas.length > 0 && (
                              <span className="text-[11px] text-slate-500 inline-flex items-center gap-1 tabular-nums">
                                <Lock className="w-3 h-3" aria-hidden="true" />
                                <span>{reporte.notasInternas.length} nota(s)</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Inspector de detalle fijo en Desktop */}
            <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-4">
              {renderDetailEditor()}
            </div>
          </div>
        </div>
      </div>

      {/* Panel de detalle en Celular / Tablet */}
      {mobileDetailOpen && selectedReport && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0f172a]/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl">
            {renderDetailEditor()}
          </div>
        </div>
      )}
    </div>
  );
};

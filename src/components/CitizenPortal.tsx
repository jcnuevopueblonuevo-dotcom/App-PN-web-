import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  FilePlus2,
  History,
  MapPin,
  MessageSquare,
  Phone,
  Search,
} from 'lucide-react';
import { CATEGORIAS_OPERATIVAS, ESTADOS_FLUJO, PERFILES_DEMO } from '../data/catalogs';
import { EstadoReporte, Reporte } from '../types/portal';
import { formatDateTimeEs } from '../utils/storage';
import { EscudoJCPN } from './EscudoJCPN';
import { LocationSelector } from './LocationSelector';
import { VecinoTab } from './PortalHeader';
import { StatusBadge } from './StatusBadge';

interface CitizenPortalProps {
  activeTab: VecinoTab;
  onChangeTab: (tab: VecinoTab) => void;
  reports: Reporte[];
  onCreateReport: (payload: {
    ubicacion: string;
    categoria: string;
    referencia: string;
    descripcion: string;
  }) => Reporte;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  activeTab,
  onChangeTab,
  reports,
  onCreateReport,
}) => {
  const vecinoProfile = PERFILES_DEMO.vecino;

  // Estado del formulario de nuevo reporte
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [referencia, setReferencia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedReport, setSubmittedReport] = useState<Reporte | null>(null);

  // Filtros en "Mis reportes"
  const [searchFolio, setSearchFolio] = useState('');
  const [statusFilter, setStatusFilter] = useState<EstadoReporte | 'Todos'>('Todos');
  const [expandedFolio, setExpandedFolio] = useState<string | null>(null);

  // Solo reportes asociados al vecino demo (y nunca mostramos notas internas aquí)
  const myReports = useMemo(() => {
    return reports
      .filter((r) => r.perteneceAVecinoDemo)
      .sort((a, b) => new Date(b.actualizadoEnISO).getTime() - new Date(a.actualizadoEnISO).getTime());
  }, [reports]);

  const filteredMyReports = useMemo(() => {
    const q = searchFolio.trim().toLowerCase();
    return myReports.filter((r) => {
      const matchesStatus = statusFilter === 'Todos' || r.estado === statusFilter;
      const matchesQuery =
        !q ||
        r.folio.toLowerCase().includes(q) ||
        r.ubicacion.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [myReports, searchFolio, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!ubicacion.trim()) {
      nextErrors.ubicacion = 'Selecciona la ubicación del reporte.';
    }
    if (!categoria.trim()) {
      nextErrors.categoria = 'Selecciona una categoría.';
    }
    if (!referencia.trim() || referencia.trim().length < 4) {
      nextErrors.referencia = 'Agrega un punto de referencia cercano (mínimo 4 caracteres).';
    }
    if (!descripcion.trim() || descripcion.trim().length < 10) {
      nextErrors.descripcion = 'Describe el problema con al menos 10 caracteres.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const created = onCreateReport({
      ubicacion: ubicacion.trim(),
      categoria: categoria.trim(),
      referencia: referencia.trim(),
      descripcion: descripcion.trim(),
    });

    setSubmittedReport(created);
    setExpandedFolio(created.folio);
    setUbicacion('');
    setCategoria('');
    setReferencia('');
    setDescripcion('');
    setErrors({});
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
      {/* Encabezado institucional del portal ciudadano */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#00236f] flex items-center justify-center shrink-0">
              <EscudoJCPN className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-[#1e3a8a] mb-1">
                Corregimiento de Pueblo Nuevo · Panamá
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#131b2e] leading-tight text-balance">
                Atención Ciudadana en Línea
              </h1>
              <p className="text-sm sm:text-base text-[#444651] mt-1.5 leading-relaxed">
                Reporta incidencias en calles, luminarias, recolección o espacios públicos y da
                seguimiento transparente con tu número de folio.
              </p>
            </div>
          </div>

          {/* Selector de pestaña de Vecinos */}
          <div
            role="tablist"
            aria-label="Secciones de vecinos"
            className="inline-flex items-center p-1 bg-[#f2f3ff] border border-slate-200 rounded-lg self-start lg:self-center shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'nuevo'}
              onClick={() => onChangeTab('nuevo')}
              className={`min-h-[40px] px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'nuevo'
                  ? 'bg-[#00236f] text-white'
                  : 'text-[#444651] hover:text-[#131b2e]'
              }`}
            >
              <FilePlus2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Nuevo reporte</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'mis-reportes'}
              onClick={() => onChangeTab('mis-reportes')}
              className={`min-h-[40px] px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeTab === 'mis-reportes'
                  ? 'bg-[#00236f] text-white'
                  : 'text-[#444651] hover:text-[#131b2e]'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="tabular-nums">Mis reportes ({myReports.length})</span>
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'nuevo' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Columna principal: Formulario o Confirmación */}
          <div className="lg:col-span-8">
            {submittedReport ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#dcfce7] text-[#166534] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#131b2e]">
                      Reporte registrado correctamente
                    </h2>
                    <p className="text-sm sm:text-base text-[#444651] mt-1">
                      Tu solicitud fue ingresada al sistema operativo de la Junta Comunal de Pueblo Nuevo.
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-[#f2f3ff] border border-[#dce1ff] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1e3a8a] block">
                      Número de folio asignado
                    </span>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#00236f] tabular-nums tracking-tight">
                      {submittedReport.folio}
                    </span>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1.5">
                    <span className="text-xs font-medium text-[#444651]">Estado actual</span>
                    <StatusBadge estado={submittedReport.estado} />
                  </div>
                </div>

                <dl className="mt-6 divide-y divide-slate-100 border-t border-b border-slate-100 text-sm">
                  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <dt className="font-semibold text-[#444651]">Ubicación</dt>
                    <dd className="sm:col-span-2 text-[#131b2e] font-medium">{submittedReport.ubicacion}</dd>
                  </div>
                  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <dt className="font-semibold text-[#444651]">Categoría</dt>
                    <dd className="sm:col-span-2 text-[#131b2e]">{submittedReport.categoria}</dd>
                  </div>
                  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <dt className="font-semibold text-[#444651]">Referencia</dt>
                    <dd className="sm:col-span-2 text-[#131b2e]">{submittedReport.referencia}</dd>
                  </div>
                  <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <dt className="font-semibold text-[#444651]">Descripción</dt>
                    <dd className="sm:col-span-2 text-[#131b2e]">{submittedReport.descripcion}</dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onChangeTab('mis-reportes');
                      setSubmittedReport(null);
                    }}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#00236f] hover:bg-[#1e3a8a] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Ver en Mis reportes</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedReport(null)}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[#131b2e] font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Enviar otro reporte
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7"
              >
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="font-display text-xl font-bold text-[#131b2e]">
                    Formulario de reporte ciudadano
                  </h2>
                  <p className="text-sm text-[#444651] mt-1">
                    Reportando como <strong>{vecinoProfile.nombre}</strong>. Todos los campos son obligatorios.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Selector único de ubicaciones */}
                  <div>
                    <label
                      htmlFor="vecino-ubicacion"
                      className="block text-sm font-semibold text-[#131b2e] mb-1.5"
                    >
                      Ubicación en Pueblo Nuevo
                    </label>
                    <LocationSelector
                      id="vecino-ubicacion"
                      value={ubicacion}
                      onChange={(val) => {
                        setUbicacion(val);
                        if (errors.ubicacion) setErrors((prev) => ({ ...prev, ubicacion: '' }));
                      }}
                      error={errors.ubicacion}
                      required
                    />
                    {errors.ubicacion ? (
                      <p className="mt-1.5 text-xs font-medium text-[#dc2626]">{errors.ubicacion}</p>
                    ) : (
                      <p className="mt-1.5 text-xs text-slate-500">
                        Selecciona la calle, avenida o urbanización más cercana al punto del problema.
                      </p>
                    )}
                  </div>

                  {/* Selector de categoría */}
                  <div>
                    <label
                      htmlFor="vecino-categoria"
                      className="block text-sm font-semibold text-[#131b2e] mb-1.5"
                    >
                      Categoría de la incidencia
                    </label>
                    <select
                      id="vecino-categoria"
                      value={categoria}
                      onChange={(e) => {
                        setCategoria(e.target.value);
                        if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: '' }));
                      }}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white text-sm text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 ${
                        errors.categoria
                          ? 'border-2 border-[#dc2626]'
                          : 'border border-slate-300 focus:border-[#1d4ed8]'
                      }`}
                    >
                      <option value="">Selecciona una categoría...</option>
                      {CATEGORIAS_OPERATIVAS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.categoria && (
                      <p className="mt-1.5 text-xs font-medium text-[#dc2626]">{errors.categoria}</p>
                    )}
                  </div>

                  {/* Punto de referencia */}
                  <div>
                    <label
                      htmlFor="vecino-referencia"
                      className="block text-sm font-semibold text-[#131b2e] mb-1.5"
                    >
                      Referencia exacta
                    </label>
                    <input
                      id="vecino-referencia"
                      type="text"
                      value={referencia}
                      onChange={(e) => {
                        setReferencia(e.target.value);
                        if (errors.referencia) setErrors((prev) => ({ ...prev, referencia: '' }));
                      }}
                      placeholder="Ej. Frente al minisúper, junto al poste #14 o esquina del parque"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white text-sm text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 ${
                        errors.referencia
                          ? 'border-2 border-[#dc2626]'
                          : 'border border-slate-300 focus:border-[#1d4ed8]'
                      }`}
                    />
                    {errors.referencia && (
                      <p className="mt-1.5 text-xs font-medium text-[#dc2626]">{errors.referencia}</p>
                    )}
                  </div>

                  {/* Descripción del problema */}
                  <div>
                    <label
                      htmlFor="vecino-descripcion"
                      className="block text-sm font-semibold text-[#131b2e] mb-1.5"
                    >
                      Descripción del problema
                    </label>
                    <textarea
                      id="vecino-descripcion"
                      rows={4}
                      value={descripcion}
                      onChange={(e) => {
                        setDescripcion(e.target.value);
                        if (errors.descripcion) setErrors((prev) => ({ ...prev, descripcion: '' }));
                      }}
                      placeholder="Describe qué ocurre, desde cuándo se presenta y si afecta el tránsito o viviendas cercanas."
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-white text-sm text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 ${
                        errors.descripcion
                          ? 'border-2 border-[#dc2626]'
                          : 'border border-slate-300 focus:border-[#1d4ed8]'
                      }`}
                    />
                    {errors.descripcion && (
                      <p className="mt-1.5 text-xs font-medium text-[#dc2626]">{errors.descripcion}</p>
                    )}
                  </div>
                </div>

                <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-xs text-slate-500">
                    Al enviar, recibirás un folio único con estado inicial <strong className="text-[#92400e]">Recibido</strong>.
                  </p>
                  <button
                    type="submit"
                    className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#eab308] hover:bg-[#f7be1d] text-[#0f172a] font-bold text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00236f]"
                  >
                    Enviar reporte
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Columna lateral: Guía de atención y seguimiento */}
          <aside id="guia-atencion" className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
              <h3 className="font-display text-base font-bold text-[#131b2e]">
                Cómo avanza tu reporte
              </h3>
              <ol className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#fef3c7] text-[#92400e] font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-[#131b2e]">Recibido</p>
                    <p className="text-xs text-[#444651] mt-0.5">
                      Tu solicitud queda registrada con folio único para revisión operativa.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#dbeafe] text-[#1e40af] font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-[#131b2e]">En proceso</p>
                    <p className="text-xs text-[#444651] mt-0.5">
                      La cuadrilla de la Junta Comunal realiza inspección o atención directa.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#ffedd5] text-[#9a3412] font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-[#131b2e]">Remitido</p>
                    <p className="text-xs text-[#444651] mt-0.5">
                      Cuando compete a otra entidad (IDAAN, AAUD, ENSA, MOP), se traslada formalmente.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#166534] font-bold text-xs flex items-center justify-center shrink-0 tabular-nums">
                    4
                  </span>
                  <div>
                    <p className="font-semibold text-[#131b2e]">Resuelto</p>
                    <p className="text-xs text-[#444651] mt-0.5">
                      El caso ha sido atendido y cerrado en tu historial ciudadano.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-[#00236f] text-white rounded-xl p-5 sm:p-6">
              <h3 className="font-display text-base font-bold">Canales presenciales y directos</h3>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                Lunes a viernes de 8:00 a.m. a 4:00 p.m. · Sede de la Junta Comunal de Pueblo Nuevo.
              </p>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center gap-2.5 text-blue-50">
                  <Phone className="w-4 h-4 text-[#f7be1d] shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">Atención telefónica: 229-0000</span>
                </div>
                <div className="flex items-center gap-2.5 text-blue-50">
                  <MessageSquare className="w-4 h-4 text-[#f7be1d] shrink-0" aria-hidden="true" />
                  <span>WhatsApp vecinal e Instagram @jcpueblonuevo</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        /* Vista: Mis Reportes */
        <section aria-label="Mis reportes ciudadanos" className="space-y-5">
          {/* Barra de búsqueda y filtro por estado */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchFolio}
                onChange={(e) => setSearchFolio(e.target.value)}
                placeholder="Buscar por folio (ej. JCPN-2026-0142) o ubicación..."
                className="w-full min-h-[42px] pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:border-[#1d4ed8]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(['Todos', ...ESTADOS_FLUJO] as const).map((estado) => {
                const active = statusFilter === estado;
                return (
                  <button
                    key={estado}
                    type="button"
                    onClick={() => setStatusFilter(estado)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#00236f] text-white'
                        : 'bg-[#f2f3ff] text-[#444651] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    {estado}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredMyReports.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden="true" />
              <h2 className="font-display text-lg font-bold text-[#131b2e]">
                No hay reportes que coincidan con tu búsqueda
              </h2>
              <p className="text-sm text-[#444651] mt-1">
                Prueba limpiar los filtros o registra una nueva incidencia ciudadana.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchFolio('');
                  setStatusFilter('Todos');
                  onChangeTab('nuevo');
                }}
                className="mt-5 min-h-[42px] px-5 py-2 rounded-lg bg-[#eab308] hover:bg-[#f7be1d] text-[#0f172a] font-bold text-sm transition-colors cursor-pointer"
              >
                Crear nuevo reporte
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMyReports.map((reporte) => {
                const isExpanded =
                  expandedFolio === reporte.folio || filteredMyReports.length === 1;

                return (
                  <article
                    key={reporte.folio}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
                  >
                    <div className="p-5 sm:p-6">
                      {/* Fila superior: Folio + metadatos limpios sin pills + Estado */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span className="font-mono text-sm sm:text-base font-bold text-[#00236f] tabular-nums">
                              {reporte.folio}
                            </span>
                            <span className="text-slate-300" aria-hidden="true">·</span>
                            <span className="text-xs sm:text-sm font-semibold text-[#131b2e]">
                              {reporte.categoria}
                            </span>
                            <span className="text-slate-300" aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#444651]">
                              <MapPin className="w-3.5 h-3.5 text-[#1e3a8a] shrink-0" aria-hidden="true" />
                              <span>{reporte.ubicacion}</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 tabular-nums">
                            Registrado el {formatDateTimeEs(reporte.creadoEnISO)} · Canal: {reporte.canal}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                          <StatusBadge estado={reporte.estado} />
                        </div>
                      </div>

                      {/* Descripción y referencia */}
                      <div className="mt-4 space-y-1.5">
                        <p className="text-sm text-[#131b2e] leading-relaxed">
                          {reporte.descripcion}
                        </p>
                        <p className="text-xs text-[#444651]">
                          <span className="font-semibold">Referencia:</span> {reporte.referencia}
                        </p>
                      </div>

                      {/* Institución remitida (visible al ciudadano cuando aplica) */}
                      {reporte.institucionRemitida && (
                        <div className="mt-4 px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] border border-[#dce1ff] flex items-center gap-2 text-xs sm:text-sm text-[#00236f]">
                          <Building2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>
                            Institución asignada o remitida:{' '}
                            <strong>{reporte.institucionRemitida}</strong>
                          </span>
                        </div>
                      )}

                      {/* Toggle historial */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5 tabular-nums">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Última actualización: {formatDateTimeEs(reporte.actualizadoEnISO)}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFolio(isExpanded ? null : reporte.folio)
                          }
                          className="text-xs font-semibold text-[#1d4ed8] hover:text-[#00236f] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {isExpanded
                              ? 'Ocultar historial'
                              : `Ver cambios de estado (${reporte.historialEstados.length})`}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Línea de tiempo ciudadana (SIN notas internas del personal) */}
                    {isExpanded && (
                      <div className="bg-[#faf8ff] border-t border-slate-200 px-5 sm:px-6 py-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#444651] mb-3">
                          Historial de cambios de estado
                        </h4>
                        <ol className="space-y-3">
                          {reporte.historialEstados.map((item) => (
                            <li
                              key={item.id}
                              className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 pb-3 last:pb-0 border-b last:border-b-0 border-slate-200/70"
                            >
                              <div className="flex items-start gap-3">
                                <StatusBadge estado={item.estado} compact />
                                <div className="text-xs sm:text-sm text-[#131b2e]">
                                  <p>{item.resumenCiudadano}</p>
                                  {item.institucionRemitida && (
                                    <p className="text-xs text-[#1e3a8a] font-medium mt-0.5">
                                      Entidad: {item.institucionRemitida}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap sm:text-right">
                                {formatDateTimeEs(item.fechaISO)}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

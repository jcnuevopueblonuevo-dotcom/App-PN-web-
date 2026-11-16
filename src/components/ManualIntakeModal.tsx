import React, { useEffect, useState } from 'react';
import { Lock, X } from 'lucide-react';
import {
  CANALES_MANUALES,
  CATEGORIAS_OPERATIVAS,
  ESTADOS_FLUJO,
  INSTITUCIONES_OPERATIVAS,
} from '../data/catalogs';
import { CanalManual, EstadoReporte } from '../types/portal';
import { LocationSelector } from './LocationSelector';

interface ManualIntakeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitManualReport: (payload: {
    canal: CanalManual;
    solicitanteNombre: string;
    solicitanteTelefono: string;
    ubicacion: string;
    categoria: string;
    referencia: string;
    descripcion: string;
    estado: EstadoReporte;
    institucionRemitida: string;
    notaInternaInicial: string;
  }) => void;
}

export const ManualIntakeModal: React.FC<ManualIntakeModalProps> = ({
  open,
  onClose,
  onSubmitManualReport,
}) => {
  const [canal, setCanal] = useState<CanalManual>('WhatsApp');
  const [solicitanteNombre, setSolicitanteNombre] = useState('');
  const [solicitanteTelefono, setSolicitanteTelefono] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [referencia, setReferencia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<EstadoReporte>('Recibido');
  const [institucionRemitida, setInstitucionRemitida] = useState('');
  const [notaInternaInicial, setNotaInternaInicial] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const resetForm = () => {
    setCanal('WhatsApp');
    setSolicitanteNombre('');
    setSolicitanteTelefono('');
    setUbicacion('');
    setCategoria('');
    setReferencia('');
    setDescripcion('');
    setEstado('Recibido');
    setInstitucionRemitida('');
    setNotaInternaInicial('');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!solicitanteNombre.trim()) {
      nextErrors.solicitanteNombre = 'Ingresa el nombre del vecino o solicitante.';
    }
    if (!ubicacion.trim()) {
      nextErrors.ubicacion = 'Selecciona una ubicación del catálogo.';
    }
    if (!categoria.trim()) {
      nextErrors.categoria = 'Selecciona una categoría.';
    }
    if (!referencia.trim()) {
      nextErrors.referencia = 'Indica un punto de referencia.';
    }
    if (!descripcion.trim() || descripcion.trim().length < 8) {
      nextErrors.descripcion = 'Describe brevemente la solicitud (mínimo 8 caracteres).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmitManualReport({
      canal,
      solicitanteNombre: solicitanteNombre.trim(),
      solicitanteTelefono: solicitanteTelefono.trim(),
      ubicacion: ubicacion.trim(),
      categoria: categoria.trim(),
      referencia: referencia.trim(),
      descripcion: descripcion.trim(),
      estado,
      institucionRemitida: institucionRemitida.trim(),
      notaInternaInicial: notaInternaInicial.trim(),
    });

    resetForm();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-intake-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0f172a]/55 backdrop-blur-[2px]"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Cabecera del modal */}
        <div className="px-5 sm:px-6 py-4 bg-[#00236f] text-white flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 id="manual-intake-title" className="font-display text-lg font-bold">
              Registrar solicitud manual
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Ingreso operativo para reportes recibidos por WhatsApp, Instagram, llamada o recepción.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo scrollable */}
        <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Canal de recepción */}
          <div>
            <span className="block text-sm font-semibold text-[#131b2e] mb-2">
              Canal de recepción
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CANALES_MANUALES.map((item) => {
                const active = canal === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCanal(item)}
                    className={`min-h-[42px] px-3 py-2 rounded-lg text-sm font-semibold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#00236f] text-white border-[#00236f]'
                        : 'bg-white text-[#131b2e] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="manual-nombre"
                className="block text-sm font-semibold text-[#131b2e] mb-1.5"
              >
                Nombre del solicitante
              </label>
              <input
                id="manual-nombre"
                type="text"
                value={solicitanteNombre}
                onChange={(e) => {
                  setSolicitanteNombre(e.target.value);
                  if (errors.solicitanteNombre) {
                    setErrors((prev) => ({ ...prev, solicitanteNombre: '' }));
                  }
                }}
                placeholder="Ej. Roberto Sánchez"
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 ${
                  errors.solicitanteNombre
                    ? 'border-2 border-[#dc2626]'
                    : 'border border-slate-300 focus:border-[#1d4ed8]'
                }`}
              />
              {errors.solicitanteNombre && (
                <p className="mt-1 text-xs font-medium text-[#dc2626]">
                  {errors.solicitanteNombre}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="manual-telefono"
                className="block text-sm font-semibold text-[#131b2e] mb-1.5"
              >
                Teléfono o usuario (opcional)
              </label>
              <input
                id="manual-telefono"
                type="text"
                value={solicitanteTelefono}
                onChange={(e) => setSolicitanteTelefono(e.target.value)}
                placeholder="Ej. 6500-1234 o @vecino"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg text-sm bg-white border border-slate-300 focus:outline-none focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="manual-ubicacion"
                className="block text-sm font-semibold text-[#131b2e] mb-1.5"
              >
                Ubicación
              </label>
              <LocationSelector
                id="manual-ubicacion"
                value={ubicacion}
                onChange={(val) => {
                  setUbicacion(val);
                  if (errors.ubicacion) setErrors((prev) => ({ ...prev, ubicacion: '' }));
                }}
                error={errors.ubicacion}
                required
              />
              {errors.ubicacion && (
                <p className="mt-1 text-xs font-medium text-[#dc2626]">{errors.ubicacion}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="manual-categoria"
                className="block text-sm font-semibold text-[#131b2e] mb-1.5"
              >
                Categoría
              </label>
              <select
                id="manual-categoria"
                value={categoria}
                onChange={(e) => {
                  setCategoria(e.target.value);
                  if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: '' }));
                }}
                className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 ${
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
                <p className="mt-1 text-xs font-medium text-[#dc2626]">{errors.categoria}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="manual-referencia"
              className="block text-sm font-semibold text-[#131b2e] mb-1.5"
            >
              Referencia del lugar
            </label>
            <input
              id="manual-referencia"
              type="text"
              value={referencia}
              onChange={(e) => {
                setReferencia(e.target.value);
                if (errors.referencia) setErrors((prev) => ({ ...prev, referencia: '' }));
              }}
              placeholder="Ej. Detrás de la estación de bomberos, casa #12"
              className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 ${
                errors.referencia
                  ? 'border-2 border-[#dc2626]'
                  : 'border border-slate-300 focus:border-[#1d4ed8]'
              }`}
            />
            {errors.referencia && (
              <p className="mt-1 text-xs font-medium text-[#dc2626]">{errors.referencia}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="manual-descripcion"
              className="block text-sm font-semibold text-[#131b2e] mb-1.5"
            >
              Descripción de la solicitud
            </label>
            <textarea
              id="manual-descripcion"
              rows={3}
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                if (errors.descripcion) setErrors((prev) => ({ ...prev, descripcion: '' }));
              }}
              placeholder="Detalle reportado por el vecino..."
              className={`w-full px-3.5 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 ${
                errors.descripcion
                  ? 'border-2 border-[#dc2626]'
                  : 'border border-slate-300 focus:border-[#1d4ed8]'
              }`}
            />
            {errors.descripcion && (
              <p className="mt-1 text-xs font-medium text-[#dc2626]">{errors.descripcion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="manual-estado"
                className="block text-sm font-semibold text-[#131b2e] mb-1.5"
              >
                Estado inicial
              </label>
              <select
                id="manual-estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoReporte)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg text-sm bg-white border border-slate-300 focus:outline-none focus:border-[#1d4ed8]"
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
                htmlFor="manual-institucion"
                className="block text-sm font-semibold text-[#131b2e] mb-1.5"
              >
                Institución remitida (opcional)
              </label>
              <select
                id="manual-institucion"
                value={institucionRemitida}
                onChange={(e) => setInstitucionRemitida(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg text-sm bg-white border border-slate-300 focus:outline-none focus:border-[#1d4ed8]"
              >
                <option value="">Sin remitir / Atención directa</option>
                {INSTITUCIONES_OPERATIVAS.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#faf8ff] border border-slate-200 rounded-lg p-3.5">
            <label
              htmlFor="manual-nota"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#444651] mb-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#00236f]" aria-hidden="true" />
              <span>Nota interna inicial (solo visible para personal)</span>
            </label>
            <textarea
              id="manual-nota"
              rows={2}
              value={notaInternaInicial}
              onChange={(e) => setNotaInternaInicial(e.target.value)}
              placeholder="Anotación operativa interna, número de chat o referencia de seguimiento..."
              className="w-full px-3 py-2 rounded-md text-sm bg-white border border-slate-300 focus:outline-none focus:border-[#1d4ed8]"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-[#131b2e] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-lg bg-[#eab308] hover:bg-[#f7be1d] text-sm font-bold text-[#0f172a] cursor-pointer"
            >
              Guardar y generar folio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

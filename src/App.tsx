import React, { useEffect, useState } from 'react';
import { ClipboardList, FilePlus2, Inbox, PlusCircle, ShieldCheck, User } from 'lucide-react';
import { CitizenPortal } from './components/CitizenPortal';
import { DemoProfileBar } from './components/DemoProfileBar';
import { ManualIntakeModal } from './components/ManualIntakeModal';
import { PortalHeader, VecinoTab } from './components/PortalHeader';
import { StaffConsole } from './components/StaffConsole';
import { PERFILES_DEMO } from './data/catalogs';
import { CanalManual, EstadoReporte, PerfilId, Reporte } from './types/portal';
import {
  generateNextFolio,
  loadActiveProfile,
  loadReports,
  resetDemoData,
  saveActiveProfile,
  saveReports,
} from './utils/storage';

function buildCitizenStatusSummary(estado: EstadoReporte, institucion: string): string {
  switch (estado) {
    case 'Recibido':
      return 'Solicitud registrada y en espera de revisión operativa.';
    case 'En proceso':
      return institucion
        ? `Caso en atención operativa en coordinación con ${institucion}.`
        : 'Caso en revisión o atención por cuadrilla de la Junta Comunal.';
    case 'Remitido':
      return institucion
        ? `Caso remitido formalmente a ${institucion} para su atención.`
        : 'Caso remitido a la entidad competente correspondiente.';
    case 'Resuelto':
      return institucion
        ? `Caso marcado como resuelto (gestión junto a ${institucion}).`
        : 'Caso atendido y marcado como resuelto por la Junta Comunal.';
  }
}

export default function App() {
  const [activeProfile, setActiveProfile] = useState<PerfilId>(() => loadActiveProfile());
  const [vecinoTab, setVecinoTab] = useState<VecinoTab>('nuevo');
  const [reports, setReports] = useState<Reporte[]>(() => loadReports());
  const [selectedStaffFolio, setSelectedStaffFolio] = useState<string | null>(() => {
    const initial = loadReports();
    return initial[0]?.folio ?? null;
  });
  const [manualModalOpen, setManualModalOpen] = useState(false);

  useEffect(() => {
    saveReports(reports);
  }, [reports]);

  useEffect(() => {
    saveActiveProfile(activeProfile);
  }, [activeProfile]);

  const handleCreateCitizenReport = (payload: {
    ubicacion: string;
    categoria: string;
    referencia: string;
    descripcion: string;
  }): Reporte => {
    const nowISO = new Date().toISOString();
    const folio = generateNextFolio(reports);
    const vecino = PERFILES_DEMO.vecino;

    const newReport: Reporte = {
      folio,
      ubicacion: payload.ubicacion,
      categoria: payload.categoria,
      referencia: payload.referencia,
      descripcion: payload.descripcion,
      estado: 'Recibido',
      canal: 'Portal Web',
      institucionRemitida: '',
      creadoEnISO: nowISO,
      actualizadoEnISO: nowISO,
      solicitanteNombre: vecino.nombre,
      solicitanteTelefono: '6412-8830',
      creadoPorPerfil: 'vecino',
      perteneceAVecinoDemo: true,
      historialEstados: [
        {
          id: `hist-${Date.now()}`,
          estado: 'Recibido',
          fechaISO: nowISO,
          resumenCiudadano: 'Solicitud ingresada por el portal ciudadano de Pueblo Nuevo.',
          actualizadoPor: 'Sistema JCPN',
        },
      ],
      notasInternas: [],
    };

    setReports((prev) => [newReport, ...prev]);
    setSelectedStaffFolio(newReport.folio);
    return newReport;
  };

  const handleCreateManualReport = (payload: {
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
  }) => {
    const nowISO = new Date().toISOString();
    const folio = generateNextFolio(reports);
    const staff = PERFILES_DEMO.personal;

    const newReport: Reporte = {
      folio,
      ubicacion: payload.ubicacion,
      categoria: payload.categoria,
      referencia: payload.referencia,
      descripcion: payload.descripcion,
      estado: payload.estado,
      canal: payload.canal,
      institucionRemitida: payload.institucionRemitida,
      creadoEnISO: nowISO,
      actualizadoEnISO: nowISO,
      solicitanteNombre: payload.solicitanteNombre,
      solicitanteTelefono: payload.solicitanteTelefono || undefined,
      creadoPorPerfil: 'personal',
      perteneceAVecinoDemo: false,
      historialEstados: [
        {
          id: `hist-${Date.now()}`,
          estado: payload.estado,
          fechaISO: nowISO,
          institucionRemitida: payload.institucionRemitida || undefined,
          resumenCiudadano: `Solicitud registrada manualmente desde canal ${payload.canal}.`,
          actualizadoPor: staff.nombre,
        },
      ],
      notasInternas: payload.notaInternaInicial
        ? [
            {
              id: `nota-${Date.now()}`,
              autor: staff.nombre,
              fechaISO: nowISO,
              contenido: payload.notaInternaInicial,
            },
          ]
        : [],
    };

    setReports((prev) => [newReport, ...prev]);
    setSelectedStaffFolio(newReport.folio);
  };

  const handleUpdateStaffCase = (payload: {
    folio: string;
    estado: EstadoReporte;
    institucionRemitida: string;
    resumenCiudadano: string;
    notaInterna: string;
  }) => {
    const nowISO = new Date().toISOString();
    const staff = PERFILES_DEMO.personal;

    setReports((prev) =>
      prev.map((reporte) => {
        if (reporte.folio !== payload.folio) return reporte;

        const statusChanged = reporte.estado !== payload.estado;
        const institutionChanged =
          reporte.institucionRemitida !== payload.institucionRemitida;
        const hasCitizenSummary = Boolean(payload.resumenCiudadano);

        const nextHistorial = [...reporte.historialEstados];
        if (statusChanged || institutionChanged || hasCitizenSummary) {
          nextHistorial.push({
            id: `hist-${Date.now()}`,
            estado: payload.estado,
            fechaISO: nowISO,
            institucionRemitida: payload.institucionRemitida || undefined,
            resumenCiudadano:
              payload.resumenCiudadano ||
              buildCitizenStatusSummary(payload.estado, payload.institucionRemitida),
            actualizadoPor: staff.nombre,
          });
        }

        const nextNotas = [...reporte.notasInternas];
        if (payload.notaInterna) {
          nextNotas.unshift({
            id: `nota-${Date.now()}`,
            autor: staff.nombre,
            fechaISO: nowISO,
            contenido: payload.notaInterna,
          });
        }

        return {
          ...reporte,
          estado: payload.estado,
          institucionRemitida: payload.institucionRemitida,
          actualizadoEnISO: nowISO,
          historialEstados: nextHistorial,
          notasInternas: nextNotas,
        };
      })
    );
  };

  const handleResetDemo = () => {
    const fresh = resetDemoData();
    setReports(fresh);
    setSelectedStaffFolio(fresh[0]?.folio ?? null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
      <PortalHeader
        activeProfile={activeProfile}
        vecinoTab={vecinoTab}
        onSelectVecinoTab={setVecinoTab}
        onOpenManualModal={() => setManualModalOpen(true)}
      />

      <DemoProfileBar
        activeProfile={activeProfile}
        onSwitchProfile={(profile) => setActiveProfile(profile)}
        onResetDemoData={handleResetDemo}
        totalReports={reports.length}
      />

      <main className="flex-1">
        {activeProfile === 'vecino' ? (
          <CitizenPortal
            activeTab={vecinoTab}
            onChangeTab={setVecinoTab}
            reports={reports}
            onCreateReport={handleCreateCitizenReport}
          />
        ) : (
          <StaffConsole
            reports={reports}
            selectedFolio={selectedStaffFolio}
            onSelectFolio={setSelectedStaffFolio}
            onUpdateCase={handleUpdateStaffCase}
            onOpenManualModal={() => setManualModalOpen(true)}
          />
        )}
      </main>

      <footer className="hidden md:block border-t border-slate-200 bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#444651]">
          <span>
            Junta Comunal de Pueblo Nuevo · Corregimiento de Pueblo Nuevo, Distrito de Panamá
          </span>
          <span>
            Vista previa interactiva con almacenamiento local en navegador
          </span>
        </div>
      </footer>

      {/* Navegación móvil compacta (<= 56px de alto) */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-white border-t border-slate-200 grid grid-cols-3"
      >
        {activeProfile === 'vecino' ? (
          <>
            <button
              type="button"
              onClick={() => {
                setVecinoTab('nuevo');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold cursor-pointer ${
                vecinoTab === 'nuevo' ? 'text-[#00236f]' : 'text-slate-500'
              }`}
            >
              <FilePlus2 className="w-4 h-4" aria-hidden="true" />
              <span>Reportar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setVecinoTab('mis-reportes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold cursor-pointer ${
                vecinoTab === 'mis-reportes' ? 'text-[#00236f]' : 'text-slate-500'
              }`}
            >
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
              <span>Mis reportes</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveProfile('personal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-slate-600 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Personal</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#00236f] cursor-pointer"
            >
              <Inbox className="w-4 h-4" aria-hidden="true" />
              <span>Bandeja</span>
            </button>
            <button
              type="button"
              onClick={() => setManualModalOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#92400e] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Manual</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveProfile('vecino');
                setVecinoTab('mis-reportes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-slate-600 cursor-pointer"
            >
              <User className="w-4 h-4" aria-hidden="true" />
              <span>Vecinos</span>
            </button>
          </>
        )}
      </nav>

      <ManualIntakeModal
        open={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onSubmitManualReport={handleCreateManualReport}
      />
    </div>
  );
}

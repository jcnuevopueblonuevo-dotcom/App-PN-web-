export type EstadoReporte = 'Recibido' | 'En proceso' | 'Remitido' | 'Resuelto';

export type CanalManual = 'WhatsApp' | 'Instagram' | 'Llamada' | 'Recepción';
export type CanalIngreso = 'Portal Web' | CanalManual;

export type PerfilId = 'vecino' | 'personal';

export interface PerfilDemo {
  id: PerfilId;
  nombre: string;
  rol: string;
  identificador: string;
  ubicacionHabitual?: string;
}

export interface HistorialEstado {
  id: string;
  estado: EstadoReporte;
  fechaISO: string;
  institucionRemitida?: string;
  resumenCiudadano: string;
  actualizadoPor: string;
}

export interface NotaInterna {
  id: string;
  autor: string;
  fechaISO: string;
  contenido: string;
}

export interface Reporte {
  folio: string;
  ubicacion: string;
  categoria: string;
  referencia: string;
  descripcion: string;
  estado: EstadoReporte;
  canal: CanalIngreso;
  institucionRemitida: string;
  creadoEnISO: string;
  actualizadoEnISO: string;
  solicitanteNombre: string;
  solicitanteTelefono?: string;
  creadoPorPerfil: PerfilId;
  perteneceAVecinoDemo: boolean;
  historialEstados: HistorialEstado[];
  notasInternas: NotaInterna[];
}

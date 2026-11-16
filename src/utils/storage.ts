import { SEED_REPORTS } from '../data/seedReports';
import { PerfilId, Reporte } from '../types/portal';

const REPORTS_STORAGE_KEY = 'jcpn_portal_reports_v1';
const PROFILE_STORAGE_KEY = 'jcpn_portal_active_profile_v1';

export function loadReports(): Reporte[] {
  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(SEED_REPORTS));
      return SEED_REPORTS;
    }
    const parsed = JSON.parse(raw) as Reporte[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(SEED_REPORTS));
      return SEED_REPORTS;
    }
    return parsed;
  } catch {
    return SEED_REPORTS;
  }
}

export function saveReports(reports: Reporte[]): void {
  try {
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function resetDemoData(): Reporte[] {
  saveReports(SEED_REPORTS);
  return SEED_REPORTS;
}

export function loadActiveProfile(): PerfilId {
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw === 'vecino' || raw === 'personal') {
      return raw;
    }
    return 'vecino';
  } catch {
    return 'vecino';
  }
}

export function saveActiveProfile(profile: PerfilId): void {
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, profile);
  } catch {
    // Ignore storage errors
  }
}

export function generateNextFolio(existingReports: Reporte[]): string {
  const year = new Date().getFullYear();
  const prefix = `JCPN-${year}-`;
  let maxNumber = 145;

  for (const r of existingReports) {
    if (r.folio.startsWith(prefix)) {
      const numericPart = Number.parseInt(r.folio.slice(prefix.length), 10);
      if (!Number.isNaN(numericPart) && numericPart > maxNumber) {
        maxNumber = numericPart;
      }
    }
  }

  return `${prefix}${String(maxNumber + 1).padStart(4, '0')}`;
}

export function formatDateTimeEs(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-PA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatShortDateEs(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-PA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

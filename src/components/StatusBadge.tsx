import React from 'react';
import { ArrowUpRight, CheckCircle2, Clock, Wrench } from 'lucide-react';
import { EstadoReporte } from '../types/portal';

interface StatusBadgeProps {
  estado: EstadoReporte;
  compact?: boolean;
}

const STATUS_STYLES: Record<
  EstadoReporte,
  {
    bg: string;
    text: string;
    border: string;
    Icon: React.FC<{ className?: string }>;
  }
> = {
  Recibido: {
    bg: 'bg-[#fef3c7]',
    text: 'text-[#92400e]',
    border: 'border-[#fcd34d]',
    Icon: Clock,
  },
  'En proceso': {
    bg: 'bg-[#dbeafe]',
    text: 'text-[#1e40af]',
    border: 'border-[#93c5fd]',
    Icon: Wrench,
  },
  Remitido: {
    bg: 'bg-[#ffedd5]',
    text: 'text-[#9a3412]',
    border: 'border-[#fdba74]',
    Icon: ArrowUpRight,
  },
  Resuelto: {
    bg: 'bg-[#dcfce7]',
    text: 'text-[#166534]',
    border: 'border-[#86efac]',
    Icon: CheckCircle2,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ estado, compact = false }) => {
  const style = STATUS_STYLES[estado];
  const Icon = style.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-semibold whitespace-nowrap shrink-0 ${style.bg} ${style.text} ${style.border} ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{estado}</span>
    </span>
  );
};

import React from 'react';

interface EscudoJCPNProps {
  className?: string;
}

export const EscudoJCPN: React.FC<EscudoJCPNProps> = ({ className = 'w-9 h-9' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Escudo exterior dorado institucional */}
      <path
        d="M32 4L56 12V31C56 45.2 45.8 55.6 32 60C18.2 55.6 8 45.2 8 31V12L32 4Z"
        fill="#EAB308"
      />
      {/* Campo interior azul institucional */}
      <path
        d="M32 7.2L52.6 14.1V30.8C52.6 43.1 43.8 52.1 32 56.1C20.2 52.1 11.4 43.1 11.4 30.8V14.1L32 7.2Z"
        fill="#00236F"
      />
      {/* Franja superior dorada con estrella cívica */}
      <path
        d="M11.4 22.5H52.6V25.5H11.4V22.5Z"
        fill="#EAB308"
      />
      {/* Estrella superior */}
      <path
        d="M32 10.6L33.35 14.35H37.3L34.1 16.65L35.3 20.4L32 18.1L28.7 20.4L29.9 16.65L26.7 14.35H30.65L32 10.6Z"
        fill="#F7BE1D"
      />
      {/* Silueta arquitectónica / comunidad de Pueblo Nuevo */}
      <path
        d="M21 43V32.5L26.5 29V43H21Z"
        fill="#FFFFFF"
        fillOpacity="0.92"
      />
      <path
        d="M28.5 43V27.5L32 25.5L35.5 27.5V43H28.5Z"
        fill="#F7BE1D"
      />
      <path
        d="M37.5 43V32.5L43 29V43H37.5Z"
        fill="#FFFFFF"
        fillOpacity="0.92"
      />
      {/* Puente / base comunitaria */}
      <path
        d="M17.5 45.5C22 43.2 27 42.2 32 42.2C37 42.2 42 43.2 46.5 45.5V47.8C41.8 45.7 36.9 44.8 32 44.8C27.1 44.8 22.2 45.7 17.5 47.8V45.5Z"
        fill="#EAB308"
      />
    </svg>
  );
};

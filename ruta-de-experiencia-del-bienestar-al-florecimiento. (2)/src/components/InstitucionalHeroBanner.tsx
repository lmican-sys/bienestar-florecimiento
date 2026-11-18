import React, { useState } from 'react';
import { Sparkles, Compass, CheckCircle2, ChevronDown, ChevronUp, Layers, Target } from 'lucide-react';

interface InstitucionalHeroBannerProps {
  compacto?: boolean;
  onExplorarModelo?: () => void;
}

export const InstitucionalHeroBanner: React.FC<InstitucionalHeroBannerProps> = ({
  compacto = false,
  onExplorarModelo
}) => {
  const [expandido, setExpandido] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden mb-6 relative transition-all">
      {/* Detalle visual sutil superior verde Areandina */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#7FB536] via-[#94cf44] to-[#414141]" />

      <div className="p-5 sm:p-7 relative">
        {/* Fondo decorativo con marca de agua sutil */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#f5faee] to-transparent pointer-events-none -z-0 opacity-80" />

        <div className="relative z-10">
          {/* Fila superior: Escudo/Logo e insignia institucional */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f8eb] text-[#4d751c] text-xs font-black uppercase tracking-wider border border-[#cde8ab]">
                <Sparkles className="w-3.5 h-3.5 text-[#7FB536]" />
                Fundación Universitaria del Área Andina
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-gray-400">
                •
              </span>
              <span className="hidden sm:inline-block text-xs font-bold text-[#414141]">
                Red de Agentes Transformadores
              </span>
            </div>

            <button
              onClick={() => setExpandido(!expandido)}
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#414141] transition-colors"
              title={expandido ? 'Minimizar encabezado' : 'Expandir visión completa'}
            >
              <span>{expandido ? 'Ocultar visión' : 'Ver visión y propósito'}</span>
              {expandido ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* TÍTULO GRANDE SOLICITADO */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#414141] tracking-tight leading-[1.15] mb-2 font-sans break-words">
            Ruta de Experiencia - Del Bienestar al Florecimiento
          </h1>

          {/* SUBTÍTULO SOLICITADO */}
          <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#7FB536] tracking-tight mb-2 leading-snug">
            Sistematizar para transformar experiencias
          </p>

          {/* DESCRIPCIÓN / VISIÓN Y REQUERIMIENTOS */}
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 max-w-4xl leading-relaxed mb-4">
            Visión y requerimientos para ajustar la herramienta de sistematización, rediseño, experimentación y validación de experiencias
          </p>

          {/* BLOQUE DE PROPÓSITO DESTACADO */}
          {expandido && (
            <div className="mt-4 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#F8FAF6] to-white border border-[#cde8ab] shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-[#7FB536] text-white shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#4d751c] bg-[#eef7e4] px-2.5 py-0.5 rounded-md border border-[#cbe5a9]">
                      PROPÓSITO
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      Principio Rector del Sistema
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#303030] leading-relaxed">
                    Convertir el Modelo «Del Bienestar al Florecimiento» en una herramienta práctica que ayude a comprender experiencias reales, decidir qué conservar o transformar, diseñar mejoras coherentes, pilotearlas, reunir evidencia y validar aprendizajes.
                  </p>
                </div>

                {onExplorarModelo && (
                  <button
                    onClick={onExplorarModelo}
                    className="shrink-0 mt-2 sm:mt-0 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 text-xs font-bold text-[#414141] transition-colors shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#7FB536]" />
                    <span>Ver el Modelo</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Sparkles,
  BookOpen,
  Printer,
  LayoutDashboard,
  Layers,
  Users,
  ShieldCheck,
  FileText,
  FileSignature,
  Plus
} from 'lucide-react';

export type TabNavegacion =
  | 'tablero'
  | 'diagnostico'
  | 'propuesta_16'
  | 'sala_validacion'
  | 'agentes_firmas'
  | 'documento_definitivo';

interface NavbarProps {
  tabActivo: TabNavegacion;
  onCambiarTab: (tab: TabNavegacion) => void;
  onReset: () => void;
  onOpenFramework: () => void;
  onPrint: () => void;
  hasActiveExperience: boolean;
  firmasPendientesCount?: number;
  dictamenActual?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  tabActivo,
  onCambiarTab,
  onReset,
  onOpenFramework,
  onPrint,
  hasActiveExperience,
  firmasPendientesCount = 0,
  dictamenActual
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      {/* Barra Superior con Logo y Slogan */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo y Nombre Principal */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onCambiarTab('tablero')}
              className="flex items-center gap-3 text-left focus:outline-hidden group"
              aria-label="Ir al inicio de Ruta de Experiencia Areandina"
            >
              <img
                src="/assets/aistudio/Mesa_de_trabajo_1_copia_77a0697d.png"
                alt="Areandina - Fundación Universitaria del Área Andina"
                className="h-8 sm:h-11 w-auto max-w-[92px] sm:max-w-none object-contain transition-transform group-hover:scale-102"
              />
              <div className="hidden sm:block border-l border-gray-200 pl-3">
                <span className="text-xs uppercase tracking-wider font-extrabold text-[#7FB536] block">
                  Ruta de Experiencia
                </span>
                <span className="text-sm sm:text-base font-black text-[#414141] leading-tight block">
                  Del Bienestar al Florecimiento
                </span>
              </div>
            </button>
          </div>

          {/* Badges Institucionales */}
          <div className="hidden xl:flex items-center gap-2 text-xs">
            <div className="bg-[#f2f8eb] text-[#4d751c] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border border-[#cbe5a9]">
              <span className="w-2 h-2 rounded-full bg-[#7FB536]"></span>
              <span>YO • OTRO • ENTORNO • NOSOTROS</span>
            </div>
            <div className="bg-gray-100 text-[#414141] px-3 py-1 rounded-full font-medium border border-gray-200">
              <span>SER • CONVIVIR • TRASCENDER</span>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenFramework}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold p-2 sm:px-3 sm:py-2 rounded-lg text-[#414141] bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
              aria-label="Consultar Guía Modelo"
              title="Consultar dimensiones y reglas del Modelo de Florecimiento"
            >
              <BookOpen className="w-4 h-4 text-[#7FB536]" />
              <span className="hidden sm:inline">Guía Modelo</span>
            </button>

            {hasActiveExperience && (
              <button
                onClick={onPrint}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold p-2 sm:px-3 sm:py-2 rounded-lg text-[#414141] bg-white hover:bg-gray-50 transition-colors border border-gray-300"
                aria-label="Imprimir o exportar PDF"
                title="Imprimir o exportar documento institucional a PDF"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <span className="hidden sm:inline">Imprimir PDF</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 text-xs font-bold p-2 sm:px-3 sm:py-2 rounded-lg text-white bg-[#7FB536] hover:bg-[#6ea12d] transition-all shadow-xs"
              aria-label="Comenzar una nueva experiencia"
              title="Comenzar un nuevo registro de experiencia"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Experiencia</span>
            </button>
          </div>
        </div>
      </div>

      {/* Franja de Slogan Areandina */}
      <div className="bg-[#414141] text-white text-[11px] py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="text-[#94cf44] font-bold">¡Sé parte de la generación que transforma!</span>
        <span className="text-gray-400 hidden sm:inline">•</span>
        <span className="text-gray-300 hidden sm:inline">
          Red de Agentes Transformadores • Sistema Inteligente de Validación y Aprobación
        </span>
      </div>

      {/* Barra de Pestañas de Navegación Institucional */}
      <div className="bg-white border-t border-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5 min-w-max">
          <button
            onClick={() => onCambiarTab('tablero')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tabActivo === 'tablero'
                ? 'bg-[#7FB536] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>1. Tablero de Control</span>
          </button>

          <button
            onClick={() => onCambiarTab('diagnostico')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tabActivo === 'diagnostico'
                ? 'bg-[#7FB536] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Base de la propuesta</span>
          </button>

          <button
            onClick={() => onCambiarTab('propuesta_16')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tabActivo === 'propuesta_16'
                ? 'bg-[#7FB536] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Propuesta (16 Componentes)</span>
          </button>

          <button
            onClick={() => onCambiarTab('sala_validacion')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tabActivo === 'sala_validacion'
                ? 'bg-[#7FB536] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. Sala de Validación Colectiva</span>
            {dictamenActual && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded">
                {dictamenActual}
              </span>
            )}
          </button>

          <button
            onClick={() => onCambiarTab('agentes_firmas')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tabActivo === 'agentes_firmas'
                ? 'bg-[#7FB536] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>5. Red de Agentes & Firmas</span>
            {firmasPendientesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                {firmasPendientesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onCambiarTab('documento_definitivo')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tabActivo === 'documento_definitivo'
                ? 'bg-[#7FB536] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>6. Documento Definitivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

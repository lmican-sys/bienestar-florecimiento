import React from 'react';
import {
  FileSearch,
  Users,
  Target,
  MapPin,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  FileQuestion,
  Tag
} from 'lucide-react';
import { DiagnosticoEjecutivo, TrazabilidadCategoria } from '../types/flourishing.ts';

interface DiagnosticoEjecutivoViewProps {
  diagnostico: DiagnosticoEjecutivo;
  tituloExperiencia: string;
  onEditarSintesis?: (campo: string, valor: string) => void;
}

export const DiagnosticoEjecutivoView: React.FC<DiagnosticoEjecutivoViewProps> = ({
  diagnostico,
  tituloExperiencia
}) => {
  const getBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'HECHO_DOCUMENTADO':
      case 'HECHO':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          label: 'HECHO DOCUMENTADO'
        };
      case 'PERCEPCION':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          dot: 'bg-blue-600',
          label: 'PERCEPCIÓN RECOGIDA'
        };
      case 'HIPOTESIS':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          dot: 'bg-purple-600',
          label: 'HIPÓTESIS DE TRABAJO'
        };
      case 'PROPUESTA_TRANSFORMACION':
        return {
          bg: 'bg-[#f2f8eb] text-[#4d751c] border-[#cde8ab]',
          dot: 'bg-[#7FB536]',
          label: 'PROPUESTA DE TRANSFORMACIÓN'
        };
      case 'PENDIENTE_VACIO':
      case 'VACIO_DATOS':
      default:
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
          label: 'PENDIENTE DE DEFINICIÓN'
        };
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8">
      {/* Header PARTE 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 mb-6 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#f2f8eb] text-[#5b8723]">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7FB536] block">
              PARTE 1 DE LA ENTREGA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#414141] tracking-tight">
              DIAGNÓSTICO EJECUTIVO
            </h2>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 self-start sm:self-auto">
          Trazabilidad: <strong className="text-gray-700">Hechos vs. Percepciones vs. Hipótesis</strong>
        </div>
      </div>

      {/* 1. Síntesis de la experiencia */}
      <div className="mb-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#7FB536]" />
          <span>1. Síntesis de la Experiencia</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F8FAF6] border border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Qué entendí de la experiencia:
            </span>
            <p className="text-sm font-medium text-[#414141] leading-relaxed">
              {diagnostico.sintesisExperiencia.queSeEntendio}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF6] border border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Qué se busca lograr (Propósito Real):
            </span>
            <p className="text-sm font-medium text-[#414141] leading-relaxed">
              {diagnostico.sintesisExperiencia.queSeBusca}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF6] border border-gray-200 flex items-start gap-3">
            <Users className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                A quién va dirigida (Población):
              </span>
              <p className="text-sm text-gray-700">
                {diagnostico.sintesisExperiencia.aQuienVaDirigida}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF6] border border-gray-200 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                Contexto, Sedes y Modalidad:
              </span>
              <p className="text-sm text-gray-700">
                {diagnostico.sintesisExperiencia.contextoYModalidad}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Puntos de quiebre o hallazgos principales con trazabilidad */}
      <div className="mb-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>2. Puntos de Quiebre o Hallazgos Principales</span>
        </h3>

        <div className="space-y-3">
          {diagnostico.puntosQuiebreHallazgos.map((h, i) => {
            const badge = getBadgeStyle(h.tipo);
            return (
              <div
                key={h.id || i}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#7FB536]/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                    {badge.label}
                  </span>
                  <span className="text-xs text-gray-400">Hallazgo #{i + 1}</span>
                </div>
                <p className="text-sm font-semibold text-[#414141] mb-1">
                  {h.descripcion}
                </p>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <strong className="text-gray-700">Impacto observado:</strong>{' '}
                  {h.impactoObservado}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Vacíos de información */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
          <FileQuestion className="w-4 h-4 text-blue-500" />
          <span>3. Vacíos de Información (Qué falta por definir antes de operar)</span>
        </h3>

        <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200">
          <ul className="space-y-2">
            {diagnostico.vaciosInformacion.map((vacio, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2"></span>
                <span>{vacio}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

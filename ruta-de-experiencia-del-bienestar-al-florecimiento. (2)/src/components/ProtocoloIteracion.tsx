import React, { useState } from 'react';
import {
  MessageSquare,
  FileCheck2,
  ShieldCheck,
  ClipboardList,
  Copy,
  Download,
  Printer,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import {
  ExperienciaInstitucional,
  GuionPaso,
  SalvaguardaEtica,
  IndicadorEvaluacion
} from '../types/flourishing.ts';
import { generarSalidaMarkdownOficial } from '../utils/flourishingConsultant.ts';

interface ProtocoloIteracionProps {
  experiencia: ExperienciaInstitucional;
  anexoActivo: 'guion' | 'salvaguardas' | 'evaluacion' | 'ninguno';
  onActualizarAnexoActivo: (anexo: 'guion' | 'salvaguardas' | 'evaluacion' | 'ninguno') => void;
  onPrint: () => void;
  onNavegarATab?: (tab: string) => void;
}

export const ProtocoloIteracion: React.FC<ProtocoloIteracionProps> = ({
  experiencia,
  anexoActivo = 'ninguno',
  onActualizarAnexoActivo,
  onPrint,
  onNavegarATab
}) => {
  const [copiado, setCopiado] = useState(false);
  const [mostrarMarkdownModal, setMostrarMarkdownModal] = useState(false);

  const handleCopiarMarkdown = () => {
    const md = generarSalidaMarkdownOficial(experiencia);
    navigator.clipboard.writeText(md);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleDescargarMarkdown = () => {
    const md = generarSalidaMarkdownOficial(experiencia);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sistematizacion_${experiencia.titulo.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8">
      {/* Encabezado del Protocolo de Iteración */}
      <div className="flex items-start sm:items-center justify-between pb-4 border-b border-gray-200 mb-6 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#f2f8eb] text-[#5b8723]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7FB536] block">
              FASE DE DECISIÓN Y REFINAMIENTO
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#414141] tracking-tight">
              Anexos técnicos de la experiencia
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopiarMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#414141] bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors"
            title="Copiar informe completo en formato Markdown oficial"
          >
            {copiado ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDescargarMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7FB536] hover:bg-[#6fa02d] transition-colors shadow-xs"
            title="Descargar archivo .md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar .md</span>
          </button>
        </div>
      </div>

      {/* Pregunta Directa Consultiva */}
      <div className="bg-[#F8FAF6] p-5 rounded-xl border border-[#cbe5a9] mb-6">
        <p className="text-sm font-semibold text-[#414141] mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#7FB536]" />
          <span>Iteración con el Especialista:</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
          ¿Cuál de las opciones de innovación de la matriz prefieres para tu plan de acción institucional?
          Puedes hacer clic directamente en las tarjetas de la tabla para seleccionar tu opción preferida,
          o profundizar a continuación en alguno de los 3 anexos técnicos operativos:
        </p>

        {/* Resumen de Opciones Seleccionadas en la Matriz */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-200">
          {experiencia.matrizEstrategica.map((fila, idx) => {
            const opcionActiva = fila.opcionesAccion.find(
              (o) => o.id === fila.opcionSeleccionadaId
            );
            return (
              <div
                key={fila.id}
                className="bg-white p-2.5 rounded-lg border border-gray-200 text-xs"
              >
                <span className="text-[10px] uppercase font-bold text-gray-400 block">
                  Hallazgo #{idx + 1} ({fila.dimensionPrincipal})
                </span>
                <span className="font-bold text-[#5b8723] block truncate">
                  {opcionActiva ? opcionActiva.titulo : 'Sin selección'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selector de Anexos Técnicos */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
          Profundizar en Anexos Técnicos Operativos:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Anexo 1: Guión de Facilitación */}
          <button
            type="button"
            onClick={() =>
              onActualizarAnexoActivo(anexoActivo === 'guion' ? 'ninguno' : 'guion')
            }
            className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
              anexoActivo === 'guion'
                ? 'border-[#7FB536] bg-[#fbfdf9] shadow-xs ring-1 ring-[#7FB536]/30'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <FileCheck2
                  className={`w-5 h-5 ${
                    anexoActivo === 'guion' ? 'text-[#7FB536]' : 'text-gray-500'
                  }`}
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  4 Etapas
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#414141] mb-1">
                1. Guión de Facilitación
              </h4>
              <p className="text-[11px] text-gray-500 line-clamp-2">
                Estructura paso a paso (Apertura, Desarrollo vivencial, Reflexión y Cierre con micro-compromiso).
              </p>
            </div>
            <span className="text-xs font-bold text-[#5b8723] mt-3 inline-flex items-center gap-1">
              {anexoActivo === 'guion' ? 'Ocultar anexo' : 'Ver guión paso a paso'}
              {anexoActivo === 'guion' ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </span>
          </button>

          {/* Anexo 2: Salvaguardas Éticas */}
          <button
            type="button"
            onClick={() =>
              onActualizarAnexoActivo(
                anexoActivo === 'salvaguardas' ? 'ninguno' : 'salvaguardas'
              )
            }
            className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
              anexoActivo === 'salvaguardas'
                ? 'border-[#7FB536] bg-[#fbfdf9] shadow-xs ring-1 ring-[#7FB536]/30'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck
                  className={`w-5 h-5 ${
                    anexoActivo === 'salvaguardas' ? 'text-[#7FB536]' : 'text-gray-500'
                  }`}
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  Cero Invención
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#414141] mb-1">
                2. Salvaguardas Éticas
              </h4>
              <p className="text-[11px] text-gray-500 line-clamp-2">
                Cero invenciones culturales, confidencialidad, seguridad psicológica y canales de derivación.
              </p>
            </div>
            <span className="text-xs font-bold text-[#5b8723] mt-3 inline-flex items-center gap-1">
              {anexoActivo === 'salvaguardas' ? 'Ocultar anexo' : 'Ver salvaguardas'}
              {anexoActivo === 'salvaguardas' ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </span>
          </button>

          {/* Anexo 3: Instrumento de Evaluación */}
          <button
            type="button"
            onClick={() =>
              onActualizarAnexoActivo(
                anexoActivo === 'evaluacion' ? 'ninguno' : 'evaluacion'
              )
            }
            className={`p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
              anexoActivo === 'evaluacion'
                ? 'border-[#7FB536] bg-[#fbfdf9] shadow-xs ring-1 ring-[#7FB536]/30'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <ClipboardList
                  className={`w-5 h-5 ${
                    anexoActivo === 'evaluacion' ? 'text-[#7FB536]' : 'text-gray-500'
                  }`}
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                  Métricas
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#414141] mb-1">
                3. Rúbrica y Evaluación
              </h4>
              <p className="text-[11px] text-gray-500 line-clamp-2">
                Indicadores cuantificables y métodos de comprobación del florecimiento universitario.
              </p>
            </div>
            <span className="text-xs font-bold text-[#5b8723] mt-3 inline-flex items-center gap-1">
              {anexoActivo === 'evaluacion' ? 'Ocultar anexo' : 'Ver indicadores'}
              {anexoActivo === 'evaluacion' ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* CONTENIDO DEL ANEXO 1: GUIÓN DE FACILITACIÓN */}
      {anexoActivo === 'guion' && experiencia.guionFacilitacion && (
        <div className="p-5 bg-[#F8FAF6] rounded-xl border border-gray-200 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#414141] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#7FB536]" />
              <span>Anexo Técnico 1: Guión Metodológico de Facilitación</span>
            </h4>
            <span className="text-xs text-gray-500">
              Duración total sugerida: 90 minutos
            </span>
          </div>

          <div className="space-y-4">
            {experiencia.guionFacilitacion.map((etapa, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#f2f8eb] text-[#5b8723] font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#414141]">
                      {etapa.etapa}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {etapa.tiempoMinutos} min
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-500 block mb-0.5">
                      Objetivo de la etapa:
                    </span>
                    <p className="text-gray-700">{etapa.objetivo}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 block mb-0.5">
                      Rol y postura del facilitador:
                    </span>
                    <p className="text-gray-700">{etapa.rolFacilitador}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 block mb-0.5">
                      Actividad de los participantes:
                    </span>
                    <p className="text-gray-700">{etapa.actividadParticipantes}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-500 block mb-0.5">
                      Recursos y materiales:
                    </span>
                    <p className="text-gray-700">{etapa.recursos}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO DEL ANEXO 2: SALVAGUARDAS ÉTICAS */}
      {anexoActivo === 'salvaguardas' && experiencia.salvaguardas && (
        <div className="p-5 bg-[#F8FAF6] rounded-xl border border-gray-200 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#414141] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anexo Técnico 2: Salvaguardas Éticas y Metodológicas</span>
            </h4>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Protocolo Estricto de Protección
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiencia.salvaguardas.map((salv, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h5 className="text-xs font-bold text-[#414141]">
                    {salv.principio}
                  </h5>
                </div>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                  {salv.descripcion}
                </p>
                <div className="bg-[#f2f8eb] p-2.5 rounded-lg border border-[#cbe5a9] text-xs text-[#414141]">
                  <strong className="text-[#5b8723]">Acción preventiva:</strong>{' '}
                  {salv.accionPreventiva}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO DEL ANEXO 3: RÚBRICA Y EVALUACIÓN */}
      {anexoActivo === 'evaluacion' && experiencia.instrumentoEvaluacion && (
        <div className="p-5 bg-[#F8FAF6] rounded-xl border border-gray-200 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#414141] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span>Anexo Técnico 3: Instrumento de Evaluación y Rúbrica de Florecimiento</span>
            </h4>
            <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Métricas Verificables
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs bg-white rounded-lg overflow-hidden border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-[#414141] font-bold">
                  <th className="py-2.5 px-3">Criterio de Florecimiento</th>
                  <th className="py-2.5 px-3">Dimensión Asociada</th>
                  <th className="py-2.5 px-3">Método de Medición</th>
                  <th className="py-2.5 px-3">Frecuencia</th>
                  <th className="py-2.5 px-3">Meta Cuantificable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {experiencia.instrumentoEvaluacion.map((ind, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70">
                    <td className="py-3 px-3 font-semibold text-[#414141]">
                      {ind.criterio}
                    </td>
                    <td className="py-3 px-3 text-[#5b8723] font-medium">
                      {ind.dimensionAsociada}
                    </td>
                    <td className="py-3 px-3 text-gray-600">
                      {ind.metodoMedicion}
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-mono">
                      {ind.frecuencia}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700 bg-emerald-50/40">
                      {ind.metaEsperada}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

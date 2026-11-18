import React from 'react';
import { ExperienciaInstitucional } from '../types/flourishing.ts';
import { obtenerAccionesElegidasConFicha } from '../utils/matrizHelpers.ts';

interface PrintReportViewProps {
  experiencia: ExperienciaInstitucional;
  onCerrar: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  experiencia,
  onCerrar
}) => {
  const accionesElegidas = obtenerAccionesElegidasConFicha(experiencia.matrizEstrategica);
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-8 font-sans text-[#414141]">
      {/* Botones de control (no se imprimen) */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex items-center justify-between bg-gray-100 p-4 rounded-xl border border-gray-300">
        <span className="text-sm font-bold text-[#414141]">
          Vista de Impresión / Exportación a PDF Institucional
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#7FB536] text-white rounded-lg text-xs font-bold hover:bg-[#6ea12d] transition-colors"
          >
            Imprimir o Guardar como PDF
          </button>
          <button
            onClick={onCerrar}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>

      {/* Contenido imprimible */}
      <div className="max-w-5xl mx-auto border border-gray-200 p-8 rounded-xl shadow-xs">
        {/* Encabezado Institucional */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-[#7FB536] mb-6">
          <div>
            <img
              src="/assets/aistudio/Mesa_de_trabajo_1_copia_77a0697d.png"
              alt="Logo Areandina"
              className="h-12 w-auto object-contain mb-2"
            />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Fundación Universitaria del Área Andina
            </span>
            <span className="text-base text-[#414141] font-black block">
              Ruta de Experiencia - Del Bienestar al Florecimiento
            </span>
            <span className="text-xs text-[#7FB536] font-extrabold block">
              Sistematizar para transformar experiencias
            </span>
            <span className="text-[10px] text-gray-500 block">
              Visión y requerimientos para ajustar la herramienta de sistematización, rediseño, experimentación y validación de experiencias
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-500 block">Expediente Oficial</span>
            <span className="text-xs font-bold text-gray-700 block">
              Código: {experiencia.codigoUnico}
            </span>
            <span className="text-[11px] text-gray-500 block">
              Versión: v{experiencia.versionActual} • {experiencia.fechaCreacion}
            </span>
          </div>
        </div>

        {/* Propósito Institucional en Impresión */}
        <div className="mb-6 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
          <strong className="text-[#4d751c] uppercase tracking-wider block mb-0.5">PROPÓSITO</strong>
          <p className="text-gray-700 font-medium">
            Convertir el Modelo «Del Bienestar al Florecimiento» en una herramienta práctica que ayude a comprender experiencias reales, decidir qué conservar o transformar, diseñar mejoras coherentes, pilotearlas, reunir evidencia y validar aprendizajes.
          </p>
        </div>

        {/* Título de la Experiencia */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#7FB536]">
            EXPERIENCIA SISTEMATIZADA
          </span>
          <h1 className="text-2xl font-black text-[#414141] uppercase tracking-tight mt-1">
            {experiencia.titulo}
          </h1>
        </div>

        {/* PARTE 1: DIAGNÓSTICO EJECUTIVO */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="bg-[#f2f8eb] text-[#5b8723] px-3 py-1 font-black text-xs uppercase tracking-wider inline-block rounded mb-4">
            PARTE 1: DIAGNÓSTICO EJECUTIVO
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Síntesis de la Experiencia
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-lg">
              <div>
                <strong className="block text-gray-700 mb-0.5">Qué se entendió:</strong>
                <p className="text-gray-600">{experiencia.diagnostico.sintesisExperiencia.queSeEntendio}</p>
              </div>
              <div>
                <strong className="block text-gray-700 mb-0.5">Qué se busca lograr:</strong>
                <p className="text-gray-600">{experiencia.diagnostico.sintesisExperiencia.queSeBusca}</p>
              </div>
              <div>
                <strong className="block text-gray-700 mb-0.5">A quién va dirigida:</strong>
                <p className="text-gray-600">{experiencia.diagnostico.sintesisExperiencia.aQuienVaDirigida}</p>
              </div>
              <div>
                <strong className="block text-gray-700 mb-0.5">Contexto y modalidad:</strong>
                <p className="text-gray-600">{experiencia.diagnostico.sintesisExperiencia.contextoYModalidad}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Puntos de quiebre o hallazgos principales
            </h2>
            <div className="space-y-2 text-xs">
              {experiencia.diagnostico.puntosQuiebreHallazgos.map((h, i) => (
                <div key={i} className="p-2.5 border border-gray-200 rounded">
                  <span className="font-bold text-[#414141]">
                    [{h.tipo}] {h.descripcion}
                  </span>
                  <span className="text-gray-500 block mt-0.5">
                    Impacto: {h.impactoObservado}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Vacíos de información (Qué falta por definir)
            </h2>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {experiencia.diagnostico.vaciosInformacion.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* PARTE 2: ACCIONES ELEGIDAS Y FICHA DE ACCIÓN */}
        <div className="mb-8 pb-6 border-b border-gray-200 page-break">
          <div className="bg-[#f2f8eb] text-[#5b8723] px-3 py-1 font-black text-xs uppercase tracking-wider inline-block rounded mb-4">
            PARTE 2: ACCIONES ELEGIDAS Y FICHA DE ACCIÓN
          </div>

          {accionesElegidas.length === 0 ? (
            <p className="text-xs text-gray-500 italic">
              Aún no se han registrado acciones elegidas para esta experiencia.
            </p>
          ) : (
            <table className="w-full text-left border-collapse text-xs border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-[#414141] font-bold border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300 w-1/4">Hallazgo / Necesidad</th>
                  <th className="p-2 border-r border-gray-300 w-1/3">Acción Elegida</th>
                  <th className="p-2 w-5/12">Ficha de Acción</th>
                </tr>
              </thead>
              <tbody>
                {accionesElegidas.map((item, idx) => (
                  <tr key={item.filaId || idx} className="border-b border-gray-300 align-top">
                    <td className="p-2 border-r border-gray-300">
                      {item.trazabilidad && (
                        <span className="font-bold text-[10px] text-gray-500 block">
                          [{item.trazabilidad}]
                        </span>
                      )}
                      <span className="font-semibold">{item.hallazgoNecesidad}</span>
                    </td>
                    <td className="p-2 border-r border-gray-300 bg-emerald-50/20">
                      <strong className="text-[#5b8723]">{item.accionTitulo}</strong>
                      {item.accionDescripcion && (
                        <p className="mt-1 text-gray-700">{item.accionDescripcion}</p>
                      )}
                    </td>
                    <td className="p-2 space-y-1 text-[11px]">
                      <div>
                        <strong>Producto / entregable:</strong> {item.ficha.productoEntregable}
                      </div>
                      <div>
                        <strong>Responsable:</strong> {item.ficha.responsable}
                      </div>
                      <div>
                        <strong>Cuándo:</strong> {item.ficha.cuando}
                      </div>
                      <div>
                        <strong>Recursos:</strong> {item.ficha.recursos}
                      </div>
                      <div>
                        <strong>Indicador de éxito:</strong> {item.ficha.indicadorExito}
                      </div>
                      <div>
                        <strong>Evidencia:</strong> {item.ficha.evidencia}
                      </div>
                      <div>
                        <strong>Estado:</strong> {item.ficha.estado}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Anexos Técnicos si están presentes */}
        {experiencia.guionFacilitacion && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Anexo Técnico: Guión de Facilitación Sugerido
            </h2>
            <div className="space-y-2 text-xs">
              {experiencia.guionFacilitacion.map((g, i) => (
                <div key={i} className="p-2.5 bg-gray-50 border border-gray-200 rounded">
                  <span className="font-bold text-[#414141]">
                    Etapa {i + 1}: {g.etapa} ({g.tiempoMinutos} min)
                  </span>
                  <p className="text-gray-600 mt-0.5">
                    <strong>Objetivo:</strong> {g.objetivo}
                  </p>
                  <p className="text-gray-600">
                    <strong>Rol facilitador:</strong> {g.rolFacilitador}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
          <p className="font-bold text-[#7FB536] mb-1">
            "¡Sé parte de la generación que transforma!"
          </p>
          <p>Fundación Universitaria del Área Andina • Bogotá • Pereira • Valledupar • Virtual</p>
        </div>
      </div>
    </div>
  );
};

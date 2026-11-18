import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';
import { ExperienciaInstitucional } from '../types/flourishing.ts';
import { exportarExperienciaAWord } from '../utils/wordExport.ts';
import { generarSalidaMarkdownOficial } from '../utils/flourishingConsultant.ts';
import { obtenerAccionesElegidasConFicha } from '../utils/matrizHelpers.ts';

interface DocumentoInstitucionalDefinitivoProps {
  experiencia: ExperienciaInstitucional;
  onImprimirPDF: () => void;
}

export const DocumentoInstitucionalDefinitivo: React.FC<DocumentoInstitucionalDefinitivoProps> = ({
  experiencia,
  onImprimirPDF
}) => {
  const [copiado, setCopiado] = React.useState(false);

  const accionesElegidas = obtenerAccionesElegidasConFicha(experiencia.matrizEstrategica);
  const firmasCompletadas = experiencia.agentes.filter((a) => a.estadoFirma === 'FIRMADO');
  const esCompletamenteAprobada =
    experiencia.dictamenColectivo === 'VALIDADA' &&
    firmasCompletadas.length === experiencia.agentes.length;

  const handleDescargarWord = () => {
    exportarExperienciaAWord(experiencia);
  };

  const handleCopiarMarkdown = () => {
    const md = generarSalidaMarkdownOficial(experiencia);
    navigator.clipboard.writeText(md);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Acciones de Exportación Superior */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#7FB536] block">
            FORMATO OFICIAL INSTITUCIONAL
          </span>
          <h2 className="text-xl font-black text-[#414141]">
            Documento Definitivo de Experiencia y Validación
          </h2>
          <span className="text-xs text-gray-400">
            {experiencia.codigoUnico} • Versión {experiencia.versionActual} • {firmasCompletadas.length} firmas registradas
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDescargarWord}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
            title="Descargar documento editable en formato Word (.doc)"
          >
            <Download className="w-4 h-4" />
            <span>Descargar en Word (.doc)</span>
          </button>

          <button
            onClick={onImprimirPDF}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white font-bold text-xs shadow-xs transition-colors"
            title="Imprimir o guardar en PDF limpio"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>

          <button
            onClick={handleCopiarMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
            title="Copiar texto en formato Markdown oficial"
          >
            <Copy className="w-4 h-4" />
            <span>{copiado ? '¡Copiado!' : 'Copiar MD'}</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO FORMAL DIAGRAMADO (Hoja Institucional) */}
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-300 shadow-sm max-w-4xl mx-auto space-y-8 font-sans">
        {/* Encabezado Oficial Areandina */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-[#7FB536] gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/Mesa_de_trabajo_1_copia_77a0697d.png"
              alt="Logo Areandina"
              className="h-12 w-auto object-contain"
            />
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7FB536] block">
                FUNDACIÓN UNIVERSITARIA DEL ÁREA ANDINA
              </span>
              <span className="text-sm font-bold text-[#414141] block">
                Red de Agentes Transformadores
              </span>
              <span className="text-xs text-gray-500 block">
                Modelo «Del Bienestar al Florecimiento»
              </span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-gray-200 sm:pl-4 text-xs">
            <span className="font-mono font-bold text-[#414141] block">
              {experiencia.codigoUnico}
            </span>
            <span className="text-gray-500 block">Versión Oficial: v{experiencia.versionActual}</span>
            <span className="text-[11px] text-gray-400 block">Fecha: {experiencia.fechaUltimaModificacion}</span>
          </div>
        </div>

        {/* Título de la Experiencia y Portada */}
        <div className="text-center py-6 bg-[#F8FAF6] rounded-xl border border-[#cde8ab] p-6">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#5b8723] block mb-1">
            EXPEDIENTE OFICIAL DE TRANSFORMACIÓN INSTITUCIONAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#414141] tracking-tight">
            Ruta de Experiencia - Del Bienestar al Florecimiento
          </h1>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#7FB536] tracking-tight mt-1 mb-2">
            Sistematizar para transformar experiencias
          </h2>
          <p className="text-xs text-gray-600 max-w-2xl mx-auto mb-4">
            Visión y requerimientos para ajustar la herramienta de sistematización, rediseño, experimentación y validación de experiencias
          </p>

          {/* Bloque Institucional de Propósito */}
          <div className="p-3.5 rounded-lg bg-white border border-[#cde8ab] text-left max-w-2xl mx-auto shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4d751c] bg-[#f2f8eb] px-2 py-0.5 rounded border border-[#cbe5a9] inline-block mb-1">
              PROPÓSITO
            </span>
            <p className="text-xs font-semibold text-[#414141] leading-relaxed">
              Convertir el Modelo «Del Bienestar al Florecimiento» en una herramienta práctica que ayude a comprender experiencias reales, decidir qué conservar o transformar, diseñar mejoras coherentes, pilotearlas, reunir evidencia y validar aprendizajes.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              EXPERIENCIA SISTEMATIZADA
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#414141] uppercase tracking-tight">
              {experiencia.titulo}
            </h3>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#414141] border border-gray-300">
              Sedes: Bogotá • Pereira • Valledupar • Virtual
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f2f8eb] text-[#3e6018] border border-[#cde8ab]">
              Dictamen: {experiencia.dictamenColectivo}
            </span>
          </div>
        </div>

        {/* 1. Diagnóstico Ejecutivo */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#7FB536] mb-3 pb-1 border-b border-gray-200">
            1. Diagnóstico Ejecutivo y Síntesis de la Experiencia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <strong className="text-gray-600 block mb-0.5">Qué se identificó:</strong>
              <p className="text-[#414141]">{experiencia.diagnostico.sintesisExperiencia.queSeEntendio}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <strong className="text-gray-600 block mb-0.5">Propósito central:</strong>
              <p className="text-[#414141]">{experiencia.diagnostico.sintesisExperiencia.queSeBusca}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <strong className="text-gray-600 block mb-0.5">Población participante:</strong>
              <p className="text-[#414141]">{experiencia.diagnostico.sintesisExperiencia.aQuienVaDirigida}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <strong className="text-gray-600 block mb-0.5">Contexto y modalidad:</strong>
              <p className="text-[#414141]">{experiencia.diagnostico.sintesisExperiencia.contextoYModalidad}</p>
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <span className="font-bold text-gray-500 block">Hallazgos con Trazabilidad:</span>
            {experiencia.diagnostico.puntosQuiebreHallazgos.map((h, i) => (
              <div key={i} className="p-2 bg-white rounded border border-gray-200 text-gray-700">
                <span className="font-bold text-[#5b8723]">[{h.tipo}]</span> {h.descripcion}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Acciones Elegidas y Ficha de Acción */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#7FB536] mb-3 pb-1 border-b border-gray-200">
            2. Acciones Elegidas y Ficha de Acción Operativa
          </h3>

          {accionesElegidas.length === 0 ? (
            <p className="text-xs text-gray-500 italic">
              Aún no se han registrado acciones elegidas en la Base de la propuesta.
            </p>
          ) : (
            <div className="space-y-4">
              {accionesElegidas.map((item, idx) => (
                <div
                  key={item.filaId || idx}
                  className="rounded-xl border border-gray-200 bg-[#F8FAF6] p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-gray-200">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                        Hallazgo / Necesidad {idx + 1}
                      </span>
                      <p className="text-xs font-bold text-[#414141]">
                        {item.hallazgoNecesidad}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f2f8eb] text-[#3e6018] border border-[#cde8ab] shrink-0">
                      Estado: {item.ficha.estado}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-[#cde8ab]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#5b8723] block mb-0.5">
                      Acción elegida
                    </span>
                    <p className="text-xs font-bold text-[#414141]">{item.accionTitulo}</p>
                    {item.accionDescripcion && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {item.accionDescripcion}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1.5">
                      Ficha de la acción
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <strong className="text-gray-500 block text-[10px] uppercase">
                          Producto o entregable
                        </strong>
                        <span className="text-[#414141]">{item.ficha.productoEntregable}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <strong className="text-gray-500 block text-[10px] uppercase">
                          Responsable
                        </strong>
                        <span className="text-[#414141]">{item.ficha.responsable}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <strong className="text-gray-500 block text-[10px] uppercase">
                          Cuándo
                        </strong>
                        <span className="text-[#414141]">{item.ficha.cuando}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <strong className="text-gray-500 block text-[10px] uppercase">
                          Recursos
                        </strong>
                        <span className="text-[#414141]">{item.ficha.recursos}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <strong className="text-gray-500 block text-[10px] uppercase">
                          Indicador de éxito
                        </strong>
                        <span className="text-[#414141]">{item.ficha.indicadorExito}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <strong className="text-gray-500 block text-[10px] uppercase">
                          Evidencia
                        </strong>
                        <span className="text-[#414141]">{item.ficha.evidencia}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Matriz de los 16 Componentes Institucionales */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#7FB536] mb-3 pb-1 border-b border-gray-200">
            3. Propuesta de Transformación (Los 16 Componentes)
          </h3>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 text-[#414141] font-bold">
                  <th className="p-2.5 w-[30%]">Componente</th>
                  <th className="p-2.5 w-[15%]">Trazabilidad</th>
                  <th className="p-2.5 w-[55%]">Contenido Metodológico Aprobado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.values(experiencia.propuesta16).map((comp) => (
                  <tr key={comp.id} className="hover:bg-gray-50/50">
                    <td className="p-2.5 font-bold text-[#414141]">
                      {comp.numero}. {comp.titulo}
                    </td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                        {comp.categoria}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-700 leading-relaxed whitespace-pre-line">
                      {comp.contenido}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Las 7 Preguntas Vivenciales de Florecimiento */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#7FB536] mb-3 pb-1 border-b border-gray-200">
            4. La Experiencia como Unidad Central de Florecimiento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F8FAF6] p-4 rounded-xl border border-gray-200">
            <div>
              <strong className="text-[#414141] block mb-0.5">1. ¿Qué situación transformar?</strong>
              <p className="text-gray-600">{experiencia.preguntasVivenciales.queSituacionTransformar}</p>
            </div>
            <div>
              <strong className="text-[#414141] block mb-0.5">2. ¿Qué vivirá la persona?</strong>
              <p className="text-gray-600">{experiencia.preguntasVivenciales.queExperienciaVivira}</p>
            </div>
            <div>
              <strong className="text-[#414141] block mb-0.5">3. ¿Qué hará, sentirá, aprenderá?</strong>
              <p className="text-gray-600">{experiencia.preguntasVivenciales.queHaraSentiraAprendera}</p>
            </div>
            <div>
              <strong className="text-[#414141] block mb-0.5">4. ¿Qué relaciones se fortalecen?</strong>
              <p className="text-gray-600">{experiencia.preguntasVivenciales.queRelacionesCapacidadesFortalecera}</p>
            </div>
            <div className="sm:col-span-2">
              <strong className="text-[#414141] block mb-0.5">5. ¿Cómo sabremos si ocurrió?</strong>
              <p className="text-gray-600">{experiencia.preguntasVivenciales.comoSabremosSiOcurrio}</p>
            </div>
          </div>
        </div>

        {/* 5. Dictamen y Acuerdos Institucionales */}
        <div className="p-4 bg-[#f2f8eb] rounded-xl border border-[#cde8ab] text-xs">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-[#5b8723]" />
            <span className="font-black text-[#385623] uppercase">
              5. Dictamen y Compromisos de la Red:
            </span>
          </div>
          <p className="text-[#414141] mb-2 font-medium">
            <strong>Dictamen:</strong> {experiencia.dictamenColectivo} — {experiencia.observacionesColectivas}
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {experiencia.acuerdosCompromisos.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        {/* 6. Relación de Integrantes y Firmas Oficiales */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#7FB536]">
              6. Suscripción y Firmas de la Red de Agentes Transformadores
            </h3>
            <span className="text-[11px] text-gray-400">
              {firmasCompletadas.length} de {experiencia.agentes.length} firmas consignadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {experiencia.agentes.map((agente) => (
              <div
                key={agente.id}
                className="p-3 rounded-xl border border-gray-200 bg-white text-center flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#414141]">{agente.nombre}</h4>
                  <span className="text-[10px] text-gray-500 block leading-tight">
                    {agente.cargo}
                  </span>
                  <span className="text-[9px] text-gray-400 block mb-2">
                    {agente.dependencia}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex flex-col items-center justify-center min-h-[55px]">
                  {agente.firmaDataUrl ? (
                    <>
                      <img
                        src={agente.firmaDataUrl}
                        alt={`Firma ${agente.nombre}`}
                        className="h-9 w-auto max-w-[120px] object-contain mb-1"
                      />
                      <span className="text-[9px] font-bold text-[#5b8723]">
                        {agente.fechaFirma || 'Suscrito'}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      [Pendiente de Firma]
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Institucional */}
        <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          <p className="font-bold text-[#7FB536] mb-0.5">
            "¡Sé parte de la generación que transforma!"
          </p>
          <p className="text-[10px]">
            Fundación Universitaria del Área Andina • Red de Agentes Transformadores • Sistema Inteligente de Florecimiento
          </p>
        </div>
      </div>
    </div>
  );
};

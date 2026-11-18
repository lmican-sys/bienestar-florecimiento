import React, { useState } from 'react';
import { extraerTextoArchivo } from '../utils/documentExtractor.ts';
import {
  UploadCloud,
  FileText,
  MessageSquare,
  ArrowRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  Layers,
  ChevronRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { PREGUNTAS_PASO_A_PASO, CASOS_EJEMPLO_AREANDINA } from '../utils/flourishingConsultant.ts';

interface ProtocoloInicioProps {
  onAnalizarTexto: (titulo: string, texto: string) => void;
  onCargarCasoEjemplo: (key: string) => void;
  onIniciarPasoAPaso: (respuestas: Record<string, string>) => void;
}

export const ProtocoloInicio: React.FC<ProtocoloInicioProps> = ({
  onAnalizarTexto,
  onCargarCasoEjemplo,
  onIniciarPasoAPaso
}) => {
  const [rutaSeleccionada, setRutaSeleccionada] = useState<'ninguna' | 'documentos' | 'paso_a_paso'>('ninguna');

  // Estado para Ruta 1 (Documentos / Texto)
  const [tituloDoc, setTituloDoc] = useState('');
  const [textoDoc, setTextoDoc] = useState('');
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);

  // Estado para Ruta 2 (Preguntas paso a paso)
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({
    proposito: '',
    poblacion: '',
    practicas: '',
    desafio: ''
  });

  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);
  const [extrayendoArchivo, setExtrayendoArchivo] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;

    setErrorArchivo(null);
    setArchivoNombre(file.name);
    if (!tituloDoc) {
      setTituloDoc(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    setExtrayendoArchivo(true);
    try {
      const content = await extraerTextoArchivo(file);
      setTextoDoc(content);
    } catch (err: any) {
      setTextoDoc('');
      setErrorArchivo(err?.message || 'No se pudo extraer texto del archivo.');
    } finally {
      setExtrayendoArchivo(false);
      if (inputEl) {
        inputEl.value = '';
      }
    }
  };

  const handleSiguientePaso = () => {
    const preguntaActual = PREGUNTAS_PASO_A_PASO[pasoActual];
    if (!respuestas[preguntaActual.id]?.trim()) {
      return; // Requerir respuesta antes de avanzar
    }

    if (pasoActual < PREGUNTAS_PASO_A_PASO.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      // Completó las 4 preguntas
      onIniciarPasoAPaso(respuestas);
    }
  };

  const handleAnteriorPaso = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Saludo Consultivo & Encuadre Directo */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#7FB536]/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f8eb] text-[#5b8723] text-xs font-extrabold uppercase tracking-wider mb-3 border border-[#cde8ab]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Especialista Consultivo Areandina • Sistematización e Innovación</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#414141] tracking-tight mb-2 leading-tight font-sans">
              Ruta de Experiencia - Del Bienestar al Florecimiento
            </h1>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#7FB536] tracking-tight mb-2">
              Sistematizar para transformar experiencias
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed mb-4">
              Visión y requerimientos para ajustar la herramienta de sistematización, rediseño, experimentación y validación de experiencias
            </p>

            <div className="p-4 rounded-xl bg-[#F8FAF6] border border-[#cde8ab] mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#4d751c] bg-[#eef7e4] px-2 py-0.5 rounded-md border border-[#cbe5a9] inline-block mb-1.5">
                PROPÓSITO
              </span>
              <p className="text-xs sm:text-sm font-semibold text-[#414141] leading-relaxed">
                Convertir el Modelo «Del Bienestar al Florecimiento» en una herramienta práctica que ayude a comprender experiencias reales, decidir qué conservar o transformar, diseñar mejoras coherentes, pilotearlas, reunir evidencia y validar aprendizajes.
              </p>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-center bg-[#F8FAF6] p-4 rounded-xl border border-gray-200 min-w-[210px] text-center">
            <img
              src="/assets/aistudio/Mesa_de_trabajo_1_copia_77a0697d.png"
              alt="Logo Areandina"
              className="h-9 w-auto object-contain mb-2"
            />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Enfoque Institucional
            </span>
            <span className="text-xs text-[#7FB536] font-semibold mt-0.5">
              Evidencia • Innovación • Impacto
            </span>
          </div>
        </div>

        {/* 5 Reglas Metodológicas Clave */}
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-[#7FB536] shrink-0" />
            <span>1. Comprender antes de proponer</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>2. Cero invenciones culturales</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <Compass className="w-4 h-4 text-blue-600 shrink-0" />
            <span>3. Certeza y trazabilidad</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>4. Menú de 2 a 3 opciones viables</span>
          </div>
        </div>
      </div>

      {/* Protocolo de Selección de Ruta */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-[#414141]">
            ¿Cómo deseas estructurar tu experiencia hoy?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Elige una de las dos rutas de trabajo para generar el Diagnóstico Ejecutivo y la Matriz de Estrategia Operativa:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta Ruta 1: Cargar Documentos / Casos */}
          <div
            onClick={() => setRutaSeleccionada('documentos')}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
              rutaSeleccionada === 'documentos'
                ? 'border-[#7FB536] bg-[#fbfdf9] shadow-md ring-2 ring-[#7FB536]/20'
                : 'border-gray-200 bg-white hover:border-[#7FB536]/60 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f2f8eb] flex items-center justify-center text-[#7FB536] mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7FB536] block mb-1">
                Ruta 1
              </span>
              <h3 className="text-lg font-bold text-[#414141] mb-2">
                Subir documentos, evidencias o resultados previos
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                Pega tu informe, carga archivos de evidencia (actas, encuestas, proyectos) o selecciona un caso institucional representativo de Areandina.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#7FB536]">
              <span>Analizar evidencias existentes</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Tarjeta Ruta 2: Preguntas Guiadas desde cero */}
          <div
            onClick={() => setRutaSeleccionada('paso_a_paso')}
            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
              rutaSeleccionada === 'paso_a_paso'
                ? 'border-[#7FB536] bg-[#fbfdf9] shadow-md ring-2 ring-[#7FB536]/20'
                : 'border-gray-200 bg-white hover:border-[#7FB536]/60 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Ruta 2
              </span>
              <h3 className="text-lg font-bold text-[#414141] mb-2">
                Responder un par de preguntas clave (desde cero)
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                Si aún no tienes documentos estructurados, responderemos 4 preguntas clave (una a la vez) para diagnosticar y co-diseñar la experiencia.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Construir guiado paso a paso</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* RUTA 1 ACTIVA: Subir documentos / Pega de texto / Casos de Areandina */}
      {rutaSeleccionada === 'documentos' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#7FB536]" />
              <h3 className="text-base sm:text-lg font-bold text-[#414141]">
                Carga de Información y Documentos
              </h3>
            </div>
            <span className="text-xs text-gray-500">Ruta 1 Seleccionada</span>
          </div>

          {/* Opciones rápidas de casos oficiales de Areandina */}
          <div className="mb-6 p-4 bg-[#F8FAF6] rounded-xl border border-gray-200">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5b8723] block mb-2">
              Casos Reales Areandina (Carga Inmediata con 1 Clic):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(CASOS_EJEMPLO_AREANDINA).map(([key, caso]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onCargarCasoEjemplo(key)}
                  className="text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-[#7FB536] hover:bg-[#f2f8eb]/30 transition-all text-xs group"
                >
                  <span className="font-bold text-[#414141] group-hover:text-[#5b8723] block">
                    {caso.titulo}
                  </span>
                  <span className="text-gray-500 text-[11px] block mt-0.5 line-clamp-1">
                    {caso.resumen}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Título de la experiencia */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#414141] uppercase tracking-wider mb-1.5">
              Título o Nombre de la Experiencia Institucional:
            </label>
            <input
              type="text"
              value={tituloDoc}
              onChange={(e) => setTituloDoc(e.target.value)}
              placeholder="Ej: Semana de Bienvenida y Arraigo Estudiantil Valledupar"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#7FB536] focus:border-transparent text-sm"
            />
          </div>

          {/* Subir archivo */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#414141] uppercase tracking-wider mb-1.5">
              Subir Archivo de Evidencias (PDF, DOCX, TXT, MD, CSV, JSON):
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-xs font-medium text-gray-700 transition-colors ${
                  extrayendoArchivo
                    ? 'opacity-70 cursor-wait'
                    : 'cursor-pointer hover:bg-gray-100'
                }`}
              >
                {extrayendoArchivo ? (
                  <Loader2 className="w-4 h-4 text-[#7FB536] animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4 text-gray-500" />
                )}
                <span>{extrayendoArchivo ? 'Leyendo archivo...' : 'Examinar archivo local...'}</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md,.json,.csv"
                  disabled={extrayendoArchivo}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {archivoNombre && !errorArchivo && !extrayendoArchivo && textoDoc.trim() && (
                <span className="text-xs text-[#5b8723] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {archivoNombre}
                </span>
              )}
            </div>
            {errorArchivo && (
              <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorArchivo}</span>
              </div>
            )}
          </div>

          {/* Texto / Contenido */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#414141] uppercase tracking-wider mb-1.5">
              O Pega Directamente el Texto, Resumen de Evidencias o Resultados:
            </label>
            <textarea
              rows={7}
              value={textoDoc}
              onChange={(e) => setTextoDoc(e.target.value)}
              placeholder="Pega aquí el informe, objetivos, población atendida, actividades actuales, datos de encuestas o quejas recogidas..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#7FB536] focus:border-transparent text-xs sm:text-sm leading-relaxed"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              * El consultor extraerá el propósito real, los hechos documentados y los vacíos sin inventar rituales ni metodologías no sustentadas.
            </p>
            {tituloDoc.trim() && !textoDoc.trim() && !extrayendoArchivo && (
              <p className="text-xs text-amber-700 font-semibold mt-2">
                Escribe o pega una descripción en este cuadro (o sube un archivo con texto legible) para poder generar la propuesta.
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={extrayendoArchivo || !textoDoc.trim()}
              onClick={() => {
                if (!textoDoc.trim()) return;
                onAnalizarTexto(tituloDoc, textoDoc);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {extrayendoArchivo
                  ? 'Extrayendo texto del archivo...'
                  : 'Generar Diagnóstico Ejecutivo y Matriz Operativa'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* RUTA 2 ACTIVA: Preguntas Guiadas Paso a Paso */}
      {rutaSeleccionada === 'paso_a_paso' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8 animate-in fade-in duration-300">
          {/* Barra de progreso de preguntas (1 a la vez) */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-bold text-[#5b8723]">
                Pregunta {pasoActual + 1} de {PREGUNTAS_PASO_A_PASO.length}
              </span>
              <span>Construcción colaborativa desde cero</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#7FB536] h-full transition-all duration-300"
                style={{
                  width: `${((pasoActual + 1) / PREGUNTAS_PASO_A_PASO.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Pregunta Activa */}
          {(() => {
            const preg = PREGUNTAS_PASO_A_PASO[pasoActual];
            const valorActual = respuestas[preg.id] || '';

            return (
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#f2f8eb] text-[#5b8723] font-extrabold flex items-center justify-center shrink-0 text-sm">
                    {preg.numero}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#414141]">
                      {preg.pregunta}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {preg.descripcionCorta}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <textarea
                    rows={4}
                    value={valorActual}
                    onChange={(e) =>
                      setRespuestas({
                        ...respuestas,
                        [preg.id]: e.target.value
                      })
                    }
                    placeholder={preg.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#7FB536] text-xs sm:text-sm"
                  />
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <Lightbulb className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>
                      <strong>Consejo del especialista:</strong> {preg.sugerencia}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleAnteriorPaso}
                    disabled={pasoActual === 0}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Atrás
                  </button>

                  <button
                    type="button"
                    onClick={handleSiguientePaso}
                    disabled={!valorActual.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-xs"
                  >
                    <span>
                      {pasoActual < PREGUNTAS_PASO_A_PASO.length - 1
                        ? 'Siguiente Pregunta'
                        : 'Estructurar Diagnóstico y Matriz'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

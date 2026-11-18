import React, { useState } from 'react';
import {
  Sparkles,
  Edit3,
  Save,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Tag,
  Layers,
  HeartHandshake,
  Compass,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  RefreshCw,
  Loader2,
  UploadCloud
} from 'lucide-react';
import { extraerTextoArchivo } from '../utils/documentExtractor.ts';
import {
  ExperienciaInstitucional,
  ComponentePropuesta,
  TrazabilidadCategoria,
  OrigenContenido
} from '../types/flourishing.ts';

interface PropuestaTransformacionViewProps {
  experiencia: ExperienciaInstitucional;
  generandoPropuesta?: boolean;
  errorGeneracionPropuesta?: string | null;
  exitoGeneracionPropuesta?: boolean;
  retryCountdown?: number;
  onReintentarGeneracion?: () => void;
  onAdjuntarFuenteYGenerar?: (fuente: string) => void;
  onRegenerar7Preguntas?: () => void;
  onRegenerarComponente?: (clave: string) => void;
  onActualizarComponente: (clave: string, nuevoContenido: string) => void;
  onActualizarPreguntaVivencial: (campo: string, valor: string) => void;
  onAbrirComentario?: (componenteClave: string, componenteTitulo: string) => void;
}

export const PropuestaTransformacionView: React.FC<PropuestaTransformacionViewProps> = ({
  experiencia,
  generandoPropuesta = false,
  errorGeneracionPropuesta = null,
  exitoGeneracionPropuesta = false,
  retryCountdown = 0,
  onReintentarGeneracion,
  onAdjuntarFuenteYGenerar,
  onRegenerar7Preguntas,
  onRegenerarComponente,
  onActualizarComponente,
  onActualizarPreguntaVivencial,
  onAbrirComentario
}) => {
  const [componenteEditando, setComponenteEditando] = useState<string | null>(null);
  const [textoEditado, setTextoEditado] = useState<string>('');
  const [mostrar7Preguntas, setMostrar7Preguntas] = useState(true);
  const [fuenteRecuperada, setFuenteRecuperada] = useState('');
  const [errorArchivoRecuperado, setErrorArchivoRecuperado] = useState<string | null>(null);
  const [extrayendoRecuperado, setExtrayendoRecuperado] = useState(false);

  const sinFuente = !experiencia.fuenteOriginal?.trim();

  const getCategoriaBadge = (cat: TrazabilidadCategoria) => {
    switch (cat) {
      case 'HECHO_DOCUMENTADO':
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
          label: 'PROPUESTA DE TRANSFORMACIÓN (IA)'
        };
      case 'PENDIENTE_VACIO':
      default:
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
          label: 'PENDIENTE DE DEFINICIÓN'
        };
    }
  };

  const getOrigenBadge = (orig: OrigenContenido) => {
    switch (orig) {
      case 'SUMINISTRADA':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'APROBADA_EQUIPO':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'GENERADA_IA':
      default:
        return 'bg-lime-50 text-lime-800 border-lime-300';
    }
  };

  const iniciarEdicion = (clave: string, contenido: string) => {
    setComponenteEditando(clave);
    setTextoEditado(contenido);
  };

  const guardarEdicion = (clave: string) => {
    onActualizarComponente(clave, textoEditado);
    setComponenteEditando(null);
  };

  const componentesEntries = Object.entries(experiencia.propuesta16);

  return (
    <div className="space-y-8">
      {generandoPropuesta && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f2f8eb] border border-[#cde8ab] text-[#4d751c]">
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          <div className="text-xs sm:text-sm font-bold">
            Generando propuesta personalizada con Gemini a partir del documento...
          </div>
        </div>
      )}

      {errorGeneracionPropuesta && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <span className="font-black block">Error al generar con Gemini</span>
              <span>{errorGeneracionPropuesta}</span>
            </div>
          </div>
          {onReintentarGeneracion && !sinFuente && (
            <button
              type="button"
              onClick={onReintentarGeneracion}
              disabled={generandoPropuesta || retryCountdown > 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {retryCountdown > 0 ? `Reintentar (${retryCountdown}s)` : 'Reintentar'}
            </button>
          )}
        </div>
      )}

      {sinFuente && onAdjuntarFuenteYGenerar && !generandoPropuesta && (
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-amber-900">
                Adjunta o pega el documento/descripción de esta experiencia para generar con IA
              </h3>
              <p className="text-xs text-amber-800">
                Esta experiencia no tiene texto guardado en la fuente original. Sube un archivo (PDF, DOCX o TXT) o pega la descripción aquí abajo.
              </p>
            </div>
            <label
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-bold text-amber-900 ${
                extrayendoRecuperado ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:bg-amber-50'
              }`}
            >
              {extrayendoRecuperado ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#7FB536]" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>{extrayendoRecuperado ? 'Leyendo archivo...' : 'Subir archivo...'}</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.json,.csv"
                disabled={extrayendoRecuperado}
                className="hidden"
                onChange={async (e) => {
                  const inputEl = e.currentTarget;
                  const file = inputEl.files?.[0];
                  if (!file) return;
                  setErrorArchivoRecuperado(null);
                  setExtrayendoRecuperado(true);
                  try {
                    const txt = await extraerTextoArchivo(file);
                    setFuenteRecuperada(txt);
                  } catch (err: any) {
                    setErrorArchivoRecuperado(err?.message || 'No se pudo leer el archivo.');
                  } finally {
                    setExtrayendoRecuperado(false);
                    if (inputEl) {
                      inputEl.value = '';
                    }
                  }
                }}
              />
            </label>
          </div>
          {errorArchivoRecuperado && (
            <p className="text-xs font-semibold text-rose-700">{errorArchivoRecuperado}</p>
          )}
          <textarea
            rows={4}
            value={fuenteRecuperada}
            onChange={(e) => setFuenteRecuperada(e.target.value)}
            placeholder="Pega aquí la descripción, informe o contexto de la experiencia..."
            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#7FB536]"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!fuenteRecuperada.trim() || extrayendoRecuperado || retryCountdown > 0}
              onClick={() => onAdjuntarFuenteYGenerar(fuenteRecuperada.trim())}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guardar documento y generar propuesta</span>
            </button>
          </div>
        </div>
      )}

      {exitoGeneracionPropuesta && !generandoPropuesta && !errorGeneracionPropuesta && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <div className="text-xs sm:text-sm font-bold">Generado correctamente</div>
        </div>
      )}

      {/* Banner de Encuadre Metodológico */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f8eb] text-[#5b8723] text-xs font-black uppercase tracking-wider mb-2 border border-[#cde8ab]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estructura Oficial • 16 Componentes Institucionales</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#414141] tracking-tight">
              Propuesta de Transformación Institucional
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
              Diseño integral formulado sobre hechos reales y necesidades comprobadas, diferenciando
              estrictamente entre información suministrada, hipótesis pedagógicas y propuestas metodológicas de la Red.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
              {experiencia.codigoUnico}
            </span>
            <span className="text-xs font-bold text-[#7FB536] bg-[#f2f8eb] px-3 py-1 rounded-lg border border-[#cde8ab]">
              v{experiencia.versionActual}
            </span>
          </div>
        </div>

        {/* 4 Categorías de Trazabilidad Explicadas */}
        <div className="mt-4 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900">
            <strong className="block font-black">1. HECHO DOCUMENTADO</strong>
            <span>Datos o evidencias comprobados en actas, encuestas o registros.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900">
            <strong className="block font-black">2. PERCEPCIÓN</strong>
            <span>Apreciaciones o testimonios manifestados por las personas.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-200 text-purple-900">
            <strong className="block font-black">3. HIPÓTESIS</strong>
            <span>Explicaciones pedagógicas que requieren validación empírica.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#f2f8eb] border border-[#cde8ab] text-[#3e6018]">
            <strong className="block font-black">4. PROPUESTA (IA)</strong>
            <span>Alternativas metodológicas innovadoras aún no ejecutadas.</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN OBLIGATORIA: LA EXPERIENCIA COMO UNIDAD CENTRAL DEL MODELO (7 PREGUNTAS CLAVE) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <HeartHandshake className="w-5 h-5" />
            </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 block">
                  UNIDAD CENTRAL DE FLORECIMIENTO • EDITABLE EN LÍNEA
                </span>
                <h3 className="text-lg font-black text-[#414141]">
                  Las 7 Preguntas Vivenciales de la Experiencia
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Haz clic en cualquier recuadro para editar o ajustar la respuesta directamente (se guarda automáticamente).
                </p>
              </div>
          </div>

          <div className="flex items-center gap-3">
            {onRegenerar7Preguntas && (
              <button
                type="button"
                onClick={onRegenerar7Preguntas}
                disabled={generandoPropuesta || retryCountdown > 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#5b8723] bg-[#f2f8eb] hover:bg-[#e5f3d4] border border-[#cde8ab] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generandoPropuesta ? 'animate-spin' : ''}`} />
                <span>
                  {retryCountdown > 0
                    ? `Regenerar (${retryCountdown}s)`
                    : 'Regenerar con el documento'}
                </span>
              </button>
            )}
            <button
              onClick={() => setMostrar7Preguntas(!mostrar7Preguntas)}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
            >
              {mostrar7Preguntas ? 'Ocultar preguntas' : 'Mostrar preguntas'}
              {mostrar7Preguntas ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {mostrar7Preguntas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              {
                campo: 'queSituacionTransformar',
                num: 1,
                pregunta: '¿Qué situación queremos transformar?',
                valor: experiencia.preguntasVivenciales.queSituacionTransformar
              },
              {
                campo: 'queExperienciaVivira',
                num: 2,
                pregunta: '¿Qué experiencia vivirá la persona?',
                valor: experiencia.preguntasVivenciales.queExperienciaVivira
              },
              {
                campo: 'queHaraSentiraAprendera',
                num: 3,
                pregunta: '¿Qué hará, sentirá, aprenderá o desarrollará?',
                valor: experiencia.preguntasVivenciales.queHaraSentiraAprendera
              },
              {
                campo: 'queRelacionesCapacidadesFortalecera',
                num: 4,
                pregunta: '¿Qué relaciones o capacidades se fortalecerán?',
                valor: experiencia.preguntasVivenciales.queRelacionesCapacidadesFortalecera
              },
              {
                campo: 'queDimensionesMovilizara',
                num: 5,
                pregunta: '¿Qué dimensiones del florecimiento se movilizarán?',
                valor: experiencia.preguntasVivenciales.queDimensionesMovilizara
              },
              {
                campo: 'queTransformacionEsperamos',
                num: 6,
                pregunta: '¿Qué transformación esperamos observar?',
                valor: experiencia.preguntasVivenciales.queTransformacionEsperamos
              },
              {
                campo: 'comoSabremosSiOcurrio',
                num: 7,
                pregunta: '¿Cómo sabremos si realmente ocurrió?',
                valor: experiencia.preguntasVivenciales.comoSabremosSiOcurrio,
                fullWidth: true
              }
            ].map((item) => (
              <div
                key={item.campo}
                className={`p-4 rounded-xl border border-gray-200 bg-[#F8FAF6] focus-within:border-[#7FB536] focus-within:ring-2 focus-within:ring-[#7FB536]/15 transition-all ${
                  item.fullWidth ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black flex items-center justify-center shrink-0">
                      {item.num}
                    </span>
                    <span className="text-xs font-bold text-[#414141]">{item.pregunta}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(`pregunta-vivencial-${item.campo}`);
                      if (el) {
                        el.focus();
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5b8723] bg-[#f2f8eb] hover:bg-[#e5f3d4] px-2 py-0.5 rounded-md border border-[#cde8ab] shrink-0 cursor-pointer transition-colors"
                    title="Haz clic para editar este campo"
                  >
                    <Edit3 className="w-3 h-3" />
                    Editable
                  </button>
                </div>
                <textarea
                  id={`pregunta-vivencial-${item.campo}`}
                  rows={4}
                  value={item.valor}
                  onChange={(e) => onActualizarPreguntaVivencial(item.campo, e.target.value)}
                  placeholder={
                    generandoPropuesta
                      ? 'Generando...'
                      : 'Pendiente de generar. Presiona Regenerar con el documento.'
                  }
                  className="w-full text-xs sm:text-sm text-gray-800 p-3 rounded-lg border border-gray-200 bg-white focus:outline-hidden focus:border-[#7FB536] leading-relaxed resize-y min-h-[96px]"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOS 16 COMPONENTES OBLIGATORIOS ESTRUCTURADOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-base font-black text-[#414141] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7FB536]" />
            <span>Desglose de los 16 Componentes Institucionales</span>
          </h3>
          <span className="text-xs text-gray-500">
            Cada componente permite edición manual y trazabilidad
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {componentesEntries.map(([clave, comp]) => {
            const esEditando = componenteEditando === clave;
            const badgeCat = getCategoriaBadge(comp.categoria);
            const badgeOrig = getOrigenBadge(comp.origen);

            return (
              <div
                key={comp.id || clave}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:border-[#7FB536]/50 transition-all"
              >
                {/* Header del Componente */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#f2f8eb] text-[#5b8723] font-black text-xs flex items-center justify-center shrink-0">
                      {comp.numero}
                    </span>
                    <h4 className="text-sm font-bold text-[#414141]">{comp.titulo}</h4>
                  </div>

                  {/* Badges de Trazabilidad y Origen */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeCat.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badgeCat.dot}`}></span>
                      {badgeCat.label}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeOrig}`}
                    >
                      Origen: {comp.origen}
                    </span>

                    {onAbrirComentario && (
                      <button
                        type="button"
                        onClick={() => onAbrirComentario(clave, comp.titulo)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                        title="Agregar observación en Sala de Validación"
                      >
                        <MessageSquarePlus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 mb-2 italic">
                  Guía: {comp.descripcionGuia}
                </p>

                {/* Contenido / Edición */}
                {esEditando ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                      className="w-full text-xs text-[#414141] p-3 rounded-xl border border-[#7FB536] focus:outline-hidden ring-1 ring-[#7FB536] leading-relaxed"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setComponenteEditando(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => guardarEdicion(clave)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7FB536] hover:bg-[#6fa02d] transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Ajuste</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line flex-1">
                      {comp.contenido ? (
                        comp.contenido
                      ) : (
                        <span className="italic text-amber-700">
                          {generandoPropuesta
                            ? 'Generando...'
                            : 'Pendiente de generar. Presiona Regenerar con el documento.'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {onRegenerarComponente && (
                        <button
                          type="button"
                          onClick={() => onRegenerarComponente(clave)}
                          disabled={generandoPropuesta || retryCountdown > 0}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5b8723] bg-[#f2f8eb] hover:bg-[#e5f3d4] px-2 py-1 rounded border border-[#cde8ab] cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${generandoPropuesta ? 'animate-spin' : ''}`}
                          />
                          <span>
                            {retryCountdown > 0
                              ? `Regenerar (${retryCountdown}s)`
                              : 'Regenerar con el documento'}
                          </span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => iniciarEdicion(clave, comp.contenido)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5b8723] hover:underline shrink-0 p-1 rounded hover:bg-gray-50"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

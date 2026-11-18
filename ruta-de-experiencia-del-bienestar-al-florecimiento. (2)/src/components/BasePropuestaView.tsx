import React, { useRef, useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  Sparkles,
  HelpCircle,
  Layers,
  Edit3,
  Save,
  X
} from 'lucide-react';
import {
  ExperienciaInstitucional,
  FichaAccionSeleccionada,
  MatrizFila,
  TrazabilidadCategoria
} from '../types/flourishing.ts';
import { proponerFichaAccionIA } from '../services/geminiPropuestaService.ts';
import {
  actualizarHallazgoEnMatriz,
  actualizarOpcionEnMatriz
} from '../utils/matrizHelpers.ts';

interface BasePropuestaViewProps {
  experiencia: ExperienciaInstitucional;
  generandoDiagnostico: boolean;
  errorDiagnostico: string | null;
  retryCountdown: number;
  onGenerarDiagnostico: () => void;
  onActualizarMatriz: (nuevaMatriz: MatrizFila[]) => void;
}

const etiquetaHallazgo = (tipo: TrazabilidadCategoria) => {
  if (tipo === 'HECHO_DOCUMENTADO') {
    return {
      label: 'Hecho del documento',
      cls: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    };
  }
  if (tipo === 'PERCEPCION') {
    return {
      label: 'Percepción',
      cls: 'bg-blue-50 text-blue-800 border-blue-200'
    };
  }
  return {
    label: 'Idea nueva',
    cls: 'bg-purple-50 text-purple-800 border-purple-200'
  };
};

const fichaVacia = (): FichaAccionSeleccionada => ({
  productoEntregable: 'No especificado en el documento',
  descripcionBreve: 'No especificado en el documento',
  responsable: 'No especificado en el documento',
  cuando: 'No especificado en el documento',
  recursos: 'No especificado en el documento',
  indicadorExito: 'No especificado en el documento',
  evidencia: 'No especificado en el documento',
  estado: 'Pendiente'
});

export const BasePropuestaView: React.FC<BasePropuestaViewProps> = ({
  experiencia,
  generandoDiagnostico,
  errorDiagnostico,
  retryCountdown,
  onGenerarDiagnostico,
  onActualizarMatriz
}) => {
  const [mostrarAnexos, setMostrarAnexos] = useState(false);
  const [proponiendoFilaId, setProponiendoFilaId] = useState<string | null>(null);
  const [errorFicha, setErrorFicha] = useState<string | null>(null);
  const [editandoOpcionKey, setEditandoOpcionKey] = useState<string | null>(null);
  const [tituloEditado, setTituloEditado] = useState('');
  const [descripcionEditada, setDescripcionEditada] = useState('');
  const [editandoHallazgoId, setEditandoHallazgoId] = useState<string | null>(null);
  const [hallazgoEditado, setHallazgoEditado] = useState('');
  const fichaTextareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const sinFuente = !experiencia.fuenteOriginal?.trim();
  const s = experiencia.diagnostico.sintesisExperiencia;
  const tieneSintesis = Boolean(
    s.queSeEntendio || s.aQuienVaDirigida || s.queSeBusca || s.contextoYModalidad
  );

  const actualizarFila = (filaId: string, cambios: Partial<MatrizFila>) => {
    const nueva = experiencia.matrizEstrategica.map((f) =>
      f.id === filaId ? { ...f, ...cambios } : f
    );
    onActualizarMatriz(nueva);
  };

  const actualizarFicha = (fila: MatrizFila, campo: keyof FichaAccionSeleccionada, valor: string) => {
    const actual = fila.fichaAccion || fichaVacia();
    actualizarFila(fila.id, {
      fichaAccion: { ...actual, [campo]: valor }
    });
  };

  const handleProponerFicha = async (fila: MatrizFila) => {
    const fuente = experiencia.fuenteOriginal?.trim();
    if (!fuente) {
      setErrorFicha('Esta experiencia no guarda el documento original. Créala de nuevo para usar IA.');
      return;
    }
    const accion =
      fila.opcionesAccion.find((o) => o.id === fila.opcionSeleccionadaId) ||
      fila.opcionesAccion[0];
    if (!accion) return;

    setProponiendoFilaId(fila.id);
    setErrorFicha(null);
    try {
      const ficha = await proponerFichaAccionIA({
        fuente,
        titulo: experiencia.titulo,
        hallazgo: fila.hallazgoNecesidad,
        accionTitulo: accion.titulo,
        accionDescripcion: accion.descripcion
      });
      actualizarFila(fila.id, { fichaAccion: ficha });
    } catch (err: any) {
      setErrorFicha(err?.message || 'No se pudo proponer la ficha con IA.');
    } finally {
      setProponiendoFilaId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#414141]">2. Base de la propuesta</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Aquí se ve en qué se basa la propuesta: qué dice el documento, qué falta definir y qué
            acciones se eligieron.
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerarDiagnostico}
          disabled={generandoDiagnostico || retryCountdown > 0 || sinFuente}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white text-xs font-bold shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generandoDiagnostico ? 'animate-spin' : ''}`} />
          <span>
            {generandoDiagnostico
              ? 'Generando...'
              : retryCountdown > 0
              ? `Reintentar (${retryCountdown}s)`
              : 'Generar con el documento'}
          </span>
        </button>
      </div>

      {sinFuente && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold">
          Esta experiencia no guarda el documento original. Crea una nueva experiencia para generar
          esta pestaña con IA.
        </div>
      )}

      {generandoDiagnostico && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f2f8eb] border border-[#cde8ab] text-[#4d751c]">
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          <span className="text-xs sm:text-sm font-bold">
            Generando diagnóstico y matriz desde el documento...
          </span>
        </div>
      )}

      {errorDiagnostico && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
          <div className="flex items-start gap-2 text-xs sm:text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorDiagnostico}</span>
          </div>
          <button
            type="button"
            onClick={onGenerarDiagnostico}
            disabled={generandoDiagnostico || retryCountdown > 0 || sinFuente}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {retryCountdown > 0 ? `Reintentar (${retryCountdown}s)` : 'Reintentar'}
          </button>
        </div>
      )}

      {/* Bloque 1: Lo que dice el documento */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-black text-[#414141] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7FB536]" />
            <span>Lo que dice el documento</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Resumen de los hechos, percepciones e ideas identificados en la fuente original.
          </p>
        </div>

        {!tieneSintesis ? (
          <p className="text-xs text-amber-700 italic">
            Aún no se ha generado la síntesis. Presiona &quot;Generar con el documento&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { titulo: 'Qué se entendió', valor: s.queSeEntendio },
              { titulo: 'A quién va dirigida', valor: s.aQuienVaDirigida },
              { titulo: 'Qué se busca', valor: s.queSeBusca },
              { titulo: 'Contexto y modalidad', valor: s.contextoYModalidad }
            ].map((c) => (
              <div key={c.titulo} className="p-3.5 rounded-xl bg-[#F8FAF6] border border-gray-200">
                <span className="text-[11px] font-black uppercase text-[#5b8723] block mb-1">
                  {c.titulo}
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">{c.valor}</p>
              </div>
            ))}
          </div>
        )}

        {/* Leyenda corta de etiquetas */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
          <span className="font-bold">Etiquetas:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            Hecho del documento
          </span>
          <span>dato escrito en la fuente;</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold">
            Percepción
          </span>
          <span>opinión o sentir reportado;</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold">
            Idea nueva
          </span>
          <span>hipótesis o propuesta de mejora.</span>
        </div>

        {experiencia.diagnostico.puntosQuiebreHallazgos.length === 0 ? (
          <p className="text-xs text-amber-700 italic">
            Aún no hay hallazgos generados para esta experiencia.
          </p>
        ) : (
          <div className="space-y-2.5">
            {experiencia.diagnostico.puntosQuiebreHallazgos.map((h) => {
              const et = etiquetaHallazgo(h.tipo);
              return (
                <div
                  key={h.id}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#414141]">{h.descripcion}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${et.cls}`}
                    >
                      {et.label}
                    </span>
                  </div>
                  {h.impactoObservado && (
                    <p className="text-[11px] text-gray-500">{h.impactoObservado}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bloque 2: Lo que falta definir */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-3">
        <div>
          <h3 className="text-base font-black text-[#414141] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Lo que falta definir</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Vacíos de información que el documento no especifica y conviene precisar con el equipo.
          </p>
        </div>

        {experiencia.diagnostico.vaciosInformacion.length === 0 ? (
          <p className="text-xs text-amber-700 italic">
            Aún no se han identificado vacíos de información.
          </p>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
            {experiencia.diagnostico.vaciosInformacion.map((v, idx) => (
              <li key={idx}>{v}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Bloque 3: Acciones elegidas */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-black text-[#414141] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7FB536]" />
            <span>Acciones elegidas</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Selecciona una acción por cada hallazgo y ajusta su ficha operativa editable.
          </p>
        </div>

        {errorFicha && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorFicha}
          </div>
        )}

        {experiencia.matrizEstrategica.length === 0 ? (
          <p className="text-xs text-amber-700 italic">
            Aún no se han generado acciones para esta experiencia.
          </p>
        ) : (
          <div className="space-y-5">
            {experiencia.matrizEstrategica.map((fila) => {
              const ficha = fila.fichaAccion || fichaVacia();
              return (
                <div
                  key={fila.id}
                  className="p-4 rounded-xl border border-gray-200 bg-[#F8FAF6] space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-gray-500 block">
                        Hallazgo / Necesidad
                      </span>
                      {editandoHallazgoId !== fila.id && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditandoHallazgoId(fila.id);
                            setHallazgoEditado(fila.hallazgoNecesidad);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5b8723] hover:underline cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar hallazgo</span>
                        </button>
                      )}
                    </div>
                    {editandoHallazgoId === fila.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={hallazgoEditado}
                          onChange={(e) => setHallazgoEditado(e.target.value)}
                          aria-label="Editar hallazgo o necesidad"
                          className="w-full px-3 py-2 rounded-lg border border-[#7FB536] bg-white text-xs sm:text-sm font-semibold text-[#414141] focus:outline-hidden ring-1 ring-[#7FB536]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditandoHallazgoId(null)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                            <span>Cancelar</span>
                          </button>
                          <button
                            type="button"
                            disabled={!hallazgoEditado.trim()}
                            onClick={() => {
                              onActualizarMatriz(
                                actualizarHallazgoEnMatriz(
                                  experiencia.matrizEstrategica,
                                  fila.id,
                                  hallazgoEditado.trim()
                                )
                              );
                              setEditandoHallazgoId(null);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-[#7FB536] hover:bg-[#6fa02d] cursor-pointer disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            <span>Guardar hallazgo</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm font-bold text-[#414141]">
                        {fila.hallazgoNecesidad}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {fila.opcionesAccion.map((op) => {
                      const seleccionada = fila.opcionSeleccionadaId === op.id;
                      const opKey = `${fila.id}::${op.id}`;
                      const estaEditando = editandoOpcionKey === opKey;

                      if (estaEditando) {
                        return (
                          <div
                            key={op.id}
                            className="text-left p-3 rounded-lg border border-[#7FB536] ring-1 ring-[#7FB536] bg-white space-y-2"
                          >
                            <label className="block">
                              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                Título de la propuesta
                              </span>
                              <input
                                type="text"
                                value={tituloEditado}
                                onChange={(e) => setTituloEditado(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-[#414141] focus:outline-hidden focus:border-[#7FB536]"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                Descripción de la propuesta
                              </span>
                              <textarea
                                rows={3}
                                value={descripcionEditada}
                                onChange={(e) => setDescripcionEditada(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-[11px] text-gray-700 leading-relaxed focus:outline-hidden focus:border-[#7FB536] resize-y"
                              />
                            </label>
                            <div className="flex justify-end gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditandoOpcionKey(null)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                                <span>Cancelar</span>
                              </button>
                              <button
                                type="button"
                                disabled={!tituloEditado.trim()}
                                onClick={() => {
                                  const nuevaMatriz = actualizarOpcionEnMatriz(
                                    experiencia.matrizEstrategica,
                                    fila.id,
                                    op.id,
                                    {
                                      titulo: tituloEditado.trim(),
                                      descripcion: descripcionEditada.trim()
                                    }
                                  );
                                  onActualizarMatriz(nuevaMatriz);
                                  setEditandoOpcionKey(null);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-[#7FB536] hover:bg-[#6fa02d] cursor-pointer disabled:opacity-50"
                              >
                                <Save className="w-3 h-3" />
                                <span>Guardar</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={op.id}
                          className={`rounded-lg border transition-all flex flex-col justify-between p-3 gap-2 ${
                            seleccionada
                              ? 'bg-[#f2f8eb] border-[#7FB536] ring-1 ring-[#7FB536]'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => actualizarFila(fila.id, { opcionSeleccionadaId: op.id })}
                            className="text-left w-full cursor-pointer flex-1"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-[#414141]">{op.titulo}</span>
                              {seleccionada && (
                                <CheckCircle2 className="w-4 h-4 text-[#7FB536] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              {op.descripcion}
                            </p>
                          </button>

                          <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                            <span className="text-[10px] font-semibold text-gray-400">
                              {seleccionada ? 'Seleccionada' : 'Clic arriba para elegir'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditandoOpcionKey(opKey);
                                setTituloEditado(op.titulo);
                                setDescripcionEditada(op.descripcion);
                              }}
                              aria-label={`Editar propuesta ${op.titulo}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5b8723] hover:bg-[#e5f3d4] px-2 py-0.5 rounded-md border border-[#cde8ab] bg-[#f2f8eb] cursor-pointer transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Editar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ficha de la acción seleccionada */}
                  <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-[#414141]">
                        Ficha de la acción seleccionada
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleProponerFicha(fila)}
                        disabled={proponiendoFilaId === fila.id || sinFuente}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f2f8eb] hover:bg-[#e5f3d4] text-[#5b8723] border border-[#cde8ab] text-[11px] font-bold cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {proponiendoFilaId === fila.id ? 'Proponiendo...' : 'Proponer ficha con IA'}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        { key: 'productoEntregable', label: 'Producto o entregable' },
                        { key: 'responsable', label: 'Responsable' },
                        { key: 'cuando', label: 'Cuándo' },
                        { key: 'recursos', label: 'Recursos' },
                        { key: 'indicadorExito', label: 'Indicador de éxito' },
                        { key: 'evidencia', label: 'Evidencia' }
                      ].map((campo) => {
                        const valorCampo =
                          (ficha[campo.key as keyof FichaAccionSeleccionada] as string) || '';
                        const refKey = `${fila.id}::${campo.key}`;
                        return (
                          <div key={campo.key} className="block">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <label
                                htmlFor={refKey}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600"
                              >
                                <span>{campo.label}</span>
                                <Edit3 className="w-3 h-3 text-[#5b8723]" />
                              </label>
                              {valorCampo.trim() !== '' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    actualizarFicha(
                                      fila,
                                      campo.key as keyof FichaAccionSeleccionada,
                                      ''
                                    );
                                    requestAnimationFrame(() => {
                                      fichaTextareaRefs.current[refKey]?.focus();
                                    });
                                  }}
                                  className="text-[10px] font-bold text-gray-400 hover:text-[#5b8723] cursor-pointer transition-colors"
                                  title={`Limpiar ${campo.label.toLowerCase()} para reescribir`}
                                >
                                  Limpiar
                                </button>
                              )}
                            </div>
                            <textarea
                              id={refKey}
                              ref={(el) => {
                                fichaTextareaRefs.current[refKey] = el;
                              }}
                              rows={3}
                              value={valorCampo}
                              placeholder="Escribe o reescribe aquí..."
                              onChange={(e) =>
                                actualizarFicha(
                                  fila,
                                  campo.key as keyof FichaAccionSeleccionada,
                                  e.target.value
                                )
                              }
                              className="w-full px-2.5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 text-xs text-gray-800 leading-relaxed focus:outline-hidden focus:border-[#7FB536] focus:ring-1 focus:ring-[#7FB536]/30 resize-y bg-white"
                            />
                          </div>
                        );
                      })}
                      <label className="block">
                        <span className="text-[11px] font-bold text-gray-500 block mb-1">
                          Estado
                        </span>
                        <select
                          value={ficha.estado}
                          onChange={(e) => actualizarFicha(fila, 'estado', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-800 bg-white focus:outline-hidden focus:border-[#7FB536]"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En curso">En curso</option>
                          <option value="Completada">Completada</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bloque plegable: Anexos (cerrado por defecto) */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => setMostrarAnexos(!mostrarAnexos)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div>
            <h3 className="text-sm font-black text-[#414141]">Anexos</h3>
            <p className="text-xs text-gray-500">
              Guion de facilitación, salvaguardas éticas y rúbrica de evaluación.
            </p>
          </div>
          {mostrarAnexos ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {mostrarAnexos && (
          <div className="p-6 pt-0 space-y-6 border-t border-gray-100">
            <div>
              <h4 className="text-xs font-black uppercase text-[#5b8723] mt-4">
                Guion de facilitación
              </h4>
              <p className="text-[11px] text-gray-500 mb-2">
                Secuencia sugerida de momentos y tiempos para guiar la vivencia.
              </p>
              {(experiencia.guionFacilitacion || []).length === 0 ? (
                <p className="text-xs text-amber-700 italic">Aún no generado.</p>
              ) : (
                <div className="space-y-2">
                  {(experiencia.guionFacilitacion || []).map((g, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#F8FAF6] border border-gray-200 text-xs">
                      <strong>
                        {g.etapa} ({g.tiempoMinutos} min):
                      </strong>{' '}
                      {g.objetivo}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-[#5b8723]">Salvaguardas éticas</h4>
              <p className="text-[11px] text-gray-500 mb-2">
                Condiciones de cuidado para proteger el bienestar de las personas participantes.
              </p>
              {(experiencia.salvaguardas || []).length === 0 ? (
                <p className="text-xs text-amber-700 italic">Aún no generadas.</p>
              ) : (
                <div className="space-y-2">
                  {(experiencia.salvaguardas || []).map((sv, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#F8FAF6] border border-gray-200 text-xs">
                      <strong>{sv.principio}:</strong> {sv.descripcion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-[#5b8723]">Rúbrica de evaluación</h4>
              <p className="text-[11px] text-gray-500 mb-2">
                Criterios para verificar si la experiencia produjo una transformación real.
              </p>
              {(experiencia.instrumentoEvaluacion || []).length === 0 ? (
                <p className="text-xs text-amber-700 italic">Aún no generada.</p>
              ) : (
                <div className="space-y-2">
                  {(experiencia.instrumentoEvaluacion || []).map((ev, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#F8FAF6] border border-gray-200 text-xs">
                      <strong>{ev.criterio}:</strong> {ev.metodoMedicion} • {ev.frecuencia} •{' '}
                      {ev.metaEsperada}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

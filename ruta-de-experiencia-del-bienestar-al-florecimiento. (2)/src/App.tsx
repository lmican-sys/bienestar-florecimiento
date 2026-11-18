import React, { useState, useEffect } from 'react';
import { Navbar, TabNavegacion } from './components/Navbar.tsx';
import { ProtocoloInicio } from './components/ProtocoloInicio.tsx';
import { DiagnosticoEjecutivoView } from './components/DiagnosticoEjecutivoView.tsx';
import { MatrizEstrategicaView } from './components/MatrizEstrategicaView.tsx';
import { ProtocoloIteracion } from './components/ProtocoloIteracion.tsx';
import { TableroControl } from './components/TableroControl.tsx';
import { BasePropuestaView } from './components/BasePropuestaView.tsx';
import { PropuestaTransformacionView } from './components/PropuestaTransformacionView.tsx';
import { SalaValidacionColectiva } from './components/SalaValidacionColectiva.tsx';
import { GestionAgentesFirmas } from './components/GestionAgentesFirmas.tsx';
import { DocumentoInstitucionalDefinitivo } from './components/DocumentoInstitucionalDefinitivo.tsx';
import { FrameworkModal } from './components/FrameworkModal.tsx';
import { PrintReportView } from './components/PrintReportView.tsx';
import { InstitucionalHeroBanner } from './components/InstitucionalHeroBanner.tsx';
import {
  ExperienciaInstitucional,
  MatrizFila,
  DictamenColectivoTipo,
  AgenteTransformador,
  ComentarioSeccion
} from './types/flourishing.ts';
import {
  crearEsqueletoExperiencia,
  CASOS_EJEMPLO_AREANDINA
} from './utils/flourishingConsultant.ts';
import {
  generarPropuestaCompletaIA,
  generarDiagnosticoIA,
  regenerarPreguntasVivencialesIA,
  regenerarComponenteIA
} from './services/geminiPropuestaService.ts';
import {
  cargarExperienciasRepositorio,
  guardarExperienciasRepositorio,
  obtenerExperienciaActivaId,
  fijarExperienciaActivaId,
  actualizarExperienciaConVersionado,
  guardarAgentesRegistrados,
  eliminarExperienciaRepositorio
} from './utils/storage.ts';
import { RefreshCw, ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function App() {
  const [experiencias, setExperiencias] = useState<ExperienciaInstitucional[]>([]);
  const [experienciaActivaId, setExperienciaActivaId] = useState<string>('');
  const [tabActivo, setTabActivo] = useState<TabNavegacion>('tablero');
  const [modoCreacionNueva, setModoCreacionNueva] = useState(false);
  const [estaAnalizando, setEstaAnalizando] = useState(false);
  const [mostrarGuiaModelo, setMostrarGuiaModelo] = useState(false);
  const [mostrarVistaImpresion, setMostrarVistaImpresion] = useState(false);
  const [anexoActivo, setAnexoActivo] = useState<'guion' | 'salvaguardas' | 'evaluacion' | 'ninguno'>('ninguno');

  // Cargar repositorio inicial desde localStorage
  useEffect(() => {
    const cargadas = cargarExperienciasRepositorio();
    setExperiencias(cargadas);

    const guardadaId = obtenerExperienciaActivaId();
    if (guardadaId && cargadas.some((e) => e.id === guardadaId)) {
      setExperienciaActivaId(guardadaId);
    } else if (cargadas.length > 0) {
      setExperienciaActivaId(cargadas[0].id);
      fijarExperienciaActivaId(cargadas[0].id);
    }
  }, []);

  const experienciaActiva = experiencias.find((e) => e.id === experienciaActivaId) || experiencias[0];

  // Helper para persistir cambios en la experiencia activa
  const persistirCambios = (
    cambios: Partial<ExperienciaInstitucional>,
    resumenCambio: string = 'Ajuste de contenido institucional'
  ) => {
    if (!experienciaActiva) return;

    const actualizada = actualizarExperienciaConVersionado(
      experienciaActiva,
      cambios,
      resumenCambio
    );

    const nuevas = experiencias.map((e) => (e.id === actualizada.id ? actualizada : e));
    setExperiencias(nuevas);
  };

  const [generandoPropuesta, setGenerandoPropuesta] = useState(false);
  const [errorGeneracionPropuesta, setErrorGeneracionPropuesta] = useState<string | null>(null);
  const [exitoGeneracionPropuesta, setExitoGeneracionPropuesta] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  useEffect(() => {
    if (retryCountdown <= 0) return;
    const t = setTimeout(() => setRetryCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [retryCountdown]);

  const ejecutarGeneracionIA = async (
    expBase: ExperienciaInstitucional,
    fuente: string,
    reiniciarFirmas = false
  ) => {
    setGenerandoPropuesta(true);
    setErrorGeneracionPropuesta(null);
    setExitoGeneracionPropuesta(false);
    const errores: string[] = [];

    try {
      const resultado = await generarPropuestaCompletaIA(
        fuente,
        expBase.titulo,
        expBase.propuesta16
      );
      const nuevaPropuesta16: Record<string, any> = { ...expBase.propuesta16 };
      Object.entries(resultado.componentes).forEach(([clave, datos]) => {
        if (nuevaPropuesta16[clave]) {
          nuevaPropuesta16[clave] = {
            ...nuevaPropuesta16[clave],
            contenido: datos.contenido,
            categoria: datos.categoria || 'PROPUESTA_TRANSFORMACION',
            origen: 'GENERADA_IA'
          };
        }
      });

      setExperiencias((prev) => {
        const actualizadas = prev.map((e) => {
          if (e.id !== expBase.id) return e;
          const agentesActualizados = reiniciarFirmas
            ? e.agentes.map((a) => ({
                ...a,
                estadoFirma: 'PENDIENTE' as const,
                fechaFirma: undefined
              }))
            : e.agentes;
          return {
            ...e,
            preguntasVivenciales: resultado.preguntasVivenciales,
            propuesta16: nuevaPropuesta16 as ExperienciaInstitucional['propuesta16'],
            agentes: agentesActualizados
          };
        });
        guardarExperienciasRepositorio(actualizadas);
        return actualizadas;
      });
    } catch (err: any) {
      if (err?.retryAfter) setRetryCountdown(err.retryAfter);
      errores.push(err?.message || 'Error al generar la propuesta.');
    }

    if (errores.length > 0) {
      setErrorGeneracionPropuesta(errores.join(' | '));
    } else {
      setExitoGeneracionPropuesta(true);
    }
    setGenerandoPropuesta(false);
  };

  const [generandoDiagnostico, setGenerandoDiagnostico] = useState(false);
  const [errorDiagnostico, setErrorDiagnostico] = useState<string | null>(null);

  const ejecutarDiagnosticoIA = async (exp: ExperienciaInstitucional) => {
    const fuente = exp.fuenteOriginal?.trim();
    if (!fuente) {
      setErrorDiagnostico(
        'Esta experiencia no guarda el documento original. Crea una nueva experiencia para generar esta pestaña.'
      );
      return;
    }
    setGenerandoDiagnostico(true);
    setErrorDiagnostico(null);
    try {
      const diagResultado = await generarDiagnosticoIA(fuente, exp.titulo);
      setExperiencias((prev) => {
        const actualizadas = prev.map((e) => {
          if (e.id !== exp.id) return e;
          return {
            ...e,
            diagnostico: {
              ...e.diagnostico,
              ...diagResultado.diagnostico
            },
            matrizEstrategica: diagResultado.matrizEstrategica || e.matrizEstrategica,
            guionFacilitacion: diagResultado.guionFacilitacion || e.guionFacilitacion,
            salvaguardas: diagResultado.salvaguardas || e.salvaguardas,
            instrumentoEvaluacion:
              diagResultado.instrumentoEvaluacion || e.instrumentoEvaluacion
          };
        });
        guardarExperienciasRepositorio(actualizadas);
        return actualizadas;
      });
    } catch (err: any) {
      if (err?.retryAfter) setRetryCountdown(err.retryAfter);
      setErrorDiagnostico(err?.message || 'Error al generar el diagnóstico.');
    } finally {
      setGenerandoDiagnostico(false);
    }
  };

  useEffect(() => {
    if (
      tabActivo === 'diagnostico' &&
      experienciaActiva &&
      !experienciaActiva.diagnostico.sintesisExperiencia.queSeEntendio &&
      experienciaActiva.fuenteOriginal?.trim() &&
      !generandoDiagnostico &&
      !errorDiagnostico
    ) {
      void ejecutarDiagnosticoIA(experienciaActiva);
    }
  }, [tabActivo, experienciaActiva?.id]);

  // Crear o analizar desde Ruta 1
  const handleAnalizarTexto = (titulo: string, texto: string) => {
    if (!texto.trim()) return;
    setEstaAnalizando(true);
    const nueva = crearEsqueletoExperiencia(titulo, texto);
    const actualizadas = [nueva, ...experiencias];
    setExperiencias(actualizadas);
    guardarExperienciasRepositorio(actualizadas);
    setExperienciaActivaId(nueva.id);
    fijarExperienciaActivaId(nueva.id);
    setModoCreacionNueva(false);
    setEstaAnalizando(false);
    setTabActivo('propuesta_16');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    void ejecutarGeneracionIA(nueva, texto, false);
  };

  // Cargar caso de ejemplo Areandina
  const handleCargarCasoEjemplo = (key: string) => {
    const caso = CASOS_EJEMPLO_AREANDINA[key];
    if (caso) {
      const nueva = crearEsqueletoExperiencia(caso.titulo, caso.contenidoBruto);
      const actualizadas = [nueva, ...experiencias];
      setExperiencias(actualizadas);
      guardarExperienciasRepositorio(actualizadas);
      setExperienciaActivaId(nueva.id);
      fijarExperienciaActivaId(nueva.id);
      setModoCreacionNueva(false);
      setEstaAnalizando(false);
      setTabActivo('propuesta_16');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      void ejecutarGeneracionIA(nueva, caso.contenidoBruto, false);
    }
  };

  // Crear desde Ruta 2 (Paso a Paso)
  const handleIniciarPasoAPaso = (respuestas: Record<string, string>) => {
    const textoCompilado = `Propósito y Nombre: ${respuestas.proposito || ''}\nPoblación y Contexto: ${respuestas.poblacion || ''}\nPrácticas y Evidencias actuales: ${respuestas.practicas || ''}\nDesafío y Reto de Florecimiento: ${respuestas.desafio || ''}`;
    const nueva = crearEsqueletoExperiencia(
      respuestas.proposito?.slice(0, 70) || 'Experiencia Institucional Areandina',
      textoCompilado
    );
    const actualizadas = [nueva, ...experiencias];
    setExperiencias(actualizadas);
    guardarExperienciasRepositorio(actualizadas);
    setExperienciaActivaId(nueva.id);
    fijarExperienciaActivaId(nueva.id);
    setModoCreacionNueva(false);
    setEstaAnalizando(false);
    setTabActivo('propuesta_16');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    void ejecutarGeneracionIA(nueva, textoCompilado, false);
  };

  // Actualizar cualquiera de los 16 componentes con trazabilidad
  const handleActualizarComponente16 = (clave: string, nuevoContenido: string) => {
    if (!experienciaActiva) return;

    const compActual = experienciaActiva.propuesta16[clave as keyof typeof experienciaActiva.propuesta16];
    if (!compActual) return;

    const nuevaPropuesta = {
      ...experienciaActiva.propuesta16,
      [clave]: {
        ...compActual,
        contenido: nuevoContenido,
        origen: 'APROBADA_EQUIPO' as const
      }
    };

    persistirCambios(
      { propuesta16: nuevaPropuesta },
      `Edición del componente ${compActual.numero}: ${compActual.titulo}`
    );
  };

  // Actualizar preguntas vivenciales
  const handleActualizarPreguntaVivencial = (campo: string, valor: string) => {
    if (!experienciaActiva) return;
    persistirCambios(
      {
        preguntasVivenciales: {
          ...experienciaActiva.preguntasVivenciales,
          [campo]: valor
        }
      },
      `Ajuste de pregunta vivencial: ${campo}`
    );
  };

  // Actualizar dictamen colectivo
  const handleActualizarDictamen = (
    dictamen: DictamenColectivoTipo,
    observaciones: string
  ) => {
    if (!experienciaActiva) return;

    const nuevoEstado =
      dictamen === 'VALIDADA'
        ? 'APROBADA'
        : dictamen === 'REQUIERE_AJUSTES'
        ? 'PENDIENTE_AJUSTES'
        : 'EN_REVISION';

    persistirCambios(
      {
        dictamenColectivo: dictamen,
        observacionesColectivas: observaciones,
        estadoGeneral: nuevoEstado
      },
      `Registro de Dictamen Colectivo: ${dictamen}`
    );
  };

  // Comentarios colaborativos por sección
  const handleAgregarComentario = (comentario: Omit<ComentarioSeccion, 'id' | 'fecha'>) => {
    if (!experienciaActiva) return;
    const nuevoComentario: ComentarioSeccion = {
      ...comentario,
      id: `com_${Date.now()}`,
      fecha: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    persistirCambios(
      {
        comentarios: [nuevoComentario, ...(experienciaActiva.comentarios || [])]
      },
      `Nuevo aporte en ${comentario.componenteTitulo}`
    );
  };

  const handleResolverComentario = (comentarioId: string) => {
    if (!experienciaActiva) return;
    const actualizados = (experienciaActiva.comentarios || []).map((c) =>
      c.id === comentarioId ? { ...c, resuelto: !c.resuelto } : c
    );
    persistirCambios({ comentarios: actualizados }, 'Actualización de estado de observación');
  };

  // Acuerdos y compromisos
  const handleAgregarAcuerdo = (acuerdo: string) => {
    if (!experienciaActiva) return;
    persistirCambios(
      {
        acuerdosCompromisos: [...(experienciaActiva.acuerdosCompromisos || []), acuerdo]
      },
      'Nuevo acuerdo institucional agregado'
    );
  };

  const handleEliminarAcuerdo = (index: number) => {
    if (!experienciaActiva) return;
    const nuevos = (experienciaActiva.acuerdosCompromisos || []).filter((_, i) => i !== index);
    persistirCambios({ acuerdosCompromisos: nuevos }, 'Acuerdo institucional retirado');
  };

  // Actualización de integrantes y firmas (persiste tanto en la experiencia como en la red global)
  const handleActualizarAgentes = (nuevosAgentes: AgenteTransformador[]) => {
    if (!experienciaActiva) return;
    guardarAgentesRegistrados(nuevosAgentes);
    persistirCambios({ agentes: nuevosAgentes }, 'Actualización de agentes y firmas');
  };

  // Actualizar matriz operativa
  const handleActualizarFilaMatriz = (filaId: string, cambios: Partial<MatrizFila>) => {
    if (!experienciaActiva) return;
    const nuevaMatriz = experienciaActiva.matrizEstrategica.map((fila) =>
      fila.id === filaId ? { ...fila, ...cambios } : fila
    );
    persistirCambios({ matrizEstrategica: nuevaMatriz }, 'Ajuste de matriz operativa');
  };

  const handleSeleccionarOpcionMatriz = (filaId: string, opcionId: string) => {
    if (!experienciaActiva) return;
    const nuevaMatriz = experienciaActiva.matrizEstrategica.map((fila) =>
      fila.id === filaId ? { ...fila, opcionSeleccionadaId: opcionId } : fila
    );
    persistirCambios({ matrizEstrategica: nuevaMatriz }, 'Selección de opción de innovación');
  };

  // Cálculo de firmas pendientes
  const firmasPendientesCount =
    experienciaActiva?.agentes?.filter((a) => a.estadoFirma === 'PENDIENTE').length || 0;

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#414141] flex flex-col font-sans">
      {/* Navbar Superior Areandina con Pestañas Institucionales */}
      <Navbar
        tabActivo={tabActivo}
        onCambiarTab={(tab) => {
          setModoCreacionNueva(false);
          setTabActivo(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReset={() => setModoCreacionNueva(true)}
        onOpenFramework={() => setMostrarGuiaModelo(true)}
        onPrint={() => setMostrarVistaImpresion(true)}
        hasActiveExperience={!!experienciaActiva}
        firmasPendientesCount={firmasPendientesCount}
        dictamenActual={experienciaActiva?.dictamenColectivo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Banner Institucional con Título Grande, Subtítulo y Propósito */}
        <InstitucionalHeroBanner onExplorarModelo={() => setMostrarGuiaModelo(true)} />

        {estaAnalizando ? (
          <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-2xl shadow-sm border border-gray-200 text-center animate-pulse">
            <div className="w-12 h-12 rounded-full bg-[#f2f8eb] text-[#7FB536] flex items-center justify-center mx-auto mb-4 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#414141] mb-1">
              Estructurando Experiencia Institucional...
            </h3>
            <p className="text-xs text-gray-500">
              Generando los 16 componentes, formulando hipótesis con trazabilidad estricta y vinculando la Red de Agentes Transformadores.
            </p>
          </div>
        ) : modoCreacionNueva || !experienciaActiva ? (
          /* MÓDULO DE INGRESO (Ruta 1 o Ruta 2) */
          <div>
            <div className="mb-4">
              <button
                onClick={() => setModoCreacionNueva(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Tablero de Control</span>
              </button>
            </div>
            <ProtocoloInicio
              onAnalizarTexto={handleAnalizarTexto}
              onCargarCasoEjemplo={handleCargarCasoEjemplo}
              onIniciarPasoAPaso={handleIniciarPasoAPaso}
            />
          </div>
        ) : (
          /* VISTAS DE LOS 6 MÓDULOS INSTITUCIONALES */
          <div>
            {/* PESTAÑA 1: TABLERO DE CONTROL Y REPOSITORIO */}
            {tabActivo === 'tablero' && (
              <TableroControl
                experiencias={experiencias}
                experienciaActivaId={experienciaActiva.id}
                onSeleccionarExperiencia={(id) => {
                  setExperienciaActivaId(id);
                  fijarExperienciaActivaId(id);
                }}
                onNuevaExperiencia={() => setModoCreacionNueva(true)}
                onNavegarATab={(tab) => setTabActivo(tab as TabNavegacion)}
                onEliminarExperiencia={(id) => {
                  const restantes = eliminarExperienciaRepositorio(id);
                  setExperiencias(restantes);
                  if (id === experienciaActivaId) {
                    const siguienteId = restantes[0]?.id || '';
                    setExperienciaActivaId(siguienteId);
                    if (siguienteId) {
                      fijarExperienciaActivaId(siguienteId);
                    }
                  }
                }}
              />
            )}

            {/* PESTAÑA 2: BASE DE LA PROPUESTA */}
            {tabActivo === 'diagnostico' && (
              <BasePropuestaView
                experiencia={experienciaActiva}
                generandoDiagnostico={generandoDiagnostico}
                errorDiagnostico={errorDiagnostico}
                retryCountdown={retryCountdown}
                onGenerarDiagnostico={() => void ejecutarDiagnosticoIA(experienciaActiva)}
                onActualizarMatriz={(nuevaMatriz) =>
                  persistirCambios(
                    { matrizEstrategica: nuevaMatriz },
                    'Actualización de acciones en Base de la propuesta'
                  )
                }
              />
            )}

            {/* PESTAÑA 3: PROPUESTA DE TRANSFORMACIÓN (16 COMPONENTES & 7 PREGUNTAS) */}
            {tabActivo === 'propuesta_16' && (
              <PropuestaTransformacionView
                experiencia={experienciaActiva}
                generandoPropuesta={generandoPropuesta}
                errorGeneracionPropuesta={errorGeneracionPropuesta}
                exitoGeneracionPropuesta={exitoGeneracionPropuesta}
                retryCountdown={retryCountdown}
                onReintentarGeneracion={() => {
                  const fuente = experienciaActiva.fuenteOriginal?.trim();
                  if (!fuente) {
                    setErrorGeneracionPropuesta(
                      'Esta experiencia no guarda el documento original. Adjúntalo o pégalo en el recuadro inferior para generar.'
                    );
                    return;
                  }
                  void ejecutarGeneracionIA(experienciaActiva, fuente, true);
                }}
                onAdjuntarFuenteYGenerar={(fuente) => {
                  const expConFuente = { ...experienciaActiva, fuenteOriginal: fuente };
                  persistirCambios(
                    { fuenteOriginal: fuente },
                    'Documento original adjuntado para generación con IA'
                  );
                  setErrorDiagnostico(null);
                  void ejecutarGeneracionIA(expConFuente, fuente, false);
                }}
                onRegenerar7Preguntas={async () => {
                  const fuente = experienciaActiva.fuenteOriginal?.trim();
                  if (!fuente) {
                    setErrorGeneracionPropuesta(
                      'Esta experiencia no guarda el documento original. Súbalo de nuevo con "Nueva Experiencia".'
                    );
                    return;
                  }
                  setGenerandoPropuesta(true);
                  setErrorGeneracionPropuesta(null);
                  setExitoGeneracionPropuesta(false);
                  try {
                    const nuevas7 = await regenerarPreguntasVivencialesIA(
                      fuente,
                      experienciaActiva.titulo
                    );
                    persistirCambios(
                      {
                        preguntasVivenciales: nuevas7,
                        agentes: experienciaActiva.agentes.map((a) => ({
                          ...a,
                          estadoFirma: 'PENDIENTE' as const,
                          fechaFirma: undefined
                        }))
                      },
                      'Regeneración IA de las 7 preguntas vivenciales (firmas reiniciadas)'
                    );
                    setExitoGeneracionPropuesta(true);
                  } catch (err: any) {
                    if (err?.retryAfter) setRetryCountdown(err.retryAfter);
                    setErrorGeneracionPropuesta(
                      err?.message || 'Error al regenerar las 7 preguntas con Gemini.'
                    );
                  } finally {
                    setGenerandoPropuesta(false);
                  }
                }}
                onRegenerarComponente={async (clave) => {
                  const compActual = (experienciaActiva.propuesta16 as Record<string, any>)[clave];
                  if (!compActual) return;
                  const fuente = experienciaActiva.fuenteOriginal?.trim();
                  if (!fuente) {
                    setErrorGeneracionPropuesta(
                      'Esta experiencia no guarda el documento original. Súbalo de nuevo con "Nueva Experiencia".'
                    );
                    return;
                  }
                  setGenerandoPropuesta(true);
                  setErrorGeneracionPropuesta(null);
                  setExitoGeneracionPropuesta(false);
                  try {
                    const res = await regenerarComponenteIA(
                      fuente,
                      experienciaActiva.titulo,
                      compActual
                    );
                    persistirCambios(
                      {
                        propuesta16: {
                          ...experienciaActiva.propuesta16,
                          [clave]: {
                            ...compActual,
                            contenido: res.contenido,
                            categoria: res.categoria || 'PROPUESTA_TRANSFORMACION',
                            origen: 'GENERADA_IA'
                          }
                        },
                        agentes: experienciaActiva.agentes.map((a) => ({
                          ...a,
                          estadoFirma: 'PENDIENTE' as const,
                          fechaFirma: undefined
                        }))
                      },
                      `Regeneración IA del componente ${compActual.numero} (firmas reiniciadas)`
                    );
                    setExitoGeneracionPropuesta(true);
                  } catch (err: any) {
                    if (err?.retryAfter) setRetryCountdown(err.retryAfter);
                    setErrorGeneracionPropuesta(
                      err?.message || `Error al regenerar el componente ${compActual.numero}.`
                    );
                  } finally {
                    setGenerandoPropuesta(false);
                  }
                }}
                onActualizarComponente={handleActualizarComponente16}
                onActualizarPreguntaVivencial={handleActualizarPreguntaVivencial}
                onAbrirComentario={(clave, titulo) => {
                  setTabActivo('sala_validacion');
                }}
              />
            )}

            {/* PESTAÑA 4: SALA DE VALIDACIÓN Y APROBACIÓN COLECTIVA */}
            {tabActivo === 'sala_validacion' && (
              <SalaValidacionColectiva
                experiencia={experienciaActiva}
                onActualizarDictamen={handleActualizarDictamen}
                onAgregarComentario={handleAgregarComentario}
                onResolverComentario={handleResolverComentario}
                onAgregarAcuerdo={handleAgregarAcuerdo}
                onEliminarAcuerdo={handleEliminarAcuerdo}
                onNavegarATab={(tab) => setTabActivo(tab as TabNavegacion)}
              />
            )}

            {/* PESTAÑA 5: GESTIÓN DE INTEGRANTES Y FIRMAS */}
            {tabActivo === 'agentes_firmas' && (
              <GestionAgentesFirmas
                agentes={experienciaActiva.agentes}
                versionActual={experienciaActiva.versionActual}
                codigoUnico={experienciaActiva.codigoUnico}
                dictamenActual={experienciaActiva.dictamenColectivo}
                onActualizarAgentes={handleActualizarAgentes}
              />
            )}

            {/* PESTAÑA 6: DOCUMENTO INSTITUCIONAL DEFINITIVO */}
            {tabActivo === 'documento_definitivo' && (
              <DocumentoInstitucionalDefinitivo
                experiencia={experienciaActiva}
                onImprimirPDF={() => setMostrarVistaImpresion(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer Institucional Areandina */}
      <footer className="bg-white border-t border-gray-200 py-6 text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/Mesa_de_trabajo_1_copia_2_c604091c.png"
              alt="Logo Areandina Oscuro"
              className="h-6 w-auto object-contain opacity-70"
            />
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-gray-700">
              Red de Agentes Transformadores Areandina
            </span>
          </div>
          <div className="text-center sm:text-right">
            <span className="font-bold text-[#7FB536]">
              "¡Sé parte de la generación que transforma!"
            </span>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Sistema Institucional de Diseño, Validación Colectiva, Firma y Aprobación • Sedes Bogotá, Pereira, Valledupar y Virtual
            </p>
          </div>
        </div>
      </footer>

      {/* Modal Educativo del Marco Institucional */}
      <FrameworkModal
        isOpen={mostrarGuiaModelo}
        onClose={() => setMostrarGuiaModelo(false)}
      />

      {/* Vista de Impresión / PDF Institucional */}
      {mostrarVistaImpresion && experienciaActiva && (
        <PrintReportView
          experiencia={experienciaActiva}
          onCerrar={() => setMostrarVistaImpresion(false)}
        />
      )}
    </div>
  );
}

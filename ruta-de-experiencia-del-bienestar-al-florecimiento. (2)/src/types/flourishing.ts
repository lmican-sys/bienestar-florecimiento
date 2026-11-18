export type SedeAreandina = 'Bogotá' | 'Pereira' | 'Valledupar' | 'Virtual' | 'Multisede / Nacional';

export type AreandinaDimension = 'YO' | 'OTRO' | 'ENTORNO' | 'NOSOTROS' | 'NO_APLICA';
export type AreandinaCapacidad = 'SER' | 'CONVIVIR' | 'TRASCENDER' | 'NO_APLICA';
export type SpireDimension = 'ESPIRITUAL' | 'FISICO' | 'INTELECTUAL' | 'RELACIONAL' | 'EMOCIONAL' | 'NO_APLICA';

// Cuatro categorías obligatorias del principio de no invención + estado pendiente
export type TrazabilidadCategoria =
  | 'HECHO_DOCUMENTADO'       // Información respaldada por datos o evidencias suministrados
  | 'PERCEPCION'              // Opiniones, interpretaciones y apreciaciones de las personas
  | 'HIPOTESIS'               // Explicaciones o posibilidades que requieren validación
  | 'PROPUESTA_TRANSFORMACION' // Alternativas metodológicas de la IA (no aprobadas ni ejecutadas)
  | 'PENDIENTE_VACIO';        // Información faltante identificada expresamente

export type OrigenContenido = 'SUMINISTRADA' | 'GENERADA_IA' | 'APROBADA_EQUIPO';

export type DictamenColectivoTipo =
  | 'EN_REVISION'
  | 'VALIDADA'
  | 'VALIDADA_OBSERVACIONES'
  | 'REQUIERE_AJUSTES';

export interface AccionInnovadora {
  id: string;
  titulo: string;
  tipoInnovacion: string;
  descripcion: string;
  viabilidad: 'Alta' | 'Media';
}

export interface FichaAccionSeleccionada {
  productoEntregable: string;
  descripcionBreve: string;
  responsable: string;
  cuando: string;
  recursos: string;
  indicadorExito: string;
  evidencia: string;
  estado: 'Pendiente' | 'En curso' | 'Completada';
}

export interface MatrizFila {
  id: string;
  hallazgoNecesidad: string;
  trazabilidad: TrazabilidadCategoria;
  dimensionPrincipal: AreandinaDimension;
  capacidadPrincipal: AreandinaCapacidad;
  spirePrincipal?: SpireDimension;
  justificacionAlineacion: string;
  opcionesAccion: AccionInnovadora[];
  opcionSeleccionadaId: string;
  experienciaEsperada: string;
  evidenciaIndicador: string;
  notasAjustes?: string;
  alertaCoherencia?: string;
  fichaAccion?: FichaAccionSeleccionada;
}

export interface DiagnosticoEjecutivo {
  sintesisExperiencia: {
    queSeEntendio: string;
    aQuienVaDirigida: string;
    queSeBusca: string;
    contextoYModalidad: string;
  };
  puntosQuiebreHallazgos: Array<{
    id: string;
    descripcion: string;
    tipo: TrazabilidadCategoria;
    impactoObservado: string;
  }>;
  vaciosInformacion: string[];
}

export interface GuionPaso {
  etapa: 'Apertura y Encuadre' | 'Desarrollo Vivencial' | 'Reflexión Dialógica' | 'Cierre y Florecimiento';
  tiempoMinutos: number;
  objetivo: string;
  rolFacilitador: string;
  actividadParticipantes: string;
  recursos: string;
}

export interface SalvaguardaEtica {
  principio: string;
  descripcion: string;
  accionPreventiva: string;
}

export interface IndicadorEvaluacion {
  criterio: string;
  dimensionAsociada: string;
  metodoMedicion: string;
  frecuencia: string;
  metaEsperada: string;
}

// 16 Componentes Obligatorios de la Propuesta de Transformación
export interface ComponentePropuesta {
  id: string;
  numero: number;
  titulo: string;
  descripcionGuia: string;
  contenido: string;
  origen: OrigenContenido;
  categoria: TrazabilidadCategoria;
  observacionesValidacion?: string;
}

export interface PropuestaTransformacion16 {
  nombreExperiencia: ComponentePropuesta;
  propositoTransformacion: ComponentePropuesta;
  situacionNecesidad: ComponentePropuesta;
  poblacionParticipante: ComponentePropuesta;
  relacionModeloFlorecimiento: ComponentePropuesta;
  dimensionesMovilizar: ComponentePropuesta;
  capacidadesFortalecer: ComponentePropuesta;
  disenoMetodologico: ComponentePropuesta;
  actividadesDinamicas: ComponentePropuesta;
  recursosNecesariosDisponibles: ComponentePropuesta;
  responsablesRoles: ComponentePropuesta;
  frecuenciaDuracion: ComponentePropuesta;
  resultadosEsperados: ComponentePropuesta;
  indicadoresSeguimientoEvaluacion: ComponentePropuesta;
  evidenciasVerificacion: ComponentePropuesta;
  riesgosLimitacionesCondiciones: ComponentePropuesta;
}

// Las 7 Preguntas Centrales de la Experiencia como Unidad de Florecimiento
export interface PreguntasVivenciales {
  queSituacionTransformar: string;
  queExperienciaVivira: string;
  queHaraSentiraAprendera: string;
  queRelacionesCapacidadesFortalecera: string;
  queDimensionesMovilizara: string;
  queTransformacionEsperamos: string;
  comoSabremosSiOcurrio: string;
}

// Integrantes de la Red de Agentes Transformadores
export interface AgenteTransformador {
  id: string;
  nombre: string;
  cargo: string;
  dependencia: string;
  email: string;
  firmaDataUrl?: string; // Firma manuscrita en imagen o canvas
  fechaFirma?: string;
  estadoFirma: 'FIRMADO' | 'PENDIENTE';
  dictamenIndividual: 'VALIDADA' | 'VALIDADA_OBSERVACIONES' | 'REQUIERE_AJUSTES' | 'PENDIENTE';
  observacionesIndividuales?: string;
}

// Comentarios por sección en la Sala de Validación
export interface ComentarioSeccion {
  id: string;
  componenteClave: string;
  componenteTitulo: string;
  autorId: string;
  autorNombre: string;
  autorCargo: string;
  fecha: string;
  texto: string;
  tipo: 'OBSERVACION' | 'RECOMENDACION' | 'CORRECCION_REQUERIDA';
  resuelto: boolean;
}

// Registro histórico de versiones para trazabilidad estricta
export interface VersionHistorial {
  numeroVersion: string; // e.g. "1.0", "1.1", "2.0"
  fecha: string;
  autorModificacion: string;
  resumenCambios: string;
  dictamenEnMomento: DictamenColectivoTipo;
  firmasRegistradas: Array<{
    agenteId: string;
    agenteNombre: string;
    cargo: string;
    fecha: string;
  }>;
}

// Modelo Maestro de la Experiencia Institucional
export interface ExperienciaInstitucional {
  id: string;
  codigoUnico: string; // e.g. "EXP-ARE-2026-001"
  titulo: string;
  fuenteOriginal?: string;
  sede: SedeAreandina;
  versionActual: string;
  fechaCreacion: string;
  fechaUltimaModificacion: string;
  estadoGeneral: 'BORRADOR' | 'EN_REVISION' | 'PENDIENTE_AJUSTES' | 'LISTA_VALIDACION' | 'APROBADA';
  dictamenColectivo: DictamenColectivoTipo;
  observacionesColectivas: string;
  acuerdosCompromisos: string[];
  
  // Diagnóstico y estrategia
  diagnostico: DiagnosticoEjecutivo;
  matrizEstrategica: MatrizFila[];
  
  // Los 16 componentes estructurados
  propuesta16: PropuestaTransformacion16;
  
  // Las 7 preguntas de vivencia de florecimiento
  preguntasVivenciales: PreguntasVivenciales;
  
  // Anexos técnicos
  guionFacilitacion?: GuionPaso[];
  salvaguardas?: SalvaguardaEtica[];
  instrumentoEvaluacion?: IndicadorEvaluacion[];

  // Red de Agentes Transformadores y Firmas
  agentes: AgenteTransformador[];
  
  // Comentarios colaborativos por sección
  comentarios: ComentarioSeccion[];
  
  // Historial de versiones
  historialVersiones: VersionHistorial[];
  
  // Protección contra modificaciones silenciosas
  bloqueadoPorAprobacion: boolean;
}

export interface PreguntaPasoAPaso {
  id: string;
  numero: number;
  pregunta: string;
  descripcionCorta: string;
  placeholder: string;
  sugerencia: string;
}

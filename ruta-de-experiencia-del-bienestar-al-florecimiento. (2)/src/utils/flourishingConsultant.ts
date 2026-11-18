import type {
  ExperienciaInstitucional,
  DiagnosticoEjecutivo,
  MatrizFila,
  GuionPaso,
  SalvaguardaEtica,
  IndicadorEvaluacion,
  PreguntaPasoAPaso,
  PropuestaTransformacion16,
  PreguntasVivenciales,
  AgenteTransformador,
  SedeAreandina
} from '../types/flourishing.ts';
import { AGENTES_DEFAULT_AREANDINA, cargarAgentesRegistrados } from './storage.ts';
import { obtenerAccionesElegidasConFicha } from './matrizHelpers.ts';

export const PREGUNTAS_PASO_A_PASO: PreguntaPasoAPaso[] = [
  {
    id: 'proposito',
    numero: 1,
    pregunta: '¿Cuál es el propósito real y el nombre de la experiencia que deseas analizar?',
    descripcionCorta: 'Define qué busca transformar en el fondo y cómo se llama la iniciativa.',
    placeholder: 'Ejemplo: Jornada de Inducción Estudiantil 2025 para conectar emocionalmente a los primíparos con su nueva etapa académica...',
    sugerencia: 'Sé directo: qué cambio concreto se busca en la vida universitaria de las personas.'
  },
  {
    id: 'poblacion',
    numero: 2,
    pregunta: '¿A qué población específica va dirigida y en qué contexto o sedes opera?',
    descripcionCorta: 'Segmento, rol institucional y sedes (Bogotá, Pereira, Valledupar o Virtual).',
    placeholder: 'Ejemplo: 1.200 estudiantes de primer semestre de modalidades presencial y virtual en las sedes Bogotá y Valledupar...',
    sugerencia: 'Aclara si incluye docentes, tutores, familias o colaboradores.'
  },
  {
    id: 'practicas',
    numero: 3,
    pregunta: '¿Qué se realiza actualmente y qué hechos o percepciones has detectado?',
    descripcionCorta: 'Actividades actuales, evidencias disponibles y puntos críticos observados.',
    placeholder: 'Ejemplo: Se dan charlas magistrales de 4 horas en auditorio. Los estudiantes muestran fatiga (hecho en encuestas) y se siente poco sentido de comunidad...',
    sugerencia: 'Distingue entre hechos verificables (asistencia, notas, encuestas) y percepciones.'
  },
  {
    id: 'desafio',
    numero: 4,
    pregunta: '¿Qué vacío de información o reto prioritario deseas resolver con el modelo de Florecimiento?',
    descripcionCorta: 'El obstáculo o la oportunidad de innovación para trascender del bienestar asistencial al florecimiento.',
    placeholder: 'Ejemplo: Deseamos que pasen de ser oyentes pasivos a protagonistas de su propio florecimiento relacional y emocional, pero no sabemos cómo medirlo...',
    sugerencia: 'Enfócate en la experiencia que vivirá el participante.'
  }
];

export const CASOS_EJEMPLO_AREANDINA: Record<string, {
  titulo: string;
  resumen: string;
  poblacion: string;
  contexto: string;
  sede: SedeAreandina;
  contenidoBruto: string;
}> = {
  cafeRector: {
    titulo: 'Más allá del cargo: conversaciones que nos conecten en un encuentro (Café con el Rector)',
    resumen: 'Encuentros horizontales y distendidos de café para conectar a colaboradores, docentes y líderes institucionales desde su autenticidad humana, eliminando barreras jerárquicas.',
    poblacion: 'Colaboradores administrativos, docentes de todas las facultades, líderes de área y Rectoría (Dr. José Leonardo Valencia)',
    contexto: 'Espacios de diálogo vivencial y café en sedes Bogotá, Pereira, Valledupar y salas virtuales',
    sede: 'Multisede / Nacional',
    contenidoBruto: `Experiencia: Más allá del cargo: conversaciones que nos conecten en un encuentro (Café con el Rector).
Población: Colaboradores administrativos, docentes de todas las facultades, directores y el Rector Dr. José Leonardo Valencia.
Sede: Multisede (Bogotá, Pereira, Valledupar, Virtual).
Propósito: Trascender la distancia jerárquica y el rol burocrático para propiciar una conversación honesta, empática y reflexiva sobre el sentido del trabajo, el bienestar mutuo y los retos institucionales de florecimiento.
Hechos documentados:
- El 68% de los colaboradores y docentes interactúa con la alta dirección únicamente mediante comunicados oficiales o eventos solemnes masivos.
- En los pilotos de Café con el Rector se han realizado 12 sesiones con grupos pequeños (máximo 15 personas), logrando 95% de asistencia puntual y activa.
- Los participantes valoran altamente la disponibilidad y escucha del Rector, pero el 40% menciona que al principio sentía timidez o miedo de expresar problemas reales de su día a día.
Percepciones:
- Los colaboradores perciben que las barreras del organigrama a veces impiden visibilizar talentos, inquietudes y soluciones que surgen en la base.
- Existe el temor inicial de que expresar opiniones críticas o vulnerabilidad emocional pueda afectar su estabilidad o imagen laboral.
Hipótesis:
- Si el espacio de encuentro se estructura con preguntas disparadoras de sentido personal (dimensión YO y OTRO) y se elimina el protocolo solemne, se genera seguridad psicológica, sentido de comunidad y soluciones colaborativas inmediatas.
Vacíos de información:
- Falta un mecanismo de seguimiento a los acuerdos o ideas que surgen en el café para que no queden en una buena intención.
- No se ha formalizado una guía para que los vicerrectores y decanos repliquen esta misma metodología en sus respectivas sedes y facultades.`
  },
  induccion: {
    titulo: 'Inducción y Bienvenida Transformadora: Sé Parte de la Generación que Transforma',
    resumen: 'Transición a la educación superior reduciendo la ansiedad temprana y fomentando el arraigo andino.',
    poblacion: 'Estudiantes de primer ingreso (Sedes Bogotá, Pereira, Valledupar y Virtual)',
    contexto: 'Semana de acogida universitaria semestral',
    sede: 'Multisede / Nacional',
    contenidoBruto: `Experiencia: Jornadas de Inducción Semestral Areandina.
Población: 2.800 estudiantes de pregrado presencial y virtual (sedes Bogotá, Pereira, Valledupar).
Propósito: Facilitar la transición de la educación media a la universidad, fortaleciendo el sentido de pertenencia y arraigo institucional.
Hechos documentados:
- La asistencia promedio a las sesiones presenciales es del 88%, pero decae al 52% el segundo día.
- El 64% de las 6 horas diarias consiste en conferencias expositivas unilaterales sobre normas académicas y servicios.
- 42% de los estudiantes novatos reporta en la encuesta diagnóstica sentirse 'abrumado o desorientado' durante los primeros 15 días.
Percepciones:
- Los directores de programa perciben que los jóvenes no leen los correos de bienvenida ni recuerdan a sus coordinadores.
- Los tutores sienten que falta conexión humana entre pares antes de iniciar las clases.
Hipótesis de trabajo:
- Si se reemplaza la sobrecarga informativa pasiva por dinámicas dialógicas y micro-retos de conexión, se incrementará la retención temprana y el florecimiento emocional.
Vacíos de información:
- No existen datos de seguimiento sobre la integración de los estudiantes virtuales en sus semanas 1 a 4.
- Falta definir un indicador de arraigo relacional posterior a la primera semana.`
  },
  mentorias: {
    titulo: 'Red Andina de Acompañamiento y Mentorías Entre Pares',
    resumen: 'Vínculos significativos entre estudiantes avanzados y novatos con riesgo de rezago o deserción.',
    poblacion: 'Estudiantes de 1° a 3° semestre acompañados por monitores de semestres superiores',
    contexto: 'Facultades de Ciencias de la Salud, Ingenierías y Educación',
    sede: 'Multisede / Nacional',
    contenidoBruto: `Experiencia: Programa de Mentorías Entre Pares Areandina.
Población: 450 estudiantes tutorados y 60 mentores estudiantiles de semestres 6° a 9°.
Propósito: Brindar soporte académico y adaptativo mediante aprendizaje colaborativo y contención relacional.
Hechos documentados:
- El 70% de las alertas de tutoría se concentran en cálculo, química y competencias comunicativas.
- Las sesiones de mentoría presenciales logran 82% de aprobación en materias críticas para quienes asisten regularmente.
- El 35% de los mentores reporta sobrecarga y confusión de rol (actúan como profesores particulares en vez de guías).
Percepciones:
- Los tutorados manifiestan que sienten vergüenza de pedir ayuda en materias complejas frente a docentes.
- Los mentores sienten que su labor es voluntariosa pero poco reconocida en su hoja de vida institucional.
Hipótesis:
- Delimitar el rol hacia el florecimiento integral (dimensión YO y OTRO) y certificar micro-competencias de liderazgo aumentará la adherencia y evitará el desgaste.
Vacíos de información:
- Falta protocolo de derivación ágil cuando el problema trasciende lo pedagógico hacia la salud mental.`
  },
  pausas: {
    titulo: 'Pausas Conscientes y Florecimiento Docente Areandino',
    resumen: 'Regulación del estrés laboral y fortalecimiento del bienestar integral en la comunidad docente.',
    poblacion: 'Docentes de cátedra y tiempo completo en jornadas diurnas y nocturnas',
    contexto: 'Sedes y entornos de docencia virtual',
    sede: 'Multisede / Nacional',
    contenidoBruto: `Experiencia: Bienestar y Florecimiento para el Claustro Docente.
Población: 850 docentes de tiempo completo y cátedra.
Propósito: Prevenir el agotamiento laboral (burnout) y fomentar hábitos sostenibles de autocuidado y vitalidad pedagógica.
Hechos documentados:
- El 58% de los docentes pasa más de 6 horas continuas frente a pantallas o de pie sin pausas activas sistemáticas.
- Menos del 18% asiste a los talleres tradicionales de bienestar por falta de coincidencia horaria con sus clases.
- La evaluación de clima laboral 2024 evidenció alta valoración por la misión institucional, pero fatiga física y emocional a mitad de semestre.
Percepciones:
- Los docentes perciben el bienestar institucional como actividades aisladas que 'quitan tiempo' en lugar de integrarse a la jornada.
Hipótesis:
- Micro-pausas de 3 minutos integradas en el cambio de clase y cápsulas asincrónicas de resiliencia tienen 4 veces más probabilidad de adopción que seminarios extensos.
Vacíos de información:
- Se desconoce el nivel de estrés específico en docentes que orientan exclusivamente en modalidad virtual nocturna.`
  },
  catedra: {
    titulo: 'Cátedra Pablo Oliveros Marmolejo: Liderazgo y Florecimiento Colectivo',
    resumen: 'Formación del humanismo transformador conectando el proyecto de vida con el impacto comunitario.',
    poblacion: 'Estudiantes de todos los programas de pregrado de Areandina',
    contexto: 'Núcleo transversal institucional',
    sede: 'Multisede / Nacional',
    contenidoBruto: `Experiencia: Cátedra Institucional Pablo Oliveros Marmolejo (CPOM).
Población: 4.200 estudiantes por semestre en campus virtual y sedes físicas.
Propósito: Desarrollar el liderazgo transformador y la conciencia de corresponsabilidad social desde el pensamiento andino.
Hechos documentados:
- Los estudiantes desarrollan retos comunitarios finales, pero el 65% de los proyectos culmina al cerrar la nota del semestre sin continuidad real.
- Las evaluaciones evidencian alta comprensión teórica de los valores institucionales (promedio 4.4/5.0).
- La conexión con líderes locales o problemáticas reales de los territorios andinos es dispersa o se gestiona a última hora.
Percepciones:
- Los estudiantes perciben que el reto es un 'trabajo académico para cumplir' en vez de una experiencia de trascendencia social.
Hipótesis:
- Si los retos se articulan con desafíos reales validados de la región y se evalúan mediante diarios de florecimiento reflexivo, el impacto comunitario se vuelve sostenible.
Vacíos de información:
- No existe un mapa consolidado de actores territoriales aliados para acoger iniciativas de los estudiantes.`
  }
};

/**
 * Genera la ExperienciaInstitucional completa respetando:
 * 1. Principio fundamental: No inventar información.
 * 2. 4 categorías de trazabilidad: HECHO_DOCUMENTADO, PERCEPCION, HIPOTESIS, PROPUESTA_TRANSFORMACION.
 * 3. 16 componentes estructurados editables.
 * 4. 7 preguntas vivenciales centrales.
 */
export function crearEsqueletoExperiencia(
  titulo: string,
  _fuente: string,
  sede: SedeAreandina = 'Multisede / Nacional'
): ExperienciaInstitucional {
  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const codigoUnico = `EXP-ARE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const propuesta16: PropuestaTransformacion16 = {
    nombreExperiencia: {
      id: 'comp-1',
      numero: 1,
      titulo: 'Nombre de la experiencia',
      descripcionGuia: 'Nombre oficial o renovado de la iniciativa en Areandina.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    propositoTransformacion: {
      id: 'comp-2',
      numero: 2,
      titulo: 'Propósito o sentido de transformación',
      descripcionGuia: 'Para qué existe esta vivencia y qué busca movilizar en el ser humano.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    situacionNecesidad: {
      id: 'comp-3',
      numero: 3,
      titulo: 'Situación, necesidad o reto que atiende',
      descripcionGuia: 'Lectura crítica de las causas y tensiones que justifican el rediseño.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    poblacionParticipante: {
      id: 'comp-4',
      numero: 4,
      titulo: 'Población participante y sedes/modalidad',
      descripcionGuia: 'Quiénes viven la experiencia, alcance territorial y modalidad.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    relacionModeloFlorecimiento: {
      id: 'comp-5',
      numero: 5,
      titulo: 'Relación con el modelo “Del Bienestar al Florecimiento”',
      descripcionGuia: 'Articulación con los ejes SER, CONVIVIR y TRASCENDER.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    dimensionesMovilizar: {
      id: 'comp-6',
      numero: 6,
      titulo: 'Dimensiones a movilizar (YO, OTRO, ENTORNO, NOSOTROS)',
      descripcionGuia: 'Justificación de qué dimensiones humanas y colectivas se activan.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    capacidadesFortalecer: {
      id: 'comp-7',
      numero: 7,
      titulo: 'Capacidades humanas o institucionales que fortalece',
      descripcionGuia: 'Competencias emocionales, relacionales o de propósito.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    disenoMetodologico: {
      id: 'comp-8',
      numero: 8,
      titulo: 'Diseño metodológico de la experiencia',
      descripcionGuia: 'Arquitectura vivencial y momentos de facilitación.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    actividadesDinamicas: {
      id: 'comp-9',
      numero: 9,
      titulo: 'Actividades o dinámicas clave propuestas',
      descripcionGuia: 'Acciones concretas que producen una transformación individual observable.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    recursosNecesariosDisponibles: {
      id: 'comp-10',
      numero: 10,
      titulo: 'Recursos necesarios y disponibles',
      descripcionGuia: 'Medios humanos, físicos y digitales requeridos y existentes.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    responsablesRoles: {
      id: 'comp-11',
      numero: 11,
      titulo: 'Responsables, aliados y roles',
      descripcionGuia: 'Equipos institucionales y actores corresponsables.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    frecuenciaDuracion: {
      id: 'comp-12',
      numero: 12,
      titulo: 'Frecuencia, duración o momentos de implementación',
      descripcionGuia: 'Ritmo temporal, hitos y duración de la vivencia.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    resultadosEsperados: {
      id: 'comp-13',
      numero: 13,
      titulo: 'Resultados esperados de transformación',
      descripcionGuia: 'Cambios observables en las personas participantes.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    indicadoresSeguimientoEvaluacion: {
      id: 'comp-14',
      numero: 14,
      titulo: 'Indicadores de seguimiento y evaluación',
      descripcionGuia: 'Métricas de transformación humana, no solo asistencia.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    evidenciasVerificacion: {
      id: 'comp-15',
      numero: 15,
      titulo: 'Evidencias de verificación y validación',
      descripcionGuia: 'Registros empíricos que demuestran el impacto.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    },
    riesgosLimitacionesCondiciones: {
      id: 'comp-16',
      numero: 16,
      titulo: 'Riesgos, limitaciones y condiciones de implementación',
      descripcionGuia: 'Salvaguardas frente a sobrecargas, dispersión o resistencia al cambio.',
      contenido: '',
      origen: 'GENERADA_IA',
      categoria: 'PENDIENTE_VACIO'
    }
  };

  const preguntasVivenciales: PreguntasVivenciales = {
    queSituacionTransformar: '',
    queExperienciaVivira: '',
    queHaraSentiraAprendera: '',
    queRelacionesCapacidadesFortalecera: '',
    queDimensionesMovilizara: '',
    queTransformacionEsperamos: '',
    comoSabremosSiOcurrio: ''
  };

  const diagnostico: DiagnosticoEjecutivo = {
    sintesisExperiencia: {
      queSeEntendio: '',
      aQuienVaDirigida: '',
      queSeBusca: '',
      contextoYModalidad: ''
    },
    puntosQuiebreHallazgos: [],
    vaciosInformacion: []
  };

  const agentesGuardados = cargarAgentesRegistrados();
  const agentes: AgenteTransformador[] = agentesGuardados.map((ag) => ({
    id: ag.id,
    nombre: ag.nombre,
    cargo: ag.cargo,
    dependencia: ag.dependencia,
    email: ag.email,
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  }));

  const id = `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    codigoUnico,
    titulo: titulo || 'Experiencia Institucional Areandina',
    fuenteOriginal: _fuente,
    versionActual: '1.0',
    fechaCreacion: fechaHoy,
    fechaUltimaModificacion: fechaHoy,
    estadoGeneral: 'EN_REVISION',
    bloqueadoPorAprobacion: false,
    sede,
    diagnostico,
    matrizEstrategica: [],
    propuesta16,
    preguntasVivenciales,
    guionFacilitacion: [],
    salvaguardas: [],
    instrumentoEvaluacion: [],
    agentes,
    comentarios: [],
    acuerdosCompromisos: [],
    dictamenColectivo: 'EN_REVISION',
    observacionesColectivas: '',
    historialVersiones: [
      {
        numeroVersion: '1.0',
        fecha: fechaHoy,
        autorModificacion: 'Red de Agentes Transformadores',
        dictamenEnMomento: 'EN_REVISION',
        firmasRegistradas: [],
        resumenCambios: 'Creación del esqueleto inicial para generación con Gemini.'
      }
    ]
  };
}

export function generarSalidaMarkdownOficial(exp: ExperienciaInstitucional): string {
  const accionesElegidas = obtenerAccionesElegidasConFicha(exp.matrizEstrategica);
  const bloqueAcciones =
    accionesElegidas.length > 0
      ? accionesElegidas
          .map(
            (a, idx) =>
              `### Acción ${idx + 1}: ${a.accionTitulo}\n- **Hallazgo / Necesidad:** ${a.hallazgoNecesidad}\n- **Descripción:** ${a.accionDescripcion || 'Sin descripción'}\n- **Producto o entregable:** ${a.ficha.productoEntregable}\n- **Responsable:** ${a.ficha.responsable}\n- **Cuándo:** ${a.ficha.cuando}\n- **Recursos:** ${a.ficha.recursos}\n- **Indicador de éxito:** ${a.ficha.indicadorExito}\n- **Evidencia:** ${a.ficha.evidencia}\n- **Estado:** ${a.ficha.estado}`
          )
          .join('\n\n')
      : 'Sin acciones elegidas registradas.';

  const componentes = Object.values(exp.propuesta16)
    .map((c) => `### ${c.numero}. ${c.titulo}\n${c.contenido || 'Pendiente de generar'}`)
    .join('\n\n');
  return `# ${exp.titulo}\nCódigo: ${exp.codigoUnico} | Versión: ${exp.versionActual}\n\n## Acciones Elegidas y Ficha de Acción\n${bloqueAcciones}\n\n## Propuesta (16 Componentes)\n${componentes}`;
}


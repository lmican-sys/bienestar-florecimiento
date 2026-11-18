import type {
  AgenteTransformador,
  ExperienciaInstitucional,
  VersionHistorial
} from '../types/flourishing.ts';
import { crearEsqueletoExperiencia, CASOS_EJEMPLO_AREANDINA } from './flourishingConsultant.ts';

const STORAGE_KEY_EXPERIENCIAS = 'areandina_florecimiento_experiencias_v2';
const STORAGE_KEY_AGENTES_DEFAULT = 'areandina_agentes_transformadores_v2';
const STORAGE_KEY_EXP_ACTIVA = 'areandina_experiencia_activa_id_v2';
const STORAGE_KEY_MIGRACION_RED_9 = 'areandina_migracion_red_9_v1';
const STORAGE_KEY_MIGRACION_RECTOR = 'areandina_migracion_rector_v2';

function corregirTextoRector(texto: string): string {
  return texto
    .replace(
      /\bRectoría\s*\(\s*(?:Dr\.|Doctor)?\s*Mauricio(?:\s+Andrés)?\s+Hernández(?:\s+Anzola)?\s*\)/gi,
      'Rectoría (Dr. José Leonardo Valencia)'
    )
    .replace(
      /\bRector\s+(?:Dr\.|Doctor)?\s*Mauricio(?:\s+Andrés)?(?:\s+Hernández)?(?:\s+Anzola)?/gi,
      'Rector Dr. José Leonardo Valencia'
    )
    .replace(
      /\b(?:Dr\.|Doctor)\s+Mauricio(?:\s+Andrés)?\s+Hernández(?:\s+Anzola)?/gi,
      'Dr. José Leonardo Valencia'
    );
}

function corregirRectorEnValor<T>(valor: T): T {
  if (typeof valor === 'string') {
    return corregirTextoRector(valor) as unknown as T;
  }
  if (Array.isArray(valor)) {
    return valor.map((item) => corregirRectorEnValor(item)) as unknown as T;
  }
  if (valor && typeof valor === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(valor)) {
      out[k] = corregirRectorEnValor(v);
    }
    return out as T;
  }
  return valor;
}

const FIRMAS_DEMO = ['M10,40 Q40,5 70,35', 'M15,45 Q50,10 80,40'];

const normalizarEmail = (email?: string): string => (email || '').trim().toLowerCase();

const esFirmaDemo = (firmaDataUrl?: string): boolean =>
  Boolean(firmaDataUrl && FIRMAS_DEMO.some((patron) => firmaDataUrl.includes(patron)));

// Integrantes Oficiales de la Red de Agentes Transformadores Areandina
export const AGENTES_DEFAULT_AREANDINA: AgenteTransformador[] = [
  {
    id: 'agente_1',
    nombre: 'Mauricio Andrés Hernández Anzola',
    cargo: 'Vicerrector Nacional de Experiencia y Felicidad',
    dependencia: 'Rectoría',
    email: 'mhernandez171@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_2',
    nombre: 'Luz Esperanza Micán Díaz',
    cargo: 'Directora Nacional de AAlumni',
    dependencia: 'Vicerrectoría Nacional de Experiencia y Felicidad',
    email: 'lmican@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_3',
    nombre: 'Jaime Enrique Casas Mora',
    cargo: 'Subdirector Nacional de Bienestar',
    dependencia: 'Dirección Nacional de Medio Universitario',
    email: 'jcasas@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_4',
    nombre: 'Lina Maria Páramo Caldas',
    cargo: 'Coordinador Nacional de Desarrollo y Bienestar',
    dependencia: 'Director Nacional de Gestión Humana',
    email: 'lparamo3@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_5',
    nombre: 'Adriana Cristina Mora Ramos',
    cargo: 'Profesional de Formación',
    dependencia: 'Director Nacional de Gestión Humana',
    email: 'amora42@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_6',
    nombre: 'Giovany Alexis Lemus Rodriguez',
    cargo: 'Coordinador de Selección',
    dependencia: 'Director Nacional de Gestión Humana',
    email: 'glemus5@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_7',
    nombre: 'Leonardo Martinez Ostos',
    cargo: 'Docente de liderazgo',
    dependencia: 'Subdirector Nacional de Bienestar',
    email: 'lmartinez@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_8',
    nombre: 'Mariana Cruz Luna',
    cargo: 'Coordinadora AAlumni Pereira',
    dependencia: 'Directora Nacional de AAlumni',
    email: 'mcruz64@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  },
  {
    id: 'agente_9',
    nombre: 'Leidy Giron Duarte',
    cargo: 'Profesional de bienestar al colaborador',
    dependencia: 'Director Nacional de Gestión Humana',
    email: 'lgiron11@areandina.edu.co',
    estadoFirma: 'PENDIENTE',
    dictamenIndividual: 'PENDIENTE'
  }
];

export function sincronizarAgentesConListaOficial(
  agentesExistentes: AgenteTransformador[]
): AgenteTransformador[] {
  const oficialPorEmail = new Map(
    AGENTES_DEFAULT_AREANDINA.map((a) => [normalizarEmail(a.email), a])
  );
  const emailsPresentes = new Set<string>();

  const actualizados = agentesExistentes.map((ag) => {
    const emailNorm = normalizarEmail(ag.email);
    if (emailNorm) emailsPresentes.add(emailNorm);

    const oficial = oficialPorEmail.get(emailNorm);
    const copia: AgenteTransformador = oficial
      ? {
          ...ag,
          nombre: oficial.nombre,
          cargo: oficial.cargo,
          dependencia: oficial.dependencia
        }
      : { ...ag };

    if (esFirmaDemo(copia.firmaDataUrl)) {
      copia.estadoFirma = 'PENDIENTE';
      copia.dictamenIndividual = 'PENDIENTE';
      delete copia.firmaDataUrl;
      delete copia.fechaFirma;
      delete copia.observacionesIndividuales;
    }

    return copia;
  });

  const faltantes = AGENTES_DEFAULT_AREANDINA.filter(
    (oficial) => !emailsPresentes.has(normalizarEmail(oficial.email))
  ).map((oficial) => ({ ...oficial }));

  return [...actualizados, ...faltantes];
}

export function migrarExperienciaListaOficial(
  exp: ExperienciaInstitucional
): ExperienciaInstitucional {
  const estaAprobada =
    exp.dictamenColectivo === 'VALIDADA' || exp.estadoGeneral === 'APROBADA';
  if (estaAprobada) {
    return exp;
  }

  return {
    ...exp,
    agentes: sincronizarAgentesConListaOficial(exp.agentes || [])
  };
}

export function cargarAgentesRegistrados(): AgenteTransformador[] {
  if (typeof localStorage === 'undefined') {
    return AGENTES_DEFAULT_AREANDINA.map((a) => ({ ...a }));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AGENTES_DEFAULT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sincronizarAgentesConListaOficial(parsed);
      }
    }
  } catch (err) {
    console.error('Error al cargar agentes de localStorage:', err);
  }
  return AGENTES_DEFAULT_AREANDINA.map((a) => ({ ...a }));
}

export function guardarAgentesRegistrados(agentes: AgenteTransformador[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const limpios: AgenteTransformador[] = agentes.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      cargo: a.cargo,
      dependencia: a.dependencia,
      email: a.email,
      estadoFirma: 'PENDIENTE' as const,
      dictamenIndividual: 'PENDIENTE' as const
    }));
    localStorage.setItem(STORAGE_KEY_AGENTES_DEFAULT, JSON.stringify(limpios));
  } catch (err) {
    console.error('Error al guardar agentes:', err);
  }
}

export function cargarExperienciasRepositorio(): ExperienciaInstitucional[] {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EXPERIENCIAS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let experiencias: ExperienciaInstitucional[] = parsed.map((e) => ({
            ...e,
            sede: e.sede || 'Multisede / Nacional'
          }));

          let huboCambios = false;
          if (!localStorage.getItem(STORAGE_KEY_MIGRACION_RED_9)) {
            experiencias = experiencias.map(migrarExperienciaListaOficial);
            localStorage.setItem(STORAGE_KEY_MIGRACION_RED_9, 'true');
            huboCambios = true;
          }

          if (!localStorage.getItem(STORAGE_KEY_MIGRACION_RECTOR)) {
            experiencias = experiencias.map((exp) => {
              const estaAprobada =
                exp.dictamenColectivo === 'VALIDADA' || exp.estadoGeneral === 'APROBADA';
              if (estaAprobada) return exp;
              return {
                ...exp,
                titulo: corregirTextoRector(exp.titulo),
                fuenteOriginal: exp.fuenteOriginal
                  ? corregirTextoRector(exp.fuenteOriginal)
                  : exp.fuenteOriginal,
                observacionesColectivas: corregirTextoRector(exp.observacionesColectivas || ''),
                acuerdosCompromisos: corregirRectorEnValor(exp.acuerdosCompromisos || []),
                diagnostico: corregirRectorEnValor(exp.diagnostico),
                matrizEstrategica: corregirRectorEnValor(exp.matrizEstrategica),
                propuesta16: corregirRectorEnValor(exp.propuesta16),
                preguntasVivenciales: corregirRectorEnValor(exp.preguntasVivenciales),
                guionFacilitacion: corregirRectorEnValor(exp.guionFacilitacion),
                salvaguardas: corregirRectorEnValor(exp.salvaguardas),
                instrumentoEvaluacion: corregirRectorEnValor(exp.instrumentoEvaluacion)
              };
            });
            localStorage.setItem(STORAGE_KEY_MIGRACION_RECTOR, 'true');
            huboCambios = true;
          }

          if (huboCambios) {
            guardarExperienciasRepositorio(experiencias);
          }

          return experiencias;
        }
      }
    } catch (err) {
      console.error('Error al cargar experiencias de localStorage:', err);
    }
  }

  // Pre-sembrar experiencias modelo iniciales
  const expCafeRector = crearEsqueletoExperiencia(
    CASOS_EJEMPLO_AREANDINA.cafeRector.titulo,
    CASOS_EJEMPLO_AREANDINA.cafeRector.contenidoBruto,
    'Multisede / Nacional'
  );

  const expInduccion = crearEsqueletoExperiencia(
    CASOS_EJEMPLO_AREANDINA.induccion.titulo,
    CASOS_EJEMPLO_AREANDINA.induccion.contenidoBruto,
    'Multisede / Nacional'
  );

  const iniciales = [expCafeRector, expInduccion];
  guardarExperienciasRepositorio(iniciales);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_MIGRACION_RED_9, 'true');
    localStorage.setItem(STORAGE_KEY_MIGRACION_RECTOR, 'true');
  }
  return iniciales;
}

export function guardarExperienciasRepositorio(experiencias: ExperienciaInstitucional[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_EXPERIENCIAS, JSON.stringify(experiencias));
  } catch (err) {
    console.error('Error al guardar repositorio de experiencias:', err);
  }
}

export function obtenerExperienciaActivaId(): string | null {
  return localStorage.getItem(STORAGE_KEY_EXP_ACTIVA);
}

export function fijarExperienciaActivaId(id: string): void {
  localStorage.setItem(STORAGE_KEY_EXP_ACTIVA, id);
}

export function eliminarExperienciaRepositorio(id: string): ExperienciaInstitucional[] {
  try {
    const actuales = cargarExperienciasRepositorio();
    const filtradas = actuales.filter((e) => e.id !== id);
    guardarExperienciasRepositorio(filtradas);
    
    // Si la eliminada era la activa, apuntar a la primera disponible o limpiar
    const activaId = obtenerExperienciaActivaId();
    if (activaId === id) {
      if (filtradas.length > 0) {
        fijarExperienciaActivaId(filtradas[0].id);
      } else {
        localStorage.removeItem(STORAGE_KEY_EXP_ACTIVA);
      }
    }
    return filtradas;
  } catch (err) {
    console.error('Error al eliminar experiencia:', err);
    return [];
  }
}

/**
 * Modificación controlada con Trazabilidad Antifraude / Anti-tamper:
 * Si la experiencia estaba aprobada y se modifica su contenido,
 * se genera automáticamente una nueva versión (ej. 1.0 -> 1.1 o 2.0),
 * se registra el historial de cambios y se reinician firmas pendientes.
 */
export function actualizarExperienciaConVersionado(
  experienciaActual: ExperienciaInstitucional,
  cambios: Partial<ExperienciaInstitucional>,
  resumenCambiosUsuario: string = 'Ajuste de componentes de transformación'
): ExperienciaInstitucional {
  const estabaAprobada = experienciaActual.dictamenColectivo === 'VALIDADA' || experienciaActual.estadoGeneral === 'APROBADA';
  
  let nuevoNumeroVersion = experienciaActual.versionActual;
  const historial = [...(experienciaActual.historialVersiones || [])];

  if (estabaAprobada) {
    // Incrementar versión menor (ej. 1.0 -> 1.1)
    const partes = experienciaActual.versionActual.split('.');
    const mayor = parseInt(partes[0] || '1', 10);
    const menor = parseInt(partes[1] || '0', 10) + 1;
    nuevoNumeroVersion = `${mayor}.${menor}`;

    // Registrar en el historial la versión previa
    const entradaHistorial: VersionHistorial = {
      numeroVersion: experienciaActual.versionActual,
      fecha: new Date().toISOString().replace('T', ' ').slice(0, 16),
      autorModificacion: 'Equipo Red de Agentes Transformadores',
      resumenCambios: `Versión aprobada archivada. Se crea v${nuevoNumeroVersion} por modificaciones posteriores: ${resumenCambiosUsuario}`,
      dictamenEnMomento: experienciaActual.dictamenColectivo,
      firmasRegistradas: experienciaActual.agentes
        .filter((a) => a.estadoFirma === 'FIRMADO')
        .map((a) => ({
          agenteId: a.id,
          agenteNombre: a.nombre,
          cargo: a.cargo,
          fecha: a.fechaFirma || ''
        }))
    };
    historial.unshift(entradaHistorial);
  }

  // Si estaba aprobada, se reabre a estado de revisión para que las firmas se revaliden con honestidad
  const nuevoEstadoGeneral = estabaAprobada ? 'EN_REVISION' : (cambios.estadoGeneral || experienciaActual.estadoGeneral);
  const nuevoDictamen = estabaAprobada ? 'EN_REVISION' : (cambios.dictamenColectivo || experienciaActual.dictamenColectivo);
  
  // Si se reabre, los agentes pendientes vuelven a 'PENDIENTE' para requerir refrendo
  const agentesActualizados = estabaAprobada
    ? experienciaActual.agentes.map((a) => ({
        ...a,
        estadoFirma: 'PENDIENTE' as const,
        dictamenIndividual: 'PENDIENTE' as const,
        fechaFirma: undefined
      }))
    : (cambios.agentes || experienciaActual.agentes);

  const experienciaActualizada: ExperienciaInstitucional = {
    ...experienciaActual,
    ...cambios,
    versionActual: nuevoNumeroVersion,
    fechaUltimaModificacion: new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    estadoGeneral: nuevoEstadoGeneral,
    dictamenColectivo: nuevoDictamen,
    agentes: agentesActualizados,
    historialVersiones: historial,
    bloqueadoPorAprobacion: nuevoDictamen === 'VALIDADA'
  };

  // Persistir en repositorio
  const todas = cargarExperienciasRepositorio();
  const index = todas.findIndex((e) => e.id === experienciaActual.id);
  if (index >= 0) {
    todas[index] = experienciaActualizada;
  } else {
    todas.unshift(experienciaActualizada);
  }
  guardarExperienciasRepositorio(todas);

  return experienciaActualizada;
}

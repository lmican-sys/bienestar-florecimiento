import {
  ComponentePropuesta,
  ExperienciaInstitucional,
  TrazabilidadCategoria
} from '../types/flourishing.ts';

const TEMAS_PLANTILLA = [
  'deserción',
  'primer semestre',
  'inducción',
  'tríadas',
  'cohorte',
  'tutores'
];

export const detectarContenidoAjeno = (texto: string, fuente: string): string[] => {
  const f = fuente.toLowerCase();
  const t = texto.toLowerCase();
  return TEMAS_PLANTILLA.filter((tema) => t.includes(tema) && !f.includes(tema));
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const tipo = res.headers.get('content-type') || '';
  if (!tipo.includes('application/json')) {
    throw new Error(
      `El servidor no respondió con datos válidos (estado ${res.status}). Espere unos segundos y reintente.`
    );
  }

  const data = await res.json();
  console.log(`[IA] POST ${url} <- status:`, res.status, 'keys:', Object.keys(data || {}));
  if (!res.ok) {
    const err: any = new Error(data?.error || `Error ${res.status}`);
    if (data?.retryAfter) err.retryAfter = data.retryAfter;
    throw err;
  }
  return data as T;
}

export interface ResultadoGeneracionCompleta {
  poblacionObjetivo: string;
  sedes: string[];
  preguntasVivenciales: ExperienciaInstitucional['preguntasVivenciales'];
  componentes: Record<
    string,
    {
      contenido: string;
      categoria: TrazabilidadCategoria;
    }
  >;
}

export async function generarPropuestaCompletaIA(
  fuente: string,
  titulo: string,
  estructuraActual: ExperienciaInstitucional['propuesta16']
): Promise<ResultadoGeneracionCompleta> {
  if (!fuente.trim()) {
    throw new Error('No hay texto del documento ni descripción escrita para generar la propuesta.');
  }

  const listaComponentes = Object.entries(estructuraActual).map(([clave, comp]) => ({
    clave,
    numero: comp.numero,
    titulo: comp.titulo,
    descripcionGuia: comp.descripcionGuia
  }));

  console.log('[IA] POST /api/generar-propuesta -> fuente:', fuente.length, 'chars');
  const data = await postJson<ResultadoGeneracionCompleta>('/api/generar-propuesta', {
    fuente,
    titulo,
    listaComponentes
  });

  if (!data.preguntasVivenciales || !data.componentes) {
    throw new Error('La respuesta del servidor no contiene preguntasVivenciales o componentes.');
  }

  return data;
}

export async function regenerarPreguntasVivencialesIA(
  fuente: string,
  titulo: string
): Promise<ExperienciaInstitucional['preguntasVivenciales']> {
  if (!fuente.trim()) {
    throw new Error('No hay fuente documental o descripción para regenerar las 7 preguntas.');
  }

  console.log('[IA] POST /api/regenerar-preguntas -> fuente:', fuente.length, 'chars');
  return postJson<ExperienciaInstitucional['preguntasVivenciales']>(
    '/api/regenerar-preguntas',
    { fuente, titulo }
  );
}

export async function regenerarComponenteIA(
  fuente: string,
  titulo: string,
  compActual: ComponentePropuesta
): Promise<{ contenido: string; categoria: TrazabilidadCategoria }> {
  if (!fuente.trim()) {
    throw new Error('No hay fuente documental o descripción para regenerar este componente.');
  }

  return postJson<{ contenido: string; categoria: TrazabilidadCategoria }>(
    '/api/regenerar-componente',
    { fuente, titulo, compActual }
  );
}

export async function generarDiagnosticoIA(
  fuente: string,
  titulo: string
): Promise<{
  diagnostico: Partial<ExperienciaInstitucional['diagnostico']>;
  matrizEstrategica: ExperienciaInstitucional['matrizEstrategica'];
  guionFacilitacion: ExperienciaInstitucional['guionFacilitacion'];
  salvaguardas: ExperienciaInstitucional['salvaguardas'];
  instrumentoEvaluacion: ExperienciaInstitucional['instrumentoEvaluacion'];
}> {
  if (!fuente.trim()) {
    throw new Error('No hay texto del documento ni descripción para generar el diagnóstico.');
  }

  console.log('[IA] POST /api/generar-diagnostico -> fuente:', fuente.length, 'chars');
  return postJson('/api/generar-diagnostico', { fuente, titulo });
}

export async function proponerFichaAccionIA(params: {
  fuente: string;
  titulo: string;
  hallazgo: string;
  accionTitulo: string;
  accionDescripcion: string;
}) {
  if (!params.fuente.trim()) {
    throw new Error('Falta el documento original para proponer la ficha.');
  }
  return postJson<{
    productoEntregable: string;
    descripcionBreve: string;
    responsable: string;
    cuando: string;
    recursos: string;
    indicadorExito: string;
    evidencia: string;
    estado: 'Pendiente' | 'En curso' | 'Completada';
  }>('/api/proponer-ficha-accion', params);
}

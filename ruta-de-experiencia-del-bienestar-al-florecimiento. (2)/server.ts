import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELO_GEMINI = (process.env.GEMINI_MODEL || '').trim() || 'gemini-4-hydrogen';
// Fuente: libro "Del Bienestar al Florecimiento" (Areandina, 2026), caps. 1, 5, 6, 9 y 10
const MARCO_MODELO = `
MARCO OFICIAL DEL MODELO (úsalo para clasificar y redactar; no lo contradigas):

HORIZONTE: el florecimiento humano. Es un horizonte al que la institución contribuye, no un
resultado que pueda producir ni garantizar. La institución crea condiciones, amplía
oportunidades, reduce barreras y diseña experiencias; las personas siguen siendo dueñas de
sus trayectorias.

DIMENSIONES (organizan la experiencia; una misma experiencia puede involucrar varias):
- YO: relación de la persona consigo misma: identidad, autonomía, autocuidado, aprendizaje,
  sentido y proyecto de vida. Pregunta: ¿cómo me desarrollo?
- OTRO: relaciones: reconocimiento, confianza, empatía, diálogo, reciprocidad, cuidado y
  convivencia. Importa la calidad de los vínculos, no solo la cantidad de contactos.
  Pregunta: ¿cómo me relaciono?
- ENTORNO: condiciones físicas, sociales, culturales, tecnológicas, económicas y
  ambientales: espacios, reglas, recursos, prácticas y oportunidades. Pregunta: ¿en qué
  condiciones vivo, aprendo y actúo?
- NOSOTROS: dimensión colectiva: pertenencia, participación, solidaridad, colaboración,
  cuidado colectivo y contribución. Pregunta: ¿qué construimos juntos?

CAPACIDADES (expresan posibilidades de desarrollo):
- SER: reconocerse, desarrollarse, cuidarse y orientar la propia vida (identidad, autonomía,
  autocuidado, aprendizaje, crecimiento, sentido y propósito).
- CONVIVIR: establecer relaciones respetuosas, participar y construir con otros (empatía,
  diálogo, reciprocidad, colaboración, cuidado, pertenencia y gestión de diferencias; no
  significa ausencia de conflicto).
- TRASCENDER: proyectar el desarrollo más allá del interés individual (sentido, propósito,
  contribución, participación, innovación y transformación).

RELACIÓN DIMENSIÓN-CAPACIDAD (predominante, no exclusiva): YO con SER; OTRO con CONVIVIR;
ENTORNO con SER, CONVIVIR y TRASCENDER; NOSOTROS con CONVIVIR y TRASCENDER.

ESPACIOS DE EXPERIENCIA (formas de leer la experiencia, no áreas administrativas):
Academia, Medio Universitario, Talento Humano, Alumni, Investigación y Nosotros.

REGLAS DE LENGUAJE Y EVIDENCIA:
- Una actividad realizada no demuestra un resultado; un resultado no demuestra impacto.
  Niveles de evidencia: Actividad, Cobertura, Experiencia, Resultado, Transformación,
  Impacto, Aprendizaje. No afirmes un nivel que la fuente no respalde.
- Nunca escribas que la experiencia "logra", "garantiza" o "produce" florecimiento,
  transformación o impacto. Usa "busca contribuir", "puede favorecer" o "se espera observar".
- Es una lógica de contribución, no de causalidad automática.
- Las metas e indicadores que la fuente no define se escriben "Meta a definir tras la línea
  base". Mide para comprender y mejorar, no para controlar ni vigilar a las personas.
- Una experiencia nueva suele ser un piloto: se prueba una hipótesis de cambio antes de
  escalar. Madurez posible: Exploración, Piloto, Consolidación, Escalamiento,
  Institucionalización.
`.trim();
const MODELO_FALLBACK = 'gemini-3.1-flash-lite';

const TIPOS_VALIDOS = [
  'HECHO_DOCUMENTADO',
  'PERCEPCION',
  'HIPOTESIS',
  'PROPUESTA_TRANSFORMACION',
  'PENDIENTE_VACIO'
];
const normalizarClave = (v: unknown) =>
  String(v ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
const tipoValido = (v: unknown) => {
  const n = normalizarClave(v);
  return TIPOS_VALIDOS.includes(n) ? n : 'PENDIENTE_VACIO';
};

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function generarConReintentos(ai: GoogleGenAI, params: any, intentos = 2) {
  const modeloPrincipal = params?.model || MODELO_GEMINI;
  const modelosAProbar =
    modeloPrincipal === MODELO_FALLBACK
      ? [MODELO_FALLBACK, MODELO_GEMINI]
      : [modeloPrincipal, MODELO_FALLBACK];

  let ultimoError: any;

  for (const modelo of modelosAProbar) {
    const requestedThinking = params?.config?.thinkingConfig;
    const thinkingConfig =
      requestedThinking?.thinkingLevel === ThinkingLevel.MINIMAL && modelo !== MODELO_FALLBACK
        ? { ...requestedThinking, thinkingLevel: ThinkingLevel.LOW }
        : requestedThinking || { thinkingLevel: ThinkingLevel.LOW };

    const conModelo = {
      ...params,
      model: modelo,
      config: {
        ...(params?.config || {}),
        thinkingConfig
      }
    };

    for (let i = 0; i < intentos; i++) {
      try {
        return await ai.models.generateContent(conModelo);
      } catch (err: any) {
        ultimoError = err;
        const texto = String(err?.message || '');
        if (/"code":\s*429|RESOURCE_EXHAUSTED/i.test(texto)) {
          const m =
            texto.match(/retry in ([\d.]+)s/i) || texto.match(/"retryDelay":\s*"(\d+)s"/i);
          const seg = m ? Math.ceil(Number(m[1])) : 60;
          const e: any = new Error(
            `Se alcanzó el límite de uso de la IA. Espere ${seg} segundos y presione Reintentar.`
          );
          e.status = 429;
          e.retryAfter = seg;
          throw e;
        }
        const cambiarModelo = /"code":\s*(404|503)|NOT_FOUND|UNAVAILABLE|high demand/i.test(texto);
        if (cambiarModelo) {
          if (modelo !== MODELO_FALLBACK) {
            break; // Pasa rápido al modelo de respaldo sin esperar backoff largo
          }
          if (i < intentos - 1) {
            await esperar(600);
            continue;
          }
        }
        const temporal = /"code":\s*(500|504)|DEADLINE_EXCEEDED/i.test(texto);
        if (!temporal || i === intentos - 1) break;
        await esperar(500 * 2 ** i);
      }
    }
  }
  throw ultimoError || new Error('No se pudo obtener respuesta de Gemini.');
}

function responderErrorGemini(res: express.Response, err: any) {
  if (err?.status === 429) {
    res.status(429).json({ error: err.message, retryAfter: err.retryAfter });
    return;
  }
  const msg = String(err?.message || '');
  const sobrecarga = /UNAVAILABLE|high demand|503/i.test(msg);
  res.status(sobrecarga ? 503 : 500).json({
    error: sobrecarga
      ? 'El servicio de IA está con alta demanda. Espere un momento y presione Reintentar.'
      : msg || 'Error al generar con Gemini.'
  });
}

const SYSTEM_PROMPT_BASE = `
Eres un analista y diseñador institucional de Areandina especializado en el Modelo "Del Bienestar al Florecimiento" (dimensiones: YO, OTRO, ENTORNO, NOSOTROS; ejes: SER, CONVIVIR, TRASCENDER).
Escribes en español, con tono ejecutivo, claro, humano e innovador.

REGLAS ESTRICTAS:
1. HECHOS DE LA FUENTE (población, sedes, problemática, cifras, nombres, fechas): NUNCA se inventan. Si faltan, escribe exactamente "No especificado en el documento" e indica qué dato falta.
2. DISEÑO DE LA PROPUESTA (actividades, dinámicas, metodología, indicadores): Propón con creatividad e innovación, respondiendo directamente a la problemática o estrategia de la fuente.
3. PROHIBIDO usar temas o ejemplos de otras experiencias (inducción, primer semestre, deserción, tríadas, cohorte, tutores) salvo que aparezcan explícitamente en la fuente.
4. Usa el vocabulario y la población real de la fuente (si habla de egresados, habla de egresados; si habla de docentes, de docentes, etc.).
5. Cada actividad propuesta debe incluir: qué hará la persona, qué sentirá, qué aprenderá o desarrollará, qué dimensión del florecimiento moviliza (YO/OTRO/ENTORNO/NOSOTROS), qué cambio individual observable se espera y con qué evidencia se verificaría.
6. Los indicadores deben medir transformación en las personas, no solo asistencia o participación.
7. En la situación a transformar, distingue los síntomas del problema de fondo.
8. Responde ÚNICAMENTE con JSON válido, sin markdown ni texto adicional.
9. SPIRE es un referente que inspira el Modelo, no parte de su arquitectura. No lo uses para clasificar ni lo menciones como dimensión o capacidad. Clasifica solo con las dimensiones YO, OTRO, ENTORNO, NOSOTROS y las capacidades SER, CONVIVIR, TRASCENDER.
10. RESTRICCIÓN TECNOLÓGICA (SIN CRM): La institución NO cuenta con un sistema CRM. PROHIBIDO diseñar, proponer o comprometer estrategias, acciones, integraciones, automatizaciones, flujos, recursos, indicadores o evidencias que dependan de un CRM o requieran implementar, alimentar o usar un CRM. Propón alternativas operativas viables con capacidades humanas, encuentros presenciales/virtuales o herramientas simples y accesibles ya disponibles (formularios sencillos, listas, correo electrónico, hojas de cálculo o canales institucionales existentes en la fuente).
`.trim();

const SYSTEM_PROMPT = `${SYSTEM_PROMPT_BASE}\n\n${MARCO_MODELO}`;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el servidor.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

function limpiarJson(raw: string): string {
  return raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.post('/api/generar-propuesta', async (req, res) => {
    try {
      const { fuente, titulo, listaComponentes } = req.body || {};
      if (!fuente || typeof fuente !== 'string' || !fuente.trim()) {
        res.status(400).json({ error: 'El texto del documento o descripción está vacío.' });
        return;
      }

      const ai = getGeminiClient();
      const fuenteRecortada = fuente.slice(0, 22000);
      const todos = Array.isArray(listaComponentes) ? listaComponentes : [];
      const mitad = Math.ceil(todos.length / 2);
      const bloque1 = todos.slice(0, mitad);
      const bloque2 = todos.slice(mitad);

      const promptBase = `TÍTULO DE LA EXPERIENCIA: "${titulo || 'Experiencia Institucional'}"

<FUENTE>
${fuenteRecortada}
</FUENTE>`;

      const formatoComps = (lista: any[]) =>
        lista
          .map(
            (c: any) =>
              `    "${c.clave}": { "contenido": "string (máx. 70 palabras, directo y accionable. Componente ${c.numero}: ${c.titulo} — ${c.descripcionGuia})", "categoria": "HECHO_DOCUMENTADO | PERCEPCION | HIPOTESIS | PROPUESTA_TRANSFORMACION | PENDIENTE_VACIO" }`
          )
          .join(',\n');

      const promptBloqueA = `${promptBase}

Genera un JSON válido, claro y conciso con esta estructura exacta:
{
  "poblacionObjetivo": "string (población real tomada de la fuente, o 'No especificado en el documento')",
  "sedes": ["string (sedes reales de la fuente, o 'No especificado en el documento')"],
  "preguntasVivenciales": {
    "queSituacionTransformar": "string (máx. 55 palabras, distinguiendo síntomas y problema de fondo)",
    "queExperienciaVivira": "string (máx. 55 palabras, experiencia vivencial innovadora)",
    "queHaraSentiraAprendera": "string (máx. 55 palabras: qué hará, sentirá y aprenderá)",
    "queRelacionesCapacidadesFortalecera": "string (máx. 55 palabras, capacidades y relaciones)",
    "queDimensionesMovilizara": "string (máx. 45 palabras, dimensiones YO/OTRO/ENTORNO/NOSOTROS y ejes SER/CONVIVIR/TRASCENDER)",
    "queTransformacionEsperamos": "string (máx. 45 palabras, cambio individual observable)",
    "comoSabremosSiOcurrio": "string (máx. 45 palabras, indicadores de transformación y evidencia)"
  },
  "componentes": {
${formatoComps(bloque1)}
  }
}`.trim();

      const promptBloqueB = `${promptBase}

Genera un JSON válido, claro y conciso con esta estructura exacta:
{
  "componentes": {
${formatoComps(bloque2)}
  }
}`.trim();

      const [resA, resB] = await Promise.all([
        generarConReintentos(ai, {
          model: MODELO_GEMINI,
          contents: promptBloqueA,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
          }
        }),
        bloque2.length > 0
          ? generarConReintentos(ai, {
              model: MODELO_GEMINI,
              contents: promptBloqueB,
              config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
              }
            })
          : Promise.resolve(null)
      ]);

      const parsedA = JSON.parse(limpiarJson(resA.text || ''));
      const parsedB = resB ? JSON.parse(limpiarJson(resB.text || '')) : { componentes: {} };

      const parsed = {
        poblacionObjetivo: parsedA.poblacionObjetivo,
        sedes: parsedA.sedes,
        preguntasVivenciales: parsedA.preguntasVivenciales,
        componentes: {
          ...(parsedA.componentes || {}),
          ...(parsedB.componentes || {})
        }
      };

      const preguntasRequeridas = [
        'queSituacionTransformar',
        'queExperienciaVivira',
        'queHaraSentiraAprendera',
        'queRelacionesCapacidadesFortalecera',
        'queDimensionesMovilizara',
        'queTransformacionEsperamos',
        'comoSabremosSiOcurrio'
      ];
      const faltanPreguntas = preguntasRequeridas.filter(
        (k) => !parsed?.preguntasVivenciales?.[k]
      );
      const faltanComponentes = todos
        .map((c: any) => c.clave)
        .filter((k: string) => !parsed?.componentes?.[k]?.contenido);

      if (faltanPreguntas.length > 0 || faltanComponentes.length > 0) {
        res.status(502).json({
          error: `Respuesta incompleta de Gemini. Faltan preguntas: [${faltanPreguntas.join(', ')}]. Faltan componentes: [${faltanComponentes.join(', ')}].`
        });
        return;
      }

      Object.values(parsed.componentes || {}).forEach((c: any) => {
        c.categoria = tipoValido(c.categoria);
      });

      res.json(parsed);
    } catch (err: any) {
      responderErrorGemini(res, err);
    }
  });

  app.post('/api/generar-diagnostico', async (req, res) => {
    try {
      const { fuente, titulo } = req.body || {};
      if (!fuente || typeof fuente !== 'string' || !fuente.trim()) {
        res.status(400).json({ error: 'El texto del documento o descripción está vacío.' });
        return;
      }

      const ai = getGeminiClient();
      const userPrompt = `
TÍTULO DE LA EXPERIENCIA: "${titulo || 'Experiencia Institucional'}"

<FUENTE>
${fuente.slice(0, 28000)}
</FUENTE>

Analiza la FUENTE y genera:
1. diagnostico.sintesisExperiencia con queSeEntendio, aQuienVaDirigida, queSeBusca, contextoYModalidad.
2. diagnostico.puntosQuiebreHallazgos (2 a 4 hallazgos) con tipo exacto: HECHO_DOCUMENTADO (solo si está escrito en la fuente), PERCEPCION, HIPOTESIS, PROPUESTA_TRANSFORMACION o PENDIENTE_VACIO.
3. diagnostico.vaciosInformacion (2 a 4 vacíos).
4. matrizEstrategica (2 a 4 filas) con hallazgoNecesidad, trazabilidad, dimensionPrincipal (YO|OTRO|ENTORNO|NOSOTROS), capacidadPrincipal (SER|CONVIVIR|TRASCENDER), justificacionAlineacion, opcionesAccion (2 a 3 opciones con id, titulo, descripcion, tipoInnovacion, viabilidad), opcionSeleccionadaId, experienciaEsperada, evidenciaIndicador.
5. guionFacilitacion (3 a 4 pasos), salvaguardas (2 a 3 objetos con principio, descripcion, accionPreventiva), instrumentoEvaluacion (3 a 4 criterios con criterio, metodoMedicion, frecuencia, metaEsperada, dimensionAsociada; si la fuente no define meta, escribe "Meta a definir tras la línea base").
`.trim();

      const response = await generarConReintentos(ai, {
        model: MODELO_GEMINI,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: [
              'diagnostico',
              'matrizEstrategica',
              'guionFacilitacion',
              'salvaguardas',
              'instrumentoEvaluacion'
            ],
            properties: {
              diagnostico: {
                type: Type.OBJECT,
                required: ['sintesisExperiencia', 'puntosQuiebreHallazgos', 'vaciosInformacion'],
                properties: {
                  sintesisExperiencia: {
                    type: Type.OBJECT,
                    required: [
                      'queSeEntendio',
                      'aQuienVaDirigida',
                      'queSeBusca',
                      'contextoYModalidad'
                    ],
                    properties: {
                      queSeEntendio: { type: Type.STRING },
                      aQuienVaDirigida: { type: Type.STRING },
                      queSeBusca: { type: Type.STRING },
                      contextoYModalidad: { type: Type.STRING }
                    }
                  },
                  puntosQuiebreHallazgos: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ['id', 'tipo', 'descripcion', 'impactoObservado'],
                      properties: {
                        id: { type: Type.STRING },
                        tipo: {
                          type: Type.STRING,
                          enum: [
                            'HECHO_DOCUMENTADO',
                            'PERCEPCION',
                            'HIPOTESIS',
                            'PROPUESTA_TRANSFORMACION',
                            'PENDIENTE_VACIO'
                          ]
                        },
                        descripcion: { type: Type.STRING },
                        impactoObservado: { type: Type.STRING }
                      }
                    }
                  },
                  vaciosInformacion: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              },
              matrizEstrategica: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: [
                    'id',
                    'hallazgoNecesidad',
                    'trazabilidad',
                    'dimensionPrincipal',
                    'capacidadPrincipal',
                    'justificacionAlineacion',
                    'opcionesAccion',
                    'opcionSeleccionadaId',
                    'experienciaEsperada',
                    'evidenciaIndicador'
                  ],
                  properties: {
                    id: { type: Type.STRING },
                    hallazgoNecesidad: { type: Type.STRING },
                    trazabilidad: {
                      type: Type.STRING,
                      enum: [
                        'HECHO_DOCUMENTADO',
                        'PERCEPCION',
                        'HIPOTESIS',
                        'PROPUESTA_TRANSFORMACION',
                        'PENDIENTE_VACIO'
                      ]
                    },
                    dimensionPrincipal: {
                      type: Type.STRING,
                      enum: ['YO', 'OTRO', 'ENTORNO', 'NOSOTROS']
                    },
                    capacidadPrincipal: {
                      type: Type.STRING,
                      enum: ['SER', 'CONVIVIR', 'TRASCENDER']
                    },
                    justificacionAlineacion: { type: Type.STRING },
                    opcionSeleccionadaId: { type: Type.STRING },
                    experienciaEsperada: { type: Type.STRING },
                    evidenciaIndicador: { type: Type.STRING },
                    opcionesAccion: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        required: ['id', 'titulo', 'descripcion', 'tipoInnovacion', 'viabilidad'],
                        properties: {
                          id: { type: Type.STRING },
                          titulo: { type: Type.STRING },
                          descripcion: { type: Type.STRING },
                          tipoInnovacion: { type: Type.STRING },
                          viabilidad: { type: Type.STRING, enum: ['Alta', 'Media'] }
                        }
                      }
                    }
                  }
                }
              },
              guionFacilitacion: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: [
                    'etapa',
                    'tiempoMinutos',
                    'objetivo',
                    'rolFacilitador',
                    'actividadParticipantes',
                    'recursos'
                  ],
                  properties: {
                    etapa: { type: Type.STRING },
                    tiempoMinutos: { type: Type.NUMBER },
                    objetivo: { type: Type.STRING },
                    rolFacilitador: { type: Type.STRING },
                    actividadParticipantes: { type: Type.STRING },
                    recursos: { type: Type.STRING }
                  }
                }
              },
              salvaguardas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ['principio', 'descripcion', 'accionPreventiva'],
                  properties: {
                    principio: { type: Type.STRING },
                    descripcion: { type: Type.STRING },
                    accionPreventiva: { type: Type.STRING }
                  }
                }
              },
              instrumentoEvaluacion: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: [
                    'criterio',
                    'metodoMedicion',
                    'frecuencia',
                    'metaEsperada',
                    'dimensionAsociada'
                  ],
                  properties: {
                    criterio: { type: Type.STRING },
                    metodoMedicion: { type: Type.STRING },
                    frecuencia: { type: Type.STRING },
                    metaEsperada: { type: Type.STRING },
                    dimensionAsociada: {
                      type: Type.STRING,
                      enum: ['YO', 'OTRO', 'ENTORNO', 'NOSOTROS']
                    }
                  }
                }
              }
            }
          }
        }
      });

      const parsed = JSON.parse(limpiarJson(response.text || ''));
      const TIPOS_VALIDOS = [
        'HECHO_DOCUMENTADO',
        'PERCEPCION',
        'HIPOTESIS',
        'PROPUESTA_TRANSFORMACION',
        'PENDIENTE_VACIO'
      ];
      const normalizarClave = (v: unknown) =>
        String(v ?? '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .trim();
      const tipoValido = (v: unknown) => {
        const n = normalizarClave(v);
        return TIPOS_VALIDOS.includes(n) ? n : 'PENDIENTE_VACIO';
      };

      if (Array.isArray(parsed?.diagnostico?.puntosQuiebreHallazgos)) {
        parsed.diagnostico.puntosQuiebreHallazgos = parsed.diagnostico.puntosQuiebreHallazgos.map(
          (h: any, i: number) => ({ ...h, id: h.id || `h${i + 1}`, tipo: tipoValido(h.tipo) })
        );
      }

      if (Array.isArray(parsed?.matrizEstrategica)) {
        parsed.matrizEstrategica = parsed.matrizEstrategica.map((f: any, i: number) => {
          const idFila = f.id || `m${i + 1}`;
          const originales = f.opcionesAccion || [];
          const opciones = originales.map((o: any, j: number) => ({
            ...o,
            id: `${idFila}_opt${j + 1}`
          }));
          const idx = originales.findIndex((o: any) => o.id === f.opcionSeleccionadaId);
          return {
            ...f,
            id: idFila,
            trazabilidad: tipoValido(f.trazabilidad),
            dimensionPrincipal: normalizarClave(f.dimensionPrincipal),
            capacidadPrincipal: normalizarClave(f.capacidadPrincipal),
            opcionesAccion: opciones,
            opcionSeleccionadaId: opciones[idx >= 0 ? idx : 0]?.id,
            notasAjustes: f.notasAjustes ?? ''
          };
        });
      }

      const s = parsed?.diagnostico?.sintesisExperiencia;
      if (
        !s?.queSeEntendio ||
        !s?.aQuienVaDirigida ||
        !s?.queSeBusca ||
        !s?.contextoYModalidad ||
        !Array.isArray(parsed?.diagnostico?.puntosQuiebreHallazgos) ||
        parsed.diagnostico.puntosQuiebreHallazgos.length === 0 ||
        !Array.isArray(parsed?.matrizEstrategica) ||
        parsed.matrizEstrategica.length === 0 ||
        !Array.isArray(parsed?.guionFacilitacion) ||
        parsed.guionFacilitacion.length === 0 ||
        !Array.isArray(parsed?.salvaguardas) ||
        parsed.salvaguardas.length === 0 ||
        !Array.isArray(parsed?.instrumentoEvaluacion) ||
        parsed.instrumentoEvaluacion.length === 0
      ) {
        res.status(502).json({
          error:
            'Respuesta incompleta de Gemini: faltan campos obligatorios en diagnostico, matrizEstrategica, guionFacilitacion, salvaguardas o instrumentoEvaluacion.'
        });
        return;
      }

      const CAPACIDADES_POR_DIMENSION: Record<string, string[]> = {
        YO: ['SER'],
        OTRO: ['CONVIVIR'],
        ENTORNO: ['SER', 'CONVIVIR', 'TRASCENDER'],
        NOSOTROS: ['CONVIVIR', 'TRASCENDER']
      };

      parsed.matrizEstrategica = parsed.matrizEstrategica.map((f: any) => {
        const esperadas = CAPACIDADES_POR_DIMENSION[f.dimensionPrincipal] || [];
        const coincide = esperadas.includes(f.capacidadPrincipal);
        return {
          ...f,
          alertaCoherencia: coincide
            ? ''
            : `El libro asocia ${f.dimensionPrincipal} principalmente con ${esperadas.join(' / ')}. Revisa si ${f.capacidadPrincipal} es la capacidad que realmente predomina en esta acción.`
        };
      });

      res.json(parsed);
    } catch (err: any) {
      responderErrorGemini(res, err);
    }
  });

  app.post('/api/proponer-ficha-accion', async (req, res) => {
    try {
      const { fuente, titulo, hallazgo, accionTitulo, accionDescripcion } = req.body || {};
      if (!fuente || typeof fuente !== 'string' || !fuente.trim()) {
        res.status(400).json({ error: 'Falta el documento original para proponer la ficha.' });
        return;
      }

      const ai = getGeminiClient();
      const userPrompt = `
TÍTULO: "${titulo || 'Experiencia Institucional'}"
HALLAZGO: "${hallazgo || ''}"
ACCIÓN SELECCIONADA: "${accionTitulo || ''}" — ${accionDescripcion || ''}

<FUENTE>
${fuente.slice(0, 28000)}
</FUENTE>

Propón la ficha operativa para esta acción. Si un dato (como responsable, cuándo o recursos) no está en la fuente, escribe "No especificado en el documento".
`.trim();

      const response = await generarConReintentos(ai, {
        model: MODELO_GEMINI,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseSchema: {
            type: Type.OBJECT,
            required: [
              'productoEntregable',
              'descripcionBreve',
              'responsable',
              'cuando',
              'recursos',
              'indicadorExito',
              'evidencia',
              'estado'
            ],
            properties: {
              productoEntregable: { type: Type.STRING },
              descripcionBreve: { type: Type.STRING },
              responsable: { type: Type.STRING },
              cuando: { type: Type.STRING },
              recursos: { type: Type.STRING },
              indicadorExito: { type: Type.STRING },
              evidencia: { type: Type.STRING },
              estado: { type: Type.STRING, enum: ['Pendiente', 'En curso', 'Completada'] }
            }
          }
        }
      });

      const parsed = JSON.parse(limpiarJson(response.text || ''));
      res.json(parsed);
    } catch (err: any) {
      responderErrorGemini(res, err);
    }
  });

  app.post('/api/regenerar-preguntas', async (req, res) => {
    try {
      const { fuente, titulo } = req.body || {};
      if (!fuente || typeof fuente !== 'string' || !fuente.trim()) {
        res.status(400).json({ error: 'No hay fuente documental o descripción.' });
        return;
      }

      const ai = getGeminiClient();
      const userPrompt = `
TÍTULO: "${titulo || 'Experiencia Institucional'}"
<FUENTE>
${fuente.slice(0, 22000)}
</FUENTE>

Devuelve ÚNICAMENTE un JSON válido y conciso (máx. 60 palabras por campo) con las 7 preguntas vivenciales basadas en la fuente:
{
  "queSituacionTransformar": "string",
  "queExperienciaVivira": "string",
  "queHaraSentiraAprendera": "string",
  "queRelacionesCapacidadesFortalecera": "string",
  "queDimensionesMovilizara": "string",
  "queTransformacionEsperamos": "string",
  "comoSabremosSiOcurrio": "string"
}
`.trim();

      const response = await generarConReintentos(ai, {
        model: MODELO_GEMINI,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });

      const parsed = JSON.parse(limpiarJson(response.text || ''));
      res.json(parsed);
    } catch (err: any) {
      responderErrorGemini(res, err);
    }
  });

  app.post('/api/regenerar-componente', async (req, res) => {
    try {
      const { fuente, titulo, compActual } = req.body || {};
      if (!fuente || typeof fuente !== 'string' || !fuente.trim()) {
        res.status(400).json({ error: 'No hay fuente documental o descripción.' });
        return;
      }

      const ai = getGeminiClient();
      const userPrompt = `
TÍTULO: "${titulo || 'Experiencia Institucional'}"
COMPONENTE ${compActual?.numero}: "${compActual?.titulo}"
GUÍA: "${compActual?.descripcionGuia}"

<FUENTE>
${fuente.slice(0, 22000)}
</FUENTE>

Devuelve ÚNICAMENTE un JSON válido:
{
  "contenido": "string (máx. 95 palabras, alineado a la fuente y al Modelo del Bienestar al Florecimiento)",
  "categoria": "HECHO_DOCUMENTADO | PERCEPCION | HIPOTESIS | PROPUESTA_TRANSFORMACION | PENDIENTE_VACIO"
}
`.trim();

      const response = await generarConReintentos(ai, {
        model: MODELO_GEMINI,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });

      const parsed = JSON.parse(limpiarJson(response.text || ''));
      parsed.categoria = tipoValido(parsed.categoria);
      res.json(parsed);
    } catch (err: any) {
      responderErrorGemini(res, err);
    }
  });

  app.post(
    '/api/extraer-pdf',
    express.raw({ type: 'application/pdf', limit: '25mb' }),
    async (req, res) => {
      try {
        let pdfBase64 = '';
        let nombreArchivo = 'documento.pdf';

        if (Buffer.isBuffer(req.body)) {
          pdfBase64 = req.body.toString('base64');
          const headerName = req.headers['x-file-name'];
          if (typeof headerName === 'string' && headerName.trim()) {
            try {
              nombreArchivo = decodeURIComponent(headerName.trim());
            } catch {
              nombreArchivo = headerName.trim();
            }
          }
        } else {
          const { base64, nombre } = req.body || {};
          if (typeof base64 === 'string') {
            pdfBase64 = base64.trim();
          }
          if (typeof nombre === 'string' && nombre.trim()) {
            nombreArchivo = nombre.trim();
          }
        }

        if (!pdfBase64) {
          res.status(400).json({ error: 'No se recibió contenido del archivo PDF.' });
          return;
        }

        const ai = getGeminiClient();
        const response = await generarConReintentos(ai, {
          model: MODELO_FALLBACK,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: pdfBase64
                }
              },
              {
                text: `Extrae y transcribe fielmente todo el texto visible de este documento PDF ("${nombreArchivo}"), incluyendo páginas escaneadas, diapositivas, títulos, tablas, cifras y notas. Respeta exactamente la información del documento sin resumir ni inventar datos. Si el archivo está completamente en blanco o ilegible, responde exactamente: SIN_TEXTO_LEGIBLE`
              }
            ]
          },
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
          }
        });

        const texto = (response.text || '').trim();
        if (!texto || texto === 'SIN_TEXTO_LEGIBLE') {
          res.status(422).json({
            error: `No se encontró texto legible en el PDF "${nombreArchivo}".`
          });
          return;
        }

        res.json({ texto });
      } catch (err: any) {
        responderErrorGemini(res, err);
      }
    }
  );

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Ruta de API no encontrada' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

startServer();

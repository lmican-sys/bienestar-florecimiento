import test from 'node:test';
import assert from 'node:assert/strict';
import {
  actualizarOpcionEnMatriz,
  actualizarHallazgoEnMatriz,
  obtenerAccionesElegidasConFicha
} from './matrizHelpers.ts';
import type { MatrizFila } from '../types/flourishing.ts';

const sampleMatriz: MatrizFila[] = [
  {
    id: 'm1',
    hallazgoNecesidad: 'Aislamiento en territorio',
    trazabilidad: 'HECHO_DOCUMENTADO',
    dimensionPrincipal: 'ENTORNO',
    capacidadPrincipal: 'CONVIVIR',
    spirePrincipal: 'RELACIONAL',
    justificacionAlineacion: 'Conecta egresados',
    opcionesAccion: [
      {
        id: 'm1_opt1',
        titulo: 'Laboratorios Aplicados de IA',
        tipoInnovacion: 'Metodológica',
        descripcion: 'Encuentros prácticos de experimentación.',
        viabilidad: 'Alta'
      },
      {
        id: 'm1_opt2',
        titulo: 'Feria tradicional de empleo',
        tipoInnovacion: 'Operativa',
        descripcion: 'Recepción de hojas de vida.',
        viabilidad: 'Media'
      }
    ],
    opcionSeleccionadaId: 'm1_opt2',
    experienciaEsperada: 'Mayor conexión territorial',
    evidenciaIndicador: 'Alianzas activas'
  }
];

test('actualizarOpcionEnMatriz updates only the target proposal title and description', () => {
  const updated = actualizarOpcionEnMatriz(sampleMatriz, 'm1', 'm1_opt1', {
    titulo: 'Laboratorios Territoriales de IA',
    descripcion: 'Sesiones semanales con mentores de industria.'
  });

  assert.equal(updated[0].opcionesAccion[0].titulo, 'Laboratorios Territoriales de IA');
  assert.equal(
    updated[0].opcionesAccion[0].descripcion,
    'Sesiones semanales con mentores de industria.'
  );
  // Second option remains unchanged
  assert.equal(updated[0].opcionesAccion[1].titulo, 'Feria tradicional de empleo');
  // Original array is not mutated
  assert.equal(sampleMatriz[0].opcionesAccion[0].titulo, 'Laboratorios Aplicados de IA');
});

test('actualizarHallazgoEnMatriz updates only the target row hallazgoNecesidad', () => {
  const updated = actualizarHallazgoEnMatriz(
    sampleMatriz,
    'm1',
    'Brecha digital y empleabilidad regional'
  );
  assert.equal(updated[0].hallazgoNecesidad, 'Brecha digital y empleabilidad regional');
  assert.equal(sampleMatriz[0].hallazgoNecesidad, 'Aislamiento en territorio');
});

test('obtenerAccionesElegidasConFicha resolves selected option and defaults empty ficha fields', () => {
  const resumen = obtenerAccionesElegidasConFicha(sampleMatriz);
  assert.equal(resumen.length, 1);
  assert.equal(resumen[0].hallazgoNecesidad, 'Aislamiento en territorio');
  assert.equal(resumen[0].accionTitulo, 'Feria tradicional de empleo');
  assert.equal(resumen[0].accionDescripcion, 'Recepción de hojas de vida.');
  assert.equal(resumen[0].ficha.productoEntregable, 'No especificado en el documento');
  assert.equal(resumen[0].ficha.estado, 'Pendiente');
});

test('obtenerAccionesElegidasConFicha preserves custom ficha values and normalizes legacy statuses', () => {
  const conFicha: MatrizFila[] = [
    {
      ...sampleMatriz[0],
      opcionSeleccionadaId: 'm1_opt1',
      fichaAccion: {
        productoEntregable: 'Guía de laboratorio regional',
        descripcionBreve: 'Manual práctico',
        responsable: 'Dirección de Graduados',
        cuando: 'Segundo semestre',
        recursos: 'Salas híbridas',
        indicadorExito: '80% de empleabilidad colaborativa',
        evidencia: 'Actas de sesiones',
        estado: 'EN_DISENO' as any
      }
    }
  ];

  const resumen = obtenerAccionesElegidasConFicha(conFicha);
  assert.equal(resumen[0].accionTitulo, 'Laboratorios Aplicados de IA');
  assert.equal(resumen[0].ficha.productoEntregable, 'Guía de laboratorio regional');
  assert.equal(resumen[0].ficha.responsable, 'Dirección de Graduados');
  assert.equal(resumen[0].ficha.cuando, 'Segundo semestre');
  assert.equal(resumen[0].ficha.recursos, 'Salas híbridas');
  assert.equal(resumen[0].ficha.indicadorExito, '80% de empleabilidad colaborativa');
  assert.equal(resumen[0].ficha.evidencia, 'Actas de sesiones');
  assert.equal(resumen[0].ficha.estado, 'En curso');
});

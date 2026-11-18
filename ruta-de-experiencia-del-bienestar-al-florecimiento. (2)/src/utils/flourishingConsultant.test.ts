import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEsqueletoExperiencia } from './flourishingConsultant.ts';

test('crearEsqueletoExperiencia produces valid empty skeleton with 16 components and no template text', () => {
  const result = crearEsqueletoExperiencia(
    'Red de Egresados con Propósito',
    'Documento de prueba sobre egresados de Areandina.'
  );

  assert.ok(result.id.startsWith('exp-'));
  assert.ok(result.codigoUnico.startsWith('EXP-ARE-'));
  assert.equal(result.versionActual, '1.0');
  assert.equal(Object.keys(result.propuesta16).length, 16);

  // Todos los componentes inician vacíos y pendientes
  for (const comp of Object.values(result.propuesta16)) {
    assert.equal(comp.contenido, '');
    assert.equal(comp.origen, 'GENERADA_IA');
    assert.equal(comp.categoria, 'PENDIENTE_VACIO');
  }

  // Las 7 preguntas vivenciales inician vacías
  for (const val of Object.values(result.preguntasVivenciales)) {
    assert.equal(val, '');
  }

  // Sin textos de plantilla ni comentarios falsos
  const serializado = JSON.stringify(result).toLowerCase();
  assert.equal(serializado.includes('tríadas'), false);
  assert.equal(serializado.includes('deserción'), false);
  assert.equal(serializado.includes('restrepo'), false);
});

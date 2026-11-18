import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENTES_DEFAULT_AREANDINA,
  cargarAgentesRegistrados,
  guardarAgentesRegistrados,
  cargarExperienciasRepositorio,
  sincronizarAgentesConListaOficial,
  migrarExperienciaListaOficial
} from './storage.ts';
import { crearEsqueletoExperiencia } from './flourishingConsultant.ts';
import type { AgenteTransformador, ExperienciaInstitucional } from '../types/flourishing.ts';

function crearMockStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => {
      map.set(k, String(v));
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
    clear: () => map.clear()
  };
}

test('AGENTES_DEFAULT_AREANDINA has 9 official members all PENDIENTE without demo signatures', () => {
  assert.equal(AGENTES_DEFAULT_AREANDINA.length, 9);
  for (const ag of AGENTES_DEFAULT_AREANDINA) {
    assert.equal(ag.estadoFirma, 'PENDIENTE');
    assert.equal(ag.dictamenIndividual, 'PENDIENTE');
    assert.equal(ag.firmaDataUrl, undefined);
    assert.equal(ag.fechaFirma, undefined);
    assert.equal(ag.observacionesIndividuales, undefined);
  }
  assert.equal(
    AGENTES_DEFAULT_AREANDINA[0].cargo,
    'Vicerrector Nacional de Experiencia y Felicidad'
  );
  assert.equal(AGENTES_DEFAULT_AREANDINA[8].email, 'lgiron11@areandina.edu.co');
});

test('cargarAgentesRegistrados preserves manual members, updates official fields case-insensitively, and adds missing official members', () => {
  const mock = crearMockStorage();
  (globalThis as any).localStorage = mock;
  try {
    const previos: AgenteTransformador[] = [
      {
        id: 'agente_1',
        nombre: 'Nombre Viejo',
        cargo: 'Cargo Viejo',
        dependencia: 'Dep Vieja',
        email: '  MHERNANDEZ171@AREANDINA.EDU.CO ',
        estadoFirma: 'PENDIENTE',
        dictamenIndividual: 'PENDIENTE'
      },
      {
        id: 'manual_1',
        nombre: 'Carlos Manual',
        cargo: 'Invitado Especial',
        dependencia: 'Facultad Salud',
        email: 'cmanual@areandina.edu.co',
        estadoFirma: 'PENDIENTE',
        dictamenIndividual: 'PENDIENTE'
      }
    ];
    mock.setItem('areandina_agentes_transformadores_v2', JSON.stringify(previos));

    const cargados = cargarAgentesRegistrados();
    // 1 manual + 9 official = 10
    assert.equal(cargados.length, 10);

    const mauricio = cargados.find((a) => a.id === 'agente_1')!;
    assert.equal(mauricio.nombre, 'Mauricio Andrés Hernández Anzola');
    assert.equal(mauricio.cargo, 'Vicerrector Nacional de Experiencia y Felicidad');
    assert.equal(mauricio.dependencia, 'Rectoría');

    const manual = cargados.find((a) => a.id === 'manual_1')!;
    assert.equal(manual.nombre, 'Carlos Manual');
    assert.equal(manual.cargo, 'Invitado Especial');

    // Missing official members added
    assert.ok(cargados.some((a) => a.email === 'lgiron11@areandina.edu.co'));
  } finally {
    delete (globalThis as any).localStorage;
  }
});

test('guardarAgentesRegistrados preserves exact nombre, cargo, dependencia and email', () => {
  const mock = crearMockStorage();
  (globalThis as any).localStorage = mock;
  try {
    const custom: AgenteTransformador[] = [
      {
        id: 'agente_x',
        nombre: '  Nombre Exacto  ',
        cargo: 'Cargo Exacto',
        dependencia: 'Dependencia Exacta',
        email: 'Exacto@Areandina.edu.co',
        estadoFirma: 'FIRMADO',
        dictamenIndividual: 'VALIDADA',
        firmaDataUrl: 'data:image/png;base64,ABC',
        fechaFirma: '2026-11-12 10:00',
        observacionesIndividuales: 'Obs'
      }
    ];
    guardarAgentesRegistrados(custom);
    const stored = JSON.parse(mock.getItem('areandina_agentes_transformadores_v2')!);
    assert.equal(stored[0].nombre, '  Nombre Exacto  ');
    assert.equal(stored[0].cargo, 'Cargo Exacto');
    assert.equal(stored[0].dependencia, 'Dependencia Exacta');
    assert.equal(stored[0].email, 'Exacto@Areandina.edu.co');
    assert.equal(stored[0].estadoFirma, 'PENDIENTE');
    assert.equal(stored[0].firmaDataUrl, undefined);
  } finally {
    delete (globalThis as any).localStorage;
  }
});

test('migration cleans demo signatures, preserves real signatures on non-approved, skips VALIDADA/APROBADA, and runs once', () => {
  const expRevision = crearEsqueletoExperiencia('Exp Revisión', 'Fuente prueba');
  expRevision.dictamenColectivo = 'EN_REVISION';
  expRevision.estadoGeneral = 'EN_REVISION';
  expRevision.agentes = [
    {
      id: 'agente_1',
      nombre: 'Mauricio Viejo',
      cargo: 'Vicerrector de Experiencia y Felicidad',
      dependencia: 'Rectoría',
      email: 'mhernandez171@areandina.edu.co',
      estadoFirma: 'FIRMADO',
      dictamenIndividual: 'VALIDADA',
      fechaFirma: '2026-11-06 10:00',
      firmaDataUrl:
        'data:image/svg+xml;utf8,<svg><path d="M10,40 Q40,5 70,35 T130,25"/></svg>',
      observacionesIndividuales: 'Demo obs'
    },
    {
      id: 'agente_2',
      nombre: 'Luz Vieja',
      cargo: 'Directora Nacional de AAlumni',
      dependencia: 'Vicerrectoría',
      email: 'lmican@areandina.edu.co',
      estadoFirma: 'FIRMADO',
      dictamenIndividual: 'VALIDADA',
      fechaFirma: '2026-11-10 12:00',
      firmaDataUrl: 'data:image/png;base64,REAL_SIGNATURE'
    }
  ];

  const expAprobada = crearEsqueletoExperiencia('Exp Aprobada', 'Fuente aprobada');
  expAprobada.dictamenColectivo = 'VALIDADA';
  expAprobada.estadoGeneral = 'APROBADA';
  expAprobada.agentes = [
    {
      id: 'agente_1',
      nombre: 'Nombre Congelado',
      cargo: 'Cargo Congelado',
      dependencia: 'Dep Congelada',
      email: 'mhernandez171@areandina.edu.co',
      estadoFirma: 'FIRMADO',
      dictamenIndividual: 'VALIDADA',
      fechaFirma: '2026-11-06 10:00',
      firmaDataUrl:
        'data:image/svg+xml;utf8,<svg><path d="M10,40 Q40,5 70,35 T130,25"/></svg>'
    }
  ];

  const mock = crearMockStorage();
  (globalThis as any).localStorage = mock;
  try {
    mock.setItem(
      'areandina_florecimiento_experiencias_v2',
      JSON.stringify([expRevision, expAprobada])
    );

    const migradas = cargarExperienciasRepositorio();
    assert.equal(mock.getItem('areandina_migracion_red_9_v1'), 'true');

    // Non-approved: 9 agents, demo sig cleaned on agente_1, real sig kept on agente_2, fields updated
    const rev = migradas[0];
    assert.equal(rev.dictamenColectivo, 'EN_REVISION');
    assert.equal(rev.agentes.length, 9);
    const a1 = rev.agentes.find((a) => a.id === 'agente_1')!;
    assert.equal(a1.estadoFirma, 'PENDIENTE');
    assert.equal(a1.dictamenIndividual, 'PENDIENTE');
    assert.equal(a1.firmaDataUrl, undefined);
    assert.equal(a1.fechaFirma, undefined);
    assert.equal(a1.observacionesIndividuales, undefined);
    assert.equal(a1.cargo, 'Vicerrector Nacional de Experiencia y Felicidad');

    const a2 = rev.agentes.find((a) => a.id === 'agente_2')!;
    assert.equal(a2.estadoFirma, 'FIRMADO');
    assert.equal(a2.firmaDataUrl, 'data:image/png;base64,REAL_SIGNATURE');
    assert.equal(a2.fechaFirma, '2026-11-10 12:00');
    assert.equal(a2.dependencia, 'Vicerrectoría Nacional de Experiencia y Felicidad');

    // Approved: completely untouched
    const apr = migradas[1];
    assert.equal(apr.agentes.length, 1);
    assert.equal(apr.agentes[0].nombre, 'Nombre Congelado');
    assert.equal(apr.agentes[0].estadoFirma, 'FIRMADO');
  } finally {
    delete (globalThis as any).localStorage;
  }
});

test('crearEsqueletoExperiencia always initializes agents as PENDIENTE with zero signatures', () => {
  const mock = crearMockStorage();
  (globalThis as any).localStorage = mock;
  try {
    // Even if localStorage somehow held signed/demo properties on global list
    mock.setItem(
      'areandina_agentes_transformadores_v2',
      JSON.stringify([
        {
          id: 'agente_1',
          nombre: 'Mauricio Andrés Hernández Anzola',
          cargo: 'Vicerrector Nacional de Experiencia y Felicidad',
          dependencia: 'Rectoría',
          email: 'mhernandez171@areandina.edu.co',
          estadoFirma: 'FIRMADO',
          dictamenIndividual: 'VALIDADA',
          firmaDataUrl: 'data:image/png;base64,FAKE',
          fechaFirma: '2026-11-12',
          observacionesIndividuales: 'Obs'
        }
      ])
    );

    const nueva = crearEsqueletoExperiencia('Nueva Exp', 'Texto base');
    assert.equal(nueva.agentes.length, 9);
    for (const ag of nueva.agentes) {
      assert.equal(ag.estadoFirma, 'PENDIENTE');
      assert.equal(ag.dictamenIndividual, 'PENDIENTE');
      assert.equal(ag.firmaDataUrl, undefined);
      assert.equal(ag.fechaFirma, undefined);
      assert.equal(ag.observacionesIndividuales, undefined);
    }
    const firmados = nueva.agentes.filter((a) => a.estadoFirma === 'FIRMADO').length;
    assert.equal(firmados, 0);
  } finally {
    delete (globalThis as any).localStorage;
  }
});

test('sincronizarAgentesConListaOficial cleans second demo SVG pattern M15,45 Q50,10 80,40', () => {
  const synced = sincronizarAgentesConListaOficial([
    {
      id: 'agente_2',
      nombre: 'Luz',
      cargo: 'Old',
      dependencia: 'Old',
      email: 'lmican@areandina.edu.co',
      estadoFirma: 'FIRMADO',
      dictamenIndividual: 'VALIDADA',
      fechaFirma: '2026-11-06 11:30',
      firmaDataUrl: 'data:image/svg+xml;utf8,<svg><path d="M15,45 Q50,10 80,40 T140,20"/></svg>',
      observacionesIndividuales: 'Demo obs 2'
    }
  ]);
  const a2 = synced.find((a) => a.id === 'agente_2')!;
  assert.equal(a2.estadoFirma, 'PENDIENTE');
  assert.equal(a2.dictamenIndividual, 'PENDIENTE');
  assert.equal(a2.firmaDataUrl, undefined);
  assert.equal(a2.fechaFirma, undefined);
  assert.equal(a2.observacionesIndividuales, undefined);
});

// Keep migrarExperienciaListaOficial explicitly covered for APROBADA statusGeneral
test('migrarExperienciaListaOficial skips experience with estadoGeneral APROBADA', () => {
  const exp: ExperienciaInstitucional = {
    ...crearEsqueletoExperiencia('Exp', 'Txt'),
    estadoGeneral: 'APROBADA',
    dictamenColectivo: 'EN_REVISION',
    agentes: []
  };
  const res = migrarExperienciaListaOficial(exp);
  assert.equal(res.agentes.length, 0);
});

test('cargarExperienciasRepositorio updates Cafe con el Rector across diagnostico, propuesta16 and source without altering Vicerrector Mauricio in agentes', () => {
  const exp = crearEsqueletoExperiencia(
    'Café con el Rector',
    'Población: Colaboradores y el Rector Dr. Mauricio Hernández.'
  );
  exp.diagnostico.sintesisExperiencia.aQuienVaDirigida =
    'Colaboradores administrativos, docentes de todas las facultades, directores y el Rector Dr. Mauricio Hernández.';
  exp.propuesta16.poblacionParticipante.contenido =
    'Incluye a Rectoría (Dr. Mauricio Hernández) y colaboradores.';
  const mock = crearMockStorage();
  (globalThis as any).localStorage = mock;
  try {
    mock.setItem('areandina_florecimiento_experiencias_v2', JSON.stringify([exp]));
    mock.setItem('areandina_migracion_red_9_v1', 'true');
    mock.setItem('areandina_migracion_rector_v1', 'true');
    const cargadas = cargarExperienciasRepositorio();
    assert.ok(cargadas[0].fuenteOriginal?.includes('el Rector Dr. José Leonardo Valencia'));
    assert.equal(
      cargadas[0].diagnostico.sintesisExperiencia.aQuienVaDirigida,
      'Colaboradores administrativos, docentes de todas las facultades, directores y el Rector Dr. José Leonardo Valencia.'
    );
    assert.equal(
      cargadas[0].propuesta16.poblacionParticipante.contenido,
      'Incluye a Rectoría (Dr. José Leonardo Valencia) y colaboradores.'
    );
    assert.equal(cargadas[0].agentes[0].nombre, 'Mauricio Andrés Hernández Anzola');
    assert.equal(mock.getItem('areandina_migracion_rector_v2'), 'true');
  } finally {
    delete (globalThis as any).localStorage;
  }
});

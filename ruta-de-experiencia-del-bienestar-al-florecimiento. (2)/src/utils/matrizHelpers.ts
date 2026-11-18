import type {
  AccionInnovadora,
  FichaAccionSeleccionada,
  MatrizFila
} from '../types/flourishing.ts';

export interface AccionElegidaResumen {
  filaId: string;
  hallazgoNecesidad: string;
  trazabilidad: string;
  accionTitulo: string;
  accionDescripcion: string;
  ficha: FichaAccionSeleccionada;
}

const normalizarEstadoFicha = (estado?: string): FichaAccionSeleccionada['estado'] => {
  const val = (estado || '').trim().toLowerCase();
  if (val === 'en curso' || val === 'en_diseno') return 'En curso';
  if (val === 'completada' || val === 'lista') return 'Completada';
  return 'Pendiente';
};

export function obtenerAccionesElegidasConFicha(
  matriz: MatrizFila[] = []
): AccionElegidaResumen[] {
  return matriz.map((fila) => {
    const accionElegida =
      fila.opcionesAccion.find((op) => op.id === fila.opcionSeleccionadaId) ||
      fila.opcionesAccion[0];
    const f = fila.fichaAccion;
    const campo = (v?: string) => (v && v.trim() ? v : 'No especificado en el documento');

    return {
      filaId: fila.id,
      hallazgoNecesidad: fila.hallazgoNecesidad,
      trazabilidad: fila.trazabilidad,
      accionTitulo: accionElegida?.titulo || 'Acción por definir',
      accionDescripcion: accionElegida?.descripcion || '',
      ficha: {
        productoEntregable: campo(f?.productoEntregable),
        descripcionBreve: campo(f?.descripcionBreve),
        responsable: campo(f?.responsable),
        cuando: campo(f?.cuando),
        recursos: campo(f?.recursos),
        indicadorExito: campo(f?.indicadorExito),
        evidencia: campo(f?.evidencia),
        estado: normalizarEstadoFicha(f?.estado)
      }
    };
  });
}

export function actualizarOpcionEnMatriz(
  matriz: MatrizFila[],
  filaId: string,
  opcionId: string,
  cambios: Partial<Pick<AccionInnovadora, 'titulo' | 'descripcion'>>
): MatrizFila[] {
  return matriz.map((fila) => {
    if (fila.id !== filaId) return fila;
    return {
      ...fila,
      opcionesAccion: fila.opcionesAccion.map((op) =>
        op.id === opcionId
          ? {
              ...op,
              titulo: cambios.titulo !== undefined ? cambios.titulo : op.titulo,
              descripcion:
                cambios.descripcion !== undefined ? cambios.descripcion : op.descripcion
            }
          : op
      )
    };
  });
}

export function actualizarHallazgoEnMatriz(
  matriz: MatrizFila[],
  filaId: string,
  nuevoHallazgo: string
): MatrizFila[] {
  return matriz.map((fila) =>
    fila.id === filaId ? { ...fila, hallazgoNecesidad: nuevoHallazgo } : fila
  );
}

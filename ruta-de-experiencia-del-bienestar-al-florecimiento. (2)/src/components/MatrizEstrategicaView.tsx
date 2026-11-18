import React, { useState } from 'react';
import {
  Table2,
  CheckCircle2,
  Circle,
  Edit3,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  Save,
  MessageSquareQuote
} from 'lucide-react';
import {
  MatrizFila,
  AccionInnovadora,
  AreandinaDimension,
  AreandinaCapacidad,
  TrazabilidadCategoria
} from '../types/flourishing.ts';

interface MatrizEstrategicaViewProps {
  matriz: MatrizFila[];
  onSeleccionarOpcion: (filaId: string, opcionId: string) => void;
  onActualizarFila: (filaId: string, cambios: Partial<MatrizFila>) => void;
  onAgregarFila?: () => void;
  onEliminarFila?: (filaId: string) => void;
}

export const MatrizEstrategicaView: React.FC<MatrizEstrategicaViewProps> = ({
  matriz,
  onSeleccionarOpcion,
  onActualizarFila,
  onAgregarFila,
  onEliminarFila
}) => {
  const [filaEditando, setFilaEditando] = useState<string | null>(null);

  const getTrazabilidadBadge = (tipo: string) => {
    switch (tipo) {
      case 'HECHO_DOCUMENTADO':
      case 'HECHO':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PERCEPCION':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'HIPOTESIS':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'PROPUESTA_TRANSFORMACION':
        return 'bg-[#f2f8eb] text-[#4d751c] border-[#cde8ab]';
      case 'PENDIENTE_VACIO':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-8 overflow-hidden">
      {/* Header PARTE 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 mb-6 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#f2f8eb] text-[#5b8723]">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7FB536] block">
              PARTE 2 DE LA ENTREGA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#414141] tracking-tight">
              MATRIZ DE ESTRATEGIA OPERATIVA
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-gray-500 hidden md:inline">
            Selecciona la opción de innovación deseada en cada fila:
          </span>
          {onAgregarFila && (
            <button
              onClick={onAgregarFila}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#5b8723] bg-[#f2f8eb] hover:bg-[#e4f3d4] border border-[#cbe5a9] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Fila</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabla Operativa Responsiva */}
      <div className="overflow-x-auto -mx-6 sm:mx-0">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-[#F8FAF6] border-y border-gray-200 text-[#414141] text-xs font-black uppercase tracking-wider">
              <th className="py-3.5 px-4 w-[22%]">Hallazgo / Necesidad</th>
              <th className="py-3.5 px-4 w-[22%]">Dimensión / Capacidad Principal</th>
              <th className="py-3.5 px-4 w-[32%]">Menú de Acciones (2 o 3 Opciones)</th>
              <th className="py-3.5 px-4 w-[16%]">Experiencia Esperada</th>
              <th className="py-3.5 px-4 w-[16%]">Evidencia / Indicador</th>
              {onEliminarFila && <th className="py-3.5 px-3 w-[4%] text-center">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
            {matriz.map((fila, index) => {
              const estaEditando = filaEditando === fila.id;

              return (
                <tr
                  key={fila.id || index}
                  className="hover:bg-gray-50/70 transition-colors align-top"
                >
                  {/* Columna 1: Hallazgo / Necesidad */}
                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getTrazabilidadBadge(
                          fila.trazabilidad
                        )}`}
                      >
                        {fila.trazabilidad}
                      </span>
                      {estaEditando ? (
                        <textarea
                          rows={3}
                          value={fila.hallazgoNecesidad}
                          onChange={(e) =>
                            onActualizarFila(fila.id, { hallazgoNecesidad: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded text-xs"
                        />
                      ) : (
                        <p className="font-semibold text-[#414141] leading-snug">
                          {fila.hallazgoNecesidad}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Columna 2: Dimensión / Capacidad Principal */}
                  <td className="py-4 px-4 bg-gray-50/40">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#f2f8eb] text-[#5b8723] font-bold text-[11px] border border-[#d2ebaf]">
                          Dimensión: {fila.dimensionPrincipal}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-gray-200 text-[#414141] font-bold text-[11px]">
                          Capacidad: {fila.capacidadPrincipal}
                        </span>
                      </div>

                      {fila.alertaCoherencia?.trim() && (
                        <p className="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-snug">
                          {fila.alertaCoherencia}
                        </p>
                      )}

                      {estaEditando ? (
                        <textarea
                          rows={2}
                          value={fila.justificacionAlineacion}
                          onChange={(e) =>
                            onActualizarFila(fila.id, { justificacionAlineacion: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded text-xs"
                        />
                      ) : (
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          "{fila.justificacionAlineacion}"
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Columna 3: Menú de Acciones (2 o 3 opciones para elegir) */}
                  <td className="py-4 px-4">
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Haz clic para seleccionar la opción preferida:
                      </span>
                      {fila.opcionesAccion.map((opcion, optIdx) => {
                        const seleccionada = fila.opcionSeleccionadaId === opcion.id;
                        const letra = String.fromCharCode(65 + optIdx); // A, B, C

                        return (
                          <div
                            key={opcion.id}
                            onClick={() => onSeleccionarOpcion(fila.id, opcion.id)}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer relative ${
                              seleccionada
                                ? 'border-[#7FB536] bg-[#fbfdf9] shadow-xs ring-1 ring-[#7FB536]/30'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5">
                                {seleccionada ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#7FB536] shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                                )}
                                <span
                                  className={`text-xs font-bold ${
                                    seleccionada ? 'text-[#414141]' : 'text-gray-700'
                                  }`}
                                >
                                  Opción {letra}: {opcion.titulo}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                {opcion.viabilidad}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-600 leading-normal pl-5">
                              {opcion.descripcion}
                            </p>

                            <div className="mt-1.5 pl-5 flex items-center gap-2">
                              <span className="text-[10px] font-medium text-[#5b8723] bg-[#f2f8eb] px-1.5 py-0.5 rounded">
                                {opcion.tipoInnovacion}
                              </span>
                              {seleccionada && (
                                <span className="text-[10px] font-bold text-[#7FB536]">
                                  • Opción activa en el plan
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  {/* Columna 4: Experiencia Esperada */}
                  <td className="py-4 px-4">
                    {estaEditando ? (
                      <textarea
                        rows={4}
                        value={fila.experienciaEsperada}
                        onChange={(e) =>
                          onActualizarFila(fila.id, { experienciaEsperada: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded text-xs"
                      />
                    ) : (
                      <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100/70">
                        <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          {fila.experienciaEsperada}
                        </p>
                      </div>
                    )}
                  </td>

                  {/* Columna 5: Evidencia / Indicador */}
                  <td className="py-4 px-4">
                    {estaEditando ? (
                      <textarea
                        rows={4}
                        value={fila.evidenciaIndicador}
                        onChange={(e) =>
                          onActualizarFila(fila.id, { evidenciaIndicador: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded text-xs"
                      />
                    ) : (
                      <div className="p-3 rounded-lg bg-blue-50/40 border border-blue-100/70">
                        <p className="text-xs text-gray-700 leading-relaxed font-mono">
                          {fila.evidenciaIndicador}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        onClick={() => setFilaEditando(estaEditando ? null : fila.id)}
                        className="text-[11px] font-bold text-[#5b8723] hover:underline inline-flex items-center gap-1"
                      >
                        {estaEditando ? (
                          <>
                            <Save className="w-3 h-3" />
                            <span>Guardar</span>
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-3 h-3" />
                            <span>Ajustar texto</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Columna Acción (Eliminar si aplica) */}
                  {onEliminarFila && (
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => onEliminarFila(fila.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Eliminar fila"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

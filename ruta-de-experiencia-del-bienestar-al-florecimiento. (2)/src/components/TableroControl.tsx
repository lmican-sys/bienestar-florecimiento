import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Users,
  Search,
  Plus,
  ArrowRight,
  Filter,
  Eye,
  FileText,
  BadgeAlert,
  Sparkles,
  Trash2
} from 'lucide-react';
import { ExperienciaInstitucional, DictamenColectivoTipo } from '../types/flourishing.ts';

interface TableroControlProps {
  experiencias: ExperienciaInstitucional[];
  experienciaActivaId: string;
  onSeleccionarExperiencia: (id: string) => void;
  onNuevaExperiencia: () => void;
  onNavegarATab: (tab: string) => void;
  onEliminarExperiencia: (id: string) => void;
}

export const TableroControl: React.FC<TableroControlProps> = ({
  experiencias,
  experienciaActivaId,
  onSeleccionarExperiencia,
  onNuevaExperiencia,
  onNavegarATab,
  onEliminarExperiencia
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<string | null>(null);

  // Métricas globales
  const total = experiencias.length;
  const enRevision = experiencias.filter((e) => e.estadoGeneral === 'EN_REVISION').length;
  const pendientesAjustes = experiencias.filter(
    (e) => e.estadoGeneral === 'PENDIENTE_AJUSTES' || e.dictamenColectivo === 'REQUIERE_AJUSTES'
  ).length;
  const listasValidacion = experiencias.filter(
    (e) => e.estadoGeneral === 'LISTA_VALIDACION' || e.dictamenColectivo === 'VALIDADA_OBSERVACIONES'
  ).length;
  const aprobadas = experiencias.filter(
    (e) => e.estadoGeneral === 'APROBADA' || e.dictamenColectivo === 'VALIDADA'
  ).length;

  // Experiencia seleccionada actualmente para detalle rápido
  const experienciaActual =
    experiencias.find((e) => e.id === experienciaActivaId) || experiencias[0];

  const totalAgentes = experienciaActual?.agentes?.length || 0;
  const firmasCompletadas =
    experienciaActual?.agentes?.filter((a) => a.estadoFirma === 'FIRMADO').length || 0;
  const porcentajeFirmas =
    totalAgentes > 0 ? Math.round((firmasCompletadas / totalAgentes) * 100) : 0;
  const agentesPendientes =
    experienciaActual?.agentes?.filter((a) => a.estadoFirma === 'PENDIENTE') || [];

  // Filtrado de lista
  const experienciasFiltradas = experiencias.filter((exp) => {
    const coincideTexto =
      exp.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.codigoUnico.toLowerCase().includes(busqueda.toLowerCase());
    if (filtroEstado === 'TODOS') return coincideTexto;
    if (filtroEstado === 'APROBADAS')
      return coincideTexto && (exp.estadoGeneral === 'APROBADA' || exp.dictamenColectivo === 'VALIDADA');
    if (filtroEstado === 'EN_REVISION')
      return coincideTexto && exp.estadoGeneral === 'EN_REVISION';
    if (filtroEstado === 'AJUSTES')
      return coincideTexto && (exp.estadoGeneral === 'PENDIENTE_AJUSTES' || exp.dictamenColectivo === 'REQUIERE_AJUSTES');
    return coincideTexto;
  });

  const getDictamenBadge = (dictamen: DictamenColectivoTipo) => {
    switch (dictamen) {
      case 'VALIDADA':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'Aprobada Institucionalmente'
        };
      case 'VALIDADA_OBSERVACIONES':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          label: 'Validada con Observaciones'
        };
      case 'REQUIERE_AJUSTES':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'Requiere Ajustes Metodológicos'
        };
      case 'EN_REVISION':
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-300',
          label: 'En Revisión Colectiva'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Tablero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f8eb] text-[#5b8723] text-xs font-black uppercase tracking-wider mb-2 border border-[#cde8ab]">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Centro de Control Institucional • Red de Agentes Transformadores</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#414141] tracking-tight">
            Tablero de Control de Experiencias y Validación
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Supervisa el estado del ciclo institucional: diagnóstico, propuesta de transformación, dictamen colectivo y firmas oficiales.
          </p>
        </div>

        <button
          onClick={onNuevaExperiencia}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nueva Experiencia</span>
        </button>
      </div>

      {/* Tarjetas de Métricas Institucionales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Total en Sistema
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#414141]">{total}</span>
            <span className="text-xs text-gray-500">experiencias</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            En Revisión
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-700">{enRevision}</span>
            <span className="text-xs text-gray-500">activas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            Pendiente Ajustes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendientesAjustes}</span>
            <span className="text-xs text-gray-500">observadas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Listas Validación
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-700">{listasValidacion}</span>
            <span className="text-xs text-gray-500">con consenso</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs col-span-2 lg:col-span-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Aprobadas / Firmadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{aprobadas}</span>
            <span className="text-xs text-emerald-800 font-semibold">institucionales</span>
          </div>
        </div>
      </div>

      {/* Alerta de Estado para la Experiencia Activa */}
      {experienciaActual && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-black tracking-wide font-mono bg-gray-100 text-[#414141]">
                  {experienciaActual.codigoUnico}
                </span>
                <span className="text-xs font-bold text-[#7FB536]">
                  Versión v{experienciaActual.versionActual}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    getDictamenBadge(experienciaActual.dictamenColectivo).bg
                  }`}
                >
                  {getDictamenBadge(experienciaActual.dictamenColectivo).label}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#414141] line-clamp-1">
                {experienciaActual.titulo}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavegarATab('sala_validacion')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#5b8723] bg-[#f2f8eb] hover:bg-[#e4f3d4] border border-[#cde8ab] transition-colors"
              >
                Abrir Sala de Validación
              </button>
              <button
                onClick={() => onNavegarATab('documento_definitivo')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#7FB536] hover:bg-[#6fa02d] transition-colors shadow-2xs"
              >
                Ver Documento Definitivo
              </button>
            </div>
          </div>

          {/* Estado de Firmas de la Experiencia Activa */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Progreso de Firmas Colectivas:
              </span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      porcentajeFirmas === 100 ? 'bg-emerald-600' : 'bg-[#7FB536]'
                    }`}
                    style={{ width: `${porcentajeFirmas}%` }}
                  />
                </div>
                <span className="text-sm font-black text-[#414141] min-w-[45px]">
                  {porcentajeFirmas}%
                </span>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                {firmasCompletadas} de {totalAgentes} firmas registradas
              </span>
            </div>

            {/* Integrantes Pendientes */}
            <div className="md:col-span-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Firmas y Validaciones Pendientes:
              </span>
              {agentesPendientes.length === 0 ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Todos los integrantes de la Red han suscrito la versión actual.</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {agentesPendientes.map((agente) => (
                    <div
                      key={agente.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-bold">{agente.nombre}</span>
                      <span className="text-[10px] text-amber-700">({agente.cargo})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Repositorio de Experiencias Institucionales */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-black text-[#414141]">
              Repositorio de Experiencias Institucionales
            </h3>
            <p className="text-xs text-gray-500">
              Historial de experiencias registradas, trazabilidad y estado de aprobación.
            </p>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código o título..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#7FB536] w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFiltroEstado('TODOS')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                  filtroEstado === 'TODOS' ? 'bg-[#7FB536] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroEstado('EN_REVISION')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                  filtroEstado === 'EN_REVISION'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Revisión
              </button>
              <button
                onClick={() => setFiltroEstado('APROBADAS')}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                  filtroEstado === 'APROBADAS'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Aprobadas
              </button>
            </div>
          </div>
        </div>

        {/* Tabla / Lista de Experiencias */}
        <div className="divide-y divide-gray-100 overflow-hidden border border-gray-200 rounded-xl">
          {experienciasFiltradas.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No se encontraron experiencias con los filtros seleccionados.
            </div>
          ) : (
            experienciasFiltradas.map((exp) => {
              const esActiva = exp.id === experienciaActivaId;
              const badge = getDictamenBadge(exp.dictamenColectivo);
              const totalAg = exp.agentes.length;
              const firmas = exp.agentes.filter((a) => a.estadoFirma === 'FIRMADO').length;

              return (
                <div
                  key={exp.id}
                  onClick={() => onSeleccionarExperiencia(exp.id)}
                  className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    esActiva ? 'bg-[#f8fbf5] border-l-4 border-l-[#7FB536]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {exp.codigoUnico}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400">
                        v{exp.versionActual}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      {esActiva && (
                        <span className="text-[10px] font-extrabold text-[#7FB536]">
                          • En pantalla
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#414141]">{exp.titulo}</h4>
                    <span className="text-[11px] text-gray-500 block">
                      Población: {exp.diagnostico.sintesisExperiencia.aQuienVaDirigida} • Actualizado:{' '}
                      {exp.fechaUltimaModificacion}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-black text-gray-700 block">
                        {firmas}/{totalAg} Firmas
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {Math.round((firmas / (totalAg || 1)) * 100)}% completado
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {confirmarEliminarId === exp.id ? (
                        <div
                          className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[11px] font-bold text-rose-700">¿Eliminar?</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEliminarExperiencia(exp.id);
                              setConfirmarEliminarId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors"
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmarEliminarId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 text-[11px] font-bold transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmarEliminarId(exp.id);
                          }}
                          className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Eliminar experiencia"
                          aria-label={`Eliminar experiencia ${exp.codigoUnico}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeleccionarExperiencia(exp.id);
                          onNavegarATab('propuesta_16');
                        }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-[#7FB536] hover:text-white text-gray-600 transition-colors"
                        title="Abrir propuesta de transformación"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

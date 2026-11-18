import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  History,
  MessageSquare,
  Send,
  Trash2,
  Check,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  GitCommit,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ExperienciaInstitucional,
  DictamenColectivoTipo,
  ComentarioSeccion,
  VersionHistorial
} from '../types/flourishing.ts';

interface SalaValidacionColectivaProps {
  experiencia: ExperienciaInstitucional;
  onActualizarDictamen: (dictamen: DictamenColectivoTipo, observaciones: string) => void;
  onAgregarComentario: (comentario: Omit<ComentarioSeccion, 'id' | 'fecha'>) => void;
  onResolverComentario: (comentarioId: string) => void;
  onAgregarAcuerdo: (acuerdo: string) => void;
  onEliminarAcuerdo: (index: number) => void;
  onNavegarATab: (tab: string) => void;
}

export const SalaValidacionColectiva: React.FC<SalaValidacionColectivaProps> = ({
  experiencia,
  onActualizarDictamen,
  onAgregarComentario,
  onResolverComentario,
  onAgregarAcuerdo,
  onEliminarAcuerdo,
  onNavegarATab
}) => {
  const [dictamenSeleccionado, setDictamenSeleccionado] = useState<DictamenColectivoTipo>(
    experiencia.dictamenColectivo
  );
  const [observacionesTexto, setObservacionesTexto] = useState(
    experiencia.observacionesColectivas || ''
  );
  const [nuevoAcuerdoTexto, setNuevoAcuerdoTexto] = useState('');

  // Formulario de nuevo comentario por sección
  const [seccionComentario, setSeccionComentario] = useState<string>('c8');
  const [autorComentarioId, setAutorComentarioId] = useState<string>(
    experiencia.agentes[0]?.id || ''
  );
  const [textoComentario, setTextoComentario] = useState('');
  const [tipoComentario, setTipoComentario] = useState<'OBSERVACION' | 'RECOMENDACION' | 'CORRECCION_REQUERIDA'>('OBSERVACION');

  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const firmasCompletas = experiencia.agentes.filter((a) => a.estadoFirma === 'FIRMADO').length;
  const totalAgentes = experiencia.agentes.length;

  const handleGuardarDictamen = () => {
    onActualizarDictamen(dictamenSeleccionado, observacionesTexto);
  };

  const handleEnviarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoComentario.trim()) return;

    const agenteAutor = experiencia.agentes.find((a) => a.id === autorComentarioId) || experiencia.agentes[0];
    const compTitulo = Object.values(experiencia.propuesta16).find(
      (c) => c.id === seccionComentario
    )?.titulo || 'Sección General';

    onAgregarComentario({
      componenteClave: seccionComentario,
      componenteTitulo: compTitulo,
      autorId: agenteAutor.id,
      autorNombre: agenteAutor.nombre,
      autorCargo: agenteAutor.cargo,
      texto: textoComentario.trim(),
      tipo: tipoComentario,
      resuelto: false
    });

    setTextoComentario('');
  };

  const handleCrearAcuerdo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoAcuerdoTexto.trim()) return;
    onAgregarAcuerdo(nuevoAcuerdoTexto.trim());
    setNuevoAcuerdoTexto('');
  };

  return (
    <div className="space-y-8">
      {/* Encabezado Sala de Validación */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f8eb] text-[#5b8723] text-xs font-black uppercase tracking-wider mb-2 border border-[#cde8ab]">
              <Users className="w-3.5 h-3.5" />
              <span>Red de Agentes Transformadores • Decisión Colectiva Humana</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#414141] tracking-tight">
              Sala de Validación y Aprobación Colectiva
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
              Espacio deliberativo donde los 7 integrantes revisan la experiencia, formulan observaciones, acuerdan compromisos institucionales y emiten el dictamen colegiado.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
              {experiencia.codigoUnico}
            </span>
            <span className="text-xs font-bold text-[#7FB536] bg-[#f2f8eb] px-3 py-1 rounded-lg border border-[#cde8ab]">
              v{experiencia.versionActual}
            </span>
          </div>
        </div>

        {/* Alerta de Principio Metodológico */}
        <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Principio de Validez Metodológica:</strong> No debe confundirse la validación metodológica de una propuesta con la comprobación de resultados de implementación. La validación colegiada certifica la coherencia ética, pedagógica y el rigor de los 16 componentes bajo el Modelo de Florecimiento.
          </div>
        </div>
      </div>

      {/* BLOQUE C: DICTAMEN COLECTIVO INSTITUCIONAL */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block">
                DECISIÓN INSTITUCIONAL COLEGIADA
              </span>
              <h3 className="text-lg font-black text-[#414141]">
                Emisión de Dictamen Colectivo
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 block">Quórum de Firmas:</span>
            <span className="text-sm font-black text-[#414141]">
              {firmasCompletas} de {totalAgentes} integrantes
            </span>
          </div>
        </div>

        {/* 3 Opciones Oficiales de Dictamen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Opción 1: VALIDADA */}
          <div
            onClick={() => setDictamenSeleccionado('VALIDADA')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              dictamenSeleccionado === 'VALIDADA'
                ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-600/30'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                Opción 1
              </span>
              {dictamenSeleccionado === 'VALIDADA' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <h4 className="text-sm font-bold text-[#414141] mb-1">1. VALIDADA</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              La propuesta refleja adecuadamente la experiencia y cumple a cabalidad los criterios del Modelo de Florecimiento Areandino.
            </p>
          </div>

          {/* Opción 2: VALIDADA CON OBSERVACIONES */}
          <div
            onClick={() => setDictamenSeleccionado('VALIDADA_OBSERVACIONES')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              dictamenSeleccionado === 'VALIDADA_OBSERVACIONES'
                ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600/30'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-800">
                Opción 2
              </span>
              {dictamenSeleccionado === 'VALIDADA_OBSERVACIONES' && (
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <h4 className="text-sm font-bold text-[#414141] mb-1">
              2. VALIDADA CON OBSERVACIONES
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Puede aprobarse con precisiones y recomendaciones metodológicas que deben quedar formalmente registradas en el expediente.
            </p>
          </div>

          {/* Opción 3: REQUIERE AJUSTES */}
          <div
            onClick={() => setDictamenSeleccionado('REQUIERE_AJUSTES')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              dictamenSeleccionado === 'REQUIERE_AJUSTES'
                ? 'border-amber-600 bg-amber-50/40 shadow-xs ring-1 ring-amber-600/30'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                Opción 3
              </span>
              {dictamenSeleccionado === 'REQUIERE_AJUSTES' && (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <h4 className="text-sm font-bold text-[#414141] mb-1">3. REQUIERE AJUSTES</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Necesita modificaciones metodológicas o de vacíos de información antes de poder obtener la aprobación institucional.
            </p>
          </div>
        </div>

        {/* Observaciones Colectivas del Dictamen */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
            Observaciones y Síntesis del Dictamen Colegiado:
          </label>
          <textarea
            rows={3}
            value={observacionesTexto}
            onChange={(e) => setObservacionesTexto(e.target.value)}
            placeholder="Registra aquí los considerandos y fundamentos de la decisión de la Red de Agentes Transformadores..."
            className="w-full text-xs text-[#414141] p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:ring-1 focus:ring-[#7FB536]"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGuardarDictamen}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Registrar Dictamen Colectivo en Versión Actual</span>
          </button>
        </div>
      </div>

      {/* BLOQUE B: OBSERVACIONES Y COMENTARIOS POR SECCIÓN */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 block">
                DELIBERACIÓN Y REVISIÓN SECTORIAL
              </span>
              <h3 className="text-lg font-black text-[#414141]">
                Comentarios y Observaciones por Sección
              </h3>
            </div>
          </div>

          <span className="text-xs font-bold text-gray-400">
            {experiencia.comentarios?.length || 0} observaciones registradas
          </span>
        </div>

        {/* Lista de Comentarios Existentes */}
        <div className="space-y-3 mb-6">
          {(!experiencia.comentarios || experiencia.comentarios.length === 0) ? (
            <div className="p-6 rounded-xl bg-gray-50 text-center text-xs text-gray-400">
              No hay observaciones abiertas. Utiliza el formulario inferior para agregar comentarios específicos por sección.
            </div>
          ) : (
            experiencia.comentarios.map((com) => (
              <div
                key={com.id}
                className={`p-4 rounded-xl border transition-all ${
                  com.resuelto
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-blue-200 shadow-2xs'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {com.componenteTitulo}
                    </span>
                    <span className="text-xs font-bold text-[#414141]">{com.autorNombre}</span>
                    <span className="text-[11px] text-gray-400">({com.autorCargo})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono">{com.fecha}</span>
                    <button
                      onClick={() => onResolverComentario(com.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                        com.resuelto
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-800'
                      }`}
                    >
                      {com.resuelto ? 'Resuelto ✓' : 'Marcar Resuelto'}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed pl-1">{com.texto}</p>
              </div>
            ))
          )}
        </div>

        {/* Formulario de Nuevo Comentario */}
        <form onSubmit={handleEnviarComentario} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <span className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-3">
            Agregar Nueva Observación Individual:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">
                Integrante que comenta:
              </label>
              <select
                value={autorComentarioId}
                onChange={(e) => setAutorComentarioId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              >
                {experiencia.agentes.map((agente) => (
                  <option key={agente.id} value={agente.id}>
                    {agente.nombre} ({agente.cargo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">
                Componente a revisar:
              </label>
              <select
                value={seccionComentario}
                onChange={(e) => setSeccionComentario(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              >
                {Object.values(experiencia.propuesta16).map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.numero}. {comp.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">
                Tipo de aporte:
              </label>
              <select
                value={tipoComentario}
                onChange={(e) =>
                  setTipoComentario(e.target.value as 'OBSERVACION' | 'RECOMENDACION' | 'CORRECCION_REQUERIDA')
                }
                className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="OBSERVACION">Observación Metodológica</option>
                <option value="RECOMENDACION">Recomendación Complementaria</option>
                <option value="CORRECCION_REQUERIDA">Ajuste Requerido antes de Aprobar</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <textarea
              rows={2}
              value={textoComentario}
              onChange={(e) => setTextoComentario(e.target.value)}
              placeholder="Escribe la observación con fundamentación en el Modelo de Florecimiento..."
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#7FB536]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!textoComentario.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Comentario</span>
            </button>
          </div>
        </form>
      </div>

      {/* BLOQUE D: ACUERDOS Y COMPROMISOS COLECTIVOS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#7FB536] block">
                COMPROMISOS DE IMPLEMENTACIÓN
              </span>
              <h3 className="text-lg font-black text-[#414141]">
                Acuerdos Colectivos Institucionales
              </h3>
            </div>
          </div>
        </div>

        <ul className="space-y-2 mb-4">
          {experiencia.acuerdosCompromisos.map((acuerdo, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700"
            >
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f2f8eb] text-[#5b8723] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{acuerdo}</span>
              </div>
              <button
                type="button"
                onClick={() => onEliminarAcuerdo(idx)}
                className="text-gray-400 hover:text-red-600 transition-colors shrink-0"
                title="Eliminar acuerdo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCrearAcuerdo} className="flex gap-2">
          <input
            type="text"
            placeholder="Añadir nuevo acuerdo de implementación..."
            value={nuevoAcuerdoTexto}
            onChange={(e) => setNuevoAcuerdoTexto(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-hidden focus:ring-1 focus:ring-[#7FB536]"
          />
          <button
            type="submit"
            disabled={!nuevoAcuerdoTexto.trim()}
            className="px-4 py-2.5 bg-[#7FB536] text-white text-xs font-bold rounded-lg hover:bg-[#6fa02d] transition-colors disabled:opacity-40"
          >
            Añadir
          </button>
        </form>
      </div>

      {/* BLOQUE E: HISTORIAL DE VERSIONES Y TRAZABILIDAD (ANTI-MODIFICACIÓN SILENCIOSA) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 block">
                CONTROL DE CAMBIOS Y TRAZABILIDAD
              </span>
              <h3 className="text-lg font-black text-[#414141]">
                Historial de Versiones Oficiales
              </h3>
            </div>
          </div>

          <span className="text-xs font-bold text-[#7FB536]">
            Versión activa: v{experiencia.versionActual}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {experiencia.historialVersiones?.map((hist, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 bg-[#F8FAF6] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-gray-300 text-[#414141]">
                    v{hist.numeroVersion}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{hist.fecha}</span>
                  <span className="text-[10px] font-bold text-gray-500">
                    Por: {hist.autorModificacion}
                  </span>
                </div>
                <p className="text-gray-700">{hist.resumenCambios}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-gray-500 block">
                  {hist.firmasRegistradas?.length || 0} firmas archivadas
                </span>
                <span className="text-[10px] font-bold text-purple-700">
                  Dictamen: {hist.dictamenEnMomento}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

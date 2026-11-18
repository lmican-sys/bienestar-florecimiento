import React, { useState, useRef } from 'react';
import {
  Users,
  UserPlus,
  PenTool,
  UploadCloud,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Save,
  X,
  FileSignature,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { AgenteTransformador, DictamenColectivoTipo } from '../types/flourishing.ts';
import { cargarAgentesRegistrados } from '../utils/storage.ts';

interface GestionAgentesFirmasProps {
  agentes: AgenteTransformador[];
  versionActual: string;
  codigoUnico: string;
  dictamenActual: DictamenColectivoTipo;
  onActualizarAgentes: (nuevosAgentes: AgenteTransformador[]) => void;
}

export const GestionAgentesFirmas: React.FC<GestionAgentesFirmasProps> = ({
  agentes,
  versionActual,
  codigoUnico,
  dictamenActual,
  onActualizarAgentes
}) => {
  const [agenteEditando, setAgenteEditando] = useState<AgenteTransformador | null>(null);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [agenteParaFirmar, setAgenteParaFirmar] = useState<AgenteTransformador | null>(null);

  // Formulario nuevo integrante
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCargo, setNuevoCargo] = useState('');
  const [nuevaDependencia, setNuevaDependencia] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');

  // Canvas de firma manuscrita
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dibujando, setDibujando] = useState(false);

  const totalAgentes = agentes.length;
  const firmasCompletadas = agentes.filter((a) => a.estadoFirma === 'FIRMADO').length;
  const porcentaje = totalAgentes > 0 ? Math.round((firmasCompletadas / totalAgentes) * 100) : 0;

  // Manejo de canvas de firma
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setDibujando(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!dibujando) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#1d3d0c';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDibujando(false);
  };

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const guardarFirmaDibujada = () => {
    if (!agenteParaFirmar) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const actualizados = agentes.map((a) => {
      if (a.id === agenteParaFirmar.id) {
        return {
          ...a,
          firmaDataUrl: dataUrl,
          fechaFirma: timestamp,
          estadoFirma: 'FIRMADO' as const,
          dictamenIndividual: 'VALIDADA' as const
        };
      }
      return a;
    });

    onActualizarAgentes(actualizados);
    setAgenteParaFirmar(null);
  };

  const handleSubirFirmaArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!agenteParaFirmar) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

      const actualizados = agentes.map((a) => {
        if (a.id === agenteParaFirmar.id) {
          return {
            ...a,
            firmaDataUrl: dataUrl,
            fechaFirma: timestamp,
            estadoFirma: 'FIRMADO' as const,
            dictamenIndividual: 'VALIDADA' as const
          };
        }
        return a;
      });

      onActualizarAgentes(actualizados);
      setAgenteParaFirmar(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCrearNuevoAgente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoCargo.trim()) return;

    const nuevo: AgenteTransformador = {
      id: `agente_${Date.now()}`,
      nombre: nuevoNombre.trim(),
      cargo: nuevoCargo.trim(),
      dependencia: nuevaDependencia.trim() || 'Dirección de Bienestar y Florecimiento',
      email: nuevoEmail.trim() || 'transformador@areandina.edu.co',
      estadoFirma: 'PENDIENTE',
      dictamenIndividual: 'PENDIENTE'
    };

    onActualizarAgentes([...agentes, nuevo]);
    setNuevoNombre('');
    setNuevoCargo('');
    setNuevaDependencia('');
    setNuevoEmail('');
    setMostrarModalNuevo(false);
  };

  const handleEliminarAgente = (agenteId: string) => {
    if (agentes.length <= 1) {
      alert('Debe existir al menos un agente transformador en el equipo.');
      return;
    }
    const filtrados = agentes.filter((a) => a.id !== agenteId);
    onActualizarAgentes(filtrados);
  };

  const handleGuardarEdicionAgente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agenteEditando) return;

    const actualizados = agentes.map((a) =>
      a.id === agenteEditando.id ? agenteEditando : a
    );
    onActualizarAgentes(actualizados);
    setAgenteEditando(null);
  };

  const anularFirma = (agenteId: string) => {
    const actualizados = agentes.map((a) => {
      if (a.id === agenteId) {
        return {
          ...a,
          estadoFirma: 'PENDIENTE' as const,
          dictamenIndividual: 'PENDIENTE' as const,
          firmaDataUrl: undefined,
          fechaFirma: undefined
        };
      }
      return a;
    });
    onActualizarAgentes(actualizados);
  };

  return (
    <div className="space-y-8">
      {/* Encabezado y Barra de Progreso de Firmas */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f8eb] text-[#5b8723] text-xs font-black uppercase tracking-wider mb-2 border border-[#cde8ab]">
              <FileSignature className="w-3.5 h-3.5" />
              <span>Administración Dinámica • Red de Agentes Transformadores</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#414141] tracking-tight">
              Gestión de Integrantes, Roles y Firmas Oficiales
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl">
              Configura los responsables institucionales de la validación, sube o dibuja sus firmas manuscritas y asocia cada suscripción a la versión vigente v{versionActual}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const guardados = cargarAgentesRegistrados();
                onActualizarAgentes(JSON.parse(JSON.stringify(guardados)));
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#414141] font-bold text-xs transition-colors border border-gray-200"
              title="Aplicar los integrantes guardados en la Red Global a este expediente"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#7FB536]" />
              <span>Cargar Red Guardada</span>
            </button>

            <button
              onClick={() => setMostrarModalNuevo(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Agregar Integrante a la Red</span>
            </button>
          </div>
        </div>

        {/* Resumen de Quórum de Firmas */}
        <div className="mt-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Quórum Oficial de Suscripción:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#414141]">
                {firmasCompletadas} de {totalAgentes}
              </span>
              <span className="text-xs text-[#7FB536] font-bold">({porcentaje}%)</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-500 ${
                  porcentaje === 100 ? 'bg-emerald-600' : 'bg-[#7FB536]'
                }`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{totalAgentes - firmasCompletadas} firmas pendientes para cierre institucional</span>
              <span className="font-mono text-[#5b8723] font-bold">
                Vinculado a: {codigoUnico} v{versionActual}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Integrantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentes.map((agente, idx) => {
          const estaFirmado = agente.estadoFirma === 'FIRMADO';

          return (
            <div
              key={agente.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                estaFirmado
                  ? 'border-emerald-200 shadow-2xs'
                  : 'border-amber-200 bg-amber-50/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f2f8eb] text-[#5b8723] font-black flex items-center justify-center shrink-0 text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#414141]">{agente.nombre}</h4>
                    <span className="text-xs font-semibold text-gray-500 block">
                      {agente.cargo}
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      {agente.dependencia} • {agente.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setAgenteEditando(agente)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                    title="Editar datos del integrante"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleEliminarAgente(agente.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Retirar de la Red"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Estado y Muestra de Firma */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {estaFirmado ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>FIRMADO Y VALIDADO</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>PENDIENTE DE FIRMA</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 block">
                    {estaFirmado ? `Registrado: ${agente.fechaFirma}` : 'Firma requerida para aprobación'}
                  </span>
                </div>

                {estaFirmado ? (
                  <div className="flex items-center gap-2">
                    {agente.firmaDataUrl && (
                      <div className="bg-white p-1 rounded border border-gray-200">
                        <img
                          src={agente.firmaDataUrl}
                          alt={`Firma de ${agente.nombre}`}
                          className="h-7 w-auto max-w-[100px] object-contain"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => anularFirma(agente.id)}
                      className="p-1 text-gray-400 hover:text-amber-600 rounded"
                      title="Reabrir firma"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAgenteParaFirmar(agente)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7FB536] hover:bg-[#6fa02d] text-white font-bold text-xs shadow-2xs transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Firmar Ahora</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL PARA DIBUJAR O SUBIR FIRMA */}
      {agenteParaFirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB536] block">
                  REGISTRO DE FIRMA INDIVIDUAL
                </span>
                <h3 className="text-base font-black text-[#414141]">
                  {agenteParaFirmar.nombre}
                </h3>
                <span className="text-xs text-gray-400">{agenteParaFirmar.cargo}</span>
              </div>
              <button
                onClick={() => setAgenteParaFirmar(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[#f2f8eb] rounded-xl border border-[#cde8ab] text-xs text-[#385623]">
                Al suscribir este documento, certificas tu aprobación de la versión{' '}
                <strong>v{versionActual}</strong> de la experiencia {codigoUnico}.
              </div>

              {/* Opción 1: Dibujar en Canvas */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#414141]">
                    Opción A: Dibuja tu firma con el mouse o pantalla táctil
                  </label>
                  <button
                    type="button"
                    onClick={limpiarCanvas}
                    className="text-[11px] font-bold text-gray-500 hover:text-red-600"
                  >
                    Limpiar trazo
                  </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={440}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair bg-white w-full h-[140px]"
                  />
                </div>
              </div>

              {/* Opción 2: Subir archivo */}
              <div>
                <label className="block text-xs font-bold text-[#414141] mb-1.5">
                  Opción B: O sube una imagen de tu firma manuscrita (PNG o JPG)
                </label>
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs text-gray-700 transition-colors w-full justify-center">
                  <UploadCloud className="w-4 h-4 text-gray-500" />
                  <span>Seleccionar imagen de firma...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSubirFirmaArchivo}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAgenteParaFirmar(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarFirmaDibujada}
                  className="px-5 py-2 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Confirmar y Guardar Firma
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA AGREGAR NUEVO INTEGRANTE */}
      {mostrarModalNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCrearNuevoAgente}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-black text-[#414141]">
                Agregar Nuevo Integrante a la Red
              </h3>
              <button
                type="button"
                onClick={() => setMostrarModalNuevo(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Nombre Completo:
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Laura Patricia Gómez"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Cargo o Rol Institucional:
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Coordinadora de Permanencia y Florecimiento"
                value={nuevoCargo}
                onChange={(e) => setNuevoCargo(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Dependencia o Facultad:
              </label>
              <input
                type="text"
                placeholder="Ej: Vicerrectoría de Aprendizaje"
                value={nuevaDependencia}
                onChange={(e) => setNuevaDependencia(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Correo Institucional:
              </label>
              <input
                type="email"
                placeholder="Ej: lgomez@areandina.edu.co"
                value={nuevoEmail}
                onChange={(e) => setNuevoEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setMostrarModalNuevo(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white text-xs font-bold shadow-xs"
              >
                Incorporar a la Red
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL PARA EDITAR INTEGRANTE */}
      {agenteEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleGuardarEdicionAgente}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-black text-[#414141]">
                Editar Datos de Integrante
              </h3>
              <button
                type="button"
                onClick={() => setAgenteEditando(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nombre Completo:</label>
              <input
                type="text"
                required
                value={agenteEditando.nombre}
                onChange={(e) =>
                  setAgenteEditando({ ...agenteEditando, nombre: e.target.value })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Cargo / Rol:</label>
              <input
                type="text"
                required
                value={agenteEditando.cargo}
                onChange={(e) =>
                  setAgenteEditando({ ...agenteEditando, cargo: e.target.value })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Dependencia:</label>
              <input
                type="text"
                value={agenteEditando.dependencia}
                onChange={(e) =>
                  setAgenteEditando({ ...agenteEditando, dependencia: e.target.value })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Correo Electrónico:</label>
              <input
                type="email"
                value={agenteEditando.email}
                onChange={(e) =>
                  setAgenteEditando({ ...agenteEditando, email: e.target.value })
                }
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAgenteEditando(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#7FB536] hover:bg-[#6fa02d] text-white text-xs font-bold shadow-xs"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

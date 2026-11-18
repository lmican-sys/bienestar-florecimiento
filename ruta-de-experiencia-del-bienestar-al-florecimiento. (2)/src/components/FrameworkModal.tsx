import React from 'react';
import { X, BookOpen, Sparkles, CheckCircle2, Shield, Heart, Users, Globe2, Compass } from 'lucide-react';

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FrameworkModal: React.FC<FrameworkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#f2f8eb] text-[#5b8723]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7FB536] block">
                FUNDACIÓN UNIVERSITARIA DEL ÁREA ANDINA
              </span>
              <h3 className="text-lg font-black text-[#414141]">
                Modelo «Del Bienestar al Florecimiento»
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-600">
          {/* Manifiesto y propósito */}
          <div className="p-4 rounded-xl bg-[#F8FAF6] border border-[#cbe5a9]">
            <p className="font-semibold text-[#414141] mb-1">
              "¡Sé parte de la generación que transforma!"
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              El modelo trasciende la concepción asistencialista o recreativa del bienestar para concebir el florecimiento como un estado integral de plenitud, sentido de vida, arraigo comunitario y transformación social en todos los miembros de la comunidad andina.
            </p>
          </div>

          {/* 4 Dimensiones */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#414141] mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7FB536]"></span>
              <span>1. Las Cuatro Dimensiones del Florecimiento</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#f2f8eb] text-[#5b8723] font-extrabold text-xs">
                    YO
                  </span>
                  <span className="text-xs font-bold text-[#414141]">Autoconocimiento y Cuidado</span>
                </div>
                <p className="text-xs text-gray-500">
                  Regulación emocional, proyecto de vida, autocuidado, salud mental y física, autoestima y coherencia personal.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-xs">
                    OTRO
                  </span>
                  <span className="text-xs font-bold text-[#414141]">Alteridad y Empatía</span>
                </div>
                <p className="text-xs text-gray-500">
                  Escucha activa, reconocimiento de la diversidad, vínculos saludables, compasión y cuidado recíproco.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-extrabold text-xs">
                    ENTORNO
                  </span>
                  <span className="text-xs font-bold text-[#414141]">Territorio y Sostenibilidad</span>
                </div>
                <p className="text-xs text-gray-500">
                  Corresponsabilidad ambiental, apropiación digna del campus físico y digital, respeto por la naturaleza.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-extrabold text-xs">
                    NOSOTROS
                  </span>
                  <span className="text-xs font-bold text-[#414141]">Comunidad y Ciudadanía</span>
                </div>
                <p className="text-xs text-gray-500">
                  Liderazgo transformador, sentido de pertenencia andina, solidaridad institucional y tejido social colectivo.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Capacidades */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#414141] mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#414141]"></span>
              <span>2. Las Tres Capacidades Institucionales</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-extrabold text-[#414141] block mb-1">SER</span>
                <p className="text-gray-600">
                  Identidad, virtudes de carácter, fortaleza ética y autenticidad en las decisiones cotidianas.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-extrabold text-[#414141] block mb-1">CONVIVIR</span>
                <p className="text-gray-600">
                  Comunicación noviolenta, acogida de la diferencia, diálogo constructivo y trabajo en equipo.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-extrabold text-[#414141] block mb-1">TRASCENDER</span>
                <p className="text-gray-600">
                  Impacto social medible, proyectos comunitarios con arraigo territorial y legado para la sociedad.
                </p>
              </div>
            </div>
          </div>

          {/* Modelo SPIRE */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#414141] mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Referente que inspira el Modelo: SPIRE (Tal Ben-Shahar)</span>
            </h4>
            <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2 text-xs">
              <p className="text-xs text-gray-600 leading-relaxed pb-2 mb-1 border-b border-gray-100">
                SPIRE aporta una forma de recordar la integralidad de la experiencia humana. No es una dimensión ni una capacidad del Modelo Areandino, que se organiza con YO, OTRO, ENTORNO, NOSOTROS y SER, CONVIVIR, TRASCENDER.
              </p>
              <div className="flex items-center gap-2">
                <strong className="text-purple-700 w-24 shrink-0">S - Espiritual:</strong>
                <span>Vivir con propósito, significado y coherencia interior.</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-700 w-24 shrink-0">P - Físico:</strong>
                <span>Cuerpo como templo: descanso, nutrición, movimiento y respiración.</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-blue-700 w-24 shrink-0">I - Intelectual:</strong>
                <span>Curiosidad viva, aprendizaje profundo y pensamiento crítico.</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-amber-700 w-24 shrink-0">R - Relacional:</strong>
                <span>Vínculos positivos, amabilidad, compasión y redes de apoyo.</span>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-rose-700 w-24 shrink-0">E - Emocional:</strong>
                <span>Gestión de emociones difíciles, optimismo realista y cultivo de la gratitud.</span>
              </div>
            </div>
          </div>

          {/* Reglas de Oro */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-[#414141] block mb-2">
              Reglas de Oro del Consultor:
            </span>
            <ul className="space-y-1.5 list-disc list-inside text-gray-600">
              <li><strong>Cero invenciones culturales:</strong> No introducir mingas, ritos o jerarquías tradicionales a menos que estén expresadas en el contexto real del usuario.</li>
              <li><strong>Alineación no forzada:</strong> Conectar únicamente en lo pertinente; se permite indicar "No aplica" o "Información insuficiente".</li>
              <li><strong>Trazabilidad estricta:</strong> Distinguir con nitidez entre hechos documentados, percepciones, hipótesis y vacíos de datos.</li>
              <li><strong>Menú de 2 a 3 opciones:</strong> Cada hallazgo operativo ofrece alternativas innovadoras para que el usuario elija de forma ágil.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#7FB536] text-white text-xs font-bold hover:bg-[#6fa02d] transition-colors"
          >
            Entendido, volver a la experiencia
          </button>
        </div>
      </div>
    </div>
  );
};

import { ExperienciaInstitucional } from '../types/flourishing.ts';
import { obtenerAccionesElegidasConFicha } from './matrizHelpers.ts';

export function exportarExperienciaAWord(exp: ExperienciaInstitucional): void {
  const accionesElegidas = obtenerAccionesElegidasConFicha(exp.matrizEstrategica);
  const firmasCompletadas = exp.agentes.filter((a) => a.estadoFirma === 'FIRMADO');
  const dictamenTexto =
    exp.dictamenColectivo === 'VALIDADA'
      ? 'APROBADA Y VALIDADA INSTITUCIONALMENTE'
      : exp.dictamenColectivo === 'VALIDADA_OBSERVACIONES'
      ? 'VALIDADA CON OBSERVACIONES COMPLEMENTARIAS'
      : exp.dictamenColectivo === 'REQUIERE_AJUSTES'
      ? 'REQUIERE AJUSTES METODOLÓGICOS'
      : 'EN PROCESO DE REVISIÓN Y VALIDACIÓN';

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${exp.titulo}</title>
      <style>
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          color: #333333;
          line-height: 1.5;
          margin: 40px;
        }
        h1 {
          color: #2b5711;
          font-size: 24pt;
          text-align: center;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        h2 {
          color: #7FB536;
          font-size: 16pt;
          border-bottom: 2px solid #7FB536;
          padding-bottom: 4px;
          margin-top: 25px;
        }
        h3 {
          color: #414141;
          font-size: 13pt;
          margin-top: 15px;
        }
        .header-box {
          border: 1px solid #7FB536;
          background-color: #f2f8eb;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 6px;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          font-size: 9pt;
          font-weight: bold;
          border-radius: 4px;
          background-color: #e2f0d9;
          color: #385623;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        th {
          background-color: #7FB536;
          color: white;
          font-weight: bold;
          padding: 8px;
          border: 1px solid #cccccc;
          text-align: left;
          font-size: 10pt;
        }
        td {
          padding: 8px;
          border: 1px solid #cccccc;
          font-size: 10pt;
          vertical-align: top;
        }
        .component-card {
          border-left: 4px solid #7FB536;
          background: #fafafa;
          padding: 10px 15px;
          margin-bottom: 12px;
        }
        .component-title {
          font-weight: bold;
          color: #262626;
          font-size: 11pt;
        }
        .signature-box {
          border: 1px solid #dddddd;
          padding: 10px;
          text-align: center;
          min-height: 80px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #7FB536;
          text-align: center;
          font-size: 9pt;
          color: #777777;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="font-size: 11pt; color: #7FB536; font-weight: bold; letter-spacing: 2px; margin: 0;">FUNDACIÓN UNIVERSITARIA DEL ÁREA ANDINA - AREANDINA</p>
        <p style="font-size: 10pt; color: #555555; margin: 2px 0 10px 0;">RED DE AGENTES TRANSFORMADORES</p>
        <h1 style="margin: 5px 0; font-size: 20pt; color: #414141;">Ruta de Experiencia - Del Bienestar al Florecimiento</h1>
        <p style="font-size: 15pt; font-weight: bold; color: #7FB536; margin: 4px 0;">Sistematizar para transformar experiencias</p>
        <p style="font-size: 10pt; color: #666666; margin: 4px 0 15px 0;">Visión y requerimientos para ajustar la herramienta de sistematización, rediseño, experimentación y validación de experiencias</p>
        
        <div style="background-color: #f2f8eb; border: 1px solid #cbe5a9; padding: 12px; border-radius: 6px; text-align: left; max-width: 650px; margin: 0 auto 15px auto;">
          <p style="font-size: 9pt; font-weight: bold; color: #4d751c; margin: 0 0 4px 0; text-transform: uppercase;">PROPÓSITO</p>
          <p style="font-size: 10pt; font-weight: bold; color: #333333; margin: 0;">Convertir el Modelo «Del Bienestar al Florecimiento» en una herramienta práctica que ayude a comprender experiencias reales, decidir qué conservar o transformar, diseñar mejoras coherentes, pilotearlas, reunir evidencia y validar aprendizajes.</p>
        </div>

        <p style="font-size: 13pt; font-weight: bold; color: #222222; margin-top: 15px;">EXPERIENCIA: ${exp.titulo}</p>
      </div>

      <div class="header-box">
        <table style="border: none; margin: 0;">
          <tr style="border: none;">
            <td style="border: none; width: 50%;">
              <strong>Código Único:</strong> ${exp.codigoUnico}<br/>
              <strong>Versión Oficial:</strong> v${exp.versionActual}<br/>
              <strong>Fecha de Elaboración:</strong> ${exp.fechaCreacion}<br/>
              <strong>Última Modificación:</strong> ${exp.fechaUltimaModificacion}
            </td>
            <td style="border: none; width: 50%;">
              <strong>Dictamen Institucional:</strong> <span class="badge">${dictamenTexto}</span><br/>
              <strong>Firmas Completadas:</strong> ${firmasCompletadas.length} de ${exp.agentes.length} integrantes<br/>
              <strong>Sedes / Modalidad:</strong> Bogotá • Pereira • Valledupar • Virtual
            </td>
          </tr>
        </table>
      </div>

      <h2>1. DIAGNÓSTICO EJECUTIVO Y SITUACIÓN IDENTIFICADA</h2>
      <div class="component-card">
        <p class="component-title">1.1 Síntesis de la Experiencia</p>
        <p><strong>Qué se identificó:</strong> ${exp.diagnostico.sintesisExperiencia.queSeEntendio}</p>
        <p><strong>A quién va dirigida:</strong> ${exp.diagnostico.sintesisExperiencia.aQuienVaDirigida}</p>
        <p><strong>Propósito central:</strong> ${exp.diagnostico.sintesisExperiencia.queSeBusca}</p>
        <p><strong>Contexto y Modalidad:</strong> ${exp.diagnostico.sintesisExperiencia.contextoYModalidad}</p>
      </div>

      <div class="component-card">
        <p class="component-title">1.2 Trazabilidad de Hallazgos y Puntos de Quiebre</p>
        <ul>
          ${exp.diagnostico.puntosQuiebreHallazgos
            .map(
              (h) => `<li><strong>[${h.tipo}]</strong> ${h.descripcion} <em>(Impacto: ${h.impactoObservado})</em></li>`
            )
            .join('')}
        </ul>
      </div>

      <div class="component-card">
        <p class="component-title">1.3 Vacíos de Información y Aspectos Pendientes</p>
        <ul>
          ${exp.diagnostico.vaciosInformacion.map((v) => `<li>${v}</li>`).join('')}
        </ul>
      </div>

      <h2>2. ACCIONES ELEGIDAS Y FICHA DE ACCIÓN OPERATIVA</h2>
      ${
        accionesElegidas.length === 0
          ? `<p style="font-size: 10pt; color: #666666;"><em>No hay acciones elegidas registradas en la Base de la propuesta.</em></p>`
          : `<table>
              <thead>
                <tr>
                  <th style="width: 24%;">Hallazgo / Necesidad</th>
                  <th style="width: 30%;">Acción Elegida</th>
                  <th style="width: 46%;">Ficha de Acción</th>
                </tr>
              </thead>
              <tbody>
                ${accionesElegidas
                  .map(
                    (item) => `
                  <tr>
                    <td><strong>${item.hallazgoNecesidad}</strong></td>
                    <td><strong>${item.accionTitulo}</strong><br/>${item.accionDescripcion}</td>
                    <td>
                      <strong>Producto o entregable:</strong> ${item.ficha.productoEntregable}<br/>
                      <strong>Responsable:</strong> ${item.ficha.responsable}<br/>
                      <strong>Cuándo:</strong> ${item.ficha.cuando}<br/>
                      <strong>Recursos:</strong> ${item.ficha.recursos}<br/>
                      <strong>Indicador de éxito:</strong> ${item.ficha.indicadorExito}<br/>
                      <strong>Evidencia:</strong> ${item.ficha.evidencia}<br/>
                      <strong>Estado:</strong> <span class="badge">${item.ficha.estado}</span>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>`
      }

      <h2>3. PROPUESTA DE TRANSFORMACIÓN (16 COMPONENTES METODOLÓGICOS)</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Componente Institucional</th>
            <th style="width: 15%;">Categoría / Origen</th>
            <th style="width: 60%;">Contenido Metodológico Aprobado</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(exp.propuesta16)
            .map(
              (comp) => `
            <tr>
              <td><strong>${comp.numero}. ${comp.titulo}</strong></td>
              <td><span class="badge">${comp.categoria}</span><br/><small>Origen: ${comp.origen}</small></td>
              <td>${comp.contenido.replace(/\n/g, '<br/>')}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h2>4. LA EXPERIENCIA COMO UNIDAD CENTRAL DE FLORECIMIENTO (7 PREGUNTAS CLAVE)</h2>
      <div class="component-card">
        <p><strong>1. ¿Qué situación queremos transformar?</strong><br/>${exp.preguntasVivenciales.queSituacionTransformar}</p>
        <p><strong>2. ¿Qué experiencia vivirá la persona?</strong><br/>${exp.preguntasVivenciales.queExperienciaVivira}</p>
        <p><strong>3. ¿Qué hará, sentirá, aprenderá o desarrollará?</strong><br/>${exp.preguntasVivenciales.queHaraSentiraAprendera}</p>
        <p><strong>4. ¿Qué relaciones o capacidades se fortalecerán?</strong><br/>${exp.preguntasVivenciales.queRelacionesCapacidadesFortalecera}</p>
        <p><strong>5. ¿Qué dimensiones del florecimiento se movilizarán?</strong><br/>${exp.preguntasVivenciales.queDimensionesMovilizara}</p>
        <p><strong>6. ¿Qué transformación esperamos observar?</strong><br/>${exp.preguntasVivenciales.queTransformacionEsperamos}</p>
        <p><strong>7. ¿Cómo sabremos si realmente ocurrió?</strong><br/>${exp.preguntasVivenciales.comoSabremosSiOcurrio}</p>
      </div>

      <h2>5. ACUERDOS, DICTAMEN COLECTIVO Y SALA DE VALIDACIÓN</h2>
      <div class="component-card">
        <p><strong>Dictamen Oficial del Equipo:</strong> ${dictamenTexto}</p>
        <p><strong>Observaciones Colectivas:</strong> ${exp.observacionesColectivas || 'Sin observaciones restrictivas.'}</p>
        <p><strong>Acuerdos y Compromisos Institucionales:</strong></p>
        <ul>
          ${exp.acuerdosCompromisos.map((acuerdo) => `<li>${acuerdo}</li>`).join('')}
        </ul>
      </div>

      <h2>6. REGISTRO OFICIAL DE INTEGRANTES Y FIRMAS COLECTIVAS</h2>
      <p style="font-size: 10pt; color: #555555;">La aprobación del presente documento vincula a cada integrante a la versión oficial ${exp.versionActual}. No se permiten modificaciones silenciosas post-aprobación.</p>
      
      <table>
        <thead>
          <tr>
            <th style="width: 30%;">Integrante y Cargo</th>
            <th style="width: 25%;">Dependencia Institucional</th>
            <th style="width: 20%;">Dictamen Individual</th>
            <th style="width: 25%;">Firma / Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          ${exp.agentes
            .map((agente) => {
              const firmaHtml = agente.firmaDataUrl
                ? `<img src="${agente.firmaDataUrl}" style="max-height: 45px; max-width: 130px;"/><br/><small style="color: #2b5711; font-weight: bold;">Registrado: ${agente.fechaFirma || 'Firmado'}</small>`
                : `<span style="color: #b7791f; font-weight: bold;">[PENDIENTE DE FIRMA]</span>`;

              return `
                <tr>
                  <td><strong>${agente.nombre}</strong><br/><small>${agente.cargo}</small></td>
                  <td>${agente.dependencia}<br/><small>${agente.email}</small></td>
                  <td><span class="badge">${agente.dictamenIndividual}</span></td>
                  <td class="signature-box">${firmaHtml}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <p><strong>"¡Sé parte de la generación que transforma!"</strong></p>
        <p>Fundación Universitaria del Área Andina • Red de Agentes Transformadores • Sistema Inteligente de Florecimiento Institucional</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${exp.codigoUnico}_${exp.titulo.replace(/[^a-zA-Z0-9]/g, '_')}_v${exp.versionActual}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

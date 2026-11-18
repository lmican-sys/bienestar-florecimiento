import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

async function extraerPdfConGemini(file: File): Promise<string> {
  const MAX_BYTES = 15 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    throw new Error(
      `El PDF "${file.name}" supera el tamaño máximo permitido de 15 MB para lectura automática.`
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);

  let res: Response;
  try {
    res = await fetch('/api/extraer-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf',
        'X-File-Name': encodeURIComponent(file.name)
      },
      body: file,
      signal: controller.signal
    });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error(
        `La lectura automática del PDF "${file.name}" tardó demasiado. Intenta con un PDF más liviano o pega el texto directamente.`
      );
    }
    throw new Error(
      `No se pudo enviar el PDF "${file.name}" al servidor. Verifica tu conexión e intenta nuevamente.`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const tipo = res.headers.get('content-type') || '';
  if (!tipo.includes('application/json')) {
    if (res.status === 413) {
      throw new Error(
        `El PDF "${file.name}" excede el límite de tamaño permitido por el servidor.`
      );
    }
    throw new Error(
      `No se pudo procesar el PDF "${file.name}" en el servidor (estado ${res.status}).`
    );
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || `No se pudo leer el PDF "${file.name}".`);
  }

  const texto = String(data?.texto || '').trim();
  if (!texto) {
    throw new Error(`El archivo PDF "${file.name}" no contiene texto legible.`);
  }
  return texto;
}

export async function extraerTextoArchivo(file: File): Promise<string> {
  const nombre = file.name.toLowerCase();

  if (file.size === 0) {
    throw new Error(`El archivo "${file.name}" está vacío (0 bytes).`);
  }

  if (nombre.endsWith('.doc') && !nombre.endsWith('.docx')) {
    throw new Error(
      `El archivo "${file.name}" usa formato antiguo (.doc). Guárdalo como .docx, .pdf o .txt, o pega el texto directamente.`
    );
  }

  if (nombre.endsWith('.docx')) {
    let texto = '';
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      texto = result.value?.trim() || '';
    } catch {
      throw new Error(
        `No se pudo leer "${file.name}". Verifica que sea un documento Word (.docx) válido y que no esté dañado ni protegido con contraseña.`
      );
    }
    if (!texto) {
      throw new Error(`El archivo Word "${file.name}" no contiene texto legible.`);
    }
    return texto;
  }

  if (nombre.endsWith('.pdf') || file.type === 'application/pdf') {
    let textoLocal = '';
    let pdf: any = null;
    try {
      const arrayBuffer = await file.arrayBuffer();
      pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const paginas: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        if (pageText.trim()) {
          paginas.push(pageText.trim());
        }
      }

      textoLocal = paginas.join('\n\n').trim();
    } catch {
      textoLocal = '';
    } finally {
      try {
        await pdf?.destroy?.();
      } catch {
        // Ignorar errores al liberar memoria del documento PDF
      }
    }

    if (textoLocal) {
      return textoLocal;
    }

    // Respaldo para PDFs escaneados, exportados como imagen o con texto no seleccionable
    return extraerPdfConGemini(file);
  }

  // Archivos de texto plano (.txt, .md, .csv, etc.)
  const texto = (await file.text()).trim();
  if (!texto) {
    throw new Error(`El archivo "${file.name}" está vacío.`);
  }
  return texto;
}

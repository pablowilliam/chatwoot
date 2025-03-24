import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';

/**
 * Decodifica entidades HTML en un texto.
 * Convierte textos como "&#39;" en su equivalente "'".
 */
function decodeHTMLEntities(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

export const downloadCsvFile = (fileName, content) => {
  const BOM = '\uFEFF'; // <- Agrega BOM para evitar problemas de codificación en Excel
  const contentType = 'data:text/csv;charset=utf-8;';

  // Decodificar entidades HTML antes de escribir el contenido en el archivo
  const cleanedContent = decodeHTMLEntities(content);

  const blob = new Blob([BOM + cleanedContent], { type: contentType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('download', fileName);
  link.setAttribute('href', url);
  link.click();
  return link;
};

export const generateFileName = ({ type, to, businessHours = false }) => {
  let name = `${type}-report-${format(fromUnixTime(to), 'dd-MM-yyyy')}`;
  if (businessHours) {
    name = `${name}-business-hours`;
  }
  return `${name}.csv`;
};

import { PDFDocument } from 'pdf-lib';
export const getPdfPageCountFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      try {
        const typedArray = new Uint8Array(event.target.result);
        const pdfDoc = await PDFDocument.load(typedArray);
        const pageCount = pdfDoc.getPageCount();
        resolve(pageCount);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};

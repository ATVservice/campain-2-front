




// fileUtils.js
import * as XLSX from 'xlsx';

// Function to read a file and return its rows (for both CSV and Excel files)
export const readFileContent = async (file, fileExtension) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      let rows = [];

      try {
        if (fileExtension === 'csv') {
          const text = event.target.result;
          
          // Check if the file uses tab-separated values or comma-separated
          const delimiter = text.indexOf('\t') > text.indexOf(',') ? '\t' : ',';

          // Split by the detected delimiter
          rows = text.split('\n').map(row => row.split(delimiter));
        } else {
          const arrayBuffer = event.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        }

        // Filter out empty rows
        rows = rows.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));

        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    // Determine file read type
    if (fileExtension === 'csv') {
      reader.readAsText(file);  // For CSV, read as text
    } else {
      reader.readAsArrayBuffer(file);  // For Excel files, read as ArrayBuffer
    }
  });
};

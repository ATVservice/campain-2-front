import * as XLSX from 'xlsx';





export const handleFileUpload = (e, callback) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const arrayBuffer = event.target.result;
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Invoke the callback function, passing the JSON data to it
    callback(json);
  };

  reader.readAsArrayBuffer(file);
};


export function recordOperation(date,operationType) 
{

}



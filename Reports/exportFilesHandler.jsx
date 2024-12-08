import React from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useEffect,useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs'
import html2pdf from 'html2pdf.js';



const hebrewToEnglishMapping = {
    'מזהה אנש': 'AnashIdentifier',
    'שם': 'FirstName',
    'משפחה': 'LastName',
    'כתובת': 'Address',
    'מספר': 'AddressNumber',
    'עיר': 'City',
    'טל נייד': 'MobilePhone',
    'טל בית': 'HomePhone',
    'מתרים': 'fundRaiser',
    "סכום התחייבות": "CommitmentAmount",
    "סכום שולם": "AmountPaid",
    "סכום שנותר": "AmountRemaining",
    "מספר תשלומים": "NumberOfPayments",
    "אופן תשלום": "PaymentMethod",
    'הערות': "Notes",
    "תשובה למתרים": "ResponseToFundraiser",
    "יום הנצחה": "MemorialDay",
    'הנצחה': "Commemoration",
    "מספר התחייבות": "CommitmentId",
    'סכום': "Amount",
    'תאריך': "Date",
    'קמפיין': "CampainName",
    'קטגוריה': "CampainName",
    'קטגורייה': "CampainName",

  };
  const headersConvertedToHebrew = Object.fromEntries(
    Object.entries(hebrewToEnglishMapping).map(([key, value]) => [value, key])
  );
  






export const exportToExcel = async (data, fileName) => {

   const dataToExport = convertToHebrewKeys([...data]);
   data = []
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add headers (optional, but recommended)
    const headers = Object.keys(dataToExport[0]);
    worksheet.columns = headers.map(header => ({
        header: header,
        key: header,
        width: 14
    }));

    // Add data rows with right alignment
    dataToExport.forEach(item => {
        const row = {};
        headers.forEach(header => {
            row[header] = item[header];
        });
        const worksheetRow = worksheet.addRow(row);
        
        // Apply right alignment to all cells in the row
        worksheetRow.eachCell({ includeEmpty: true }, (cell) => {
            cell.alignment = { 
                horizontal: 'right',
                vertical: 'middle'
            };
        });
    });

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create and save the file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
};
function fixEn(str) {
  if (/[א-ת]/.test(String(str))) return str;
  return String(str).split("").reverse().join("");
}


const reverseHebrewText = (text) => {
    // Check if the text contains Hebrew characters
    const hebrewRegex = /[\u0590-\u05FF]/;
    
    // If no Hebrew characters, return the text as is
    if (!hebrewRegex.test(text)) return text;
  
    // Split the text into words
    const words = text.split(' ');
    
    // Process each word
    const processedWords = words.map(word => {
      // If the word contains Hebrew characters, reverse its letters
      if (hebrewRegex.test(word)) {
        return word.split('').reverse().join('');
      }
      // If no Hebrew characters, keep the word as is
      return word;
    });
  
    // Reverse the order of words
    return processedWords.reverse().join(' ');
  };  
 export const exportToPDF = (data, fileName) => {
  try {
    const  dataToExport = convertToHebrewKeys([...data]);
    data = [];

    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
  
    // Add the font to VFS (from the public folder)
    doc.addFileToVFS('ARIAL.TTF', '/ARIAL.TTF');
    doc.addFont('/ARIAL.TTF', 'ArialHebrew', 'normal');
  
    // Set the font to use the Hebrew font
    doc.setFont('ArialHebrew');
  
    // Add title
    doc.setFontSize(40);
    doc.setR2L(true);
    // doc.text(reverseHebrewText(fileName), 280, 10, { align: 'right' }); // Reverse fileName if in Hebrew
  
    // Define columns for the table
    let columns = Object.keys(dataToExport[0])
  
    // Prepare rows data (reverse each row and handle Hebrew text)
    let rows = dataToExport.map(item =>
      columns.map(column => {
        const value = item[column];
        return value ? fixEn(value) : '';
      
      }).reverse() // Reverse the row for proper RTL alignment
    );
    // columns = columns.map((column) => reverseHebrewText(column));

    
    // Generate the table with RTL support
    doc.autoTable({
      head: [columns.reverse()], // Reverse column headers for RTL
      body: rows,
      startY: 20,
      styles: {
        font: 'ArialHebrew',
        fontSize: 12,
        cellPadding: 3,
        halign: 'right', // Right-align text
        overflow: 'linebreak',
      
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
      },
    });
    console.log(dataToExport);
  
    // Save the PDF
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error(error);
  }
  };
  function convertToHebrewKeys(data) {
    return data.map((item) => {
      const convertedItem = {};
      Object.entries(item).forEach(([key, value]) => {
        const hebrewKey = headersConvertedToHebrew[key];
        if (hebrewKey) {
          convertedItem[hebrewKey] = value;
        }
      });
      return convertedItem;
    });


  }  





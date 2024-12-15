import React from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useEffect,useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs'
import html2pdf from 'html2pdf.js';
import { format } from 'date-fns';

import { hebrewToEnglisAlfonhMapping,englishToHebrewAlfonhMapping } from '../src/components/Utils';
import { ceil } from 'lodash';






  // const headersConvertedToHebrew = Object.fromEntries(
  //   Object.entries(hebrewToEnglisAlfonhMapping).map(([key, value]) => [value, key])
  // );
  // console.log(headersConvertedToHebrew)

  const isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

  





export const exportToExcel = async (data,columsMapping, fileName) => {
  const dataToExport = [...data];
  data = [];
   
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add headers with bold formatting
  let headers = Object.keys(columsMapping);
  
  headers = headers.filter(header => dataToExport.some(item => item[header]));
  // Set column configuration using Hebrew headers
  worksheet.columns = headers.map(header => ({
      header: columsMapping[header],
      key: header,
      width: 14
  }));

  // Make headers bold
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
      cell.font = { 
          bold: true 
      };
  });

  // Add data rows with right alignment
  dataToExport.forEach(item => {
      const row = {};
      headers.forEach(header => {
          
          if (isDate(item[header]) && (header === 'Date'|| header === 'TransactionDate')) {
              row[header] = format(new Date(item[header]), 'dd/MM/yyyy');
          } else {
              row[header] = item[header];
          }
      });
      
      const worksheetRow = worksheet.addRow(row);

      // Apply right alignment to all cells in the row
      worksheetRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = {
              horizontal: 'right',
              vertical: 'middle',
          };
      });
  });
 
  // Generate the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  
  // Create and save the file
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};
 
 
 function fixEn(str,key) {
  if (/[א-ת]/.test(String(str))) return str;
  let reversedStr =  String(str).split("").reverse().join("");
  if (isDate(reversedStr)&& (key === 'Date'|| key === 'TransactionDate')) {
    reversedStr = format(new Date( reversedStr), 'dd/MM/yyyy');
  }

  return reversedStr;
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
 export const exportToPDF = (data,columsMapping, fileName) => {
  console.log(columsMapping);
  try {
    const  dataToExport = [...data];
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
    let columns = Object.keys(columsMapping);
    columns = columns.filter(column => dataToExport.some(item => item[column]));
  
    // Prepare rows data (reverse each row and handle Hebrew text)
    let rows = dataToExport.map(item =>
      columns.map(column => {
        const value = item[column];
        return value ? fixEn(value,column) : '';
      
      }).reverse() // Reverse the row for proper RTL alignment
    );
columns= columns.map(column => columsMapping[column]);
    
    // Generate the table with RTL support
    doc.autoTable({
      head: [columns.reverse()], // Reverse column headers for RTL
      body: rows,
      startY: 20,
      styles: {
        font: 'ArialHebrew',
        fontSize: 10,
        cellPadding: 1,
        halign: 'right', // Right-align text
        overflow: 'linebreak',
      
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
      },
    });
    // console.log(dataToExport);
  
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





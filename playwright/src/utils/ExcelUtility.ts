import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

export interface TestData {
  [key: string]: string | number;
}

export class ExcelUtility {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  /**
   * Read data from an Excel file
   * @param sheetName - Name of the sheet to read from
   * @returns Array of objects containing the data
   */
  readExcelFile(sheetName: string = 'Sheet1'): TestData[] {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`Excel file not found at: ${this.filePath}`);
    }

    const workbook = xlsx.readFile(this.filePath);
    
    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found in Excel file`);
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    return data as TestData[];
  }

  /**
   * Read all sheets from an Excel file
   * @returns Object with sheet names as keys and data arrays as values
   */
  readAllSheets(): { [sheetName: string]: TestData[] } {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`Excel file not found at: ${this.filePath}`);
    }

    const workbook = xlsx.readFile(this.filePath);
    const allData: { [sheetName: string]: TestData[] } = {};

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      allData[sheetName] = xlsx.utils.sheet_to_json(worksheet) as TestData[];
    });

    return allData;
  }

  /**
   * Write data to an Excel file
   * @param data - Array of objects to write
   * @param sheetName - Name of the sheet to write to
   */
  writeExcelFile(data: TestData[], sheetName: string = 'Sheet1'): void {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    xlsx.writeFile(workbook, this.filePath);
  }

  /**
   * Get specific row data from Excel
   * @param sheetName - Name of the sheet
   * @param rowIndex - Index of the row (0-based)
   */
  getRowData(sheetName: string, rowIndex: number): TestData | null {
    const data = this.readExcelFile(sheetName);
    return data[rowIndex] || null;
  }

  /**
   * Get all values of a specific column
   * @param sheetName - Name of the sheet
   * @param columnName - Name of the column
   */
  getColumnData(sheetName: string, columnName: string): (string | number)[] {
    const data = this.readExcelFile(sheetName);
    return data.map((row) => row[columnName]).filter((value) => value !== undefined);
  }
}

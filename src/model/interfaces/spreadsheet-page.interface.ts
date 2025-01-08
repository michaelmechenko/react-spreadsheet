import { ICell } from "./cell.interface";

// Represents a page of a spreadsheet that contains a 2D array of cells and has a name
export interface ISpreadsheetPage {
  // Gets a cell from the spreadsheet page given a string reference
  getCellFromReference(cellReference: string): ICell;

  // Sets a new value to a cell at the given reference point
  // and updates the display accordingly.
  setValue(cellReference: string, value: string): void;

  // Adds a new row to the spreadsheet page at the given index
  addRow(index: number): void;

  getValueAtCell(cellReference: string): string;

  // Adds a new column to the spreadsheet page at the given index
  addColumn(index: number): void;

  // Removes the row of the spreadsheet page at the given index
  removeRow(index: number): void;

  // Removes the column of the spreadsheet page at the given index
  removeColumn(index: number): void;

  // Returns the number of rows in the spreadsheet page
  getNumRows(): number;

  // Returns the number of columns in the spreadsheet page
  getNumCols(): number;

  // Returns the name of the spreadsheet page
  getSheetName(): string;

    // Sets the spreadsheet page name to the given name
    setSheetName(newName: string): void;

    // Retrieves the data from this spreadsheet page
    getData(): string[][];
}

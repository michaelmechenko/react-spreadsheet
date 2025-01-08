import { Expressions } from "../../expressions/expression-enums.model";
import { ICell } from "../interfaces/cell.interface";
import { ISpreadsheetPage } from "../interfaces/spreadsheet-page.interface";
import { SpreadsheetCellModel } from "./cells/spreadsheet-cell.model";

/**
 * Represents the Spreadsheet Page of the spreadsheet application.
 * Every page is first initialized as a 15x15 matrix
 */
export class SpreadSheetPageModel implements ISpreadsheetPage {
  private _sheetName: string;
  private sheet: SpreadsheetCellModel[][];

  // Instantiates spreadsheet page that defaults to a 12x12 page
  public constructor(
    name: string = "",
    rows: number = 12,
    cols: number = 12,
    data?: string[][]
  ) {
    this._sheetName = name;
    this.sheet = [];

    for (let row: number = 0; row < rows; row++) {
      this.sheet[row] = [];
      for (let col: number = 0; col < cols; col++) {
        if (data === undefined) {
          this.sheet[row][col] = new SpreadsheetCellModel();
        } else {
          let cell: SpreadsheetCellModel = new SpreadsheetCellModel();
          cell.setBuffer(data[row][col]);
          this.sheet[row][col] = cell;
        }
      }
    }
  }

  // Returns number of rows in spreadsheet page
  public getNumRows(): number {
    return this.sheet.length;
  }

  // Returns number of columns in spreadsheet page
  public getNumCols(): number {
    return this.sheet[0].length;
  }

  // Returns the name of this spreadsheet page
  public getSheetName(): string {
    return this._sheetName;
  }

  // Sets the name of this spreadsheet to be the given name
  public setSheetName(newName: string) {
    this._sheetName = newName;
  }

  // Gets the display value of a cell given the reference string
  public getValueAtCell(cellReference: string): string {
    const cell = this.getCellFromReference(cellReference);
    return cell.getDisplay();
  }

  // Returns the buffer value of this cell
  public getCellBuffer(cellReference: string): string {
    const cell = this.getCellFromReference(cellReference);
    return cell.getBuffer();
  }

  /**
   * sets the buffer of the given cell reference to the value
   * does a check to see if the value is an expression which is indicated by '='
   * Adds a dependency between the given cells
   * Throws an error if a cycle would be created by the new dependency and does not add the dependency
   * @param fromCell : cell to add a dependency
   * @param toCell : dependency cell
   */
  private addDependency(fromCell: string, toCell: string): void {
    if (this.validDependency(fromCell, toCell)) {
      this.getCellFromReference(fromCell).addDependency(toCell);
    } else {
        this.setValue(fromCell, '!ERR')
    }
  }

  // Checks if a dependency between the given cells is valid
  // A dependency is valid is no cycle is created by the dependency
  private validDependency(fromCell: string, toCell: string) {
    if (
      this.getCellFromReference(toCell).getDependencies().includes(fromCell)
    ) {
      return false;
    }
    this.getCellFromReference(fromCell)
      .getDependencies()
      .forEach((dependency) => {
        return this.validDependency(dependency, toCell);
      });

    return true;
  }

  /**
   * Sets the user's input (buffer) to the desired cell.
   * This undergoes a lot of logic and regex checks to correctly evaluate the
   * buffer that is given.
   * This method is the only way for the desired cell's display value to be changed.
   * @param cellReference : string reference of a cell (A1)
   * @param buffer : string to be read and parsed
   */
  public setValue(cellReference: string, buffer: string): void {
    const cell = this.getCellFromReference(cellReference);
    let expression = "";
    // logic if buffer is an expression (starts with '=')
    if (buffer.startsWith("=", 0)) {
      try {
        expression = this.evaluateExpression(
          cellReference,
          buffer.substring(1)
        );
        cell.setBuffer(buffer, expression);
      } catch (error) {
        cell.setBuffer('!ERR');
      }
    } else {
      cell.setBuffer(buffer);
    }

    this.updateReferences(cell);
  }

  // Updates the cells that reference the given cell
  private updateReferences(cell: ICell): void {
    if (cell.getDependencies().length === 0) {
      return;
    } else {
      cell.getDependencies().forEach((c) => {
        this.updateReferenceHelper(c, this.getCellBuffer(c));
        const d = this.getCellFromReference(c);
        this.updateReferences(d);
      });
    }
  }

  private updateReferenceHelper(cellReference: string, buffer: string) {
    const cell = this.getCellFromReference(cellReference);
    let expression = "";
    // logic if buffer is an expression (starts with '=')
    if (buffer.startsWith("=", 0)) {
      try {
        expression = this.evaluateExpression(cellReference, buffer.substring(1));
        cell.setBuffer(buffer, expression);
      } catch (error) {
        throw new Error(`Invalid Expression ${error}`);
      }
    } else {
      cell.setBuffer(buffer);
    }
  }

  // Parses a string reference to get the correct cell from spreadsheet page
  // Returns the cell object given the cell reference
  public getCellFromReference(cellReference: string): SpreadsheetCellModel {
    const colArr = cellReference.match(/[A-Z]+/i);
    const rowArr = cellReference.match(/\d+/);

    if (colArr == null || rowArr == null) {
      throw new Error("Invalid row or col reference given");
    }
    const colChars = colArr[0];
    const rowChars = rowArr[0];
    let col = this.getColumnIndex(colChars);

    const row = parseInt(rowChars) - 1;

    if (col > this.getNumCols() || row > this.getNumRows()) {
      throw new Error("Reference out of bounds!");
    }

    return this.sheet[row][col];
  }

  // Returns the cell at a given row and column
  // Should be able to use getters and setters on the returned cell??
  public getCellAtRowCol(row: number, col: number): SpreadsheetCellModel {
    return this.sheet[row][col];
  }

  // Adds a row to the spreadsheet page below the given row index
  public addRow(index: number): void {
    if (index < 0) {
      throw new Error("Invalid row index");
    }
    if (index > this.sheet[0].length) {
      index = this.sheet[0].length;
    }

    const newRow: SpreadsheetCellModel[] = [];
    for (let col = 0; col < this.sheet[0].length; col++) {
      newRow[col] = new SpreadsheetCellModel();
    }

    this.sheet.splice(index, 0, newRow);

    this.shiftDependenciesDown(index);
  }

  // shifts all dependencies within the spreadsheet down that are affected
  // by adding a row at the given index
  // Also updates the buffers of every cell that refers to a changed cell to the correct reference
  private shiftDependenciesDown(index: number) {
    for (let row = 0; row < this.getNumRows(); row++) {
      for (let col = 0; col < this.getNumCols(); col++) {
        const currentBuffer = this.sheet[row][col].getBuffer();

        let newBuffer: string = this.shiftBuffer(currentBuffer, "down", index);
        this.updateReferenceHelper(`${this.getColumnName(col)}${row + 1}`, newBuffer);

        this.sheet[row][col].shiftCellDependencies(1, 0, index, -1);
      }
    }
  }

  // shifts all dependencies within the spreadsheet up that are
  // affected by removing a row at the given index
  // Also updates the buffers of every cell that refers to a changed cell to the correct reference
  private shiftDependenciesUp(index: number) {
    for (let row = 0; row < this.getNumRows(); row++) {
      for (let col = 0; col < this.getNumCols(); col++) {
        const currentBuffer = this.sheet[row][col].getBuffer();

        let newBuffer: string = this.shiftBuffer(currentBuffer, "up", index);
        this.updateReferenceHelper(`${this.getColumnName(col)}${row + 1}`, newBuffer);

        this.sheet[row][col].shiftCellDependencies(-1, 0, index, -1);
      }
    }
  }

  // shifts right all dependencies within the spreadsheet page that are affected
  // by adding a column at the given index
  // Also updates the buffers of every cell that refers to a changed cell to the correct reference
  private shiftDependenciesRight(index: number) {
    for (let row = 0; row < this.getNumRows(); row++) {
      for (let col = 0; col < this.getNumCols(); col++) {
        const currentBuffer = this.sheet[row][col].getBuffer();

        let newBuffer: string = this.shiftBuffer(currentBuffer, "right", index);
        this.updateReferenceHelper(`${this.getColumnName(col)}${row + 1}`, newBuffer);

        this.sheet[row][col].shiftCellDependencies(0, 1, -1, index);
      }
    }
  }

  // shifts left all dependencies within the spreadsheet page that are
  // affected by removing a column at the given index
  // Also updates the buffers of every cell that refers to a changed cell to the correct reference
  private shiftDependenciesLeft(index: number) {
    for (let row = 0; row < this.getNumRows(); row++) {
      for (let col = 0; col < this.getNumCols(); col++) {
        const currentBuffer = this.sheet[row][col].getBuffer();

        let newBuffer: string = this.shiftBuffer(currentBuffer, "left", index);
        this.updateReferenceHelper(`${this.getColumnName(col)}${row + 1}`, newBuffer);

        this.sheet[row][col].shiftCellDependencies(0, -1, -1, index);
      }
    }
  }

  // Adds a column to the spreadsheet page to the right of the given column index
  public addColumn(index: number): void {
    if (index < 0) {
      throw new Error("Invalid column index");
    }
    if (index > this.sheet[0].length) {
      index = this.sheet[0].length;
    }

    for (let row = 0; row < this.sheet.length; row++) {
      this.sheet[row].splice(index, 0, new SpreadsheetCellModel());
    }

    this.shiftDependenciesRight(index);
  }

  // Removes the row of the spreadsheet page at the given row index
  public removeRow(index: number): void {
    if (index < 0 || index >= this.sheet.length) {
      throw new Error("Invalid row index");
    }

    this.sheet.splice(index, 1);

    this.shiftDependenciesUp(index);
  }

  // Removes the column of the spreadsheet page at the given column index
  public removeColumn(index: number): void {
    if (index < 0 || index >= this.sheet[0].length) {
      throw new Error("Invalid column index");
    }

    for (let row = 0; row < this.sheet.length; row++) {
      this.sheet[row].splice(index, 1);
    }

    this.shiftDependenciesLeft(index);
  }

  // Replaces the range or reference function if found in the expression with the actual number
  // Evaluates the given reference expression at the given originCell
  private evaluateExpression(originCell: string, input: string): string {
    try {
      while (input.includes(Expressions.REF)) {
        input = this.evaluateRefExpressions(originCell, input);
      }

      while (input.includes(Expressions.SUM)) {
        input = this.evaluateSumExpressions(originCell, input);
      }

      while (input.includes(Expressions.AVG)) {
        input = this.evaluateAvgExpressions(originCell, input);
      }

      return input;
    } catch (error) {
    //   console.warn(`Failed to replace expressions ${error}`);
      return '!ERR'
    }
  }

  // replaces any 'REF(x)' found using regex with the correct cell display
  // Parses through the reference expression, adding a dependency and reformatting
  // the expression to be evaluated
  private evaluateRefExpressions(originCell: string, input: string): string {
    const refRegex = /REF\(([^)]+)\)/g;
    return input.replace(refRegex, (_, cellReference) => {
      this.addDependency(cellReference, originCell);
      return this.getCellFromReference(cellReference).getDisplay();
    });
  }

  // replaces any 'SUM(A1:A3)' found using regex with the correct sum
  // Parses through the sum expression,
  // reformatting the expression to be evaluated
  private evaluateSumExpressions(originCell: string, input: string): string {
    const sumRegex = /SUM\(([^)]+)\)/g;
    return input.replace(sumRegex, (_, range) =>
      this.sumCells(originCell, range)
    );
  }

  // replaces any 'AVG(A1:A3)' found using regex with the correct average
  // Parses through the average expression,
  // reformatting the expression to be evaluated
  private evaluateAvgExpressions(originCell: string, input: string): string {
    const avgRegex = /AVG\(([^)]+)\)/g;
    return input.replace(avgRegex, (_, range) =>
      this.averageCells(originCell, range)
    );
  }

  // Evaluates the sum of a range or group of cells
  private sumCells(originCell: string, range: string): string {
    let sum: number = 0;
    let cellRange: string[] = [];

    // regex to match expressions using colon for cell range
    if (range.match("^[^:]+:[^:]+$")) {
      const [startCell, endCell] = range.split(":");
      cellRange = this.getRangeOfCells(startCell, endCell);
      // regex to match expressions using comma
    } else if (range.match("^[A-Za-z]\\d+(,\\s?[A-Za-z]\\d+)*$")) {
      cellRange = range.split(",");
    } else {
      throw new Error(`Syntax for reference is not correct. ${range}`);
    }

    for (let cell of cellRange) {
      this.addDependency(cell, originCell);

      let cellVal = Number(this.getCellFromReference(cell).getDisplay());
      if (Number.isNaN(cellVal)) {
        // console.warn("Cell is not a Number");
        return '!ERR'
      } else {
        sum += cellVal;
      }
    }

    return sum.toString();
  }

  // Finds all cells that was given in the range and returns the average of all cell values
  // Evaluates the average of a range or group of cells
  private averageCells(originCell: string, range: string): string {
    let sum: number = 0;
    let cellRange: string[] = [];

    // regex to match expressions using colon for cell range
    if (range.match("^[^:]+:[^:]+$")) {
      const [startCell, endCell] = range.split(":");
      cellRange = this.getRangeOfCells(startCell, endCell);
      // regex to match expressions using comma
    } else if (range.match("^[A-Za-z]\\d+(,\\s?[A-Za-z]\\d+)*$")) {
      cellRange = range.split(",");
    } else {
      throw new Error(`Syntax for reference is not correct. ${range}`);
    }

    let count = cellRange.length;

    for (let cell of cellRange) {
      this.addDependency(cell, originCell);

      let cellVal = Number(this.getCellFromReference(cell).getDisplay());
      if (Number.isNaN(cellVal)) {
        throw new Error("Cell is not a Number");
      } else {
        sum += cellVal;
      }
    }

    let average = sum / count;
    return average.toString();
  }

  // Returns a list of cells that contains all cells that are represented by a range of cells (A1, C2)

  // Gets all the cells within a range given the start and end of the range
  private getRangeOfCells(startCell: string, endCell: string): string[] {
    let cells: string[] = [];

    const startCol = startCell.match(/[A-Z]+/i)![0];
    const startRow = startCell.match(/\d+/)![0];
    const endCol = endCell.match(/[A-Z]+/i)![0];
    const endRow = endCell.match(/\d+/)![0];

    let startColIdx = this.getColumnIndex(startCol);
    let endColIdx = this.getColumnIndex(endCol);

    const startRowIdx = parseInt(startRow);
    const endRowIdx = parseInt(endRow);

    for (let i = startRowIdx; i <= endRowIdx; i++) {
      for (let j = startColIdx; j <= endColIdx; j++) {
        cells.push(this.getColumnName(j) + i);
      }
    }
    return cells;
  }

  // returns the column name (uppercase alphabetical) given the column index
  // Gets the character code for a column given the index
  private getColumnName(columnNumber: number): string {
    let columnName = "";
    while (columnNumber >= 0) {
      columnName = String.fromCharCode((columnNumber % 26) + 65) + columnName;
      columnNumber = Math.floor(columnNumber / 26) - 1;
    }
    return columnName;
  }

  // returns the column index given the column name (uppercase alphabetical)
  private getColumnIndex(column: string): number {
    let colIndex = -1;
    for (let i = 0; i < column.length; i++) {
      colIndex +=
        (column[i].charCodeAt(0) - "A".charCodeAt(0) + 1) *
        Math.pow(26, column.length - i - 1);
    }
    return colIndex;
  }

  private shiftBuffer(buffer: string, option: string, index: number): string {
    // Regular expression to match cell references like "AA2" or "AA18"
    const cellReferenceRegex = /[A-Z]+[0-9]+/g;

    // Check if currentBuffer contains any cell references
    const matches = buffer.match(cellReferenceRegex);

    let updatedBuffer = buffer;

    if (matches) {
      // Update the buffer for each matching cell reference
      if (option === 'down') {
        matches.sort((a, b) => {
            const rowA = parseInt(a.match(/\d+/)![0]);
            const rowB = parseInt(b.match(/\d+/)![0]);
          
            return rowB - rowA;
          });
      } else if (option === 'up') {
        matches.sort((a, b) => {
            const rowA = parseInt(a.match(/\d+/)![0]);
            const rowB = parseInt(b.match(/\d+/)![0]);
          
            return rowA - rowB;
          });
      } else if (option === 'right') {
        matches.sort((a, b) => {
            const colA = a.match(/[A-Z]+/i)![0];
            const colB = b.match(/[A-Z]+/i)![0];
            const colAIdx = this.getColumnIndex(colA);
            const colBIdx = this.getColumnIndex(colB);
          
            return colBIdx - colAIdx;
          });
      } else if (option === 'left') {
        matches.sort((a, b) => {
            const colA = a.match(/[A-Z]+/i)![0];
            const colB = b.match(/[A-Z]+/i)![0];
            const colAIdx = this.getColumnIndex(colA);
            const colBIdx = this.getColumnIndex(colB);
          
            return colAIdx - colBIdx;
          });
      }
      matches.forEach((cellReference) => {
        const colChars = cellReference.match(/[A-Z]+/i)![0];
        const rowStr = cellReference.match(/\d+/)![0]
        const cellRow = parseInt(rowStr) || 0;
        const colIndex = this.getColumnIndex(colChars) + 1;

        if (option === "down") {
          if (cellRow > index) {
            // Replace the row value in the cell reference with (cellRow + 1)
            updatedBuffer = updatedBuffer.replace(
                cellReference,
                `${colChars}${cellRow + 1}`
              );
          }
        } else if (option === "up") {
          if (cellRow > index) {
            // Replace the row value in the cell reference with (cellRow - 1)
            updatedBuffer = updatedBuffer.replace(
              cellReference,
              `${colChars}${cellRow - 1}`
            );
          }
        } else if (option === "right") {
          if (colIndex > index) {
            // Replace the col value in the cell reference with (col + 1)
            updatedBuffer = updatedBuffer.replace(
              cellReference,
              `${this.getColumnName(
                this.getColumnIndex(colChars) + 1
              )}${cellRow}`
            );
          }
        } else if (option === "left") {
          if (colIndex > index) {
            // Replace the col value in the cell reference with (col - 1)
            updatedBuffer = updatedBuffer.replace(
              cellReference,
              `${this.getColumnName(
                this.getColumnIndex(colChars) - 1
              )}${cellRow}`
            );
          }
        }
      });
    }

    return updatedBuffer;
  }

  // returns a 2D array with only the buffers of every cell in the sheet
  public getData(): string[][] {
    const output: string[][] = [];

    for (let r = 0; r < this.getNumRows(); r++) {
      const row: string[] = [];
      for (let c = 0; c < this.getNumCols(); c++) {
        row.push(this.sheet[r][c].getBuffer());
      }
      output.push(row);
    }

    return output;
  }
}

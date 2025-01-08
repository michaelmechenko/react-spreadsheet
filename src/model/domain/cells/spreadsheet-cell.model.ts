import { ICell } from "../../interfaces/cell.interface";
import { CellText } from "./cell-text.model";
import { create, all } from "mathjs";

/**
 * 
 */
export class SpreadsheetCellModel implements ICell {
  private _buffer: string;
  private _display: string;
  private dependencies: Set<string>;
  private textVisual: CellText;

  public constructor() {
    this._buffer = "";
    this._display = "";
    this.dependencies = new Set<string>();
    this.textVisual = new CellText.Builder().build();
  }

  /**
   * Sets the buffer and display accordingly using the buffer and possible replacedBuffer inputs.
   * buffer is the real buffer inputted by the user
   * replacedBuffer is the buffer string with the replaced values which is needed to use mathjs
   * Sets the buffer of this spreadsheet cell to be the new given buffer value
   * If a replaceBuffer is given, it will evaluate the expression and set the
   * display to be the result of that expression. Otherwise the display will
   * match the buffer
   * @param buffer : the string buffer that was entered by the user
   * @param replacedBuffer : a possible buffer that has any cell reference expressions replaced 
   *                         with the actual value
   */
  public setBuffer(buffer: string, replacedBuffer?: string): void {
    this._buffer = buffer;

    if (replacedBuffer !== undefined) {
      try {
        const math = create(all, {});
        if (
          replacedBuffer.match(
            "^[a-zA-Z][a-zA-Z0-9]*(\\+[a-zA-Z][a-zA-Z0-9]*)*$"
          )
        ) {
          let stringToConcatArr: string[] = replacedBuffer.split("+");
          this._display = stringToConcatArr.join("");
        } else {
            const evaluatedBuffer = String(math.evaluate(replacedBuffer));
            if (evaluatedBuffer === 'undefined' || evaluatedBuffer ===' Infinity') {
                this._display = "!ERR"
            } else {
                this._display = evaluatedBuffer;
            }
          
        }
      } catch (error) {
        // console.warn(error);
        this._display = "!ERR";
      }
    } else {
      this._display = this._buffer;
    }
  }

  // Returns the buffer value of this spreadsheet cell
  public getBuffer(): string {
    return this._buffer;
  }

  // Returns the display value of this spreadsheet cell
  public getDisplay(): string {
    return this._display;
  }

  // Return the dependencies of this spreadsheet cell
  public getDependencies(): Array<string> {
    return Array.from(this.dependencies);
  }

  // Adds the given reference as a dependency to this spreadsheet cell
  public addDependency(r: string): void {
    this.dependencies.add(r);
  }

  // Removes the given reference from the dependencies of this spreadsheet cell
  public removeDependency(r: string): void {
    this.dependencies.delete(r);
  }

  // Shifts the dependencies of this cell up, left, down, or right depending on the inputs
  public shiftCellDependencies(
    down: number,
    right: number,
    rowIndex: number,
    colIndex: number
  ) {
    const newDependencies = new Set<string>();

    this.dependencies.forEach((dependency) => {
      const rowCol = this.getRowColFromReference(dependency);

      if (
        !(
          (rowCol[0] === rowIndex && down < 0) ||
          (rowCol[1] === colIndex && right < 0)
        )
      ) {
        if (
          (rowCol[0] >= rowIndex && down > 0) ||
          (rowCol[0] > rowIndex && down < 0)
        ) {
          rowCol[0] = rowCol[0] + down;
        } else if (
          (rowCol[1] >= colIndex && right > 0) ||
          (rowCol[1] > colIndex && right < 0)
        ) {
          rowCol[1] = rowCol[1] + right;
        }

        const newReference = this.getColumnName(rowCol[1]) + (rowCol[0] + 1);

        newDependencies.add(newReference);
      }
    });

    this.dependencies = newDependencies;
  }

  // Parses a string reference to get the correct cell from spreadsheet page
  private getRowColFromReference(cellReference: string): Array<number> {
    const col = cellReference.match(/[A-Z]+/i)![0];
    const row = cellReference.match(/\d+/)![0];
    const colIndex = this.getColumnIndex(col)
    const rowIndex = Number(row) - 1;

    return [rowIndex, colIndex];
  }

  // Get the character code for the column based on the given index
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

  // Clears the buffer and display values for this spreadsheet cell
  public clearCell(): void {
    this._buffer = "";
    this._display = "";
  }
}

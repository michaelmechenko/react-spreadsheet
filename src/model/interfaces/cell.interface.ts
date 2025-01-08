// Represents a single cell in spreadsheet page that has a buffer value, display value, and dependencies
export interface ICell {
  // Returns the value displayed by the cell (evaluated version of buffer)
  getDisplay(): string;

  // Sets a new buffer to the cell
  setBuffer(buffer: string, replacedBuffer?: string): void;
  // Returns the buffer value of the cell
  getBuffer(): string;

  // Clears the cell and all of its attributes except for dependencies
  clearCell(): void;
  // Returns a list of cell references that depend on this cell's value
  getDependencies(): Array<string>;
  // Adds a new dependency to this cell
  addDependency(r: string): void;
  // Removes an existing dependency from this cell
  removeDependency(r: string): void;
  // Adjusts the cell's dependencies when a transformation is made
  shiftCellDependencies(
    down: number,
    right: number,
    rowIndex: number,
    colIndex: number
  ): void;
}

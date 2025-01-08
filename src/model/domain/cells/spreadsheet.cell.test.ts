import { ICell } from "../../interfaces/cell.interface";
import { SpreadsheetCellModel } from "./spreadsheet-cell.model";

describe("tests for spreadsheet cells", (): void => {
  // beforeEach((): void => {
  //     spreadsheetCell = new SpreadsheetCell();
  // })

  it("creating a spreadSheet Cell has an empty buffer", (): void => {
    let spreadsheetCell: SpreadsheetCellModel;

    spreadsheetCell = new SpreadsheetCellModel();

    // expect(spreadsheetCell.getBuffer()).toBe('');
    expect(spreadsheetCell.getDisplay()).toBe("");
  });

  it("tests updating the spreadsheet value", (): void => {
    const spreadsheetCell: SpreadsheetCellModel = new SpreadsheetCellModel();

    spreadsheetCell.setBuffer("hello");

    expect(spreadsheetCell.getBuffer()).toBe("hello");
  });

  it("tests clearing a cell", (): void => {
    const spreadsheetCell: ICell = new SpreadsheetCellModel();
    spreadsheetCell.setBuffer("hello");

    spreadsheetCell.clearCell();

    expect(spreadsheetCell.getBuffer()).toBe("");
    expect(spreadsheetCell.getDisplay()).toBe("");
  });

  it("tests adding dependencies to this cell", (): void => {
    const spreadsheetCell: ICell = new SpreadsheetCellModel();

    spreadsheetCell.addDependency("A1");
    spreadsheetCell.addDependency("A2");

    expect(spreadsheetCell.getDependencies()).toStrictEqual(["A1", "A2"]);
  });
});

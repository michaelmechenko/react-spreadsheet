import { SpreadSheetPageModel } from "./spreadsheet-page.model";

describe("SpreadsheetPage", (): void => {
  let spreadsheetPage: SpreadSheetPageModel;

  beforeEach((): void => {
    spreadsheetPage = new SpreadSheetPageModel("test", 27, 27);
  });

  it("should contain a SpreadsheetPage class that implements ISpreadsheetPage", (): void => {
    expect(spreadsheetPage).toBeDefined();
  });

  it("should contain a SpreadsheetPage class that implements ISpreadsheetPage with test as the name", (): void => {
    expect(spreadsheetPage.getSheetName()).toBe("test");
  });

  it("should contain a SpreadsheetPage class that has 27 rows", (): void => {
    expect(spreadsheetPage.getNumRows()).toBe(27);
  });

  it("should contain a SpreadsheetPage class that has 27 columns", (): void => {
    expect(spreadsheetPage.getNumCols()).toBe(27);
  });

  it("should instantiate a cell with empty string", (): void => {
    expect(spreadsheetPage.getValueAtCell("A1")).toEqual("");
  });

  it("should set a cell to a string value", (): void => {
    spreadsheetPage.setValue("A1", "Foo");
    expect(spreadsheetPage.getValueAtCell("A1")).toEqual("Foo");
  });

  it("should set a cell to a arithemetic expression", (): void => {
    spreadsheetPage.setValue("A2", "=1+2");
    expect(spreadsheetPage.getValueAtCell("A2")).toEqual("3");
  });

  it("should set a cell to a string since a mixed input is given", (): void => {
    spreadsheetPage.setValue("A2", "1+2A");
    expect(spreadsheetPage.getValueAtCell("A2")).toEqual("1+2A");
  });

  it("should set a cell to a string using string concatenation", (): void => {
    spreadsheetPage.setValue("A2", "=abc+def");
    expect(spreadsheetPage.getValueAtCell("A2")).toEqual("abcdef");
  });

  it("should set a cell to a string using string concatenation with string-number inputs", (): void => {
    spreadsheetPage.setValue("A2", "=abc1+def2");
    expect(spreadsheetPage.getValueAtCell("A2")).toEqual("abc1def2");
  });

  it("should set a cell to 5 when REFerring to a cell with 5", (): void => {
    spreadsheetPage.setValue("A1", "5");
    spreadsheetPage.setValue("A2", "=REF(A1)");
    expect(spreadsheetPage.getValueAtCell("A2")).toEqual("5");
  });

  it("should set a cell to 20 when it is a SUM of 4 cells with 5 using a comma seperator", (): void => {
    spreadsheetPage.setValue("A1", "5");
    spreadsheetPage.setValue("A2", "5");
    spreadsheetPage.setValue("A3", "5");
    spreadsheetPage.setValue("A4", "5");
    spreadsheetPage.setValue("A5", "=SUM(A1,A2,A3,A4)");
    expect(spreadsheetPage.getValueAtCell("A5")).toEqual("20");
  });

  it("should set a cell to 20 when it is a SUM of 4 cells with 5 using a colon seperator", (): void => {
    spreadsheetPage.setValue("A1", "5");
    spreadsheetPage.setValue("A2", "5");
    spreadsheetPage.setValue("A3", "5");
    spreadsheetPage.setValue("A4", "5");
    spreadsheetPage.setValue("A5", "=SUM(A1:A4)");
    expect(spreadsheetPage.getValueAtCell("A5")).toEqual("20");
  });

  it("should set a cell to 20 when it is a SUM of 4 cells  with 5 in a square using a colon seperator", (): void => {
    spreadsheetPage.setValue("A1", "5");
    spreadsheetPage.setValue("A2", "5");
    spreadsheetPage.setValue("B1", "5");
    spreadsheetPage.setValue("B2", "5");
    spreadsheetPage.setValue("A3", "=SUM(A1:B2)");
    expect(spreadsheetPage.getValueAtCell("A3")).toEqual("20");
  });

  it("should set a cell to 5 when it is the AVG of 3 cells with a sum of 15", (): void => {
    spreadsheetPage.setValue("A1", "5");
    spreadsheetPage.setValue("A2", "9");
    spreadsheetPage.setValue("A3", "1");
    spreadsheetPage.setValue("A5", "=AVG(A1,A2,A3)");
    expect(spreadsheetPage.getValueAtCell("A5")).toEqual("5");
  });

  it("should set a cell to 6 when it is the AVG of 4 cells with a sum of 24", (): void => {
    spreadsheetPage.setValue("A1", "5");
    spreadsheetPage.setValue("A2", "4");
    spreadsheetPage.setValue("A3", "7");
    spreadsheetPage.setValue("A4", "8");
    spreadsheetPage.setValue("A5", "=AVG(A1:A4)");
    expect(spreadsheetPage.getValueAtCell("A5")).toEqual("6");
  });

  it("should set a cell to 6 when it is the AVG of 4 cells in a square with a sum of 24", (): void => {
    spreadsheetPage.setValue("A1", "5");
    spreadsheetPage.setValue("A2", "4");
    spreadsheetPage.setValue("B1", "7");
    spreadsheetPage.setValue("B2", "8");
    spreadsheetPage.setValue("A3", "=AVG(A1:B2)");
    expect(spreadsheetPage.getValueAtCell("A3")).toEqual("6");
  });

  it("should set foo to AA11 which has multi-character row and column reference", (): void => {
    spreadsheetPage.setValue("AA11", "foo");
    expect(spreadsheetPage.getValueAtCell("AA11")).toEqual("foo");
  });

  it("should contain a spreadsheet with 28 rows after a row is added at index 0", (): void => {
    spreadsheetPage.addRow(0);
    expect(spreadsheetPage.getNumRows()).toBe(28);
  });

  it("should throw error when trying to add row at index less than 0", (): void => {
    expect(() => spreadsheetPage.addRow(-1)).toThrow("Invalid row index");
  });

  // it("should throw error when trying to add row at index larger than spreadsheet size", (): void => {
  //   expect(() =>
  //     spreadsheetPage.addRow(spreadsheetPage.getNumRows() + 1)
  //   ).toThrow("Invalid row index");
  // });

  it("should contain a spreadsheet with 29 rows after a row is added at index 0 and index 10", (): void => {
    spreadsheetPage.addRow(0);
    spreadsheetPage.addRow(10);

    expect(spreadsheetPage.getNumRows()).toBe(29);
  });

  it("should create new cells in spreadsheet with empty values when new row is added", (): void => {
    spreadsheetPage.addRow(9);

    expect(spreadsheetPage.getNumRows()).toBe(28);
  });

  it("should properly adjust values when a row is added ", () => {
    spreadsheetPage.setValue("A1", "1");
    spreadsheetPage.setValue("A2", "2");

    spreadsheetPage.addRow(1);

    expect(spreadsheetPage.getValueAtCell("A1")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("A2")).toBe("");
    expect(spreadsheetPage.getValueAtCell("A3")).toBe("2");
  });

  it("should properly adjust dependencies when a row is added", () => {
    spreadsheetPage.setValue("A2", "2");
    spreadsheetPage.setValue("A1", "=REF(A2)");

    spreadsheetPage.addRow(1);

    expect(spreadsheetPage.getValueAtCell("A1")).toBe("2");
    expect(spreadsheetPage.getValueAtCell("A2")).toBe("");
    expect(spreadsheetPage.getValueAtCell("A3")).toBe("2");
  });

  it("should properly adjust and update dependencies when a row is added", () => {
    spreadsheetPage.setValue("A1", "2");
    spreadsheetPage.setValue("A3", "=REF(A1)");
    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["A3"]);

    spreadsheetPage.addRow(1);

    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["A4"]);
  });

  it("should properly adjust dependencies when a row is removed", () => {
    spreadsheetPage.setValue("A1", "2");
    spreadsheetPage.setValue("A3", "=REF(A1)");
    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["A3"]);

    spreadsheetPage.removeRow(1);

    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["A2"]);
  });

  it("should properly adjust dependencies when a column is removed", () => {
    spreadsheetPage.setValue("A1", "2");
    spreadsheetPage.setValue("C1", "=REF(A1)");
    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["C1"]);

    spreadsheetPage.removeColumn(1);

    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["B1"]);
  });

  it("should properly adjust dependencies when a column is added", () => {
    spreadsheetPage.setValue("A1", "2");
    spreadsheetPage.setValue("C1", "=REF(A1)");
    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["C1"]);

    spreadsheetPage.addColumn(1);

    expect(
      spreadsheetPage.getCellFromReference("A1").getDependencies()
    ).toStrictEqual(["D1"]);
  });

  it("should update cells that reference another cell when that cell is changed", () => {
    spreadsheetPage.setValue("A1", "2");
    spreadsheetPage.setValue("C1", "=REF(A1)");
    expect(spreadsheetPage.getCellFromReference("C1").getDisplay()).toBe("2");

    spreadsheetPage.setValue("A1", "5");

    expect(spreadsheetPage.getCellFromReference("A1").getDisplay()).toBe("5");
    expect(spreadsheetPage.getCellFromReference("C1").getDisplay()).toBe("5");
  });

  it("should update cells that reference another cell when that cell is changed 2", () => {
    spreadsheetPage.setValue("A1", "2");
    spreadsheetPage.setValue("C1", "=REF(A1)");
    spreadsheetPage.setValue("C3", "=REF(C1)");

    expect(spreadsheetPage.getCellFromReference("C1").getDisplay()).toBe("2");
    expect(spreadsheetPage.getCellFromReference("C3").getDisplay()).toBe("2");

    spreadsheetPage.setValue("A1", "5");

    expect(spreadsheetPage.getCellFromReference("A1").getDisplay()).toBe("5");
    expect(spreadsheetPage.getCellFromReference("C1").getDisplay()).toBe("5");
    expect(spreadsheetPage.getCellFromReference("C3").getDisplay()).toBe("5");
  });

  //   it("should throw an error when user tries to reference one a cell that references the current cell already", () => {
  //     spreadsheetPage.setValue("A1", "=REF(A2)");
  //     spreadsheetPage.setValue("A2", "=REF(A1)");

  //     expect(spreadsheetPage.getValueAtCell("A1")).toBe("!ERR")
  //   });

  //   it("should throw an error when a reference cycle is created", () => {
  //     spreadsheetPage.setValue("A1", "=REF(A2)");
  //     spreadsheetPage.setValue("A2", "=REF(A3)");
  //     spreadsheetPage.setValue("A3", "=REF(A4)");
  //     spreadsheetPage.setValue("A4", "=REF(A1)");

  //     expect(spreadsheetPage.getValueAtCell("A1")).toBe("!ERR")
  //   });

  it("should correctly add a row in the beginning and move cells", () => {
    spreadsheetPage.setValue("A1", "1");
    spreadsheetPage.setValue("B1", "2");
    spreadsheetPage.setValue("C1", "3");
    spreadsheetPage.setValue("D1", "4");
    spreadsheetPage.setValue("E1", "5");

    spreadsheetPage.addRow(0);

    expect(spreadsheetPage.getValueAtCell("A1")).toBe("");
    expect(spreadsheetPage.getValueAtCell("B1")).toBe("");
    expect(spreadsheetPage.getValueAtCell("C1")).toBe("");
    expect(spreadsheetPage.getValueAtCell("D1")).toBe("");
    expect(spreadsheetPage.getValueAtCell("E1")).toBe("");

    expect(spreadsheetPage.getValueAtCell("A2")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("B2")).toBe("2");
    expect(spreadsheetPage.getValueAtCell("C2")).toBe("3");
    expect(spreadsheetPage.getValueAtCell("D2")).toBe("4");
    expect(spreadsheetPage.getValueAtCell("E2")).toBe("5");
  });

  it("should correctly add a row in the beginning and rereference buffers", () => {
    spreadsheetPage.setValue("A1", "1");
    spreadsheetPage.setValue("B1", "=REF(A1)");
    spreadsheetPage.setValue("C1", "=SUM(A1:B1)");
    spreadsheetPage.setValue("D1", "=AVG(A1,B1,C1)");
    spreadsheetPage.setValue("E1", "=4+7");

    expect(spreadsheetPage.getValueAtCell("A1")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("B1")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("C1")).toBe("2");
    expect(spreadsheetPage.getValueAtCell("D1")).toEqual(String(4 / 3));
    expect(spreadsheetPage.getValueAtCell("E1")).toBe("11");

    spreadsheetPage.addRow(0);

    expect(spreadsheetPage.getCellBuffer("A2")).toBe("1");
    expect(spreadsheetPage.getCellBuffer("B2")).toBe("=REF(A2)");
    expect(spreadsheetPage.getCellBuffer("C2")).toBe("=SUM(A2:B2)");
    expect(spreadsheetPage.getCellBuffer("D2")).toBe("=AVG(A2,B2,C2)");
    expect(spreadsheetPage.getCellBuffer("E2")).toBe("=4+7");
  });

  it("should correctly add a column in the beginning and rereference buffers", () => {
    spreadsheetPage.setValue("A1", "1");
    spreadsheetPage.setValue("A2", "=REF(A1)");
    spreadsheetPage.setValue("A3", "=SUM(A1:A2)");
    spreadsheetPage.setValue("A4", "=AVG(A1,A2,A3)");
    spreadsheetPage.setValue("A5", "=4+7");

    expect(spreadsheetPage.getValueAtCell("A1")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("A2")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("A3")).toBe("2");
    expect(spreadsheetPage.getValueAtCell("A4")).toEqual(String(4 / 3));
    expect(spreadsheetPage.getValueAtCell("A5")).toBe("11");

    spreadsheetPage.addColumn(0);

    expect(spreadsheetPage.getCellBuffer("B1")).toBe("1");
    expect(spreadsheetPage.getCellBuffer("B2")).toBe("=REF(B1)");
    expect(spreadsheetPage.getCellBuffer("B3")).toBe("=SUM(B1:B2)");
    expect(spreadsheetPage.getCellBuffer("B4")).toBe("=AVG(B1,B2,B3)");
    expect(spreadsheetPage.getCellBuffer("B5")).toBe("=4+7");
  });

  it("should correctly add a column in the beginning and rereference buffers 2", () => {
    spreadsheetPage.setValue("A1", "1");
    spreadsheetPage.setValue("A2", "=REF(A1)");
    spreadsheetPage.setValue("A3", "=SUM(A1:A2)");
    spreadsheetPage.setValue("A4", "=AVG(A1,A2,A3)");
    spreadsheetPage.setValue("A5", "=4+7");

    expect(spreadsheetPage.getValueAtCell("A1")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("A2")).toBe("1");
    expect(spreadsheetPage.getValueAtCell("A3")).toBe("2");
    expect(spreadsheetPage.getValueAtCell("A4")).toEqual(String(4 / 3));
    expect(spreadsheetPage.getValueAtCell("A5")).toBe("11");

    spreadsheetPage.addColumn(0);

    expect(spreadsheetPage.getCellBuffer("B1")).toBe("1");
    expect(spreadsheetPage.getCellBuffer("B2")).toBe("=REF(B1)");
    expect(spreadsheetPage.getCellBuffer("B3")).toBe("=SUM(B1:B2)");
    expect(spreadsheetPage.getCellBuffer("B4")).toBe("=AVG(B1,B2,B3)");
    expect(spreadsheetPage.getCellBuffer("B5")).toBe("=4+7");
  });

  it("should correctly add a column in the beginning and rereference buffers when cells are in a square", () => {
    spreadsheetPage.setValue("A1", "3");
    spreadsheetPage.setValue("A2", "=REF(A1)");
    spreadsheetPage.setValue("B1", "=SUM(A1:A2)");
    spreadsheetPage.setValue("B2", "=AVG(A1,A2,B1)");

    expect(spreadsheetPage.getValueAtCell("A1")).toBe("3");
    expect(spreadsheetPage.getValueAtCell("A2")).toBe("3");
    expect(spreadsheetPage.getValueAtCell("B1")).toBe("6");
    expect(spreadsheetPage.getValueAtCell("B2")).toBe("4");

    spreadsheetPage.addRow(0);

    expect(spreadsheetPage.getCellBuffer("A2")).toBe("3");
    expect(spreadsheetPage.getCellBuffer("A3")).toBe("=REF(A2)");
    expect(spreadsheetPage.getCellBuffer("B2")).toBe("=SUM(A2:A3)");
    expect(spreadsheetPage.getCellBuffer("B3")).toBe("=AVG(A2,A3,B2)");
  });
});

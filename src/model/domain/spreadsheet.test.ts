import path from "path";
import SpreadsheetPage from "../../components/SpreadsheetPage.component";
import { ISpreadsheetPage } from "../interfaces/spreadsheet-page.interface";
import { ISpreadsheetModel } from "../interfaces/spreadsheet.interface";
import { SpreadSheetPageModel } from "./spreadsheet-page.model";
import { SpreadsheetModel } from "./spreadsheet.model";

describe("Spreadsheet Model", (): void => {
  let spreadSheet: ISpreadsheetModel;

  beforeEach((): void => {
    spreadSheet = new SpreadsheetModel();
  });

  it("should instantiate a new spreadsheet model", () => {
    expect(spreadSheet).toBeDefined();
  });

  it("should instantiate with a page called Page 1", () => {
    const currentPage: ISpreadsheetPage = new SpreadSheetPageModel("Page 1");

    expect(spreadSheet.getCurrentPage()).toStrictEqual(currentPage);
  });

  it("should export data to CSV", () => {
    spreadSheet.getCurrentPage().setValue("A1", "hello");
    spreadSheet.getCurrentPage().setValue("A2", "hi");
    spreadSheet.getCurrentPage().setValue("B1", "test");
    spreadSheet.getCurrentPage().setValue("B2", "testing");
    const spy: any = jest.spyOn(spreadSheet, "exportCurrentToCSV");

    spreadSheet.exportCurrentToCSV("export.csv");

    expect(spy).toHaveBeenCalled();
  });

  it("should import data from CSV", () => {
    const csv: string = "1,2" + "\n3,4";
    const filepath = path.join(process.cwd(), "/test.csv");
    spreadSheet.importCSV(filepath);

    const data = [
      ["1", "2"],
      ["3", "4"],
    ];
    expect(spreadSheet.getCurrentPage().getData()).toStrictEqual(data);
  });

  it("should add a new empty page called Page 2 when no data is given", () => {
    spreadSheet.addPage();
    const newPage: ISpreadsheetPage = new SpreadSheetPageModel("Page 2");

    expect(spreadSheet.getCurrentPage()).toStrictEqual(newPage);
  });

  it("should successfully delete given spreadsheet page", () => {
    spreadSheet.addPage();
    spreadSheet.addPage();
    const thirdPage: ISpreadsheetPage = new SpreadSheetPageModel("Page 3");

    expect(spreadSheet.getCurrentPage()).toStrictEqual(thirdPage);

    const secondPage: ISpreadsheetPage = new SpreadSheetPageModel("Page 2");
    spreadSheet.deletePage(spreadSheet.getCurrentPage());

    expect(spreadSheet.getCurrentPage()).toStrictEqual(secondPage);
    expect(spreadSheet.getAllPageNames()).toStrictEqual(["Page 1", "Page 2"]);
    expect(spreadSheet.getNumPages()).toBe(2);
  });
  // test
});

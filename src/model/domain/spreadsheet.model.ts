import path from "path";
import * as fs from "fs";
import { ISpreadsheetModel } from "../interfaces/spreadsheet.interface";
import { SpreadSheetPageModel } from "./spreadsheet-page.model";
const { convertArrayToCSV } = require("convert-array-to-csv");
const FileSaver = require("file-saver");
const { convertCSVToArray } = require("convert-csv-to-array");

/**
 * This is the model for our spreadsheet application. The spreadsheet model contains an array of spreadsheet pages
 * that is used for the standard matrix of cells. This is one of our additional features for this project which is the application
 * having multiple pages that are saved and can be worked on.
 */
export class SpreadsheetModel implements ISpreadsheetModel {
  private _spreadsheets: SpreadSheetPageModel[] = [];
  private _currentPage: SpreadSheetPageModel;

  public constructor() {
    const newPage: SpreadSheetPageModel = new SpreadSheetPageModel("Page 1");
    this._spreadsheets.push(newPage);
    this._currentPage = newPage;
  }

  // Adds a generic page to the spreadsheet model and changes the current page.
  public addPage(data?: string[][], sheetName?: string): void {
    let newPage: SpreadSheetPageModel;
    let newPageName: string;
    if (sheetName === undefined) {
      newPageName = "Page " + (this._spreadsheets.length + 1);
    } else {
      newPageName = sheetName;
    }

    if (data !== undefined) {
      newPage = new SpreadSheetPageModel(
        newPageName,
        data.length,
        data[0].length,
        data
      );
    } else {
      newPage = new SpreadSheetPageModel(newPageName);
    }

    this._spreadsheets.push(newPage);
    this._currentPage = newPage;
  }

  // Tries to delete the given spreadsheet page.
  public deletePage(spreadsheet: SpreadSheetPageModel): void {
    // Find the index of the spreadsheet to delete
    const index = this._spreadsheets.indexOf(spreadsheet);
    const currentIndex = this._spreadsheets.indexOf(this._currentPage);

    if (index !== -1) {
      this._spreadsheets.splice(index, 1);
    } else {
      throw new Error("Spreadsheet not found");
    }

    if (index === currentIndex) {
      this._currentPage = this._spreadsheets[this._spreadsheets.length - 1];
    }
  }

  // returns the current page that is being viewed in the Spreadsheet
  public getCurrentPage(): SpreadSheetPageModel {
    return this._currentPage;
  }

  // sets the current page to the given spreadsheet page
  public setCurrentPage(newPage: SpreadSheetPageModel): void {
    // Find the index of the spreadsheet to delete
    const index = this._spreadsheets.indexOf(newPage);

    if (index !== -1) {
      // Change the current page to the given page if found
      this._currentPage = this._spreadsheets[index];
    } else {
      throw new Error("Spreadsheet not found");
    }
  }

  // Exports the data in the current spreadsheet page to a CSV formatted string
  public exportCurrentToCSV(filePath?: string, separator: string = ";"): void {
    if (filePath === undefined) {
      filePath = "export.csv";
    }
    try {
      const csvFromArrayOfArrays = convertArrayToCSV(
        this._currentPage.getData(),
        {
          separator,
        }
      );

      // Write the CSV data to a file
      // fs.writeFileSync(filePath, csvFromArrayOfArrays);
      const file = new File([csvFromArrayOfArrays as BlobPart], filePath);
      FileSaver.saveAs(file, filePath);
    } catch (error) {
      console.log("Error exporting to CSV:", error);
    }
  }

  // imports a CSV from a filepath to a 2D array of data and adds it as a new page
  public importCSV(filepath: string): void {
    const csvFilePath = path.resolve(__dirname, filepath);

    const fileContent =
      fs.readFileSync(csvFilePath, { encoding: "utf-8" }) + "\n";

    const csv: string[][] = convertCSVToArray(fileContent, {
      type: "array",
      separator: ",", // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
    });

    for (let r = 0; r < csv.length; r++) {
      for (let c = 0; c < csv[0].length; c++) {
        csv[r][c] = csv[r][c].toString();
      }
    }

    this.addPage(csv);
  }

  // imports a CSV from a File object to a 2D array of data and adds it as a new page
  public importCSVFromFile(file: File): void {
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = () => {
      const csv: string[][] = convertCSVToArray(fileReader.result, {
        type: "array",
        separator: ",", // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
      });

      for (let r = 0; r < csv.length; r++) {
        for (let c = 0; c < csv[0].length; c++) {
          csv[r][c] = csv[r][c].toString();
        }
      }

      this.addPage(csv, "Import");
    };
  }

  public getNumPages(): number {
    return this._spreadsheets.length;
  }

  public getAllPageNames(): string[] {
    const pageNames: string[] = [];

    for (let i = 0; i < this._spreadsheets.length; i++) {
      pageNames.push(this._spreadsheets[i].getSheetName());
    }

    return pageNames;
  }
}

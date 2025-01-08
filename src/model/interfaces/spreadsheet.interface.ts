import { ISpreadsheetPage } from "./spreadsheet-page.interface";

// Represents the entire spreadsheet program that contains spreadsheet pages
export interface ISpreadsheetModel {
    // Adds a new page to this spreadsheet
    addPage(): void;

    // Deletes the given page from this spreadsheet
    deletePage(spreadsheet: ISpreadsheetPage): void;

    // Returns the spreadsheet page
    getCurrentPage(): ISpreadsheetPage;

    // Sets a given spreadsheet page as the current page
    setCurrentPage(newPage: ISpreadsheetPage): void;

    exportCurrentToCSV(filepath?: string): void;

    importCSV(csvString: string): void;

    getNumPages(): number;

    getAllPageNames(): string[];
}
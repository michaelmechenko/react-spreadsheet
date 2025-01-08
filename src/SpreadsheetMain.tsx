import React, { useState } from "react";
import "./globals.css";
import Header from "./components/layout/Header";
import SelectedCellBox from "./components/SelectedCellBox.component";
import InputBox from "./components/InputBox.component";
import SpreadSheetPage from "./components/SpreadsheetPage.component";
import { SpreadsheetModel } from "./model/domain/spreadsheet.model";
import PagesButton from "./components/layout/PagesButton";
import ImportButton from "./components/layout/ImportButton";
import ExportButton from "./components/layout/ExportButton";
import AddColumnButton from "./components/layout/AddColumnButton";
import RemoveColumnButton from "./components/layout/RemoveColumnButton";
import RemoveRowButton from "./components/layout/RemoveRowButton";
import AddRowButton from "./components/layout/AddRowButton";
import { SpreadSheetPageModel } from "./model/domain/spreadsheet-page.model";
import ClearCellButton from "./components/layout/ClearCellButton";

export default function SpreadsheetMain() {
  const [spreadsheetModel, setSpreadsheetModel] = useState(
    new SpreadsheetModel(),
  );
  const [pageModel, setPageModel] = useState(spreadsheetModel.getCurrentPage());
  const [pages, setPages] = useState([spreadsheetModel.getCurrentPage()]);
  const [selectedPageCell, setSelectedPageCell] = useState("A1");
  const [inputDisplay, setInputDisplay] = useState("");
  const [addRowDisplay, setAddRowDisplay] = useState("");
  const [addColDisplay, setAddColDisplay] = useState("");
  const [removeRowDisplay, setRemoveRowDisplay] = useState("");
  const [removeColDisplay, setRemoveColDisplay] = useState("");

  const updateSelectedCell = (reference: string) => {
    setSelectedPageCell(reference);
    setInputDisplay(pageModel.getCellBuffer(reference));
  };

  const handleInputEnter = (input: string): void => {
    pageModel.setValue(selectedPageCell, input);
    setPageModel(pageModel);
    setSelectedPageCell(selectedPageCell);
    setSpreadsheetModel(spreadsheetModel);
  };

  const handleCreateNewPagePressed = (): void => {
    spreadsheetModel.addPage();
    setPageModel(spreadsheetModel.getCurrentPage());
    const newPage = spreadsheetModel.getCurrentPage();
    setPages([...pages, newPage]);
    setSpreadsheetModel(spreadsheetModel);
  };

  const handlePagePressed = (page: SpreadSheetPageModel): void => {
    setPageModel(page);
    setSpreadsheetModel(spreadsheetModel);
  };

  const handleAddColumnAtIndex = (index: number): void => {
    if (index < 0 || isNaN(index)) return;
    setAddColDisplay("");
    pageModel.addColumn(index);
    setPageModel(pageModel);
    setSpreadsheetModel(spreadsheetModel);
  };

  const handleAddRowAtIndex = (index: number): void => {
    if (index < 0 || isNaN(index)) return;
    setAddRowDisplay("");
    pageModel.addRow(index);
    setPageModel(pageModel);
    setSpreadsheetModel(spreadsheetModel);
  };

  const handleRemoveColumnAtIndex = (index: number): void => {
    if (index < 0 || isNaN(index)) return;
    setRemoveColDisplay("");
    pageModel.removeColumn(index);
    setPageModel(pageModel);
    setSpreadsheetModel(spreadsheetModel);
  };

  const handleRemoveRowAtIndex = (index: number): void => {
    if (index < 0 || isNaN(index)) return;
    setRemoveRowDisplay("");
    pageModel.removeRow(index);
    setPageModel(pageModel);
    setSpreadsheetModel(spreadsheetModel);
  };

  const handleImportPressed = (file: File): void => {
    spreadsheetModel.importCSVFromFile(file);
    setPageModel(spreadsheetModel.getCurrentPage());
    const newPage = spreadsheetModel.getCurrentPage();
    newPage.setSheetName("Import");
    setPages([...pages, newPage]);
  };

  const handleExportPressed = (): void => {
    spreadsheetModel.exportCurrentToCSV();
  };

  const handleClearCellPressed = (): void => {
    pageModel.getCellFromReference(selectedPageCell).clearCell();
  };

  return (
    <>
      <div className="main-container">
        <Header></Header>
        <div className="flex justify-center">
          <div className="flex flex-col pt-2">
            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-row">
                <PagesButton
                  pages={pages}
                  currentPage={pageModel}
                  handlePlusClick={handleCreateNewPagePressed}
                  handlePageClick={handlePagePressed}
                />
              </div>
              <div className="flex flex-row">
                <ClearCellButton handleOnClick={handleClearCellPressed} />
                <ImportButton handleOnClick={handleImportPressed} />
                <ExportButton handleOnClick={handleExportPressed} />
              </div>
            </div>
            <div className="flex flex-row w-full">
              <SelectedCellBox display={selectedPageCell} />
              <InputBox
                inputEnter={handleInputEnter}
                displayValue={inputDisplay}
                setInputDisplay={setInputDisplay}
              />
            </div>
            <SpreadSheetPage
              pageModel={pageModel}
              currentInputDisplay={inputDisplay}
              handleCellClick={updateSelectedCell}
              selectedCell={selectedPageCell}
            />
            <div className="flex flex-row w-full space-x-2 pt-2">
              <AddColumnButton
                handleAddColumnAtIndex={handleAddColumnAtIndex}
                displayValue={addColDisplay}
                setInputDisplay={setAddColDisplay}
              />
              <AddRowButton
                handleAddRowAtIndex={handleAddRowAtIndex}
                displayValue={addRowDisplay}
                setInputDisplay={setAddRowDisplay}
              />
            </div>
            <div className="flex flex-row w-full space-x-2 pt-2">
              <RemoveColumnButton
                handleRemoveColumnAtIndex={handleRemoveColumnAtIndex}
                displayValue={removeColDisplay}
                setInputDisplay={setRemoveColDisplay}
              />
              <RemoveRowButton
                handleRemoveRowAtIndex={handleRemoveRowAtIndex}
                displayValue={removeRowDisplay}
                setInputDisplay={setRemoveRowDisplay}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

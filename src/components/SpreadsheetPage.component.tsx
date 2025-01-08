import React, { useCallback, useEffect } from "react";
import SpreadsheetCell from "./SpreadsheetCell.component";
import { SpreadSheetPageModel } from "../model/domain/spreadsheet-page.model";

interface PageProp {
  pageModel: SpreadSheetPageModel;
  handleCellClick(reference: string): void;
  selectedCell: string;
  currentInputDisplay: string;
}

export default function SpreadsheetPage({
  pageModel,
  handleCellClick,
  selectedCell,
  currentInputDisplay,
}: PageProp) {
  function determineReference(row: number, col: number): string {
    const colChar = String.fromCharCode(64 + col);
    const rowNum = row.toString();

    return colChar + rowNum;
  }

  const handleCellDisplay = (reference: string): string => {
    if (selectedCell === reference && currentInputDisplay !== "") {
      return currentInputDisplay;
    }
    return pageModel.getValueAtCell(reference);
  };

  const rowNum = pageModel.getNumRows();
  const colNum = pageModel.getNumCols();

  const renderCells = useCallback(() => {
    const rows = [];
    for (let i = 0; i < rowNum; i++) {
      const cols = [];
      for (let j = 0; j < colNum; j++) {
        if (i === 0 && j === 0) {
          cols.push(
            <div
              key={0}
              className="w-24 h-7 border-2 bg-[#c3c3c9] border-solid border-zinc-700 text-center"
            ></div>
          );
        } else if (i === 0) {
          cols.push(
            <div
              key={j}
              className="w-24 h-7 border-2 bg-[#c3c3c9] border-solid border-zinc-700 text-center"
            >
              {String.fromCharCode(64 + j)}
            </div>
          );
        } else if (j === 0) {
          cols.push(
            <div
              key={i}
              className="w-24 h-7 border-2 bg-[#c3c3c9] border-solid border-zinc-700 text-center"
            >
              {i}
            </div>
          );
        } else {
          cols.push(
            <SpreadsheetCell
              key={determineReference(i, j)}
              reference={determineReference(i, j)}
              isSelected={selectedCell === determineReference(i, j)}
              handleCellClick={handleCellClick}
              cellDisplay={handleCellDisplay(determineReference(i, j))}
            />
          );
        }
      }
      rows.push(
        <div key={i} className="flex flex-row">
          {cols}
        </div>
      );
    }
    return rows;
  }, [handleCellClick, colNum, rowNum, handleCellDisplay, selectedCell]);

  return <>{renderCells()}</>;
}

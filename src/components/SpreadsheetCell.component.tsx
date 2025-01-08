import React from "react";

interface CellProp {
  handleCellClick(reference: string): void;
  isSelected: boolean;
  cellDisplay: string;
  reference: string;
}

export default function SpreadsheetCell({
  handleCellClick,
  isSelected,
  cellDisplay,
  reference,
}: CellProp) {
  const handleClick = () => {
    handleCellClick(reference);
  };

  if (isSelected) {
    return (
      <div
        className="w-24 h-7 border-2 bg-pink-200 border-solid border-pink-800 text-left"
        onClick={handleClick}
      >
        {cellDisplay}
      </div>
    );
  } else {
    return (
      <div
        className="w-24 h-7 border-2 bg-zinc-300 border-solid border-zinc-700 text-left"
        onClick={handleClick}
      >
        {cellDisplay}
      </div>
    );
  }
}

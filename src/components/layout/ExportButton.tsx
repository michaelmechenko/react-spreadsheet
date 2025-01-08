import React from "react";

interface ExportButtonProps {
  handleOnClick(): void;
}

export default function ExportButton({ handleOnClick }: ExportButtonProps) {
  return (
    <button
      className="w-24 h-7 border-t-2 border-r-2 border-l-2 bg-green-200 hover:bg-green-300 transition duration-120 border-solid border-zinc-700 text-center"
      onClick={handleOnClick}
    >
      Export
    </button>
  );
}

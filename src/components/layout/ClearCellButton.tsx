import React from "react";
interface ClearCellButtonProps {
  handleOnClick(): void;
}

export default function ClearCellButton({
  handleOnClick,
}: ClearCellButtonProps) {
  return (
    <button
      className="w-44 h-7 border-t-2 border-l-2 bg-zinc-200 hover:bg-zinc-300 transition duration-120 ease-in-out border-solid border-zinc-700 text-center"
      onClick={handleOnClick}
    >
      Clear Current Cell
    </button>
  );
}

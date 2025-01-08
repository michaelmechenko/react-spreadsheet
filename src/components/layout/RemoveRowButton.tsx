import React from "react";

interface RemoveRowButtonProps {
  handleRemoveRowAtIndex: (index: number) => void;
  displayValue: string;
  setInputDisplay(input: string): void;
}

export default function RemoveRowButton({
  handleRemoveRowAtIndex,
  displayValue,
  setInputDisplay,
}: RemoveRowButtonProps) {
  return (
    <div className="flex flex-row">
      <button
        className="w-32 h-7 border-y-2 border-l-2 bg-red-200 border-solid border-zinc-700 text-center"
        onClick={() => handleRemoveRowAtIndex(parseInt(displayValue))}
      >
        Remove Row
      </button>
      <input
        className="w-12 h-7 text-zinc-900 border-2 border-zinc-800 bg-zinc-300 hover:bg-zinc-300 focus:bg-zinc-300 transition duration-90 ease-in-out text-center"
        onChange={(e) => setInputDisplay(e.target.value)}
        value={displayValue}
      ></input>
    </div>
  );
}

import React from "react";

interface InputProp {
  inputEnter(input: string): void;
  displayValue: string;
  setInputDisplay(input: string): void;
}

export default function InputBox({
  inputEnter,
  displayValue,
  setInputDisplay,
}: InputProp) {
  return (
    <input
      type="text"
      className="w-4/5 text-zinc-900 border-2 border-zinc-800 bg-zinc-400 hover:bg-zinc-300 focus:bg-zinc-300 transition duration-90 ease-in-out text-xl h-10"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          inputEnter(displayValue);
        }
      }}
      onChange={(e) => setInputDisplay(e.target.value)}
      value={displayValue}
    ></input>
  );
}

import React from "react";

interface SelectedCellBoxProp {
  display: string;
}

export default function SelectedCellBox({ display }: SelectedCellBoxProp) {
  return (
    <div className="w-1/5 bg-zinc-300 border-2 border-zinc-800 h-10 text-zinc-900 text-center align-middle">
      Selected Cell:{" "}
      <b>
        <em className="text-red-400">{display}</em>
      </b>
    </div>
  );
}

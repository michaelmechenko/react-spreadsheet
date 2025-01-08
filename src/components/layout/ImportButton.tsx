import React from "react";

interface ImportButtonProps {
  handleOnClick(file: File): void;
}

export default function ImportButton({ handleOnClick }: ImportButtonProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files) {
      const file = files[0];
      handleOnClick(file);
    }
  }

  return (
    <div>
      <div className="w-24 h-7 border-t-2 border-l-2 bg-green-200 hover:bg-green-300 transition duration-120 border-solid border-zinc-700 text-center">
        Import
        <input
          className="relative left-2 bottom-6 w-24 h-7 opacity-0 cursor-pointer"
          type="file"
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
}

import React from "react";
import { SpreadSheetPageModel } from "../../model/domain/spreadsheet-page.model";

interface PageButtonProp {
  currentPage: SpreadSheetPageModel;
  pages: SpreadSheetPageModel[];
  handlePlusClick(): void;
  handlePageClick(page: SpreadSheetPageModel): void;
}

export default function PagesButton({
  currentPage,
  pages,
  handlePlusClick,
  handlePageClick,
}: PageButtonProp) {
  const pageButtons = pages.map((page) => {
    if (page === currentPage) {
      return (
        <button
          key={`${page.getSheetName()}, ${page.getData()}}`}
          className="w-24 h-7 border-x-2 border-t-2 bg-blue-300 hover:bg-blue-400 transition duration-90 ease-in-out border-solid border-zinc-700 text-center"
          onClick={() => handlePageClick(page)}
        >
          {page.getSheetName()}
        </button>
      );
    }
    return (
      <button
        key={`${page.getSheetName()}, ${page.getData()}}`}
        className="w-24 h-7 border-x-2 border-t-2 bg-blue-200 hover:bg-blue-300 transition duration-90 ease-in-out border-solid border-zinc-700 text-center"
        onClick={() => handlePageClick(page)}
      >
        {page.getSheetName()}
      </button>
    );
  });

  const plusButton = (
    <button
      className="h-7 w-8 border-r-2 border-t-2 bg-gray-200 border-solid border-zinc-700 text-center hover:bg-zinc-300 transition duration-90 ease-in-out"
      onClick={handlePlusClick}
    >
      +
    </button>
  );

  return (
    <>
      {pageButtons}
      {plusButton}
    </>
  );
}

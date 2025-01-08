# Team 111 Spreadsheet Application

## Overview

This is a simple spreadsheet application built using Node.js and React for CS4530. It allows users to create, edit, and organize data in a tabular format much like Excel. The server-side logic is implemented using Node.js, while the front-end interface is built with React.

## Features

- **Create and Edit pages:** Users can create multiple pages, each containing a tabular data structure. They can add, edit, and delete rows and columns within each sheet.

- **Cell Formulas:** The application supports basic cell formulas, allowing users to perform calculations and reference other cells within the same sheet. These formulas include general arithmetic equations, sum by cell references, and average by cell references.

- **Import and Export:** Users can import data from CSV files into the application and export sheets to downloadable CSV files for external use.

- **Edit Rows and Columns:** Users can add or delete rows and columns through the UI using 4 buttons and the index of the row or column to change.

- **Responsive Design:** The application is designed to be responsive, ensuring a seamless experience across different devices and screen sizes.

## Installation
1. Clone the repository:

    ```bash
    git clone https://github.com/neu-cs4530-fall2023/team111-project.git
    ```
2. Navigate to the project directory:

    ```bash
    cd implementation
    ```
3. Install dependencies:

    ```bash
    npm install
    ```
4. Start the application:

    ```bash
    yarn start
    ```

## Usage

- **Seeing Any Changes**
    - To see any changes you will have to click on the screen anymore. This updates the UI with the new changes.
    - To save the input typed in the input box, you MUST press enter.

- **Creating a Sheet:**
    1. Click the "New Sheet" button.
    2. Enter a name for the new sheet and click "Create."

- **Editing Cells:**
    - Click on a cell to edit its contents. The buffer for the selected cell will show on the top text box.

- **Formulas:**
    - Start a cell with `=` to enter a formula.
    - `=` followed by an arithemtic expression can be used get the result in the correct order of operations.
    - `REF` can be used to reference a cell value within a formula. 
        - ex. `=REF(A1)` results in the cell value of 'A1'
    - `SUM` can be used with a range of cells to get the sum of all the cells. 
        - ex. `=SUM(A1:B3)` results in the sum of cells A1, A2, A3, B1, B2, B3 if they are all numbers
        - ex. `SUM(A1,A2,A3,B1,B2,B3)` will do the same as above
    - `AVG` can be used with a range of cells to get the average of all the cells. 
        - ex. `=AVG(A1:B3)` results in the mean of cells A1, A2, A3, B1, B2, B3 if they are all numbers
        - ex. `AVG(A1,A2,A3,B1,B2,B3)` will do the same as above
- **Adding/Deleting Rows and Columns**
    - To use the row or columns buttons, type an index starting at 0. 0 means the very first row or column.
    - Click on the actual buttons.
    - Press anywhere on the page to see the update!

- **Importing Data:**
    1. Click the "Import" button.
    2. Select a CSV file to import into the current sheet.

- **Exporting Data:**
    1. Click the "Export" button.
    2. The current sheet will be exported as a CSV file.

- **Saving Changes:**
    - Changes are automatically saved.

## Test Suite

- **Running Tests**
    ```bash
    cd implementation/src
    yarn test
    ```
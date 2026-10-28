declare module 'xlsx' {
  interface Worksheet {
    [key: string]: unknown;
    '!cols'?: { wch: number }[];
  }

  type Workbook = object;

  const content: {
    utils: {
      aoa_to_sheet(data: unknown[][]): Worksheet;
      book_append_sheet(workbook: Workbook, worksheet: Worksheet, name: string): void;
      book_new(): Workbook;
      json_to_sheet(data: unknown[], options?: object): Worksheet;
      table_to_book(table: HTMLTableElement, options?: { sheet?: string }): Workbook;
    };
    write(workbook: Workbook, options: { bookType?: string; type?: string }): BlobPart;
    writeFile(workbook: Workbook, filename: string): void;
  };
  export = content;
}
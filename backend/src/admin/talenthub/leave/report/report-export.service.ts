import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportExportService {

  // ==========================================
  // Generate Excel
  // ==========================================

  async generateExcel(
    data: any[],
    sheetName: string,
  ): Promise<Buffer> {

    const workbook = new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(sheetName);

    if (!data || data.length === 0) {
      worksheet.addRow(['No data available']);
    } else {

      // Get column names dynamically
      const columns = Object.keys(data[0]);

      // Create Excel columns
      worksheet.columns = columns.map(
        (column) => ({
          header: column,
          key: column,
          width: 20,
        }),
      );

      // Add report data
      data.forEach((row) => {
        worksheet.addRow(row);
      });

      // Format header
      const headerRow =
        worksheet.getRow(1);

      headerRow.font = {
        bold: true,
      };

      headerRow.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };

      // Freeze header row
      worksheet.views = [
        {
          state: 'frozen',
          ySplit: 1,
        },
      ];
    }

    const buffer =
      await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
  }
}
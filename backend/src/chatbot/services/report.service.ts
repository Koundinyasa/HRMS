import { Injectable } from '@nestjs/common';
import XlsxPopulate from 'xlsx-populate';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { TeamMember } from '../types';

// Fallback color when the request didn't supply a live theme color (or it
// failed validation on the controller side) — same purple this always used
// to be, just no longer the only option.
const DEFAULT_COLOR = '#6d5efc';

const TEXT_DARK = '#2b2740';
const TEXT_MUTED = '#8b86a3';

// Reads the logo directly from the frontend project's own assets folder
// rather than requiring a duplicate copy in the backend. This only works
// because both projects live side by side in the same repo on the same
// machine — if backend and frontend are ever deployed separately (e.g.
// different servers/hosts), this path won't resolve and it'll fall back
// to the text badge below rather than breaking PDF generation.
const LOGO_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'frontend',
  'src',
  'assets',
  'images',
  'koundinyasa-logo.png',
);
const COMPANY_NAME = 'Koundinyasa TechnAology Services Pvt. Ltd.';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

// amount 0..1, 1 = pure white. Used to derive light tints (header bg, row
// stripes, badge fills) from whatever single color the frontend sends,
// instead of hand-picking a fixed set of purple-family constants.
function tint(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

function shade(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

@Injectable()
export class ReportService {
  async generateTeamPdf(
    teamName: string,
    members: TeamMember[],
    themeColor?: string,
  ): Promise<Buffer> {
    const brand = themeColor ?? DEFAULT_COLOR;
    const brandLight = tint(brand, 0.6);
    const headerBg = tint(brand, 0.92);
    const borderColor = tint(brand, 0.75);
    const rowAltBg = tint(brand, 0.96);
    const badgeText = shade(brand, 0.35);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const startX = doc.page.margins.left;

      // ── Header band ────────────────────────────────────────────────
      const headerHeight = 108;
      const gradient = doc.linearGradient(0, 0, doc.page.width, headerHeight);
      gradient.stop(0, brand).stop(1, brandLight);
      doc.rect(0, 0, doc.page.width, headerHeight).fill(gradient);

      // Soft decorative circles, low opacity, purely texture
      doc.save();
      doc.fillOpacity(0.08);
      doc.circle(doc.page.width - 40, -20, 90).fill('white');
      doc.fillOpacity(0.06);
      doc.circle(doc.page.width - 90, 70, 55).fill('white');
      doc.restore();

      // Logo badge — real logo image if the file exists on this server,
      // otherwise a text-initials badge so the header never looks broken.
      // Wider/shorter than a square since the real logo is a horizontal
      // logotype, not an icon — a square badge was squeezing it small
      // with a lot of empty space around it.
      const badgeX = startX,
        badgeY = 20,
        badgeW = 150,
        badgeH = 56;
      const logoExists = fs.existsSync(LOGO_PATH);
      const textStartX = startX + badgeW + 18;
      if (logoExists) {
        try {
          doc.image(LOGO_PATH, badgeX, badgeY, {
            fit: [badgeW, badgeH],
            valign: 'center',
          });
        } catch {
          doc
            .fillColor('white')
            .font('Helvetica-Bold')
            .fontSize(16)
            .text('KTS', badgeX, badgeY + badgeH / 2 - 8, {
              width: badgeW,
              align: 'left',
            });
        }
      } else {
        doc
          .fillColor('white')
          .font('Helvetica-Bold')
          .fontSize(16)
          .text('KTS', badgeX, badgeY + badgeH / 2 - 8, {
            width: badgeW,
            align: 'left',
          });
      }

      doc
        .fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(19)
        .text('HRMS', textStartX, badgeY, {
          width: pageWidth - (textStartX - startX),
        });
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#f0eefc')
        .text(COMPANY_NAME, textStartX, badgeY + 22, {
          width: pageWidth - (textStartX - startX),
        });
      doc
        .fontSize(9.5)
        .fillColor('#e5e1ff')
        .text(
          `Team Roster \u2014 Generated ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          textStartX,
          badgeY + 40,
          { width: pageWidth - (textStartX - startX) },
        );

      // ── Stats row ──────────────────────────────────────────────────
      let y = headerHeight + 18;
      const designationCount = new Set(
        members.map((m) => m.designation).filter(Boolean),
      ).size;

      doc
        .fillColor(TEXT_DARK)
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(String(members.length), startX, y);
      doc
        .fillColor(TEXT_MUTED)
        .font('Helvetica')
        .fontSize(8.5)
        .text('MEMBERS', startX, y + 20);

      doc
        .fillColor(TEXT_DARK)
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(String(designationCount), startX + 90, y);
      doc
        .fillColor(TEXT_MUTED)
        .font('Helvetica')
        .fontSize(8.5)
        .text('DESIGNATIONS', startX + 90, y + 20);

      y += 48;

      // ── Table ──────────────────────────────────────────────────────
      const col1X = startX,
        col2X = startX + 140,
        col3X = startX + 330;
      const colW1 = 140,
        colW2 = 190,
        colW3 = pageWidth - 330;
      const rowH = 26;
      const tableTop = y;

      const drawVerticalGridLines = (fromY: number, toY: number) => {
        doc.strokeColor(borderColor).lineWidth(0.5);
        [startX, col2X, col3X, startX + pageWidth].forEach((x) => {
          doc.moveTo(x, fromY).lineTo(x, toY).stroke();
        });
      };

      const drawHeaderRow = (yPos: number) => {
        doc.rect(startX, yPos, pageWidth, rowH).fill(headerBg);
        doc.fillColor(brand).font('Helvetica-Bold').fontSize(9);
        doc.text('EMPLOYEE ID', col1X + 10, yPos + 9, { width: colW1 - 15 });
        doc.text('NAME', col2X + 10, yPos + 9, { width: colW2 - 15 });
        doc.text('DESIGNATION', col3X + 10, yPos + 9, { width: colW3 - 15 });
      };

      const pageBottom = doc.page.height - doc.page.margins.bottom - 30;
      const footerY = doc.page.height - doc.page.margins.bottom + 10;

      const writeFooter = (pageNum: number) => {
        // pdfkit auto-adds a new page if text is placed at/beyond the
        // bottom margin boundary — which the footer intentionally is.
        // Zeroing the margin right before this call stops that from
        // triggering; safe since we're either about to addPage() (which
        // resets margins fresh) or about to end() the document entirely.
        doc.page.margins.bottom = 0;
        doc
          .fontSize(8)
          .fillColor(TEXT_MUTED)
          .text(
            `Page ${pageNum} \u00b7 Generated by HRMS Assistant`,
            startX,
            footerY,
            { width: pageWidth, align: 'center', lineBreak: false },
          );
      };

      let pageNum = 1;

      drawHeaderRow(y);
      y += rowH;

      doc.font('Helvetica').fontSize(10);
      let sectionTop = tableTop;

      const closeGrid = (bottomY: number) => {
        drawVerticalGridLines(sectionTop, bottomY);
        doc
          .strokeColor(borderColor)
          .lineWidth(0.75)
          .rect(startX, sectionTop, pageWidth, bottomY - sectionTop)
          .stroke();
      };

      members.forEach((m, i) => {
        if (y + rowH > pageBottom) {
          closeGrid(y);
          writeFooter(pageNum);
          doc.addPage();
          pageNum += 1;
          y = 40;
          sectionTop = y;
          drawHeaderRow(y);
          y += rowH;
        }
        if (i % 2 === 1) {
          doc.rect(startX, y, pageWidth, rowH).fill(rowAltBg);
        }
        doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(10);
        doc.text(m.employeeId, col1X + 10, y + 8, { width: colW1 - 15 });
        doc.text(m.name, col2X + 10, y + 8, { width: colW2 - 15 });

        // Designation as a small rounded badge instead of plain text
        const designation = m.designation ?? 'N/A';
        doc.font('Helvetica').fontSize(8.5);
        const badgeTextWidth = doc.widthOfString(designation);
        const badgeW = Math.min(badgeTextWidth + 16, colW3 - 15);
        doc.roundedRect(col3X + 10, y + 5, badgeW, 16, 8).fill(headerBg);
        doc
          .fillColor(badgeText)
          .font('Helvetica')
          .fontSize(8.5)
          .text(designation, col3X + 14, y + 9, {
            width: badgeW - 8,
            ellipsis: true,
          });

        doc
          .strokeColor(borderColor)
          .lineWidth(0.5)
          .moveTo(startX, y + rowH)
          .lineTo(startX + pageWidth, y + rowH)
          .stroke();
        y += rowH;
      });

      closeGrid(y);

      if (!members.length) {
        doc
          .fillColor(TEXT_MUTED)
          .fontSize(10)
          .text('No members found for this team.', startX, y + 14);
      }

      writeFooter(pageNum);

      doc.end();
    });
  }

  async generateTeamExcel(
    teamName: string,
    members: TeamMember[],
    themeColor?: string,
  ): Promise<Buffer> {
    const brand = themeColor ?? DEFAULT_COLOR;
    const brandArgb = 'FF' + brand.replace('#', '').toUpperCase();
    const headerBgArgb =
      'FF' + tint(brand, 0.92).replace('#', '').toUpperCase();
    const borderArgb = 'FF' + tint(brand, 0.75).replace('#', '').toUpperCase();
    const altRowArgb = 'FF' + tint(brand, 0.96).replace('#', '').toUpperCase();

    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);
    sheet.name(teamName.substring(0, 31));

    const headers = ['Employee ID', 'Name', 'Designation'];
    const widths = [18, 28, 26];

    headers.forEach((header, index) => {
      const cell = sheet.cell(1, index + 1);
      cell.value(header);
      cell.style({
        bold: true,
        fontColor: brand.replace('#', ''),
        fill: headerBgArgb.slice(2),
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        border: {
          top: { style: 'thin', color: borderArgb.slice(2) },
          bottom: { style: 'thin', color: borderArgb.slice(2) },
          left: { style: 'thin', color: borderArgb.slice(2) },
          right: { style: 'thin', color: borderArgb.slice(2) },
        },
      });
      sheet.column(index + 1).width(widths[index]);
    });

    members.forEach((member, rowIndex) => {
      const values = [member.employeeId, member.name, member.designation];

      values.forEach((value, columnIndex) => {
        const cell = sheet.cell(rowIndex + 2, columnIndex + 1);
        cell.value(value);
        cell.style({
          border: {
            top: { style: 'thin', color: borderArgb.slice(2) },
            bottom: { style: 'thin', color: borderArgb.slice(2) },
            left: { style: 'thin', color: borderArgb.slice(2) },
            right: { style: 'thin', color: borderArgb.slice(2) },
          },
        });

        if (rowIndex % 2 === 1) {
          cell.style({
            fill: altRowArgb.slice(2),
          });
        }
      });
    });

    const buffer = await workbook.outputAsync();
    return Buffer.from(buffer);
  }

  // ============================================================
  // ALL EMPLOYEES - EXCEL
  // ============================================================

  async generateAllEmployeesExcel(
    employees: any[],
    themeColor?: string,
  ): Promise<Buffer> {
    const brand = themeColor ?? DEFAULT_COLOR;

    const brandArgb = 'FF' + brand.replace('#', '').toUpperCase();

    const headerBgArgb =
      'FF' + tint(brand, 0.92).replace('#', '').toUpperCase();

    const borderArgb = 'FF' + tint(brand, 0.75).replace('#', '').toUpperCase();

    const altRowArgb = 'FF' + tint(brand, 0.96).replace('#', '').toUpperCase();

    const workbook = await XlsxPopulate.fromBlankAsync();

    const sheet = workbook.sheet(0);

    sheet.name('All Employees');

    /*
     * These columns are based on the employee object returned
     * by HrmsDbService.
     *
     * We use the common employee fields first and then write
     * the remaining properties dynamically so that employee
     * information is not silently lost.
     */

    if (!employees.length) {
      sheet.cell('A1').value('No employees found.');
      return Buffer.from(await workbook.outputAsync());
    }

    // Get all property names appearing in employee records.
    const columns = [
      {
        key: 'EmployeeID',
        title: 'EMPLOYEE ID',
      },
      {
        key: 'FullName',
        title: 'NAME',
      },
      {
        key: 'Email',
        title: 'EMAIL',
      },
      {
        key: 'DepartmentName',
        title: 'DEPARTMENT',
      },
      {
        key: 'DesignationName',
        title: 'DESIGNATION',
      },
    ];

    // ------------------------------------------------------------
    // HEADER
    // ------------------------------------------------------------

    columns.forEach((column, columnIndex) => {
      const cell = sheet.cell(1, columnIndex + 1);

      cell.value(column.title);

      cell.style({
        bold: true,
        fontColor: brand.replace('#', ''),
        fill: headerBgArgb.slice(2),
        horizontalAlignment: 'center',
        verticalAlignment: 'center',
        border: {
          top: {
            style: 'thin',
            color: borderArgb.slice(2),
          },
          bottom: {
            style: 'thin',
            color: borderArgb.slice(2),
          },
          left: {
            style: 'thin',
            color: borderArgb.slice(2),
          },
          right: {
            style: 'thin',
            color: borderArgb.slice(2),
          },
        },
      });

      sheet
        .column(columnIndex + 1)
        .width(Math.min(Math.max(column.title.length + 5, 18), 35));
    });

    // ------------------------------------------------------------
    // EMPLOYEE DATA
    // ------------------------------------------------------------

    employees.forEach((employee, rowIndex) => {
      columns.forEach((column, columnIndex) => {
        const cell = sheet.cell(rowIndex + 2, columnIndex + 1);

        const value = employee?.[column.key];

        let cellValue: string | number = '';

        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            cellValue = JSON.stringify(value);
          } else {
            cellValue = String(value);
          }
        }

        cell.value(cellValue);

        cell.style({
          border: {
            top: {
              style: 'thin',
              color: borderArgb.slice(2),
            },
            bottom: {
              style: 'thin',
              color: borderArgb.slice(2),
            },
            left: {
              style: 'thin',
              color: borderArgb.slice(2),
            },
            right: {
              style: 'thin',
              color: borderArgb.slice(2),
            },
          },
        });

        if (rowIndex % 2 === 1) {
          cell.style({
            fill: altRowArgb.slice(2),
          });
        }
      });
    });

    const buffer = await workbook.outputAsync();

    return Buffer.from(buffer);
  }

  // ============================================================
  // ALL EMPLOYEES - PDF
  // ============================================================

  async generateAllEmployeesPdf(
    employees: any[],
    themeColor?: string,
  ): Promise<Buffer> {
    const brand = themeColor ?? DEFAULT_COLOR;

    const brandLight = tint(brand, 0.6);

    const headerBg = tint(brand, 0.92);

    const borderColor = tint(brand, 0.75);

    const rowAltBg = tint(brand, 0.96);

    const badgeText = shade(brand, 0.35);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        layout: 'landscape',
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));

      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.on('error', reject);

      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;

      const startX = doc.page.margins.left;

      // --------------------------------------------------------
      // HEADER
      // --------------------------------------------------------

      const headerHeight = 95;

      const gradient = doc.linearGradient(0, 0, doc.page.width, headerHeight);

      gradient.stop(0, brand).stop(1, brandLight);

      doc.rect(0, 0, doc.page.width, headerHeight).fill(gradient);

      // Decorative circles
      doc.save();

      doc.fillOpacity(0.08);

      doc.circle(doc.page.width - 50, -20, 90).fill('white');

      doc.fillOpacity(0.06);

      doc.circle(doc.page.width - 120, 60, 55).fill('white');

      doc.restore();

      // --------------------------------------------------------
      // LOGO
      // --------------------------------------------------------

      const badgeX = startX;
      const badgeY = 18;
      const badgeW = 150;
      const badgeH = 52;

      const logoExists = fs.existsSync(LOGO_PATH);

      const textStartX = startX + badgeW + 18;

      if (logoExists) {
        try {
          doc.image(LOGO_PATH, badgeX, badgeY, {
            fit: [badgeW, badgeH],
            valign: 'center',
          });
        } catch {
          doc
            .fillColor('white')
            .font('Helvetica-Bold')
            .fontSize(16)
            .text('KTS', badgeX, badgeY + 20, {
              width: badgeW,
            });
        }
      } else {
        doc
          .fillColor('white')
          .font('Helvetica-Bold')
          .fontSize(16)
          .text('KTS', badgeX, badgeY + 20, {
            width: badgeW,
          });
      }

      doc
        .fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(19)
        .text('HRMS', textStartX, badgeY, {
          width: pageWidth - (textStartX - startX),
        });

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#f0eefc')
        .text(COMPANY_NAME, textStartX, badgeY + 22, {
          width: pageWidth - (textStartX - startX),
        });

      doc
        .fontSize(9.5)
        .fillColor('#e5e1ff')
        .text(
          `All Employees — Generated ${new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}`,
          textStartX,
          badgeY + 38,
          {
            width: pageWidth - (textStartX - startX),
          },
        );

      // --------------------------------------------------------
      // STATS
      // --------------------------------------------------------

      let y = headerHeight + 18;

      doc
        .fillColor(TEXT_DARK)
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(String(employees.length), startX, y);

      doc
        .fillColor(TEXT_MUTED)
        .font('Helvetica')
        .fontSize(8.5)
        .text('EMPLOYEES', startX, y + 20);

      y += 48;

      // --------------------------------------------------------
      // TABLE
      // --------------------------------------------------------

      /*
       * PDF is intentionally limited to the most useful
       * employee columns so the landscape A4 page remains
       * readable.
       */

      const columns = [
        {
          key: 'EmployeeID',
          title: 'EMPLOYEE ID',
          width: 115,
        },
        {
          key: 'FullName',
          title: 'NAME',
          width: 150,
        },
        {
          key: 'Email',
          title: 'EMAIL',
          width: 180,
        },
        {
          key: 'DepartmentName',
          title: 'DEPARTMENT',
          width: 130,
        },
        {
          key: 'DesignationName',
          title: 'DESIGNATION',
          width: 150,
        },
      ];

      const tableWidth = columns.reduce(
        (total, column) => total + column.width,
        0,
      );

      const tableX = startX;

      const rowH = 25;

      const pageBottom = doc.page.height - doc.page.margins.bottom - 30;

      let pageNum = 1;

      const drawHeaderRow = (yPos: number) => {
        doc.rect(tableX, yPos, tableWidth, rowH).fill(headerBg);

        let x = tableX;

        columns.forEach((column) => {
          doc
            .fillColor(brand)
            .font('Helvetica-Bold')
            .fontSize(8)
            .text(column.title, x + 7, yPos + 8, {
              width: column.width - 10,
              ellipsis: true,
            });

          x += column.width;
        });
      };

      const drawGrid = (fromY: number, toY: number) => {
        doc.strokeColor(borderColor).lineWidth(0.5);

        let x = tableX;

        doc.moveTo(x, fromY).lineTo(x, toY).stroke();

        columns.forEach((column) => {
          x += column.width;

          doc.moveTo(x, fromY).lineTo(x, toY).stroke();
        });

        doc.rect(tableX, fromY, tableWidth, toY - fromY).stroke();
      };

      const writeFooter = (currentPage: number) => {
        const footerY = doc.page.height - doc.page.margins.bottom - 12;

        doc
          .fontSize(8)
          .fillColor(TEXT_MUTED)
          .text(
            `Page ${currentPage} · Generated by HRMS Assistant`,
            startX,
            footerY,
            {
              width: tableWidth,
              align: 'center',
              lineBreak: false,
            },
          );
      };

      let sectionTop = y;

      drawHeaderRow(y);

      y += rowH;

      employees.forEach((employee, index) => {
        if (y + rowH > pageBottom) {
          drawGrid(sectionTop, y);

          writeFooter(pageNum);

          doc.addPage();

          pageNum += 1;

          y = 40;

          sectionTop = y;

          drawHeaderRow(y);

          y += rowH;
        }

        if (index % 2 === 1) {
          doc.rect(tableX, y, tableWidth, rowH).fill(rowAltBg);
        }

        let x = tableX;

        columns.forEach((column) => {
          const value = employee?.[column.key];

          const text =
            value === null || value === undefined || value === ''
              ? 'N/A'
              : String(value);

          doc
            .fillColor(TEXT_DARK)
            .font('Helvetica')
            .fontSize(8)
            .text(text, x + 7, y + 8, {
              width: column.width - 12,
              ellipsis: true,
            });

          x += column.width;
        });

        doc
          .strokeColor(borderColor)
          .lineWidth(0.5)
          .moveTo(tableX, y + rowH)
          .lineTo(tableX + tableWidth, y + rowH)
          .stroke();

        y += rowH;
      });

      drawGrid(sectionTop, y);

      if (!employees.length) {
        doc
          .fillColor(TEXT_MUTED)
          .fontSize(10)
          .text('No employees found.', startX, y + 14);
      }

      writeFooter(pageNum);

      doc.end();
    });
  }
}

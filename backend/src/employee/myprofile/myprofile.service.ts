// import { Injectable, BadRequestException } from '@nestjs/common';
// import { DatabaseService } from '../../database/database.service';
// import * as sql from 'mssql';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as crypto from 'crypto';
// @Injectable()
// export class MyprofileService {
//   constructor(
//     private readonly dbService: DatabaseService,
//   ) {}

//   // Friendly labels
//   private readonly labelMap: Record<string, string> = {
//     EmployeeId: 'Employee ID',
//     EmployeeName: 'Full Name',
//     FullName: 'Full Name',
//     DOJ: 'Date Of Joining',
//     DOB: 'Date Of Birth',
//     MobileNo: 'Mobile Number',
//     EmailId: 'Email',
//     IFSCCode: 'IFSC Code',
//     AccountNo: 'Account Number',
//     AccountNumber: 'Account Number',
//     PinCode: 'Pin Code',
//     AltMobileNo: 'Alt Mobile No',
//     OfficialEmailId: 'Official Email Id',
//     AlternateEmailId: 'Alternate Email Id',
//     ResidentialNameNo: 'Residential Name No',
//     BoardOrUniversity: 'Board Or University',
//     YearOfPassing: 'Year Of Passing',
//     GradeValue: 'Grade Value',
//     GradeType: 'Grade Type',
//   };

//   /**
//    * Convert DB column name to readable label.
//    */
//   private formatLabel(key: string): string {
//     return key
//       .replace(/_/g, ' ')
//       .replace(/([a-z])([A-Z])/g, '$1 $2')
//       .trim();
//   }

//   /**
//    * Format values before sending to frontend.
//    */
//   private formatValue(value: any): any {
//     if (value === null || value === undefined) return '';

//     if (value instanceof Date) {
//       return value.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       });
//     }

//     return value;
//   }

//   /**
//    * Map one record.
//    */
//   private mapFields(record: any) {
//     if (!record) return [];

//     return Object.entries(record)
//       .filter(([_, value]) => value !== null && value !== undefined)
//       .map(([key, value]) => ({
//         label: this.labelMap[key] || this.formatLabel(key),
//         value: this.formatValue(value),
//       }));
//   }

//   /**
//    * Generic mapper.
//    */
//   private mapRecords(records: any[]) {
//     if (!records || records.length === 0) return [];

//     return records.map((record) => ({
//       fields: this.mapFields(record),
//     }));
//   }

//   /**
//    * Address mapper (Present / Permanent heading)
//    */
//   private mapAddressRecords(records: any[]) {
//     if (!records || records.length === 0) return [];

//     return records.map((record) => {
//       const heading = record.AddressType;

//       const fields = Object.entries(record)
//         .filter(
//           ([key, value]) =>
//             key !== 'AddressType' &&
//             value !== null &&
//             value !== undefined,
//         )
//         .map(([key, value]) => ({
//           label: this.labelMap[key] || this.formatLabel(key),
//           value: this.formatValue(value),
//         }));

//       return {
//         heading,
//         fields,
//       };
//     });
//   }

//   /**
//    * Documents mapper with Actions
//    */
//   private mapDocumentRecords(records: any[]) {
//     if (!records || records.length === 0) return [];

//     return records.map((record) => {
//       const fields = this.mapFields(record);

//       fields.push({
//         label: 'Actions',
//         value: {
//           view: true,
//           download: true,
//         },
//       });

//       return {
//         fields,
//       };
//     });
//   }
//     async getEmployeeInfo(employeeId: string) {
//     try {
//       const pool = await this.dbService.connect();

//       const result = await pool
//         .request()
//         .input('EmployeeID', sql.VarChar(20), employeeId)
//         .execute('USP_GetEmployeeInfo');

//       return {
//         sections: [
//           {
//             title: 'Personal Information',
//             icon: 'user',
//             fields: this.mapFields(result.recordsets[0]?.[0]),
//           },

//           {
//             title: 'Address',
//             icon: 'map-pin',
//             records: this.mapAddressRecords(result.recordsets[1]),
//           },

//           {
//             title: 'Bank Details',
//             icon: 'bank',
//             fields: this.mapFields(result.recordsets[2]?.[0]),
//           },

//           {
//             title: 'Family Details',
//             icon: 'users',
//             records: this.mapRecords(result.recordsets[3]),
//           },

//           {
//             title: 'Documents',
//             icon: 'file-text',
//             records: this.mapDocumentRecords(result.recordsets[4]),
//           },

//           {
//             title: 'Experience',
//             icon: 'briefcase',
//             records: this.mapRecords(result.recordsets[5]),
//           },

//           {
//             title: 'Education',
//             icon: 'graduation-cap',
//             records: this.mapRecords(result.recordsets[6]),
//           },
//         ],
//       };
//     } catch (error) {
//       console.error(error);
//       throw new BadRequestException('Failed to fetch employee profile.');
//     }
//   }
// async uploadDocument(
//   employeeId: string,
//   body: any,
//   file: Express.Multer.File,
// ) {
//   try {
//     if (!file) {
//       throw new BadRequestException('File is required');
//     }

//     const pool = await this.dbService.connect();

//     const extension = path.extname(file.originalname);

//     const fileName = `${crypto.randomUUID()}${extension}`;

//     const uploadDir = path.join(
//   'C:\\HRMS\\Documents',
//   employeeId,
// );

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const fullFilePath = path.join(
//       uploadDir,
//       fileName,
//     );

//     fs.writeFileSync(
//       fullFilePath,
//       file.buffer,
//     );

// const dbFilePath = fullFilePath;
//     await pool
//       .request()
//       .input(
//         'EmployeeId',
//         sql.Int,
//         Number(employeeId),
//       )
//       .input(
//         'DocumentTypeId',
//         sql.Int,
//         Number(body.documentTypeId),
//       )
//       .input(
//         'DocumentNumber',
//         sql.VarChar(100),
//         body.documentNumber,
//       )
//       .input(
//         'DocumentTitle',
//         sql.VarChar(200),
//         body.documentTitle,
//       )
//       .input(
//         'FileName',
//         sql.VarChar(500),
//         fileName,
//       )
//       .input(
//         'FilePath',
//         sql.VarChar(1000),
//         dbFilePath,
//       )
//       .input(
//         'FileExtension',
//         sql.VarChar(20),
//         extension,
//       )
//       .input(
//         'FileSizeKB',
//         sql.Decimal(18, 2),
//         file.size / 1024,
//       )
//       .query(`
//         INSERT INTO EmployeeDocument
//         (
//           EmployeeId,
//           DocumentTypeId,
//           DocumentNumber,
//           DocumentTitle,
//           FileName,
//           FilePath,
//           FileExtension,
//           FileSizeKB,
//           VersionNo,
//           Status,
//           IsActive,
//           CreatedBy,
//           CreatedOn
//         )
//         VALUES
//         (
//           @EmployeeId,
//           @DocumentTypeId,
//           @DocumentNumber,
//           @DocumentTitle,
//           @FileName,
//           @FilePath,
//           @FileExtension,
//           @FileSizeKB,
//           1,
//           'Pending',
//           1,
//           @EmployeeId,
//           GETDATE()
//         )
//       `);

//     return {
//       success: true,
//       message: 'Document uploaded successfully',
//       fileName,
//       filePath: dbFilePath,
//     };
//   } catch (error) {
//     console.error(error);
//     throw new BadRequestException(
//       'Failed to upload document',
//     );
//   }
// }}

import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as sql from 'mssql';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
@Injectable()
export class MyprofileService {
  constructor(private readonly dbService: DatabaseService) {}

  // Friendly labels
  private readonly labelMap: Record<string, string> = {
    EmployeeId: 'Employee ID',
    EmployeeName: 'Full Name',
    FullName: 'Full Name',
    DOJ: 'Date Of Joining',
    DOB: 'Date Of Birth',
    MobileNo: 'Mobile Number',
    EmailId: 'Email',
    IFSCCode: 'IFSC Code',
    AccountNo: 'Account Number',
    AccountNumber: 'Account Number',
    PinCode: 'Pin Code',
    AltMobileNo: 'Alt Mobile No',
    OfficialEmailId: 'Official Email Id',
    AlternateEmailId: 'Alternate Email Id',
    ResidentialNameNo: 'Residential Name No',
    BoardOrUniversity: 'Board Or University',
    YearOfPassing: 'Year Of Passing',
    GradeValue: 'Grade Value',
    GradeType: 'Grade Type',
  };

  /**
   * Convert DB column name to readable label.
   */
  private formatLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
  }

  /**
   * Format values before sending to frontend.
   */
  private formatValue(value: any): any {
    if (value === null || value === undefined) return '';

    if (value instanceof Date) {
      return value.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    return value;
  }

  /**
   * Map one record.
   */
  private mapFields(record: any) {
    if (!record) return [];

    return Object.entries(record)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => ({
        label: this.labelMap[key] || this.formatLabel(key),
        value: this.formatValue(value),
      }));
  }

  /**
   * Generic mapper.
   */
  private mapRecords(records: any[]) {
    if (!records || records.length === 0) return [];

    return records.map((record) => ({
      fields: this.mapFields(record),
    }));
  }

  /**
   * Address mapper (Present / Permanent heading)
   */
  private mapAddressRecords(records: any[]) {
    if (!records || records.length === 0) return [];

    return records.map((record) => {
      const heading = record.AddressType;

      const fields = Object.entries(record)
        .filter(
          ([key, value]) =>
            key !== 'AddressType' && value !== null && value !== undefined,
        )
        .map(([key, value]) => ({
          label: this.labelMap[key] || this.formatLabel(key),
          value: this.formatValue(value),
        }));

      return {
        heading,
        fields,
      };
    });
  }

  /**
   * Documents mapper with Actions
   */
  private mapDocumentRecords(records: any[]) {
    if (!records || records.length === 0) return [];

    return records.map((record) => {
      const fields = this.mapFields(record);

      fields.push({
        label: 'Actions',
        value: {
          view: true,
          download: true,
        },
      });

      return {
        fields,
      };
    });
  }
  async getEmployeeInfo(employeeId: string) {
    try {
      const pool = await this.dbService.connect();

      const result = await pool
        .request()
        .input('EmployeeID', sql.VarChar(20), employeeId)
        .execute('USP_GetEmployeeInfo');

      return {
        sections: [
          {
            title: 'Personal Information',
            icon: 'user',
            fields: this.mapFields(result.recordsets[0]?.[0]),
          },

          {
            title: 'Address',
            icon: 'map-pin',
            records: this.mapAddressRecords(result.recordsets[1]),
          },

          {
            title: 'Bank Details',
            icon: 'bank',
            fields: this.mapFields(result.recordsets[2]?.[0]),
          },

          {
            title: 'Family Details',
            icon: 'users',
            records: this.mapRecords(result.recordsets[3]),
          },

          {
            title: 'Documents',
            icon: 'file-text',
            records: this.mapDocumentRecords(result.recordsets[4]),
          },

          {
            title: 'Experience',
            icon: 'briefcase',
            records: this.mapRecords(result.recordsets[5]),
          },

          {
            title: 'Education',
            icon: 'graduation-cap',
            records: this.mapRecords(result.recordsets[6]),
          },
        ],
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to fetch employee profile.');
    }
  }
  async uploadDocument(
    employeeId: string,
    body: any,
    file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('File is required');
      }

      const pool = await this.dbService.connect();

      const extension = path.extname(file.originalname);

      const fileName = `${crypto.randomUUID()}${extension}`;

      const uploadDir = path.join('C:\\HRMS\\Documents', employeeId);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fullFilePath = path.join(uploadDir, fileName);

      fs.writeFileSync(fullFilePath, file.buffer);

      const dbFilePath = fullFilePath;
      await pool
        .request()
        .input('EmployeeId', sql.Int, Number(employeeId))
        .input('DocumentTypeId', sql.Int, Number(body.documentTypeId))
        .input('DocumentNumber', sql.VarChar(100), body.documentNumber)
        .input('DocumentTitle', sql.VarChar(200), body.documentTitle)
        .input('FileName', sql.VarChar(500), fileName)
        .input('FilePath', sql.VarChar(1000), dbFilePath)
        .input('FileExtension', sql.VarChar(20), extension)
        .input('FileSizeKB', sql.Decimal(18, 2), file.size / 1024).query(`
        INSERT INTO EmployeeDocument
        (
          EmployeeId,
          DocumentTypeId,
          DocumentNumber,
          DocumentTitle,
          FileName,
          FilePath,
          FileExtension,
          FileSizeKB,
          VersionNo,
          Status,
          IsActive,
          CreatedBy,
          CreatedOn
        )
        VALUES
        (
          @EmployeeId,
          @DocumentTypeId,
          @DocumentNumber,
          @DocumentTitle,
          @FileName,
          @FilePath,
          @FileExtension,
          @FileSizeKB,
          1,
          'Pending',
          1,
          @EmployeeId,
          GETDATE()
        )
      `);

      return {
        success: true,
        message: 'Document uploaded successfully',
        fileName,
        filePath: dbFilePath,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to upload document');
    }
  }
}

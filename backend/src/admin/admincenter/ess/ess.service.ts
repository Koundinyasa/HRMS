import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { mkdir, rename, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import * as sql from 'mssql';
import { basename, extname, join, resolve } from 'path';
 
import { DatabaseService } from '../../../database/database.service';
import { CreateEssModuleDto } from './dto/create-ess-module.dto';
import { UpdateEssModuleDto } from './dto/update-ess-module.dto';
import { DeleteEssModuleDto } from './dto/delete-ess-module.dto';
 
// Name of the uploads folder under the root. Change it here only.
export const ESS_UPLOADS_DIR = 'ESS_Uploads';
 
// Read at call time, not at import time: the .env file is loaded after this
// file is first imported, so a constant here would silently fall back to the
// local documents folder.
export const getEssDocumentsRoot = () =>
  process.env.ESS_UPLOAD_ROOT
    ? resolve(process.env.ESS_UPLOAD_ROOT)
    : resolve(process.cwd(), 'documents');
 
// Multer saves every upload here first. The service then moves it into the
// module folder once the module is known (the form fields are not available
// when multer picks the folder).
export const getEssTempDir = () =>
  resolve(getEssDocumentsRoot(), ESS_UPLOADS_DIR, '_incoming');
 
// Modules that can carry an attachment -> folder under <root>/ESS_Uploads
// Stored FilePath looks like /ESS_Uploads/circulars/townhall_q3.pdf
const ESS_FILE_FOLDERS: Record<number, string> = {
  1: 'circulars',
  2: 'notifications',
  5: 'policies',
};
 
const toInt = (value?: string) =>
  value === undefined || value === '' ? null : Number(value);
 
const toText = (value?: string) =>
  value === undefined || value === '' ? null : value;
 
const toBit = (value?: string) => {
  const normalized = value?.toLowerCase();
  return normalized === 'true' || normalized === '1';
};
 
// "Townhall Q3 (final).pdf" -> "townhall_q3_final"
const toReadableName = (originalName: string, fallback: string) => {
  const base = basename(originalName, extname(originalName));
 
  const clean = base
    .normalize('NFKD')
    .replace(/[^\w\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .toLowerCase()
    .slice(0, 60);
 
  return clean || fallback;
};
 
// Never overwrite an existing file: townhall_q3.pdf, townhall_q3_1.pdf, ...
const toUniqueFileName = (dir: string, name: string, extension: string) => {
  let candidate = `${name}${extension}`;
  let counter = 1;
 
  while (existsSync(join(dir, candidate))) {
    candidate = `${name}_${counter}${extension}`;
    counter++;
  }
 
  return candidate;
};
 
@Injectable()
export class EssService implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}
 
  // =========================================================
  // Create the upload folders when the app starts, so they exist before the
  // first upload: <root>/ESS_Uploads/_incoming, circulars, notifications,
  // policies
  // =========================================================
 
  async onModuleInit() {
    const root = getEssDocumentsRoot();
    const folders = [...Object.values(ESS_FILE_FOLDERS), '_incoming'];
 
    for (const folder of folders) {
      const dir = resolve(root, ESS_UPLOADS_DIR, folder);
 
      try {
        await mkdir(dir, { recursive: true });
      } catch (error) {
        console.error('[ESS UPLOAD LOG] cannot create folder:', dir, error);
      }
    }
  }
 
  // =========================================================
  // Move the uploaded file from the temp folder into its module folder and
  // return the path that is stored in the database.
  // Returns null when the module has no attachment (the file is discarded).
  // =========================================================
 
  private async storeEssFile(
    essInsightId: number | null,
    file: Express.Multer.File,
  ) {
    const folder =
      essInsightId === null ? undefined : ESS_FILE_FOLDERS[essInsightId];
 
    if (!folder) {
      await unlink(file.path).catch(() => undefined);
      return null;
    }
 
    const root = getEssDocumentsRoot();
    const targetDir = resolve(root, ESS_UPLOADS_DIR, folder);
 
    await mkdir(targetDir, { recursive: true });
 
    const extension = extname(file.originalname).toLowerCase();
    const fileName = toUniqueFileName(
      targetDir,
      toReadableName(file.originalname, folder),
      extension,
    );
 
    const absolutePath = join(targetDir, fileName);
    await rename(file.path, absolutePath);
 
    const filePath = `/${ESS_UPLOADS_DIR}/${folder}/${fileName}`;
 
    return { filePath, absolutePath };
  }
 
  // =========================================================
  // GET ESS MODULE
  // Uses USP_GetEssModule. This SP remains unchanged.
  // =========================================================
 
  async getEssModule(
    essInsightId: number,
    statusId?: number,
    id?: number,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const request = pool
        .request()
        .input('ESSInsightID', sql.Int, essInsightId)
        .input('ID', sql.Int, id ?? null);
 
      if (statusId !== undefined) {
        request.input('StatusID', sql.Int, statusId);
      }
 
      const result = await request.execute('USP_GetEssModule');
      const rows = result.recordset ?? [];
 
      if (rows.length > 0 && rows[0].StatusCode !== undefined) {
        throw new BadRequestException(rows[0].Message);
      }
 
      return {
        success: true,
        message: 'ESS module data retrieved successfully.',
        data: rows,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
 
      console.error('Error while fetching ESS module data:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve ESS module data.',
      );
    }
  }
 
  // =========================================================
  // CREATE ESS RECORD
  // Uses USP_EssModuleSave.
  // =========================================================
 
  async createEssModule(
    dto: CreateEssModuleDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    // Where the uploaded file currently is (temp folder, then module folder)
    let currentFilePath = file?.path;
 
    try {
      const pool = await this.databaseService.connect();
 
      const stored = file
        ? await this.storeEssFile(toInt(dto.essInsightId), file)
        : null;
 
      currentFilePath = stored?.absolutePath ?? currentFilePath;
      const filePath = stored?.filePath ?? null;
 
      const result = await pool
        .request()
        .input('ESSInsightID', sql.Int, toInt(dto.essInsightId))
        .input('FromDate', sql.Date, toText(dto.fromDate))
        .input('Title', sql.NVarChar(255), toText(dto.title))
        .input('CategoryID', sql.Int, toInt(dto.categoryId))
        .input('AckTypeID', sql.Int, toInt(dto.ackTypeId))
        .input('QuestionTypeID', sql.Int, toInt(dto.questionTypeId))
        .input('Content', sql.NVarChar(sql.MAX), toText(dto.content))
        .input('FilePath', sql.NVarChar(500), filePath)
        .input('ToDate', sql.Date, toText(dto.toDate))
        .input(
          'IsDownloadRestricted',
          sql.Bit,
          toBit(dto.isDownloadRestricted),
        )
        .input('UserID', sql.Int, userId)
        .input('Filter', sql.Int, toInt(dto.filter))
        .input('SubFilter', sql.Int, toInt(dto.subFilter))
        // ID is omitted, so the SP default NULL causes an insert.
        // IsInactivate is omitted, so the SP default is 0.
        .execute('USP_EssModuleSave');
 
      const row = result.recordset?.[0];
 
      if (!row) {
        throw new Error('USP_EssModuleSave returned no result.');
      }
 
      if (String(row.StatusCode) === '400') {
        throw new BadRequestException(row.Message);
      }
 
      if (String(row.StatusCode) !== '200') {
        throw new Error(`USP_EssModuleSave failed: ${row.Message}`);
      }
 
      return {
        success: true,
        message: row.Message,
        data: {
          recordId: row.RecordID,
          filePath,
        },
      };
    } catch (error) {
      // Nothing was saved, so do not leave the uploaded file behind
      if (currentFilePath) {
        await unlink(currentFilePath).catch(() => undefined);
      }
 
      if (error instanceof HttpException) {
        throw error;
      }
 
      console.error('Error while creating ESS record:', error);
      throw new InternalServerErrorException(
        'Failed to create ESS record.',
      );
    }
  }
 
  // =========================================================
  // UPDATE ESS RECORD
  // =========================================================
 
  async updateEssModule(
    dto: UpdateEssModuleDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    // Where the uploaded file currently is (temp folder, then module folder)
    let currentFilePath = file?.path;
 
    try {
      const pool = await this.databaseService.connect();
 
      const stored = file
        ? await this.storeEssFile(toInt(dto.essInsightId), file)
        : null;
 
      currentFilePath = stored?.absolutePath ?? currentFilePath;
      const filePath = stored?.filePath ?? null;
 
      const result = await pool
        .request()
        .input('ESSInsightID', sql.Int, toInt(dto.essInsightId))
        .input('FromDate', sql.Date, toText(dto.fromDate))
        .input('ID', sql.Int, toInt(dto.id))
        .input('Title', sql.NVarChar(255), toText(dto.title))
        .input('CategoryID', sql.Int, toInt(dto.categoryId))
        .input('AckTypeID', sql.Int, toInt(dto.ackTypeId))
        .input('QuestionTypeID', sql.Int, toInt(dto.questionTypeId))
        .input('Content', sql.NVarChar(sql.MAX), toText(dto.content))
        .input('FilePath', sql.NVarChar(500), filePath)
        .input('ToDate', sql.Date, toText(dto.toDate))
        .input(
          'IsDownloadRestricted',
          sql.Bit,
          toBit(dto.isDownloadRestricted),
        )
        .input('UserID', sql.Int, userId)
        .input('Filter', sql.Int, toInt(dto.filter))
        .input('SubFilter', sql.Int, toInt(dto.subFilter))
        .execute('USP_EssModuleSave');
 
      const row = result.recordset?.[0];
 
      if (!row) {
        throw new Error('USP_EssModuleSave returned no result.');
      }
 
      if (String(row.StatusCode) === '400') {
        throw new BadRequestException(row.Message);
      }
 
      if (String(row.StatusCode) === '404') {
        throw new NotFoundException(row.Message);
      }
 
      if (String(row.StatusCode) !== '200') {
        throw new Error(`USP_EssModuleSave failed: ${row.Message}`);
      }
 
      return {
        success: true,
        message: row.Message,
        data: {
          recordId: row.RecordID,
          filePath,
        },
      };
    } catch (error) {
      // Nothing was saved, so do not leave the uploaded file behind
      if (currentFilePath) {
        await unlink(currentFilePath).catch(() => undefined);
      }
 
      if (error instanceof HttpException) {
        throw error;
      }
 
      console.error('Error while updating ESS record:', error);
      throw new InternalServerErrorException(
        'Failed to update ESS record.',
      );
    }
  }
 
  // =========================================================
  // DELETE / INACTIVATE ESS RECORD
  // =========================================================
 
  async deleteEssModule(dto: DeleteEssModuleDto, userId: number) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('ESSInsightID', sql.Int, toInt(dto.essInsightId))
        .input('FromDate', sql.Date, null)
        .input('ID', sql.Int, toInt(dto.id))
        .input('UserID', sql.Int, userId)
        .input('IsInactivate', sql.Bit, true)
        .execute('USP_EssModuleSave');
 
      const row = result.recordset?.[0];
 
      if (!row) {
        throw new Error('USP_EssModuleSave returned no result.');
      }
 
      if (String(row.StatusCode) === '400') {
        throw new BadRequestException(row.Message);
      }
 
      if (String(row.StatusCode) === '404') {
        throw new NotFoundException(row.Message);
      }
 
      if (String(row.StatusCode) !== '200') {
        throw new Error(`USP_EssModuleSave failed: ${row.Message}`);
      }
 
      return {
        success: true,
        message: row.Message,
        data: { recordId: row.RecordID },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
 
      console.error('Error while deleting ESS record:', error);
      throw new InternalServerErrorException(
        'Failed to delete ESS record.',
      );
    }
  }
 
  // =========================================================
  // ESS DROPDOWNS
  // USP_GetESSDropdown returns five separate result sets:
  // 0 = Ack types, 1 = Poll types, 2 = Filter types,
  // 3 = Departments, 4 = Designations.
  // =========================================================
 
  async getEssDropdowns() {
    try {
      const pool = await this.databaseService.connect();
      const result = await pool.request().execute('USP_GetESSDropdown');
 
      const sets = result.recordsets as unknown as any[][];
 
      if (sets.length < 5) {
        throw new Error(
          `USP_GetESSDropdown returned ${sets.length} result sets; expected 5.`,
        );
      }
 
      return {
        success: true,
        message: 'ESS dropdowns retrieved successfully.',
        data: {
          ackTypes: sets[0] ?? [],
          pollTypes: sets[1] ?? [],
          filterTypes: sets[2] ?? [],
          departments: sets[3] ?? [],
          designations: sets[4] ?? [],
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
 
      console.error('Error while fetching ESS dropdowns:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve ESS dropdowns.',
      );
    }
  }
 
  // =========================================================
  // POLICY READ STATUS
  // =========================================================
 
  async getEssPolicyReadStatus(policyId: number) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('PolicyID', sql.Int, policyId)
        .execute('USP_GetEssPolicyReadStatus');
 
      const sets = result.recordsets as unknown as any[][];
      const first = sets[0]?.[0];
 
      if (first?.Status !== undefined) {
        if (String(first.Message).toLowerCase().includes('not found')) {
          throw new NotFoundException(first.Message);
        }
 
        throw new Error(
          `USP_GetEssPolicyReadStatus failed: ${first.Message}`,
        );
      }
 
      if (sets.length !== 2) {
        throw new Error(
          `USP_GetEssPolicyReadStatus returned ${sets.length} result sets, expected 2.`,
        );
      }
 
      return {
        success: true,
        message: 'Policy read status retrieved successfully.',
        data: {
          seen: sets[0],
          unseen: sets[1],
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
 
      console.error('Error while fetching policy read status:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve policy read status.',
      );
    }
  }
}
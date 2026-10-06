import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { access, mkdir, writeFile } from 'fs/promises';
import path from 'path';

const RESUME_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

@Injectable()
export class RecruitmentResumeStorageService {
  private readonly storageDirectory =
    process.env.RECRUITMENT_RESUME_STORAGE_PATH ??
    path.resolve(process.cwd(), 'private-uploads', 'recruitment-resumes');

  async save(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Please select a resume file.');
    }

    const extension = path.extname(file.originalname).toLowerCase();
    if (!RESUME_EXTENSIONS.has(extension) || !this.hasValidSignature(file, extension)) {
      throw new BadRequestException(
        'Upload a valid PDF, DOC, or DOCX resume file.',
      );
    }

    await mkdir(this.storageDirectory, { recursive: true, mode: 0o700 });
    const fileName = `${randomUUID()}${extension}`;
    const filePath = path.join(this.storageDirectory, fileName);
    await writeFile(filePath, file.buffer, { flag: 'wx', mode: 0o600 });

    return `/recruitment/resumes/${fileName}`;
  }

  async getPath(fileName: string): Promise<string> {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|doc|docx)$/i.test(
        fileName,
      )
    ) {
      throw new NotFoundException('Resume not found.');
    }

    const filePath = path.join(this.storageDirectory, fileName);
    try {
      await access(filePath);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        throw new NotFoundException('Resume not found.');
      }
      throw error;
    }

    return filePath;
  }

  private hasValidSignature(file: Express.Multer.File, extension: string) {
    if (extension === '.pdf') {
      return file.buffer.subarray(0, 5).toString('ascii') === '%PDF-';
    }
    if (extension === '.doc') {
      return file.buffer.subarray(0, 8).equals(
        Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
      );
    }
    return file.buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  }
}

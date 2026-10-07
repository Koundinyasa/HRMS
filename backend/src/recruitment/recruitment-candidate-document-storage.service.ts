import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { access, mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';

const DOCUMENT_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

@Injectable()
export class RecruitmentCandidateDocumentStorageService {
  private readonly storageDirectory =
    process.env.RECRUITMENT_CANDIDATE_DOCUMENT_STORAGE_PATH ??
    path.resolve(process.cwd(), 'private-uploads', 'candidate-documents');

  async save(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Please select a document.');
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      throw new BadRequestException('Document file must be 10 MB or smaller.');
    }

    const extension = path.extname(file.originalname).toLowerCase();
    if (
      DOCUMENT_TYPES[extension] !== file.mimetype ||
      !this.hasValidSignature(file, extension)
    ) {
      throw new BadRequestException(
        'Upload a valid PDF, JPG, JPEG, or PNG document.',
      );
    }

    await mkdir(this.storageDirectory, { recursive: true, mode: 0o700 });
    const fileName = `${randomUUID()}${extension}`;
    await writeFile(path.join(this.storageDirectory, fileName), file.buffer, {
      flag: 'wx',
      mode: 0o600,
    });

    return `/recruitment/candidate-documents/${fileName}`;
  }

  async getPath(fileName: string): Promise<string> {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|jpe?g|png)$/i.test(
        fileName,
      )
    ) {
      throw new NotFoundException('Candidate document not found.');
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
        throw new NotFoundException('Candidate document not found.');
      }
      throw error;
    }

    return filePath;
  }

  async remove(documentUrl: string): Promise<void> {
    const fileName = path.basename(documentUrl);
    await unlink(await this.getPath(fileName));
  }

  private hasValidSignature(file: Express.Multer.File, extension: string) {
    if (extension === '.pdf') {
      return file.buffer.subarray(0, 5).toString('ascii') === '%PDF-';
    }
    if (extension === '.png') {
      return file.buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    }
    return (
      file.buffer[0] === 0xff &&
      file.buffer[1] === 0xd8 &&
      file.buffer[2] === 0xff
    );
  }
}

import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  Post,
  Body,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyprofileService } from './myprofile.service';

@Controller('employee/myprofile')
export class MyprofileController {
  constructor(private readonly myprofileService: MyprofileService) {}

  @Get('info')
  async getMyProfile(@Req() req: any) {
    return await this.myprofileService.getEmployeeInfo(req.user.employeeId);
  }

  /** One of the signed-in employee's own documents (?download=1 forces a download). */
  @Get('documents/file/:fileName')
  async getDocumentFile(
    @Req() req: any,
    @Param('fileName') fileName: string,
    @Query('download') download: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.myprofileService.getDocumentFile(
      req.user.employeeId,
      fileName,
    );
    const asAttachment = download === '1' || !file.canShowInline;
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `${asAttachment ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(file.downloadName)}`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    });
    return new StreamableFile(fs.createReadStream(file.fullPath));
  }

  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return await this.myprofileService.uploadDocument(
      req.user.employeeId,
      body,
      file,
    );
  }
}

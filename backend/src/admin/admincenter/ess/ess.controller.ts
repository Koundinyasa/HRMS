import {
  BadRequestException,
  Body,
  CallHandler,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  HttpException,
  Injectable,
  NestInterceptor,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { catchError, throwError } from 'rxjs';
 
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { EssService, getEssTempDir } from './ess.service';
import { CreateEssModuleDto } from './dto/create-ess-module.dto';
import { UpdateEssModuleDto } from './dto/update-ess-module.dto';
import { DeleteEssModuleDto } from './dto/delete-ess-module.dto';
 
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
];
 
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];
 
// Multer only receives the file into a temp folder. The service moves it into
// its module folder (/uploads/circulars, /uploads/notifications, ...) and
// builds the readable name that is stored in the database.
const essUploadOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      try {
        // Resolved per request so the configured (.env) folder is used
        const dir = getEssTempDir();
 
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
 
        cb(null, dir);
      } catch (error) {
        // Folder missing / share unreachable / no permission: reported to the
        // error interceptor instead of crashing the request
        console.error('[ESS UPLOAD LOG] cannot use upload folder:', error);
        cb(error as Error, '');
      }
    },
    filename: (_req, file, cb) => {
      cb(
        null,
        `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
      );
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    const extension = extname(file.originalname).toLowerCase();
 
    if (
      !ALLOWED_MIME_TYPES.includes(file.mimetype) ||
      !ALLOWED_EXTENSIONS.includes(extension)
    ) {
      return cb(
        new BadRequestException(
          'Only PDF, PNG and JPG files are allowed.',
        ),
        false,
      );
    }
 
    cb(null, true);
  },
};
 
@Injectable()
class EssUploadErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
 
    return next.handle().pipe(
      catchError((error: any) => {
        // Removes the file if it is still in the temp folder. Once the service
        // has moved it, the service cleans it up itself.
        if (req.file?.path) {
          unlink(req.file.path).catch(() => undefined);
        }
 
        if (error instanceof HttpException) {
          return throwError(() => error);
        }
 
        if (error?.syscall) {
          console.error('ESS upload failed:', error);
          return throwError(() => error);
        }
 
        return throwError(
          () =>
            new BadRequestException(
              error?.message || 'Invalid file upload request.',
            ),
        );
      }),
    );
  }
}
 
@Controller('admin/ess')
@UseGuards(JwtAuthGuard)
export class EssController {
  constructor(private readonly essService: EssService) {}
 
  // GET /api/admin/ess/module?essInsightId=1&statusId=63&id=5
  @Get('module')
  async getEssModule(
    @Query('essInsightId', ParseIntPipe) essInsightId: number,
    @Query('statusId') statusId?: string,
    @Query('id') id?: string,
  ) {
    return this.essService.getEssModule(
      essInsightId,
      statusId === undefined ? undefined : Number(statusId),
      id === undefined ? undefined : Number(id),
    );
  }
 
  // GET /api/admin/ess/dropdowns
  // Calls USP_GetESSDropdown once and returns all five dropdown collections.
  @Get('dropdowns')
  async getEssDropdowns() {
    return this.essService.getEssDropdowns();
  }
 
 
  // POST /api/admin/ess/create
  // multipart/form-data; optional file field named "file"
  @Post('create')
  @UseInterceptors(
    EssUploadErrorInterceptor,
    FileInterceptor('file', essUploadOptions),
  )
  async createEssModule(
    @Req() req: any,
    @Body() dto: CreateEssModuleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.essService.createEssModule(
      dto,
      req.user.createdBy,
      file,
    );
  }
 
  // PUT /api/admin/ess/update
  // multipart/form-data; id required; optional file field named "file"
  @Put('update')
  @UseInterceptors(
    EssUploadErrorInterceptor,
    FileInterceptor('file', essUploadOptions),
  )
  async updateEssModule(
    @Req() req: any,
    @Body() dto: UpdateEssModuleDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.essService.updateEssModule(
      dto,
      req.user.createdBy,
      file,
    );
  }
 
  // DELETE /api/admin/ess/delete?essInsightId=1&id=5
  @Delete('delete')
  async deleteEssModule(
    @Req() req: any,
    @Query() dto: DeleteEssModuleDto,
  ) {
    return this.essService.deleteEssModule(
      dto,
      req.user.createdBy,
    );
  }
 
  // GET /api/admin/ess/policy-read-status?policyId=5
  @Get('policy-read-status')
  async getEssPolicyReadStatus(
    @Query('policyId', ParseIntPipe) policyId: number,
  ) {
    return this.essService.getEssPolicyReadStatus(policyId);
  }
}
import { HelpdeskService } from './helpdesk.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
 
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketActionDto } from './dto/ticket-action.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { ReopenTicketDto } from './dto/reopen-ticket.dto';
 
@Controller('employee/helpdesk')
export class HelpdeskController {
  constructor(
    private readonly helpdeskService: HelpdeskService,
  ) {}
 
  @Get('departments')
  getDepartments() {
    return this.helpdeskService.getDepartments();
  }
  @Get('knowledgebase')
getKnowledgeBase() {
  return this.helpdeskService.getKnowledgeBase();
}
  @Get('categories/:departmentId')
getCategories(
  @Param('departmentId')
  departmentId: number,
) {
  return this.helpdeskService.getCategories(
    Number(departmentId),
  );
}
@Get('subcategories/:categoryId')
getSubCategories(
  @Param('categoryId')
  categoryId: number,
) {
  return this.helpdeskService.getSubCategories(
    Number(categoryId),
  );
}
@UseGuards(JwtAuthGuard)
@Post('ticket')
async raiseTicket(
  @Req() req,
  @Body() body: CreateTicketDto,
) {
  return this.helpdeskService.raiseTicket(
    req.user.employeeId,
    body,
  );
}
@Get('mytickets')
@UseGuards(JwtAuthGuard)
async getMyTickets(
  @Req() req,
) {
  return this.helpdeskService.getMyTickets(
    req.user.employeeId,
  );
}
@Get('pending')
@UseGuards(JwtAuthGuard)
async getPendingTickets(
  @Req() req,
) {
  return this.helpdeskService.getPendingTickets(
    req.user.employeeId,
  );
}
@Post('action')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileInterceptor('document', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const employeeId =
          (req as any).user.employeeId;
 
        const uploadPath = path.join(
          process.cwd(),
          'uploads',
          'helpdesk',
          employeeId,
        );
 
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, {
            recursive: true,
          });
        }
 
        cb(null, uploadPath);
      },
 
      filename: (req, file, cb) => {
        const uniqueFileName =
          `${uuid()}${extname(file.originalname)}`;
 
        cb(null, uniqueFileName);
      },
    }),
  }),
)
async ticketAction(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
) {
  const employeeId = req.user.employeeId;
 
  const fileName = file
    ? file.originalname
    : undefined;
 
  const filePath = file
    ? `helpdesk/${employeeId}/${file.filename}`
    : undefined;
  return this.helpdeskService.ticketAction(
    Number(body.ticketId),
    employeeId,
    Number(body.actionStatusId),
    body.remarks,
    fileName,
    filePath,
  );
}
@Post('assign')
@UseGuards(JwtAuthGuard)
async assignTicket(
  @Req() req,
  @Body() body: AssignTicketDto,
) {
  return this.helpdeskService.assignTicket(
    body.ticketId,
    req.user.employeeId,
    body.assignToEmployeeId,
  );
}
@UseGuards(JwtAuthGuard)
@Post('reply')
@UseInterceptors(
  FileInterceptor('document', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const employeeId = (req as any).user.employeeId;
 
        const uploadPath = path.join(
          process.cwd(),
          'uploads',
          'helpdesk',
          employeeId,
        );
 
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, {
            recursive: true,
          });
        }
 
        cb(null, uploadPath);
      },
 
      filename: (req, file, cb) => {
        const uniqueFileName =
          `${uuid()}${extname(file.originalname)}`;
 
        cb(null, uniqueFileName);
      },
    }),
  }),
)
async replyTicket(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: ReplyTicketDto,
) {
  const employeeId = req.user.employeeId;
 
  const fileName = file
    ? file.originalname
    : undefined;
 
  const filePath = file
    ? `helpdesk/${employeeId}/${file.filename}`
    : undefined;
 
  return this.helpdeskService.replyTicket(
    Number(body.ticketId),
    employeeId,
    body.remarks,
    fileName,
    filePath,
  );
}
@Post('reopen')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileInterceptor('document', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const employeeId =
          (req as any).user.employeeId;
 
        const uploadPath = path.join(
          process.cwd(),
          'uploads',
          'helpdesk',
          employeeId,
        );
 
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, {
            recursive: true,
          });
        }
 
        cb(null, uploadPath);
      },
 
      filename: (req, file, cb) => {
        const uniqueFileName =
          `${uuid()}${extname(file.originalname)}`;
 
        cb(null, uniqueFileName);
      },
    }),
  }),
)
async reopenTicket(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
) {
  const employeeId = req.user.employeeId;
 
  const fileName = file
    ? file.originalname
    : undefined;
 
  const filePath = file
    ? `helpdesk/${employeeId}/${file.filename}`
    : undefined;
 
  return this.helpdeskService.reopenTicket(
    Number(body.ticketId),
    employeeId,
    body.remarks,
    fileName,
    filePath,
  );
}
}
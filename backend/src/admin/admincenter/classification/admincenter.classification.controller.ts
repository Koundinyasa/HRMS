import {
  Controller,
  Get,
  Req,
  Param,
  UseGuards,
  Body,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { AdmincenterClassificationService } from './admincenter.classification.service';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UpdateLeavePolicyDetailsDto } from './dto/update-leave-policy-details.dto';
import { CreateLeavePolicyDetailsDto } from './dto/create-leave-policy-details.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';

import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateBranchStatusDto } from './dto/update-branch-status.dto';

import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { UpdateDesignationStatusDto } from './dto/update-designation-status.dto';

import { BankInfoDto } from './dto/bank-info.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';


@Controller('admin/classification')
@UseGuards(JwtAuthGuard)
export class AdmincenterClassificationController {
  constructor(
    private readonly classificationService: AdmincenterClassificationService,
  ) {}

  @Get('summary')
  getClassificationSummary(@Req() req) {
    return this.classificationService.getClassificationSummary(
      req.user.companyId,
    );
  }

   @Post('details')
   getClassificationDetails(
    @Req() req, @Body('classificationId') classificationId: number,) {
    return this.classificationService.getClassificationDetails(
      req.user.companyId,
      classificationId,
    );
  }

  @Post('leave-policy')
  async addLeavePolicy(
    @Body() dto: CreateLeavePolicyDto,
    @Req() req,
  ) {
     console.log(req.user);
    return this.classificationService.addLeavePolicy(
      dto,
      req.user.createdBy,
    );
  }

  @Put('leave-policy')
  async updateLeavePolicy(
    @Body() dto: UpdateLeavePolicyDto,
    @Req() req,
  ) {
    return this.classificationService.updateLeavePolicy(
      dto,
      req.user.createdBy,
    );
  }

  @Put('leave-policy/details')
  async updateLeavePolicyDetails(
    @Body() dto: UpdateLeavePolicyDetailsDto,
    @Req() req,
  ) {
    return this.classificationService.updateLeavePolicyDetails(
      dto,
      req.user.createdBy,
    );
  }

  @Post('leave-policy/details')
  async addLeavePolicyDetails(
    @Body() dto: CreateLeavePolicyDetailsDto,
    @Req() req,
  ) {
    return this.classificationService.addLeavePolicyDetails(
      dto,
      req.user.createdBy,
    );
  }


  
  // Branch Management Endpoints

  @Post('branch')
  createBranch(
    @Req() req,
    @Body() dto: CreateBranchDto,
  ) {
    return this.classificationService.createBranch(
      req.user.createdBy,
      dto,
    );
  }

  @Put('branch')
  updateBranch(
    @Req() req,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.classificationService.updateBranch(
      req.user.createdBy,
      dto,
    );
  }

  @Put('branch/status')
  updateBranchStatus(
    @Req() req,
    @Body() dto: UpdateBranchStatusDto,
  ) {
    return this.classificationService.updateBranchStatus(
      req.user.createdBy,
      dto,
    );
  }


  // Designation Management Endpoints

  @Post('designation')
  createDesignation(
    @Req() req,
    @Body() dto: CreateDesignationDto,
  ) {
    return this.classificationService.createDesignation(
      req.user.createdBy,
      dto,
    );
  }


  @Put('designation')
  updateDesignation(
    @Req() req,
    @Body() dto: UpdateDesignationDto,
  ) {
    return this.classificationService.updateDesignation(
      req.user.createdBy,
      dto,
    );
  }


  @Put('designation/status')
  updateDesignationStatus(
    @Req() req,
    @Body() dto: UpdateDesignationStatusDto,
  ) {
    return this.classificationService.updateDesignationStatus(
      req.user.createdBy,
      dto,
    );
  }


  @Post('bank/info')
  async getBankInfo(
    @Body() dto: BankInfoDto,
    @Req() req: any,
  ) {
    console.log('User:', req.user);
  console.log('userId:', req.user.userId);
  console.log('typeof:', typeof req.user.userId);
    return this.classificationService.getBankInfo(
      dto.ifsc,
      req.user.createdBy,
    );
  }


  //Additional Classification is Pending, will be added in future



  //Import /Export Endpoints
  @Get('import/template/:type')
  downloadTemplate(
    @Param('type') type: string,
    @Res() res: Response,
  ) {
    return this.classificationService.downloadTemplate(
      type,
      res,
    );
  }

  @Post('import/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/admin/admincenter/classification/uploads',
        filename: (req, file, cb) => {
          cb(
            null,
            Date.now() + extname(file.originalname),
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(/\.(xlsx|xls)$/)
        ) {
          return cb(
            new Error('Only Excel files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadImportFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('templateType') templateType: string,
  ) {
    return this.classificationService.uploadImportFile(
      file,
      templateType,
    );
  }

}
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  StreamableFile,
<<<<<<< HEAD
  Query,
=======
>>>>>>> 2cbd7b52227a122381ddbda8b9f09199185fbe7e
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { createReadStream } from 'fs';
import path from 'path';

import { RecruitmentService } from './recruitment.service';
import { RecruitmentResumeStorageService } from './recruitment-resume-storage.service';
<<<<<<< HEAD
import { RecruitmentCandidateDocumentStorageService } from './recruitment-candidate-document-storage.service';
=======
>>>>>>> 2cbd7b52227a122381ddbda8b9f09199185fbe7e
import { RequisitionActionDto } from './dto/requisition-action.dto';
import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { PublishJobOpeningDto } from './dto/publish-job-opening.dto';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { ResumeScreeningDto } from './dto/resume-screening.dto';
import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
import { ScheduleCandidateAssessmentDto } from './dto/schedule-candidate-assessment.dto';
import { ScheduleCandidateInterviewDto } from './dto/schedule-candidate-interview.dto';
import { UpdateCandidateAssessmentResultDto } from './dto/update-candidate-assessment-result.dto';
import { FinalInterviewApprovalDto } from './dto/final-interview-approval.dto';
import { SubmitInterviewFeedbackDto } from './dto/submit-interview-feedback.dto';
import { CreateCandidateOfferDto } from './dto/create-candidate-offer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadCandidateDocumentDto } from './dto/upload-candidate-document.dto';
import { BgvCandidateDto } from './dto/bgv-candidate.dto';
import { ApproveCandidateJoiningDto } from './dto/approve-candidate-joining.dto';
import { SkipCandidateAssessmentDto } from "./dto/skip-candidate-assessment.dto";
<<<<<<< HEAD
import { MailService } from '../mail/mail.service';
import { SendWelcomeEmailDto } from './dto/send-welcome-email.dto';
import { SendJoiningEmailDto } from './dto/send-joining-email.dto';
import { SendTeamAssignmentEmailDto } from './dto/send-team-assignment-email.dto';
=======
>>>>>>> 2cbd7b52227a122381ddbda8b9f09199185fbe7e

@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly resumeStorage: RecruitmentResumeStorageService,
<<<<<<< HEAD
    private readonly candidateDocumentStorage: RecruitmentCandidateDocumentStorageService,
    private readonly mailService: MailService,
=======
>>>>>>> 2cbd7b52227a122381ddbda8b9f09199185fbe7e
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('pendingrequisitions')
  async getPendingRequisitions(@Req() req) {
    return this.recruitmentService.getPendingRequisitions(req.user.employeeId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('requisitionaction')
  async requisitionAction(@Body() dto: RequisitionActionDto, @Req() req) {
    return this.recruitmentService.requisitionAction(
      dto.requisitionId,
      dto.action,
      req.user.employeeId,
      req.user.companyId,
      dto.reviewRemarks,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('jobopening')
  async createJobOpening(@Body() dto: CreateJobOpeningDto, @Req() req) {
    return this.recruitmentService.createJobOpening(
      dto.requisitionId,
      req.user.employeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('jobopeningpublish')
  async publishJobOpening(@Body() dto: PublishJobOpeningDto, @Req() req) {
    return this.recruitmentService.publishJobOpening(
      dto.jobOpeningId,
      dto.closingDate,
      req.user.employeeId,
    );
  }
  @Get('jobopenings')
  async getJobOpenings() {
    return this.recruitmentService.getJobOpenings();
  }
  @UseGuards(JwtAuthGuard)
  @Post('requisition')
  async createRequisition(@Body() dto: CreateRequisitionDto, @Req() req: any) {
    const companyId = Number(req.user.companyId);
    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new UnauthorizedException(
        'Authenticated user is missing a valid company ID.',
      );
    }

    return this.recruitmentService.createRequisition(
      { ...dto, companyId },
      req.user.employeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('candidateapplication')
  async createCandidateApplication(@Body() dto: CreateCandidateApplicationDto) {
    return this.recruitmentService.createCandidateApplication(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('resumes')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const supportedMimeTypes: Record<string, string> = {
          '.pdf': 'application/pdf',
          '.doc': 'application/msword',
          '.docx':
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };
        if (supportedMimeTypes[extension] !== file.mimetype) {
          callback(
            new BadRequestException('Upload a PDF, DOC, or DOCX resume.'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    return { resumeUrl: await this.resumeStorage.save(file) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('resumes/:fileName')
  async downloadResume(
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    const filePath = await this.resumeStorage.getPath(fileName);
<<<<<<< HEAD
    const extension = path.extname(fileName).toLowerCase();
    const contentType =
      extension === '.pdf'
        ? 'application/pdf'
        : extension === '.doc'
          ? 'application/msword'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    return new StreamableFile(createReadStream(filePath), {
      type: contentType,
      disposition: `inline; filename="${fileName}"`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('candidate-documents')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const supportedMimeTypes: Record<string, string> = {
          '.pdf': 'application/pdf',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
        };
        if (supportedMimeTypes[extension] !== file.mimetype) {
          callback(
            new BadRequestException(
              'Upload a PDF, JPG, JPEG, or PNG document.',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadCandidateDocumentFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('applicationId', ParseIntPipe) applicationId: number,
    @Body('documentType', ParseIntPipe) documentType: number,
  ) {
    if (applicationId <= 0 || documentType < 1 || documentType > 9) {
      throw new BadRequestException(
        'Choose a valid candidate and document type.',
      );
    }

    const documentUrl = await this.candidateDocumentStorage.save(file);
    try {
      const result = await this.recruitmentService.uploadCandidateDocument({
        applicationId,
        documentType,
        documentUrl,
      });
      return { documentUrl, result };
    } catch (error) {
      await this.candidateDocumentStorage.remove(documentUrl);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('candidate-documents/:fileName')
  async downloadCandidateDocument(
    @Param('fileName') fileName: string,
  ): Promise<StreamableFile> {
    const filePath = await this.candidateDocumentStorage.getPath(fileName);
    const extension = path.extname(fileName).toLowerCase();
    const contentType =
      extension === '.pdf'
        ? 'application/pdf'
        : extension === '.png'
          ? 'image/png'
          : 'image/jpeg';
    return new StreamableFile(createReadStream(filePath), {
      type: contentType,
      disposition: `inline; filename="${fileName}"`,
    });
  }

=======
    return new StreamableFile(createReadStream(filePath), {
      type: 'application/octet-stream',
      disposition: `attachment; filename="${fileName}"`,
    });
  }
>>>>>>> 2cbd7b52227a122381ddbda8b9f09199185fbe7e
  @UseGuards(JwtAuthGuard)
  @Get('candidatescreening/:jobOpeningId')
  async getCandidatesForScreening(
    @Param('jobOpeningId', ParseIntPipe) jobOpeningId: number,
    @Req() req: any,
  ) {
    return this.recruitmentService.getCandidatesForScreening(
      jobOpeningId,
      req.user.employeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('screening')
  async resumeScreening(@Body() dto: ResumeScreeningDto, @Req() req) {
    return this.recruitmentService.resumeScreening(
      dto.applicationId,
      dto.action,
      req.user.employeeId,
      dto.reviewRemarks,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('assessmentscheduling')
  async getCandidatesForAssessmentScheduling() {
    return this.recruitmentService.getCandidatesForAssessmentScheduling();
  }
  @UseGuards(JwtAuthGuard)
  @Post('assessmentschedule')
  async scheduleCandidateAssessment(
    @Body() dto: ScheduleCandidateAssessmentDto,
    @Req() req,
  ) {
    return this.recruitmentService.scheduleCandidateAssessment(
      dto.applicationId,
      dto.assessmentType,
      dto.scheduledDate,
      req.user.employeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('intervieweligible')
  async getCandidatesEligibleForInterview() {
    return this.recruitmentService.getCandidatesEligibleForInterview();
  }
  @UseGuards(JwtAuthGuard)
  @Post('interviewschedule')
  async scheduleCandidateInterview(
    @Body() dto: ScheduleCandidateInterviewDto,
    @Req() req: any,
  ) {
    return this.recruitmentService.scheduleCandidateInterview(
      dto.applicationId,
      dto.interviewTypeId,
      dto.scheduledDate,
      dto.interviewerEmployeeId,
      req.user.employeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('assessmentresult')
  async updateCandidateAssessmentResult(
    @Body() dto: UpdateCandidateAssessmentResultDto,
    @Req() req,
  ) {
    return this.recruitmentService.updateCandidateAssessmentResult(
      dto.assessmentId,
      dto.score,
      dto.isQualified,
      dto.remarks,
      req.user.employeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('finalinterviewapproval')
  async updateFinalInterviewApproval(
    @Body() dto: FinalInterviewApprovalDto,
    @Req() req,
  ) {
    return this.recruitmentService.updateFinalInterviewApproval(
      dto,
      req.user.employeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('interviewfeedback')
  async submitInterviewFeedback(
    @Body() dto: SubmitInterviewFeedbackDto,
    @Req() req: any,
  ) {
    const actionBy = req.user.employeeId;

    return this.recruitmentService.submitInterviewFeedback(dto, actionBy);
  }
  @UseGuards(JwtAuthGuard)
  @Post('candidateoffer')
  async createCandidateOffer(
    @Body() dto: CreateCandidateOfferDto,
    @Req() req: any,
  ) {
    const actionBy = req.user.employeeId;

    return this.recruitmentService.createCandidateOffer(dto, actionBy);
  }
  @UseGuards(JwtAuthGuard)
  @Get('candidatesforverification')
  async getCandidatesForVerification(@Req() req: any) {
    const hrManagerEmployeeId = req.user.employeeId;

    return this.recruitmentService.getCandidatesForVerification(
      hrManagerEmployeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('uploadcandidatedocument')
  async uploadCandidateDocument(@Body() dto: UploadCandidateDocumentDto) {
    return this.recruitmentService.uploadCandidateDocument(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('bgvcandidate')
  async performBgvCandidate(@Body() dto: BgvCandidateDto, @Req() req: any) {
    const hrManagerEmployeeId = req.user.employeeId;

    return this.recruitmentService.performBgvCandidate(
      dto,
      hrManagerEmployeeId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('candidatesforjoining')
  async getCandidatesForJoining(@Req() req: any) {
    const hrManagerEmployeeId = req.user.employeeId;

    return this.recruitmentService.getCandidatesForJoining(hrManagerEmployeeId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('send-welcome-email')
  async sendWelcomeEmail(@Body() dto: SendWelcomeEmailDto) {
    await this.mailService.sendWelcomeEmail(
      dto.email,
      dto.candidateName,
      dto.position,
    );
    return { success: true, message: 'Welcome email sent successfully.' };
  }
  @UseGuards(JwtAuthGuard)
  @Post('send-joining-email')
  async sendJoiningEmail(@Body() dto: SendJoiningEmailDto) {
    await this.mailService.sendJoiningEmail(
      dto.email,
      dto.candidateName,
      dto.position,
      dto.joiningDate,
    );
    return { success: true, message: 'Joining email sent successfully.' };
  }
  @UseGuards(JwtAuthGuard)
  @Post('send-team-assignment-email')
  async sendTeamAssignmentEmail(@Body() dto: SendTeamAssignmentEmailDto) {
    await this.mailService.sendTeamAssignmentEmail(
      dto.email,
      dto.employeeName,
      dto.department,
      dto.team,
      dto.manager,
    );
    return { success: true, message: 'Team assignment email sent successfully.' };
  }
  @UseGuards(JwtAuthGuard)
  @Post('approvecandidatejoining')
  async approveCandidateJoining(
    @Body() dto: ApproveCandidateJoiningDto,
    @Req() req: any,
  ) {
    return this.recruitmentService.approveCandidateJoining(
      dto,
      req.user.employeeId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('skipcandidateassessment')
  async skipCandidateAssessment(
    @Body() dto: SkipCandidateAssessmentDto,
    @Req() req,
  ) {
    return this.recruitmentService.skipCandidateAssessment(
      dto.applicationId,
      req.user.employeeId,
      dto.remarks,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('requisitionmaster')
  async getRequisitionMaster(@Req() req: any) {
    return this.recruitmentService.getRequisitionMaster(req.user.companyId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getRecruitmentDashboard(@Query('stage') stage: string = 'ALL') {
    return this.recruitmentService.getRecruitmentDashboard(stage);
  }
 
}

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  StreamableFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { createReadStream } from 'fs';
import { access } from 'fs/promises';
import path from 'path';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentResumeStorageService } from './recruitment-resume-storage.service';
import { RecruitmentCandidateDocumentStorageService } from './recruitment-candidate-document-storage.service';
import { RequisitionActionDto } from './dto/requisition-action.dto';
import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
import { PublishJobOpeningDto } from './dto/publish-job-opening.dto';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { ResumeScreeningDto } from './dto/resume-screening.dto';
import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
import { ScheduleCandidateAssessmentDto } from './dto/schedule-candidate-assessment.dto';
import { UpdateCandidateAssessmentResultDto } from './dto/update-candidate-assessment-result.dto';
import { FinalInterviewApprovalDto } from './dto/final-interview-approval.dto';
import { SubmitInterviewFeedbackDto } from './dto/submit-interview-feedback.dto';
import { CreateCandidateOfferDto } from './dto/create-candidate-offer.dto';
import { UploadCandidateDocumentDto } from './dto/upload-candidate-document.dto';
import { BgvCandidateDto } from './dto/bgv-candidate.dto';
import { ApproveCandidateJoiningDto } from './dto/approve-candidate-joining.dto';
import { SkipCandidateAssessmentDto } from "./dto/skip-candidate-assessment.dto";
import { MailService } from '../mail/mail.service';
import { Roles } from '../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../common/constants/roles';
// import { SendWelcomeEmailDto } from './dto/send-welcome-email.dto';
// import { SendJoiningEmailDto } from './dto/send-joining-email.dto';
// import { SendTeamAssignmentEmailDto } from './dto/send-team-assignment-email.dto';
// import { SendInterviewInvitationDto } from './dto/send-interview-invitation.dto';
const uploadPath = join(process.cwd(), 'uploads', 'recruitment', 'resumes');
mkdirSync(uploadPath, { recursive: true });

@Roles(...ADMIN_PORTAL_ROLES)
@Controller('recruitment')
export class RecruitmentController {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly resumeStorage: RecruitmentResumeStorageService,
    private readonly candidateDocumentStorage: RecruitmentCandidateDocumentStorageService,
    private readonly mailService: MailService,
  ) {}

  @Get('pendingrequisitions')
  async getPendingRequisitions(@Req() req) {
    return this.recruitmentService.getPendingRequisitions(req.user.employeeId);
  }
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
  @Post('jobopening')
  async createJobOpening(@Body() dto: CreateJobOpeningDto, @Req() req) {
    return this.recruitmentService.createJobOpening(
      dto.requisitionId,
      req.user.employeeId,
    );
  }
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
  @Get('job-opening-requisitions')
  async getJobOpeningRequisitions(
    @Req() req: { user: { companyId: number } },
  ) {
    const companyId = Number(req.user.companyId);
    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new UnauthorizedException(
        'Authenticated user is missing a valid company ID.',
      );
    }
    return this.recruitmentService.getJobOpeningRequisitions(companyId);
  }
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
  @Post('candidateapplication')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: uploadPath,
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        const allowedMimeTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Only PDF, DOC, and DOCX resume files are allowed.',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createCandidateApplication(
    @Body() dto: CreateCandidateApplicationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    resume: Express.Multer.File,
  ) {
    return this.recruitmentService.createCandidateApplication(dto, resume);
  }
// import { RecruitmentService } from './recruitment.service';
// import { RequisitionActionDto } from './dto/requisition-action.dto';
// import { CreateJobOpeningDto } from './dto/create-job-opening.dto';
// import { PublishJobOpeningDto } from './dto/publish-job-opening.dto';
// import { CreateRequisitionDto } from './dto/create-requisition.dto';
// import { ResumeScreeningDto } from './dto/resume-screening.dto';
// import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
// import { ScheduleCandidateAssessmentDto } from './dto/schedule-candidate-assessment.dto';
// import { ScheduleCandidateInterviewDto } from './dto/schedule-candidate-interview.dto';
// import { UpdateCandidateAssessmentResultDto } from './dto/update-candidate-assessment-result.dto';
// import { FinalInterviewApprovalDto } from './dto/final-interview-approval.dto';
// import { SubmitInterviewFeedbackDto } from './dto/submit-interview-feedback.dto';
// import { CreateCandidateOfferDto } from './dto/create-candidate-offer.dto';
// import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// import { UploadCandidateDocumentDto } from './dto/upload-candidate-document.dto';
// import { BgvCandidateDto } from './dto/bgv-candidate.dto';
// import { ApproveCandidateJoiningDto } from './dto/approve-candidate-joining.dto';
// import { SkipCandidateAssessmentDto } from './dto/skip-candidate-assessment.dto';
 
// @Controller('recruitment')
// export class RecruitmentController {
//   constructor(private readonly recruitmentService: RecruitmentService) {}
 
//   @UseGuards(JwtAuthGuard)
//   @Get('pendingrequisitions')
//   async getPendingRequisitions(@Req() req) {
//     return this.recruitmentService.getPendingRequisitions(req.user.employeeId);
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('requisitionaction')
//   async requisitionAction(@Body() dto: RequisitionActionDto, @Req() req) {
//     return this.recruitmentService.requisitionAction(
//       dto.requisitionId,
//       dto.action,
//       req.user.employeeId,
//       req.user.companyId,
//       dto.reviewRemarks,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('jobopening')
//   async createJobOpening(@Body() dto: CreateJobOpeningDto, @Req() req) {
//     return this.recruitmentService.createJobOpening(
//       dto.requisitionId,
//       req.user.employeeId,
//     );
//   }
 
//   @UseGuards(JwtAuthGuard)
//   @Post('jobopeningpublish')
//   async publishJobOpening(@Body() dto: PublishJobOpeningDto, @Req() req) {
//     return this.recruitmentService.publishJobOpening(
//       dto.jobOpeningId,
//       dto.closingDate,
//       req.user.employeeId,
//     );
//   }
//   @Get('jobopenings')
//   async getJobOpenings() {
//     return this.recruitmentService.getJobOpenings();
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('requisition')
//   async createRequisition(@Body() dto: CreateRequisitionDto, @Req() req: any) {
//     return this.recruitmentService.createRequisition(
//       dto,
//       req.user.employeeId,
//       req.user.companyId,
//     );
//   }
 
//   // @Post('candidateapplication')
//   // async createCandidateApplication(@Body() dto: CreateCandidateApplicationDto) {
//   //   return this.recruitmentService.createCandidateApplication(dto);
//   // }
//   @Post('candidateapplication')
//   @UseInterceptors(
//     FileInterceptor('resume', {
//       dest: './uploads/recruitment/resumes',
 
//       fileFilter: (req, file, callback) => {
//         const allowedMimeTypes = [
//           'application/pdf',
//           'application/msword',
//           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         ];
 
//         if (!allowedMimeTypes.includes(file.mimetype)) {
//           return callback(
//             new BadRequestException(
//               'Only PDF, DOC, and DOCX resume files are allowed.',
//             ),
//             false,
//           );
//         }
 
//         callback(null, true);
//       },
 
//       // Optional: also enforce at Multer level
//       limits: {
//         fileSize: 5 * 1024 * 1024, // 5 MB
//       },
//     }),
//   )
//   async createCandidateApplication(
//     @Body() dto: CreateCandidateApplicationDto,
 
//     @UploadedFile(
//       new ParseFilePipe({
//         validators: [
//           new MaxFileSizeValidator({
//             maxSize: 5 * 1024 * 1024, // 5 MB
//           }),
//         ],
//       }),
//     )
//     resume: Express.Multer.File,
//   ) {
//     return this.recruitmentService.createCandidateApplication(dto, resume);
//   }
 
//   @UseGuards(JwtAuthGuard)
//   @Get('jobopeningmaster')
//   async getActiveJobOpenings(@Req() req: Request) {
//     const companyId = (req as any).user.companyId;
 
//     return this.recruitmentService.getActiveJobOpenings(companyId);
//   }
 
//   @UseGuards(JwtAuthGuard)
//   @Get('sources')
//   async getRecruitmentSources() {
//     return this.recruitmentService.getRecruitmentSources();
//   }
 
//   @UseGuards(JwtAuthGuard)
//   @Get('resume-preview/:fileName')
//   async previewUploadedResume(
//     @Param('fileName') fileName: string,
//     @Query('extension') requestedExtension?: string,
//   ): Promise<StreamableFile> {
//     if (!/^[a-f0-9-]{32,36}(?:\.(pdf|doc|docx))?$/i.test(fileName)) {
//       throw new NotFoundException('Resume not found.');
//     }

  @Get('candidatescreening')
  async getCandidatesForScreening(
    @Req() req: any,
    @Query('jobOpeningId') jobOpeningId?: string,
  ) {
    return this.recruitmentService.getCandidatesForScreening(
      req.user.companyId,
      jobOpeningId ? Number(jobOpeningId) : undefined,
      req.user.employeeId,
    );
  }
  @Get('candidateapplications')
  async getCandidateApplications(
    @Req() req: any,
    @Query('applicationStatusId') applicationStatusId?: string,
  ) {
    return this.recruitmentService.getCandidateApplications(
      req.user.companyId,
      applicationStatusId ? Number(applicationStatusId) : undefined,
    );
  }
  @Post('screening')
  async resumeScreening(@Body() dto: ResumeScreeningDto, @Req() req) {
    return this.recruitmentService.resumeScreening(
      dto.applicationId,
      dto.action,
      req.user.employeeId,
      dto.reviewRemarks,
    );
  }
  @Get('assessmentscheduling')
  async getCandidatesForAssessmentScheduling() {
    return this.recruitmentService.getCandidatesForAssessmentScheduling();
  }
  @Get('intervieweligible')
  async getInterviewEligibleCandidates() {
    return this.recruitmentService.getInterviewEligibleCandidates();
  }
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
  @Post('interviewfeedback')
  async submitInterviewFeedback(
    @Body() dto: SubmitInterviewFeedbackDto,
    @Req() req: any,
  ) {
    const actionBy = req.user.employeeId;
    return this.recruitmentService.submitInterviewFeedback(dto, actionBy);
  }

  @Get('candidatesforverification')
  async getCandidatesForVerification(@Req() req: any) {
    return this.recruitmentService.getCandidatesForVerification(
      req.user.employeeId,
    );
  }
  @Get('all-verification-candidates')
  async getAllVerificationCandidates(@Req() req: any) {
    return this.recruitmentService.getAllVerificationCandidates(
      String(req.user.employeeId),
    );
  }
  @Get('pending-bgv-documents')
  async getPendingBgvDocuments(
    @Query('applicationId') applicationId: string | undefined,
    @Query('flag') flag: string | undefined,
    @Req() req: { user: { employeeId: string } },
  ) {
    const parsedFlag = flag === undefined ? 1 : Number(flag);
    if (!Number.isInteger(parsedFlag) || ![1, 2].includes(parsedFlag)) {
      throw new BadRequestException('flag must be 1 or 2.');
    }

    let parsedApplicationId: number | undefined;

    if (applicationId !== undefined) {
      parsedApplicationId = Number(applicationId);

      if (!Number.isInteger(parsedApplicationId) || parsedApplicationId <= 0) {
        throw new BadRequestException(
          'applicationId must be a positive integer.',
        );
      }
    }

    if (parsedFlag === 2 && parsedApplicationId === undefined) {
      throw new BadRequestException(
        'applicationId is required when flag is 2.',
      );
    }

    return this.recruitmentService.getPendingBgvDocuments(
      String(req.user.employeeId),
      parsedApplicationId,
      parsedFlag,
    );
  }
  @Post('uploadcandidatedocument')
  async uploadCandidateDocument(@Body() dto: UploadCandidateDocumentDto) {
    return this.recruitmentService.uploadCandidateDocument(dto);
  }
  @Post('bgvcandidate')
  async performBgvCandidate(@Body() dto: BgvCandidateDto, @Req() req: any) {
    const hrManagerEmployeeId = req.user.employeeId;
    return this.recruitmentService.performBgvCandidate(
      dto,
      hrManagerEmployeeId,
    );
  }

//   @UseGuards(JwtAuthGuard)
//   @Post('candidate-documents')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: memoryStorage(),
//       limits: { fileSize: 10 * 1024 * 1024 },
//       fileFilter: (_req, file, callback) => {
//         const extension = path.extname(file.originalname).toLowerCase();
//         const supportedMimeTypes: Record<string, string> = {
//           '.pdf': 'application/pdf',
//           '.jpg': 'image/jpeg',
//           '.jpeg': 'image/jpeg',
//           '.png': 'image/png',
//         };
//         if (supportedMimeTypes[extension] !== file.mimetype) {
//           callback(
//             new BadRequestException(
//               'Upload a PDF, JPG, JPEG, or PNG document.',
//             ),
//             false,
//           );
//           return;
//         }
//         callback(null, true);
//       },
//     }),
//   )
//   async uploadCandidateDocumentFile(
//     @UploadedFile() file: Express.Multer.File,
//     @Body('applicationId', ParseIntPipe) applicationId: number,
//     @Body('documentType', ParseIntPipe) documentType: number,
//   ) {
//     if (applicationId <= 0 || documentType < 1 || documentType > 9) {
//       throw new BadRequestException(
//         'Choose a valid candidate and document type.',
//       );
//     }

//     const documentUrl = await this.candidateDocumentStorage.save(file);
//     try {
//       const result = await this.recruitmentService.uploadCandidateDocument({
//         applicationId,
//         documentType,
//         documentUrl,
//       });
//       return { documentUrl, result };
//     } catch (error) {
//       await this.candidateDocumentStorage.remove(documentUrl);
//       throw error;
//     }
//   }

//   @UseGuards(JwtAuthGuard)
//   @Get('candidate-documents/:fileName')
//   async downloadCandidateDocument(
//     @Param('fileName') fileName: string,
//   ): Promise<StreamableFile> {
//     const filePath = await this.candidateDocumentStorage.getPath(fileName);
//     const extension = path.extname(fileName).toLowerCase();
//     const contentType =
//       extension === '.pdf'
//         ? 'application/pdf'
//         : extension === '.png'
//           ? 'image/png'
//           : 'image/jpeg';
//     return new StreamableFile(createReadStream(filePath), {
//       type: contentType,
//       disposition: `inline; filename="${fileName}"`,
//     });
//   }

//    @UseGuards(JwtAuthGuard)
//   @Get('candidatescreening')
//   async getCandidatesForScreening(
//     @Req() req: any,
//     @Query('jobOpeningId') jobOpeningId?: string,
//   ) {
//     return this.recruitmentService.getCandidatesForScreening(
//       req.user.companyId,
//       jobOpeningId ? Number(jobOpeningId) : undefined,
//       req.user.employeeId,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Get('candidateapplications')
//   async getCandidateApplications(
//     @Req() req: any,
//     @Query('applicationStatusId') applicationStatusId?: string,
//   ) {
//     return this.recruitmentService.getCandidateApplications(
//       req.user.companyId,
//       applicationStatusId ? Number(applicationStatusId) : undefined,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @UseGuards(JwtAuthGuard)
//   @Post('screening')
//   async resumeScreening(@Body() dto: ResumeScreeningDto, @Req() req) {
//     return this.recruitmentService.resumeScreening(
//       dto.applicationId,
//       dto.action,
//       req.user.employeeId,
//       dto.reviewRemarks,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Get('assessmentscheduling')
//   async getCandidatesForAssessmentScheduling() {
//     return this.recruitmentService.getCandidatesForAssessmentScheduling();
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('assessmentschedule')
//   async scheduleCandidateAssessment(
//     @Body() dto: ScheduleCandidateAssessmentDto,
//     @Req() req,
//   ) {
//     return this.recruitmentService.scheduleCandidateAssessment(
//       dto.applicationId,
//       dto.assessmentType,
//       dto.scheduledDate,
//       req.user.employeeId,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Get('intervieweligible')
//   async getCandidatesEligibleForInterview() {
//     return this.recruitmentService.getCandidatesEligibleForInterview();
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('interviewschedule')
//   async scheduleCandidateInterview(
//     @Body() dto: ScheduleCandidateInterviewDto,
//     @Req() req: any,
//   ) {
//     return this.recruitmentService.scheduleCandidateInterview(
//       dto.applicationId,
//       dto.interviewTypeId,
//       dto.scheduledDate,
//       dto.interviewerEmployeeId,
//       req.user.employeeId,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('assessmentresult')
//   async updateCandidateAssessmentResult(
//     @Body() dto: UpdateCandidateAssessmentResultDto,
//     @Req() req,
//   ) {
//     return this.recruitmentService.updateCandidateAssessmentResult(
//       dto.assessmentId,
//       dto.score,
//       dto.isQualified,
//       dto.remarks,
//       req.user.employeeId,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('finalinterviewapproval')
//   async updateFinalInterviewApproval(
//     @Body() dto: FinalInterviewApprovalDto,
//     @Req() req,
//   ) {
//     return this.recruitmentService.updateFinalInterviewApproval(
//       dto,
//       req.user.employeeId,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('interviewfeedback')
//   async submitInterviewFeedback(
//     @Body() dto: SubmitInterviewFeedbackDto,
//     @Req() req: any,
//   ) {
//     const actionBy = req.user.employeeId;
 
//     return this.recruitmentService.submitInterviewFeedback(dto, actionBy);
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('candidateoffer')
//   async createCandidateOffer(
//     @Body() dto: CreateCandidateOfferDto,
//     @Req() req: any,
//   ) {
//     const actionBy = req.user.employeeId;
 
//     return this.recruitmentService.createCandidateOffer(dto, actionBy);
//   }
//   @UseGuards(JwtAuthGuard)
//   @Get('candidatesforverification')
//   async getCandidatesForVerification(@Req() req: any) {
//     const hrManagerEmployeeId = req.user.employeeId;
 
//     return this.recruitmentService.getCandidatesForVerification(
//       hrManagerEmployeeId,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('uploadcandidatedocument')
//   async uploadCandidateDocument(@Body() dto: UploadCandidateDocumentDto) {
//     return this.recruitmentService.uploadCandidateDocument(dto);
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('bgvcandidate')
//   async performBgvCandidate(@Body() dto: BgvCandidateDto, @Req() req: any) {
//     const hrManagerEmployeeId = req.user.employeeId;
 
//     return this.recruitmentService.performBgvCandidate(
//       dto,
//       hrManagerEmployeeId,
//     );
//   }
//   @UseGuards(JwtAuthGuard)
//   @Get('candidatesforjoining')
//   async getCandidatesForJoining(@Req() req: any) {
//     const hrManagerEmployeeId = req.user.employeeId;
 
//     return this.recruitmentService.getCandidatesForJoining(hrManagerEmployeeId);
//   }
//   @UseGuards(JwtAuthGuard)
//   @Post('approvecandidatejoining')
//   async approveCandidateJoining(
//     @Body() dto: ApproveCandidateJoiningDto,
//     @Req() req: any,
//   ) {
//     return this.recruitmentService.approveCandidateJoining(
//       dto,
//       req.user.employeeId,
//     );
//   }
 
//   @UseGuards(JwtAuthGuard)
//   @Post('skipcandidateassessment')
//   async skipCandidateAssessment(
//     @Body() dto: SkipCandidateAssessmentDto,
//     @Req() req,
//   ) {
//     return this.recruitmentService.skipCandidateAssessment(
//       dto.applicationId,
//       req.user.employeeId,
//       dto.remarks,
//     );
//   }
 
//   @UseGuards(JwtAuthGuard)
//   @Get('dashboard')
//   async getRecruitmentDashboard(@Query('stage') stage: string = 'ALL') {
//     return this.recruitmentService.getRecruitmentDashboard(stage);
//   }
//   @UseGuards(JwtAuthGuard)
//   @Get('jobopeningmaster')
//   async getActiveJobOpenings(@Req() req: Request) {
//     const companyId = (req as any).user.companyId;
 
//     return this.recruitmentService.getActiveJobOpenings(companyId);
//   }
 
//   @UseGuards(JwtAuthGuard)
//   @Get('sources')
//   async getRecruitmentSources() {
//     return this.recruitmentService.getRecruitmentSources();
//   }
 
  @Get('sources')
  async getRecruitmentSources() {
    return this.recruitmentService.getRecruitmentSources();
  }

  @Get('requisitionmaster')
  async getRequisitionMaster(
    @Req() req: { user: { companyId: number } },
  ) {
    const companyId = Number(req.user.companyId);
    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new UnauthorizedException(
        'Authenticated user is missing a valid company ID.',
      );
    }

    return this.recruitmentService.getRequisitionMaster(companyId);
  }

  @Get('jobopeningmaster')
  async getActiveJobOpenings(
    @Req() req: { user: { companyId: number } },
  ) {
    const companyId = Number(req.user.companyId);
    if (!Number.isInteger(companyId) || companyId <= 0) {
      throw new UnauthorizedException(
        'Authenticated user is missing a valid company ID.',
      );
    }

    return this.recruitmentService.getActiveJobOpenings(companyId);
  }

  @Get('dashboard')
  async getRecruitmentDashboard(
    @Query('stage') stage: string = 'ALL',
  ) {
    return this.recruitmentService.getRecruitmentDashboard(stage);
  }

  @Get('all-requisitions-for-hr')
  async getAllRequisitionsForHR(@Req() req: any) {
   if (!req.user?.employeeId) {
     throw new UnauthorizedException(
       'Authenticated user is missing an employee ID.',
     );
   }

   return this.recruitmentService.getAllRequisitionsForHR(
     String(req.user.employeeId),
   );
 }
 // scheduled candidate assessment start from here
  @Post('assessmentschedule')
  async scheduleCandidateAssessment(
    @Body() dto: ScheduleCandidateAssessmentDto,
    @Req() req,
  ) {
    return this.recruitmentService.scheduleCandidateAssessment(
      dto.applicationId,
      dto.assessmentTypeId,
      dto.scheduledDate,
      req.user.employeeId,
    );
  }
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
// Assessment Scheduling Dropdowns
  @Get('assessment-schedule-dropdowns')
  async getAssessmentScheduleDropdowns(@Req() req) {
    return this.recruitmentService.getAssessmentScheduleDropdowns(
      req.user.companyId,
    );
  }
  //update candidate assessment result
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
  // Job Requisition Details Endpoint
  @Get('jobrequisitiondetails/:requisitionId')
  async getJobRequisitionDetails(
    @Param('requisitionId', ParseIntPipe) requisitionId: number,
  ) {
    return this.recruitmentService.getJobRequisitionDetails(requisitionId);
  }
}

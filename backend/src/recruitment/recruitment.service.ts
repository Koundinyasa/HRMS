// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import * as sql from 'mssql';
// import { DatabaseService } from '../database/database.service';
// import { CreateRequisitionDto } from './dto/create-requisition.dto';
// import { CreateCandidateApplicationDto } from './dto/create-candidate-application.dto';
// import { FinalInterviewApprovalDto } from './dto/final-interview-approval.dto';
// import { SubmitInterviewFeedbackDto } from './dto/submit-interview-feedback.dto';
// import { CreateCandidateOfferDto } from './dto/create-candidate-offer.dto';
// import { UploadCandidateDocumentDto } from './dto/upload-candidate-document.dto';
// import { BgvCandidateDto } from './dto/bgv-candidate.dto';
// import { ApproveCandidateJoiningDto } from './dto/approve-candidate-joining.dto';
// import { extname } from 'path';
// @Injectable()
// export class RecruitmentService {
//   constructor(private readonly databaseService: DatabaseService) {}
 
//   async getPendingRequisitions(employeeId: string) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('EmployeeID', sql.VarChar(25), employeeId)
//         .execute('USP_GetPendingRequisition');
 
//       return result.recordset;
//     } catch (error) {
//       console.error('Error in getPendingRequisitions:', error);
//       throw error;
//     }
//   }
 
//   async requisitionAction(
//     requisitionId: number,
//     action: 'APPROVE' | 'REJECT',
//     employeeId: string,
//     companyId: number,
//     reviewRemarks?: string,
//   ) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('Action', sql.VarChar(20), action)
//         .input('RequisitionID', sql.Int, requisitionId)
//         .input('CompanyID', sql.Int, companyId)
//         .input('ActionBy', sql.VarChar(25), employeeId)
//         .input('ReviewRemarks', sql.VarChar(500), reviewRemarks ?? null)
//         .execute('USP_JobRequisition');
 
//       return result.recordset;
//     } catch (error) {
//       console.error('Error in requisitionAction:', error);
//       throw error;
//     }
//   }
 
//   async createJobOpening(requisitionId: number, employeeId: string) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('RequisitionID', sql.Int, requisitionId)
//       .input('ActionBy', sql.VarChar(25), employeeId)
//       .execute('USP_CreateJobOpening');
 
//     return result.recordset;
//   }
 
//   async publishJobOpening(
//     jobOpeningId: number,
//     closingDate: string,
//     employeeId: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('JobOpeningID', sql.Int, jobOpeningId)
//       .input('ClosingDate', sql.Date, closingDate)
//       .input('ActionBy', sql.VarChar(25), employeeId)
//       .execute('USP_PublishJobOpening');
 
//     return result.recordset;
//   }
//   async getJobOpenings() {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool.request().execute('USP_GetJobOpenings');
 
//     return result.recordset;
//   }
 
//   // async createRequisition(
//   //   dto: CreateRequisitionDto,
//   //   employeeId: string,
//   //   companyId: number,
//   // ) {
//   //   try {
//   //     const pool = await this.databaseService.connect();
 
//   //     const result = await pool
//   //       .request()
//   //       .input('Action', sql.VarChar(20), 'CREATE')
//   //       .input('RequisitionID', sql.Int, null)
//   //       .input('CompanyID', sql.Int, companyId)
//   //       .input('BranchID', sql.Int, dto.branchId)
//   //       .input('DesignationID', sql.Int, dto.designationId)
//   //       .input('JobTitle', sql.NVarChar(100), dto.jobTitle)
//   //       .input('Vacancies', sql.Int, dto.vacancies)
//   //       .input('SalaryRangeMin', sql.Decimal(12, 2), dto.salaryRangeMin ?? null)
//   //       .input('SalaryRangeMax', sql.Decimal(12, 2), dto.salaryRangeMax ?? null)
//   //       .input(
//   //         'ExperienceRequired',
//   //         sql.VarChar(50),
//   //         dto.experienceRequired ?? null,
//   //       )
//   //       .input('Priority', sql.Int, dto.priority ?? null)
//   //       .input('ActionBy', sql.VarChar(25), employeeId)
//   //       .input('ReviewRemarks', sql.VarChar(500), null)
//   //       .execute('USP_JobRequisition');
 
//   //     return result.recordset;
//   //   } catch (error) {
//   //     console.error('Error in createRequisition:', error);
//   //     throw error;
//   //   }
//   // }
//   // upload resume and create candidate application start here
//   async createCandidateApplication(
//     dto: CreateCandidateApplicationDto,
//     resume: Express.Multer.File,
//   ) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const resumeUrl = resume
//         ? `/uploads/recruitment/resumes/${resume.filename}`
//         : null;
 
//       const actualFileName = resume ? resume.originalname : null;
 
//       const fileName = resume ? resume.filename : null;
 
//       const fileExtension = resume ? extname(resume.originalname) : null;
 
//       const fileSizeKB = resume
//         ? Number((resume.size / 1024).toFixed(2))
//         : null;
 
//       const result = await pool
//         .request()
//         .input('JobOpeningID', sql.Int, dto.jobOpeningId)
//         .input('FullName', sql.VarChar(200), dto.fullName)
//         .input('Email', sql.VarChar(150), dto.email)
//         .input('Phone', sql.VarChar(20), dto.phone)
//         .input('Address', sql.VarChar(500), dto.address ?? null)
//         .input('ResumeURL', sql.VarChar(500), resumeUrl)
//         .input('ActualFileName', sql.VarChar(255), actualFileName)
//         .input('FileName', sql.VarChar(255), fileName)
//         .input('FileExtension', sql.VarChar(20), fileExtension)
//         .input('FileSizeKB', sql.Decimal(18, 2), fileSizeKB)
//         .input('Source', sql.VarChar(100), dto.source ?? null)
//         .input('ReferredBy', sql.VarChar(100), dto.referredBy ?? null)
//         .execute('USP_CreateCandidateApplication');
 
//       return result.recordset;
//     } catch (error) {
//       console.error('Create candidate application error:', error);
 
//       throw new InternalServerErrorException(
//         'Failed to create candidate application.',
//       );
//     }
//   }
 
//   async getActiveJobOpenings(companyId: number) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('CompanyID', sql.Int, companyId)
//         .input('Flag', sql.Int, 3)
//         .execute('USP_GetRecruitmentPriority');
 
//       return {
//         success: true,
//         data: result.recordset || [],
//         message: 'Active job openings retrieved successfully.',
//       };
//     } catch (error) {
//       console.error('Get active job openings error:', error);
 
//       throw new InternalServerErrorException(
//         error instanceof Error
//           ? error.message
//           : 'Failed to retrieve active job openings.',
//       );
//     }
//   }
 
//   async getRecruitmentSources() {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('CompanyID', sql.Int, 0)
//         .input('Flag', sql.Int, 4)
//         .execute('USP_GetRecruitmentPriority');
 
//       return {
//         success: true,
//         data: result.recordset || [],
//         message: 'Recruitment sources retrieved successfully.',
//       };
//     } catch (error) {
//       console.error('Get recruitment sources error:', error);
 
//       throw new InternalServerErrorException(
//         error instanceof Error
//           ? error.message
//           : 'Failed to retrieve recruitment sources.',
//       );
//     }
//   }
 
//   async getCandidatesForScreening(jobOpeningId: number, employeeId: string) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('JobOpeningID', sql.Int, jobOpeningId)
//       .input('ActionBy', sql.VarChar(25), employeeId)
//       .execute('USP_GetCandidatesForScreening');
 
//     return result.recordset;
//   }

//   async getCandidateApplications(
//     companyId: number,
//     applicationStatusId?: number,
//   ) {
//     try {
//       const pool = await this.databaseService.connect();

//       const result = await pool
//         .request()
//         .input('CompanyID', sql.Int, companyId)
//         .input('ApplicationStatusID', sql.Int, applicationStatusId ?? null)
//         .execute('USP_GetCandidateApplication');

//       return result.recordset;
//     } catch (error) {
//       console.error('Error in getCandidateApplications:', error);

//       throw new InternalServerErrorException(
//         error instanceof Error
//           ? error.message
//           : 'Failed to retrieve candidate applications.',
//       );
//     }
//   }
 
//   async resumeScreening(
//     applicationId: number,
//     action: 'APPROVE' | 'REJECT',
//     employeeId: string,
//     reviewRemarks?: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', sql.Int, applicationId)
//       .input('Action', sql.VarChar(20), action)
//       .input('ActionBy', sql.VarChar(25), employeeId)
//       .input('ReviewRemarks', sql.VarChar(500), reviewRemarks ?? null)
//       .execute('USP_ResumeScreening');
 
//     return result.recordset;
//   }
 
//   async getCandidatesForAssessmentScheduling() {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .execute('USP_GetCandidatesForAssessmentScheduling');
 
//     return result.recordset;
//   }
 
//   async scheduleCandidateAssessment(
//     applicationId: number,
//     assessmentType: string,
//     scheduledDate: string,
//     employeeId: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', sql.Int, applicationId)
//       .input('AssessmentType', sql.VarChar(50), assessmentType)
//       .input('ScheduledDate', sql.VarChar(19), scheduledDate)
//       .input('AssignedBy', sql.VarChar(25), employeeId)
//       .execute('USP_ScheduleCandidateAssessment');
 
//     return result.recordset;
//   }
 
//   async getCandidatesEligibleForInterview() {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .execute('USP_GetCandidatesEligibleForInterview');
 
//     return result.recordset;
//   }


//   async getCandidatesForScreening(
//     companyId: number,
//     jobOpeningId: number | undefined,
//     actionBy: string,
//   ) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('CompanyID', sql.Int, companyId)
//         .input('JobOpeningID', sql.Int, jobOpeningId ?? null)
//         .input('ActionBy', sql.VarChar(25), actionBy)
//         .execute('USP_GetCandidatesForScreening');
 
//       return result.recordset;
//     } catch (error) {
//       console.error('Get candidates for screening error:', error);
 
//       throw new InternalServerErrorException(
//         'Failed to retrieve candidates for resume screening.',
//       );
//     }
//   }
 
  
//   async scheduleCandidateInterview(
//     applicationId: number,
//     interviewTypeId: number,
//     scheduledDate: string,
//     interviewerEmployeeId: string,
//     actionBy: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', sql.Int, applicationId)
//       .input('InterviewTypeID', sql.Int, interviewTypeId)
//       .input('ScheduledDate', sql.VarChar(19), scheduledDate)
//       .input('InterviewerEmployeeID', sql.VarChar(25), interviewerEmployeeId)
//       .input('ActionBy', sql.VarChar(25), actionBy)
//       .execute('USP_ScheduleCandidateInterview');
 
//     return result.recordset;
//   }
 
//   async updateCandidateAssessmentResult(
//     assessmentId: number,
//     score: number,
//     isQualified: boolean,
//     remarks: string | undefined,
//     reviewedBy: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('AssessmentID', sql.Int, assessmentId)
//       .input('Score', sql.Decimal(5, 2), score)
//       .input('IsQualified', sql.Bit, isQualified)
//       .input('Remarks', sql.VarChar(500), remarks ?? null)
//       .input('ReviewedBy', sql.VarChar(25), reviewedBy)
//       .execute('USP_UpdateCandidateAssessmentResult');
 
//     return result.recordset;
//   }
 
//   async updateFinalInterviewApproval(
//     dto: FinalInterviewApprovalDto,
//     actionBy: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', sql.Int, dto.applicationId)
//       .input('IsSelected', sql.Bit, dto.isSelected)
//       .input('Remarks', sql.VarChar(500), dto.remarks ?? null)
//       .input('ActionBy', sql.VarChar(25), actionBy)
//       .execute('USP_UpdateFinalInterviewApproval');
 
//     return result.recordset;
//   }
 
//   async submitInterviewFeedback(
//     dto: SubmitInterviewFeedbackDto,
//     actionBy: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('InterviewID', sql.Int, dto.interviewId)
//       .input('Rating', sql.Decimal(3, 1), dto.rating)
//       .input('Feedback', sql.VarChar(1000), dto.feedback)
//       .input('ActionBy', sql.VarChar(25), actionBy)
//       .execute('USP_SubmitInterviewFeedback');
 
//     return result.recordset;
//   }
 
//   async createCandidateOffer(dto: CreateCandidateOfferDto, actionBy: string) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', sql.Int, dto.applicationId)
//       .input('OfferedSalary', sql.Decimal(18, 2), dto.offeredSalary)
//       .input(
//         'NegotiatedSalary',
//         sql.Decimal(18, 2),
//         dto.negotiatedSalary ?? null,
//       )
//       .input('ActionBy', sql.VarChar(25), actionBy)
//       .execute('USP_CreateCandidateOffer');
 
//     return result.recordset;
//   }
 
//   async getCandidatesForVerification(hrManagerEmployeeId: string) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
//       .execute('USP_GetCandidatesForVerification');
 
//     return result.recordset;
//   }
 
//   async uploadCandidateDocument(dto: UploadCandidateDocumentDto) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', sql.Int, dto.applicationId)
//       .input('DocumentType', sql.Int, dto.documentType)
//       .input('DocumentURL', sql.VarChar(300), dto.documentUrl)
//       .execute('USP_UploadCandidateDocument');
 
//     return result.recordset;
//   }
 
//   async performBgvCandidate(dto: BgvCandidateDto, hrManagerEmployeeId: string) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', sql.Int, dto.applicationId)
//       .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
//       .input('IsClear', sql.Bit, dto.isClear)
//       .input('Remarks', sql.VarChar(500), dto.remarks ?? null)
//       .execute('USP_BGV_Candidate');
 
//     return result.recordset;
//   }
 
//   async getCandidatesForJoining(hrManagerEmployeeId: string) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('HRManagerEmployeeID', sql.VarChar(25), hrManagerEmployeeId)
//       .execute('USP_GetCandidatesForJoining');
 
//     return result.recordset;
//   }
//   async approveCandidateJoining(
//     dto: ApproveCandidateJoiningDto,
//     approvedBy: string,
//   ) {
//     const pool = await this.databaseService.connect();
 
//     const result = await pool
//       .request()
//       .input('ApplicationID', dto.applicationId)
//       .input('JoiningDate', sql.Date, dto.joiningDate)
//       .input('ApprovedBy', sql.VarChar(25), approvedBy)
//       .execute('USP_ApproveCandidateJoining');
 
//     return result.recordsets;
//   }
 
//   async skipCandidateAssessment(
//     applicationId: number,
//     employeeId: string,
//     remarks?: string,
//   ) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('ApplicationID', sql.Int, applicationId)
//         .input('ActionBy', sql.VarChar(25), employeeId)
//         .input('Remarks', sql.VarChar(500), remarks ?? null)
//         .execute('USP_SkipCandidateAssessment');
 
//       return result.recordset;
//     } catch (error) {
//       console.error('Error in skipCandidateAssessment:', error);
//       throw error;
//     }
//   }
 
//   async getRecruitmentDashboard(stage: string = 'ALL') {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('Stage', sql.VarChar(30), stage)
//         .execute('USP_GetRecruitmentDashboard');
 
//       return {
//         success: true,
//         data: {
//           applications: result.recordsets[0] || [],
//           summary: result.recordsets[1]?.[0] || {},
//         },
//         message:
//           result.recordsets[2]?.[0]?.Message ||
//           'Recruitment pipeline data retrieved successfully.',
//       };
//     } catch (error) {
//       throw new InternalServerErrorException(
//         error instanceof Error
//           ? error.message
//           : 'Failed to retrieve recruitment dashboard.',
//       );
//     }
//   }
//  async createCandidateApplication(
//     dto: CreateCandidateApplicationDto,
//     resume: Express.Multer.File,
//   ) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const resumeUrl = resume
//         ? `/uploads/recruitment/resumes/${resume.filename}`
//         : null;
 
//       const actualFileName = resume ? resume.originalname : null;
 
//       const fileName = resume ? resume.filename : null;
 
//       const fileExtension = resume ? extname(resume.originalname) : null;
 
//       const fileSizeKB = resume
//         ? Number((resume.size / 1024).toFixed(2))
//         : null;
 
//       const result = await pool
//         .request()
//         .input('JobOpeningID', sql.Int, dto.jobOpeningId)
//         .input('FullName', sql.VarChar(200), dto.fullName)
//         .input('Email', sql.VarChar(150), dto.email)
//         .input('Phone', sql.VarChar(20), dto.phone)
//         .input('Address', sql.VarChar(500), dto.address ?? null)
//         .input('ResumeURL', sql.VarChar(500), resumeUrl)
//         .input('ActualFileName', sql.VarChar(255), actualFileName)
//         .input('FileName', sql.VarChar(255), fileName)
//         .input('FileExtension', sql.VarChar(20), fileExtension)
//         .input('FileSizeKB', sql.Decimal(18, 2), fileSizeKB)
//         .input('Source', sql.VarChar(100), dto.source ?? null)
//         .input('ReferredBy', sql.VarChar(100), dto.referredBy ?? null)
//         .execute('USP_CreateCandidateApplication');
 
//       return result.recordset;
//     } catch (error) {
//       console.error('Create candidate application error:', error);
 
//       throw new InternalServerErrorException(
//         'Failed to create candidate application.',
//       );
//     }
//   }
//   //  async getActiveJobOpenings(companyId: number) {
//   //   try {
//   //     const pool = await this.databaseService.connect();
 
//   //     const result = await pool
//   //       .request()
//   //       .input('CompanyID', sql.Int, companyId)
//   //       .input('Flag', sql.Int, 3)
//   //       .execute('USP_GetRecruitmentPriority');
 
//   //     return {
//   //       success: true,
//   //       data: result.recordset || [],
//   //       message: 'Active job openings retrieved successfully.',
//   //     };
//   //   } catch (error) {
//   //     console.error('Get active job openings error:', error);
 
//   //     throw new InternalServerErrorException(
//   //       error instanceof Error
//   //         ? error.message
//   //         : 'Failed to retrieve active job openings.',
//   //     );
//   //   }
//   // }

   
 
//   // async getRecruitmentSources() {
//   //   try {
//   //     const pool = await this.databaseService.connect();
 
//   //     const result = await pool
//   //       .request()
//   //       .input('CompanyID', sql.Int, 0)
//   //       .input('Flag', sql.Int, 4)
//   //       .execute('USP_GetRecruitmentPriority');
 
//   //     return {
//   //       success: true,
//   //       data: result.recordset || [],
//   //       message: 'Recruitment sources retrieved successfully.',
//   //     };
//   //   } catch (error) {
//   //     console.error('Get recruitment sources error:', error);
 
//   //     throw new InternalServerErrorException(
//   //       error instanceof Error
//   //         ? error.message
//   //         : 'Failed to retrieve recruitment sources.',
//   //     );
//   //   }
//   // }
 
 
//   // Create a new requisition start from here
//   async createRequisition(
//     dto: CreateRequisitionDto,
//     employeeId: string,
//     companyId: number,
//   ) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('Action', sql.VarChar(20), 'CREATE')
//         .input('RequisitionID', sql.Int, null)
//         .input('CompanyID', sql.Int, companyId)
//         .input('BranchID', sql.Int, dto.branchId)
//         .input('DesignationID', sql.Int, dto.designationId)
//         .input('JobTitle', sql.NVarChar(100), dto.jobTitle)
//         .input('Vacancies', sql.Int, dto.vacancies)
//         .input('SalaryRangeMin', sql.Decimal(12, 2), dto.salaryRangeMin ?? null)
//         .input('SalaryRangeMax', sql.Decimal(12, 2), dto.salaryRangeMax ?? null)
//         .input(
//           'ExperienceRequired',
//           sql.VarChar(50),
//           dto.experienceRequired ?? null,
//         )
//         .input('Priority', sql.Int, dto.priority ?? null)
//         .input('ActionBy', sql.VarChar(25), employeeId)
//         .input('ReviewRemarks', sql.VarChar(500), null)
//         .execute('USP_JobRequisition');
 
//       return result.recordset;
//     } catch (error) {
//       console.error('Error in createRequisition:', error);
//       throw error;
//     }
//   }
 
//   async getRequisitionMaster(companyId: number) {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool
//         .request()
//         .input('CompanyID', sql.Int, companyId)
//         .input('IncludeInactive', sql.Bit, 0)
//         .input('AsJson', sql.Bit, 0)
//         .execute('USP_GetCompanyMasterData_N');
 
//       return {
//         success: true,
//         data: {
//           companies: result.recordsets[0] || [],
//           branches: result.recordsets[1] || [],
//           departments: result.recordsets[2] || [],
//           designations: result.recordsets[3] || [],
//         },
//       };
//     } catch (error) {
//       console.error('Error in getRequisitionMaster:', error);
//       throw error;
//     }
//   }
 
//   async getRecruitmentPriorities() {
//     try {
//       const pool = await this.databaseService.connect();
 
//       const result = await pool.request().execute('USP_GetRecruitmentPriority');
 
//       return {
//         success: true,
//         data: result.recordset,
//         message: 'Recruitment priorities retrieved successfully.',
//       };
//     } catch (error) {
//       console.error('Error in getRecruitmentPriorities:', error);
//       throw error;
//     }
//   }
// }

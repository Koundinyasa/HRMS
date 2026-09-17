import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { EmployeeDetailsService } from './employee-details.service';

import { GetEmployeesDto } from './dto/get-employees.dto';
import { CreateEmployeeGroupDto } from './dto/create-employee-group.dto';
import { UpdatePendingCandidateDto } from './dto/update-pending-candidate.dto';
import { UpdateGeneralDto } from './dto/update-general.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { UpdateStatutoryDto } from './dto/update-statutory.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateHrCategoryDto } from './dto/update-hrcategory.dto';
import { UpdateDocumentsDto } from './dto/update-documents.dto';
import { UpdateSalaryRateDto } from './dto/update-salary-rate.dto';
import { UnblockUserDto } from './dto/unblock-user.dto';
import { ImportEmployeeDto } from './dto/import-employee.dto';

import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('enrollment/employeedetails')
@UseGuards(JwtAuthGuard)
export class EmployeeDetailsController {
  constructor(
    private readonly employeeDetailsService: EmployeeDetailsService,
  ) {}
  // =========================================================
  // 3. Employee List
  // =========================================================

  @Get('employeelist')
  async getEmployees(@Query() dto: GetEmployeesDto) {
    return this.employeeDetailsService.getEmployees(dto);
  }

  //=====================================
  //Get Employees
  //=====================================
  // @Get('details/:employeeId')
  // async getEmployeeDetails(@Param('employeeId') employeeId: string) {
  //   return this.employeeDetailsService.getEmployeeDetails(employeeId);
  // }

  // ==========================================
  // Employees By Company
  // ==========================================

  // @Get('employees/:companyId')
  // async getEmployeesByCompanyId(@Param('companyId') companyId: string) {
  //   return this.employeeDetailsService.getEmployeesByCompanyId(
  //     Number(companyId),
  //   );
  // }

  // =========================================================
  // 4. Employee Groups
  // =========================================================

  @Get('employeegroups')
  async getEmployeeGroups() {
    return this.employeeDetailsService.getEmployeeGroups();
  }

  // =========================================================
  // 5. Employees for Group Selection
  // =========================================================

  @Get('employeegroups/employees')
  async getEmployeeGroupEmployees() {
    return this.employeeDetailsService.getEmployeeGroupEmployees();
  }

  // =========================================================
  // 6. Create / Save Employee Group
  // =========================================================

  @Post('employeegroups')
  async createEmployeeGroup(
    @Body() dto: CreateEmployeeGroupDto,
    @Req() req: any,
  ) {
    const createdBy = req.user.createdBy;

    return this.employeeDetailsService.createEmployeeGroup(dto, createdBy);
  }

  // =========================================================
  // 7. Pending Candidates
  // =========================================================

  @Get('pendingcandidates')
  async getPendingCandidates() {
    return this.employeeDetailsService.getPendingCandidates();
  }

  // =========================================================
  // 8. Pending Candidate Details
  // =========================================================

  @Get('pendingcandidates/:employeeId')
  async getPendingCandidateDetails(@Param('employeeId') employeeId: string) {
    return this.employeeDetailsService.getPendingCandidateDetails(employeeId);
  }

  // =========================================================
  // 9. Update Pending Candidate
  // =========================================================

  @Put('pendingcandidates/:employeeId')
  async updatePendingCandidate(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdatePendingCandidateDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updatePendingCandidate(
      employeeId,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 10. General
  // =========================================================

  @Put(':employeeId/general')
  async updateGeneral(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateGeneralDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updateGeneral(
      employeeId,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 11. Classification
  // =========================================================

  @Put(':employeeId/classification')
  async updateClassification(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateClassificationDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updateClassification(
      employeeId,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 12. Statutory
  // =========================================================

  @Put(':employeeId/statutory')
  async updateStatutory(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateStatutoryDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updateStatutory(
      employeeId,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 13. Address
  // =========================================================

  @Put(':employeeId/address')
  async updateAddress(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateAddressDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updateAddress(
      employeeId,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 14. HR Category
  // =========================================================

  @Put(':employeeId/hrcategory')
  async updateHrCategory(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateHrCategoryDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updateHrCategory(
      employeeId,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 15. Documents
  // =========================================================

  @Post(':employeeId/documents')
  @UseInterceptors(FileInterceptor('file'))
  async updateDocuments(
    @Param('employeeId') employeeId: string,
    @UploadedFile() file: any,
    @Body() dto: UpdateDocumentsDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updateDocuments(
      employeeId,
      file,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 16. Salary Rate
  // =========================================================

  @Put(':employeeId/salaryrate')
  async updateSalaryRate(
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateSalaryRateDto,
    @Req() req: any,
  ) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.updateSalaryRate(
      employeeId,
      dto,
      modifiedBy,
    );
  }

  // =========================================================
  // 17. Organization Chart
  // =========================================================

  @Get('organizationchart')
  async getOrganizationChart(
    @Query('employeeId') employeeId?: string,
    @Query('view') view?: string,
    @Query('branchId') branchId?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.employeeDetailsService.getOrganizationChart(
      employeeId,
      view,
      branchId,
      departmentId,
    );
  }

  // =========================================================
  // 18. Organization Chart Download
  // =========================================================

  @Get('organizationchart/download')
  async downloadOrganizationChart(
    @Query('employeeId') employeeId?: string,
    @Query('view') view?: string,
    @Query('branchId') branchId?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.employeeDetailsService.downloadOrganizationChart(
      employeeId,
      view,
      branchId,
      departmentId,
    );
  }

  // =========================================================
  // 19. Reset Blocked Users
  // =========================================================

  @Get('resetblockedusers')
  async getResetBlockedUsers() {
    return this.employeeDetailsService.getResetBlockedUsers();
  }

  // =========================================================
  // 20. Unblock User
  // =========================================================

  @Put('resetblockedusers/unblock')
  async unblockUser(@Body() dto: UnblockUserDto, @Req() req: any) {
    const modifiedBy = req.user.createdBy;

    return this.employeeDetailsService.unblockUser(dto, modifiedBy);
  }

  // =========================================================
  // 21. Audit Log
  // =========================================================

  @Get('auditlog')
  async getAuditLog(
    @Query('search') search?: string,
    @Query('userId') userId?: string,
    @Query('employeeId') employeeId?: string,
    @Query('action') action?: string,
  ) {
    return this.employeeDetailsService.getAuditLog(
      search,
      userId,
      employeeId,
      action,
    );
  }

  // =========================================================
  // 22. Import Template Types
  // =========================================================

  @Get('import/templatetypes')
  async getImportTemplateTypes() {
    return this.employeeDetailsService.getImportTemplateTypes();
  }

  // =========================================================
  // 23. Download Import Template
  // =========================================================

  @Get('import/template')
  async getImportTemplate(
    @Query('templateTypeId', ParseIntPipe)
    templateTypeId: number,
  ) {
    return this.employeeDetailsService.getImportTemplate(templateTypeId);
  }

  // =========================================================
  // 24. Import Employee
  // =========================================================

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importEmployee(
    @UploadedFile() file: any,
    @Body() dto: ImportEmployeeDto,
    @Req() req: any,
  ) {
    const createdBy = req.user.createdBy;

    return this.employeeDetailsService.importEmployee(file, dto, createdBy);
  }

  // List endpoint — powers the dashboard drill-through / EmployeePage1
  @Get('employees')
  async getEmployeesByCompanyId(
    @Req() req: any,
    @Query('flag', ParseIntPipe) flag: number,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const companyId = req.user.companyId;

    return this.employeeDetailsService.getEmployeesByCompanyId(
      companyId,
      flag,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
    );
  }

  // Single-employee detail page — powers EmployeeDetailsPage
  @Get('details/:employeeId')
  async getEmployeeDetails(@Param('employeeId') employeeId: string) {
    return this.employeeDetailsService.getEmployeeDetails(employeeId);
  }
}
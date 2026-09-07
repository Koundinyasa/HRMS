import { Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import * as sql from 'mssql';
import axios from 'axios';
import { UpdateLeavePolicyDetailsDto } from './dto/update-leave-policy-details.dto';
import { CreateLeavePolicyDetailsDto } from './dto/create-leave-policy-details.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';

import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateBranchStatusDto } from './dto/update-branch-status.dto';

import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { UpdateDesignationStatusDto } from './dto/update-designation-status.dto';

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import type { Response } from 'express';

@Injectable()
export class AdmincenterClassificationService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Get Classification Summary
  async getClassificationSummary(companyId: number) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetClassificationSummary');

      const summary = result.recordsets[0];
      const status = result.recordsets[1][0];

      return {
        statusCode: status.StatusCode,
        statusMessage: status.StatusMessage,
        data: summary,
      };
    } catch (error) {
    throw new BadRequestException((error as Error).message);
    }
  }

  // Get Classification Details 
  async getClassificationDetails(
  companyId: number,
  classificationId: number,) {
    try {
        const pool = await this.databaseService.connect();

        const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('ClassificationID', sql.Int, classificationId)
        .execute('USP_GetClassificationDetails');

        // If the SP returns StatusCode/StatusMessage
        if (
        result.recordset.length > 0 &&
        result.recordset[0].StatusCode
        ) {
        return {
            statusCode: result.recordset[0].StatusCode,
            statusMessage: result.recordset[0].StatusMessage,
            data: [],
        };
        }

        return {
        statusCode: 200,
        statusMessage: 'Classification details retrieved successfully.',
        data: result.recordset,
        };
    } catch (error) {
        throw new BadRequestException(
        error instanceof Error ? error.message : 'Internal Server Error',
        );
    }
  }

  // Add Leave Policy
  async addLeavePolicy(
  dto: CreateLeavePolicyDto,
  createdBy: number,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyName', sql.VarChar(200), dto.policyName)
      .input('EmploymentTypeID', sql.Int, dto.employmentTypeId)
      .input('DesignationID', sql.Int, dto.designationId ?? null)
      .input('DepartmentID', sql.Int, dto.departmentId ?? null)
      .input('LocationID', sql.Int, dto.locationId ?? null)
      .input('EffectiveFrom', sql.Date, dto.effectiveFrom)
      .input('EffectiveTo', sql.Date, dto.effectiveTo ?? null)
      .input('LeaveCreditFrequency', sql.VarChar(20), dto.leaveCreditFrequency)
      .input('LeaveCreditDay', sql.Int, dto.leaveCreditDay)
      .input('ProrateOnJoining', sql.Bit, dto.prorateOnJoining)
      .input('JoiningCutOffDay', sql.Int, dto.joiningCutOffDay)
      .input('JoiningCreditRule', sql.VarChar(20), dto.joiningCreditRule)
      .input('CreatedBy', sql.Int, createdBy)
      .execute('USP_AddLeavePolicy');

    return result.recordset[0];
  }


  // Update Leave Policy
  async updateLeavePolicy(
    dto: UpdateLeavePolicyDto,
    modifiedBy: number,
    ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyID', sql.Int, dto.policyId)
      .input('PolicyName', sql.VarChar(200), dto.policyName)
      .input('EmploymentTypeID', sql.Int, dto.employmentTypeId)
      .input('DesignationID', sql.Int, dto.designationId ?? null)
      .input('DepartmentID', sql.Int, dto.departmentId ?? null)
      .input('LocationID', sql.Int, dto.locationId ?? null)
      .input('EffectiveFrom', sql.Date, dto.effectiveFrom)
      .input('EffectiveTo', sql.Date, dto.effectiveTo ?? null)
      .input(
        'LeaveCreditFrequency',
        sql.VarChar(20),
        dto.leaveCreditFrequency ?? null,
      )
      .input(
        'LeaveCreditDay',
        sql.Int,
        dto.leaveCreditDay ?? null,
      )
      .input(
        'ProrateOnJoining',
        sql.Bit,
        dto.prorateOnJoining ?? false,
      )
      .input(
        'JoiningCutOffDay',
        sql.Int,
        dto.joiningCutOffDay ?? null,
      )
      .input(
        'JoiningCreditRule',
        sql.VarChar(20),
        dto.joiningCreditRule ?? null,
      )
      .input('ModifiedBy', sql.Int, modifiedBy)
      .execute('USP_UpdateLeavePolicy');

    return result.recordset[0];
  }

  //Update Leave Policy Details
  async updateLeavePolicyDetails(
  dto: UpdateLeavePolicyDetailsDto,
  modifiedBy: number,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyID', sql.Int, dto.policyId)
      .input('LeaveTypeID', sql.Int, dto.leaveTypeId)
      .input('AnnualQuota', sql.Decimal(6, 2), dto.annualQuota)
      .input('MonthlyAccrual', sql.Decimal(6, 2), dto.monthlyAccrual)
      .input('CreditDay', sql.Int, dto.creditDay ?? null)
      .input('CarryForwardLimit', sql.Decimal(6, 2), dto.carryForwardLimit)
      .input('MaxBalance', sql.Decimal(6, 2), dto.maxBalance)
      .input('EncashmentLimit', sql.Decimal(6, 2), dto.encashmentLimit)
      .input('ProbationEligible', sql.Bit, dto.probationEligible)
      .input('NoticePeriodEligible', sql.Bit, dto.noticePeriodEligible)
      .input('SandwichApplicable', sql.Bit, dto.sandwichApplicable)
      .input('IncludeHoliday', sql.Bit, dto.includeHoliday)
      .input('IncludeWeekOff', sql.Bit, dto.includeWeekOff)
      .input('ModifiedBy', sql.Int, modifiedBy)
      .execute('USP_UpdateLeavePolicyDetails');

    return result.recordset[0];
  }


 // Add Leave Policy Details
  async addLeavePolicyDetails(
  dto: CreateLeavePolicyDetailsDto,
  createdBy: number,
  ) {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyID', sql.Int, dto.policyId)
      .input('LeaveTypeID', sql.Int, dto.leaveTypeId)
      .input('AnnualQuota', sql.Decimal(6, 2), dto.annualQuota)
      .input('MonthlyAccrual', sql.Decimal(6, 2), dto.monthlyAccrual)
      .input('CreditDay', sql.Int, dto.creditDay ?? null)
      .input(
        'CarryForwardLimit',
        sql.Decimal(6, 2),
        dto.carryForwardLimit,
      )
      .input(
        'MaxBalance',
        sql.Decimal(6, 2),
        dto.maxBalance,
      )
      .input(
        'EncashmentLimit',
        sql.Decimal(6, 2),
        dto.encashmentLimit,
      )
      .input(
        'ProbationEligible',
        sql.Bit,
        dto.probationEligible,
      )
      .input(
        'NoticePeriodEligible',
        sql.Bit,
        dto.noticePeriodEligible,
      )
      .input(
        'SandwichApplicable',
        sql.Bit,
        dto.sandwichApplicable,
      )
      .input(
        'IncludeHoliday',
        sql.Bit,
        dto.includeHoliday,
      )
      .input(
        'IncludeWeekOff',
        sql.Bit,
        dto.includeWeekOff,
      )
      .input('CreatedBy', sql.Int, createdBy)
      .execute('USP_AddLeavePolicyDetails');

    return result.recordset[0];
  }


  //2 Create Branch
  async createBranch(
    userId: number,
    dto: CreateBranchDto,
  ) {
    return this.executeBranchProcedure(1, userId, dto);
  }

  // Update Branch
  async updateBranch(
    userId: number,
    dto: UpdateBranchDto,
  ) {
    return this.executeBranchProcedure(2, userId, dto);
  }

  // Update Branch Status
  async updateBranchStatus(
    userId: number,
    dto: UpdateBranchStatusDto,
  ) {
    return this.executeBranchProcedure(3, userId, dto);
  }

  private async executeBranchProcedure(
    flag: number,
    userId: number,
    dto: any,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('Flag', sql.Int, flag)
        .input('UserID', sql.Int, userId)
        .input('BranchID', sql.Int, dto.branchId ?? null)
        .input('BranchCode', sql.VarChar(50), dto.branchCode ?? null)
        .input('BranchName', sql.VarChar(200), dto.branchName ?? null)
        .input('Address1', sql.VarChar(255), dto.address1 ?? null)
        .input('Address2', sql.VarChar(255), dto.address2 ?? null)
        .input('City', sql.VarChar(100), dto.city ?? null)
        .input('StateID', sql.Int, dto.stateId ?? null)
        .input('CountryID', sql.Int, dto.countryId ?? null)
        .input('ZipCode', sql.VarChar(20), dto.zipCode ?? null)
        .input('PhoneNo', sql.VarChar(20), dto.phoneNo ?? null)
        .input('IsActive', sql.Bit, dto.isActive ?? true)
        .execute('USP_CompanyBranchesInsertUpdate');

      return result.recordset?.[0];
    } catch (error) {
      console.error('Branch API Error:', error);

      throw new BadRequestException(
        'Failed to process company branch.',
      );
    }
  }


  // Create Designation
async createDesignation(
  userId: number,
  dto: CreateDesignationDto,
) {
  return this.executeDesignationProcedure(1, userId, dto);
}


// Update Designation
async updateDesignation(
  userId: number,
  dto: UpdateDesignationDto,
) {
  return this.executeDesignationProcedure(2, userId, dto);
}


// Update Designation Status
async updateDesignationStatus(
  userId: number,
  dto: UpdateDesignationStatusDto,
) {
  return this.executeDesignationProcedure(3, userId, dto);
}


// Common Designation Procedure
private async executeDesignationProcedure(
  flag: number,
  userId: number,
  dto: any,
) {
  try {
    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('Flag', sql.Int, flag)
      .input('UserID', sql.Int, userId)
      .input('ID', sql.Int, dto.id ?? null)
      .input('DeptID', sql.Int, dto.departmentId ?? null)
      .input('Name', sql.VarChar(100), dto.name ?? null)
      .input('IsActive', sql.Bit, dto.isActive ?? true)
      .execute('USP_DesignationInsertUpdate');

    return result.recordset?.[0];

  } catch (error) {

    console.error(
      'Designation API Error:',
      error,
    );

    throw new BadRequestException(
      'Failed to process designation.',
    );
  }
}


async getBankInfo(
  ifsc: string,
  createdBy: number,
) {
  try {
    if (!ifsc) {
      throw new BadRequestException(
        'IFSC Code is required',
      );
    }

    const response = await axios.get(
      `https://ifsc.razorpay.com/${ifsc.trim().toUpperCase()}`,
    );

    const bank = response.data;

    const pool = await this.databaseService.connect();

    const result = await pool
      .request()
      .input('IFSC', sql.VarChar(15), bank.IFSC)
      .input('BankCode', sql.VarChar(10), bank.BANKCODE ?? null)
      .input('BankName', sql.VarChar(150), bank.BANK)
      .input('BranchName', sql.VarChar(150), bank.BRANCH)
      .input('Centre', sql.VarChar(100), bank.CENTRE)
      .input('District', sql.VarChar(100), bank.DISTRICT)
      .input('City', sql.VarChar(100), bank.CITY)
      .input('State', sql.VarChar(100), bank.STATE)
      .input('Address', sql.VarChar(500), bank.ADDRESS)
      .input('Contact', sql.VarChar(20), bank.CONTACT)
      .input('MICR', sql.VarChar(15), bank.MICR)
      .input('SWIFT', sql.VarChar(15), bank.SWIFT ?? null)
      .input('ISO3166', sql.VarChar(10), bank.ISO3166 ?? null)
      .input('IMPS', sql.Bit, bank.IMPS)
      .input('RTGS', sql.Bit, bank.RTGS)
      .input('NEFT', sql.Bit, bank.NEFT)
      .input('UPI', sql.Bit, bank.UPI)
      .input('CreatedBy', sql.Int, createdBy)
      .execute('USP_BankInfo_Insert');

    return result.recordset[0];
  } catch (error: any) {
    throw new BadRequestException(
      error?.response?.data || error.message,
    );
  }
}


// Import /Export Endpoints
  downloadTemplate(
    type: string,
    res: Response,
  ) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'admin',
      'admincenter',
      'classification',
      'templates',
      `${type}-template.xlsx`,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(
        'Template not found.',
      );
    }

    return res.download(filePath);
  }


  async uploadImportFile(
  file: Express.Multer.File,
  templateType: string,
) {
  if (!file) {
    throw new BadRequestException(
      'Please upload an Excel file.',
    );
  }

  if (
    !['branch', 'designation', 'bank'].includes(
      templateType.toLowerCase(),
    )
  ) {
    throw new BadRequestException(
      'Invalid template type.',
    );
  }

  const workbook = XLSX.readFile(file.path);

  if (workbook.SheetNames.length === 0) {
    throw new BadRequestException(
      'Excel file is empty.',
    );
  }

  const worksheet =
    workbook.Sheets[workbook.SheetNames[0]];

  const data = XLSX.utils.sheet_to_json(worksheet);

  if (data.length === 0) {
    throw new BadRequestException(
      'No records found in Excel file.',
    );
  }

  console.log(data);

  return {
    success: true,
    templateType,
    totalRecords: data.length,
    data,
  };
}

}

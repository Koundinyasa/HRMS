import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { SaveManualLeaveAllotmentDto } from './dto/save-manual-leave-allotment.dto';
import { CreateLeaveAdjustmentDto } from './dto/create-leave-adjustment.dto';
import { UpdateManualAllotmentDto } from './dto/update-manual-allotment.dto';
import { ImportLeaveAdjustmentDto } from './dto/import-leave-adjustment.dto';
import { GetManualLeaveAllotmentListDto } from './dto/get-manual-leave-allotment-list.dto';

@Injectable()
export class AdjustmentService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // ==========================================
  // Leave Adjustment Types
  // ==========================================

  async getLeaveTypes() {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .execute(
          'USP_GetLeaveAdjustmentTypes',
        ); // Placeholder SP

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching leave adjustment types:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch leave adjustment types.',
      );
    }
  }
  // ==========================================
// Leave Adjustment Configuration
// ==========================================

async getLeaveAdjustmentConfiguration(
  leaveId: number,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('LeaveId', leaveId)
      .execute(
        'USP_GetLeaveAdjustmentConfiguration',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching leave adjustment configuration:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch leave adjustment configuration.',
    );
  }
}
// ==========================================
// Employees
// ==========================================

async getEmployees() {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .execute(
        'USP_GetLeaveAdjustmentEmployees',// we can also use an inline query to fetch employee names
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching employees:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch employees.',
    );
  }
}

// ==========================================
// Manual Leave Allotment - Leave Policies
// ==========================================

async getLeavePolicies() {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .execute(
        'USP_GetLeavePolicies',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching leave policies:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch leave policies.',
    );
  }
}
// ==========================================
// Manual Leave Allotment - Policy Leave Types
// ==========================================

async getPolicyLeaves(
  policyId: number,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyId', policyId)
      .execute(
        'USP_GetManualAllotmentLeaves',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching policy leave types:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch policy leave types.',
    );
  }
}
// ==========================================
// Manual Leave Allotment - Employee Grid
// ==========================================

async getEmployeeAllotments(
  policyId: number,
  leaveId: number,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyId', policyId)
      .input('LeaveId', leaveId)
      .execute(
        'USP_GetManualLeaveAllotments',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching employee allotments:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch employee allotments.',
    );
  }
}
// ==========================================
// Update Manual Leave Allotment
// ==========================================

async updateManualAllotment(
  dto: UpdateManualAllotmentDto,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input('PolicyId', dto.policyId)
      .input('LeaveId', dto.leaveId)
      .input(
        'Employees',
        JSON.stringify(dto.employees),
      )
      .execute(
        'USP_UpdateManualLeaveAllotments',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while updating manual leave allotments:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to update manual leave allotments.',
    );
  }
}

// ==========================================
// Import - Pay Months
// ==========================================

async getPayMonths() {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .execute(
        'USP_GetPayMonths',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while fetching pay months:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to fetch pay months.',
    );
  }
}
// ==========================================
// Import Leave Adjustment
// ==========================================

async importLeaveAdjustment(
  file: any,
  dto: ImportLeaveAdjustmentDto,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input(
        'TemplateTypeId',
        dto.templateTypeId,
      )
      .input(
        'PayMonthId',
        dto.payMonthId,
      )
      .input(
        'FileName',
        file.originalname,
      )
      .execute(
        'USP_ImportLeaveAdjustment',
      ); // Placeholder SP

    return result.recordset;
  } catch (error) {
    console.error(
      'Error while importing leave adjustment:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to import leave adjustment.',
    );
  }
}


// Starting from here actual SPs
  // ==========================================
// Insert Leave Adjustment
// ==========================================

async createLeaveAdjustment(
  dto: CreateLeaveAdjustmentDto,
  adjustedBy: number,
) {
  try {
    const pool =
      await this.databaseService.connect();

    const result = await pool
      .request()
      .input(
        'EmployeeID',
        dto.employeeId,
      )
      .input(
        'LeaveTypeID',
        dto.leaveTypeId,
      )
      .input(
        'AdjustmentDays',
        dto.adjustmentDays,
      )
      .input(
        'IsAllot',
        dto.isAllot,
      )
      .input(
        'Reason',
        dto.reason ?? 'Manual Adjustment',
      )
      .input(
        'AdjustedBy',
        adjustedBy,
      )
      .input(
        'AdjustmentMonth',
        dto.adjustmentMonth,
      )
      .execute(
        'USP_InsertLeaveAdjustment',
      );

    return result.recordset?.[0] ?? result.recordset;
  } catch (error) {
    console.error(
      'Error while inserting leave adjustment:',
      error,
    );

    throw new InternalServerErrorException(
      'Unable to save leave adjustment.',
    );
  }
}



  

  // ==========================================
  // Save Manual Leave Allotment
  // ==========================================

  async saveManualLeaveAllotment(
    dto: SaveManualLeaveAllotmentDto,
    createdBy: number,
  ) {
    try {
      const pool =
        await this.databaseService.connect();

      const result = await pool
        .request()
        .input(
          'EmployeeId',
          dto.employeeId,
        )
        .input(
          'AdjustmentMonth',
          dto.adjustmentMonth ?? null,
        )
        .input(
          'Allotment',
          dto.allotment,
        )
        .input(
          'CreatedBy',
          createdBy,
        )
        .execute(
          'USP_SaveManualLeaveAllotment',
        );

      return result.recordset?.[0] ?? result.recordset;
    } catch (error) {
      console.error(
        'Error while saving manual leave allotment:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to save manual leave allotment.',
      );
    }
  }

  // ==========================================
// Get Manual Leave Allotment List
// ==========================================

  async getManualLeaveAllotmentList(
  dto: GetManualLeaveAllotmentListDto,
  companyId: number,
  ) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('CompanyId', companyId)
        .input(
          'LeaveTypeId',
          dto.leaveTypeId ?? null,
        )
        .input(
          'Month',
          dto.month ?? null,
        )
        .input(
          'Year',
          dto.year ?? null,
        )
        .execute(
          'USP_GetManualLeaveAllotmentList',
        );

      return result.recordset;
    } catch (error) {
      console.error(
        'Error while fetching manual leave allotment list:',
        error,
      );

      throw new InternalServerErrorException(
        'Unable to fetch manual leave allotment list.',
      );
    }
  }
}
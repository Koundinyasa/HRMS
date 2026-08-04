import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
 
import { DatabaseService } from '../../database/database.service';
 
import { CreateAssetRequestDto } from './dto/create-asset-request.dto';
import { ApproveAssetStageDto } from './dto/approve-asset-stage.dto';
import { CreateAssetAllocationDto } from './dto/create-asset-allocation.dto';
 
import { CreateAssetTypeDto } from './dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset-type.dto';
import { UpdateAssetTypeStatusDto } from './dto/update-asset-type-status.dto';
 
@Injectable()
export class AssetService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}
 private buildSectionResponse(
  title: string,
  data: any[],
) {
  // Handle Stored Procedures returning FOR JSON PATH
  if (data.length === 1) {
    const keys = Object.keys(data[0]);
 
    if (keys.length === 1 && keys[0].startsWith('JSON_')) {
      const json = data[0][keys[0]];
 
      // No active requests
      if (!json || json.trim() === '') {
        return {
          AssetRequests: [],
        };
      }
 
      return JSON.parse(json);
    }
  }
 
  return {
    sections: [
      {
        title,
        records: data.map((row) => ({
          fields: Object.entries(row).map(([key, value]) => ({
            label: key,
            value,
          })),
        })),
      },
    ],
  };
}
  // =====================================================
  // Asset Request
  // =====================================================
 
  // Create Asset Request
  async createAssetRequest(
    employeeId: string,
    createAssetRequestDto: CreateAssetRequestDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .input('AssetId', createAssetRequestDto.assetId)
        .input('Remarks', createAssetRequestDto.remarks)
        .execute('USP_InsertAssetRequest');
 
      return result.recordset[0];
    } catch (error) {
      console.error(
        'Error while submitting asset request:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to submit asset request.',
      );
    }
  }
 
  // =====================================================
  // Asset Approval Workflow
  // =====================================================
 
  // Approve / Reject Asset Request Stage
  async approveAssetStage(
    approverEmpID: string,
    approveAssetStageDto: ApproveAssetStageDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'RequestID',
          approveAssetStageDto.requestId,
        )
        .input(
          'StageOrder',
          approveAssetStageDto.stageOrder,
        )
        .input(
          'ApproverEmpID',
          approverEmpID,
        )
        .input(
          'ActionStatusId',
          approveAssetStageDto.actionStatusId,
        )
        .input(
          'Remarks',
          approveAssetStageDto.remarks,
        )
        .execute('USP_ApproveAssetStage');
 
      return result.recordset[0];
    } catch (error) {
      console.error(
        'Error while processing asset approval:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to process asset approval.',
      );
    }
  }
 
  // =====================================================
  // Asset Allocation
  // =====================================================
 
  // Allocate Asset
  async allocateAsset(
    employeeId: string,
    createAssetAllocationDto: CreateAssetAllocationDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'AssetRequestId',
          createAssetAllocationDto.assetRequestId,
        )
        .input(
          'AssetNumber',
          createAssetAllocationDto.assetNumber,
        )
        .input(
          'Configuration',
          createAssetAllocationDto.configuration,
        )
        .input(
          'AssetCondition',
          createAssetAllocationDto.assetCondition,
        )
        .input(
          'Location',
          createAssetAllocationDto.location,
        )
        // Keeping AssignedBy from request body as discussed
        .input(
          'AssignedBy',
          createAssetAllocationDto.assignedBy,
        )
        .execute('USP_AssetAllocation_Insert');
 
      return result.recordset[0];
    } catch (error) {
      console.error(
        'Error while allocating asset:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to allocate asset.',
      );
    }
  }
 
  // =====================================================
  // Asset Allocation History
  // =====================================================
 
  // Get Asset Allocation History
  async getAssetAllocationHistory(
    employeeId: string,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('EmployeeID', employeeId)
        .execute('USP_GetAssethistory');
 
      return this.buildSectionResponse(
  'Asset Allocation History',
  result.recordset,
);
    } catch (error) {
      console.error(
        'Error while fetching asset allocation history:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to fetch asset allocation history.',
      );
    }
  }
 
  // =====================================================
  // Pending Asset Requests
  // =====================================================
 
  // Get Pending Asset Requests for Approver
  async getPendingAssetRequests(
    approverEmpID: string,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input(
          'ApproverEmpID',
          approverEmpID,
        )
        .execute(
          'USP_GetPendingAssetRequestsForApprover',
        );
 
      return this.buildSectionResponse(
  'Pending Asset Requests',
  result.recordset,
);
    } catch (error) {
      console.error(
        'Error while fetching pending asset requests:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to fetch pending asset requests.',
      );
    }
  }
 
 
     // =====================================================
  // Asset Type
  // =====================================================
 
  // Create Asset Type
  async createAssetType(
    createdBy: string,
    createAssetTypeDto: CreateAssetTypeDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('Flag', 1)
        .input(
          'AssetName',
          createAssetTypeDto.assetName,
        )
        .input(
          'CreatedBy',
          createdBy,
        )
        .execute('USP_AssetType');
 
      return result.recordset[0];
    } catch (error) {
      console.error(
        'Error while creating asset type:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to create asset type.',
      );
    }
  }
 
  // =====================================================
  // Asset Type
  // =====================================================
 
  // Update Asset Type
  async updateAssetType(
    createdBy: string,
    updateAssetTypeDto: UpdateAssetTypeDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('Flag', 2)
        .input(
          'AssetName',
          updateAssetTypeDto.assetName,
        )
        .input(
          'NewAssetName',
          updateAssetTypeDto.newAssetName,
        )
        .input(
          'CreatedBy',
          createdBy,
        )
        .execute('USP_AssetType');
 
      return result.recordset[0];
    } catch (error) {
      console.error(
        'Error while updating asset type:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to update asset type.',
      );
    }
  }
 
  // =====================================================
  // Asset Type
  // =====================================================
 
  // Activate / Deactivate Asset Type
  async updateAssetTypeStatus(
    createdBy: string,
    updateAssetTypeStatusDto: UpdateAssetTypeStatusDto,
  ) {
    try {
      const pool = await this.databaseService.connect();
 
      const result = await pool
        .request()
        .input('Flag', 3)
        .input(
          'AssetName',
          updateAssetTypeStatusDto.assetName,
        )
        .input(
          'IsActive',
          updateAssetTypeStatusDto.isActive,
        )
        .input(
          'CreatedBy',
          createdBy,
        )
        .execute('USP_AssetType');
 
      return result.recordset[0];
    } catch (error) {
      console.error(
        'Error while updating asset type status:',
        error,
      );
 
      throw new InternalServerErrorException(
        'Unable to update asset type status.',
      );
    }
  }
 
  // =====================================================
  // Asset Type
  // =====================================================
 
  // Get Active Asset Types
async getAssetTypes() {
  try {
    const pool = await this.databaseService.connect();
 
    const result = await pool.request().query(`
      SELECT
        AssetID,
        AssetName
      FROM AssetType
      WHERE IsActive = 1
        AND Deleted = 0
    `);
 
    return this.buildSectionResponse(
      'Asset Types',
      result.recordset,
    );
  } catch (error) {
    console.error(
      'Error while fetching asset types:',
      error,
    );
 
    throw new InternalServerErrorException(
      'Unable to fetch asset types.',
    );
  }
}
  // =====================================================
// Asset Request Tracking
// =====================================================
 
async getAssetRequestStatus(employeeId: string) {
  try {
    const pool = await this.databaseService.connect();
 
    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_GetAssetRequestStatusbyEmployee');
 
    // Return the response from the stored procedure directly.
     return this.buildSectionResponse(
      'Asset Request Status',
      result.recordset,
    );
   
  } catch (error) {
    console.error(
      'Error while fetching asset request status:',
      error,
    );
 
    throw new InternalServerErrorException(
      'Unable to fetch asset request status.',
    );
  }
}
}
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AssetService } from './asset.service';

import { CreateAssetRequestDto } from './dto/create-asset-request.dto';
import { ApproveAssetStageDto } from './dto/approve-asset-stage.dto';
import { CreateAssetAllocationDto } from './dto/create-asset-allocation.dto';
import { CreateAssetTypeDto } from './dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset-type.dto';
import { UpdateAssetTypeStatusDto } from './dto/update-asset-type-status.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('asset')
@UseGuards(JwtAuthGuard)
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
  ) {}

  // =====================================================
  // Asset Request
  // =====================================================

  // Create Asset Request
  @Post('request')
  async createAssetRequest(
    @Req() req,
    @Body() dto: CreateAssetRequestDto,
  ) {
    return this.assetService.createAssetRequest(
      req.user.employeeId,
      dto,
    );
  }

  // =====================================================
  // Asset Approval Workflow
  // =====================================================

  // Approve / Reject Asset Request
  @Put('approvestage')
  async approveAssetStage(
    @Req() req,
    @Body() approveAssetStageDto: ApproveAssetStageDto,
  ) {
    return this.assetService.approveAssetStage(
      req.user.employeeId,
      approveAssetStageDto,
    );
  }

  // =====================================================
  // Asset Allocation
  // =====================================================

  // Allocate Asset
  @Post('allocation')
  async allocateAsset(
    @Req() req,
    @Body() createAssetAllocationDto: CreateAssetAllocationDto,
  ) {
    return this.assetService.allocateAsset(
      req.user.employeeId,
      createAssetAllocationDto,
    );
  }

  // =====================================================
  // Asset Allocation History
  // =====================================================

  // Get Asset Allocation History
  @Get('history')
  async getAssetAllocationHistory(
    @Req() req,
  ) {
    return this.assetService.getAssetAllocationHistory(
      req.user.employeeId,
    );
  }

  // =====================================================
  // Pending Asset Requests
  // =====================================================

  // Get Pending Asset Requests for Approver
  @Get('pendingrequests')
  async getPendingAssetRequests(
    @Req() req,
  ) {
    return this.assetService.getPendingAssetRequests(
      req.user.employeeId,
    );
  }

  // =====================================================
  // Asset Type
  // =====================================================

  // Create Asset Type
  @Post('type')
  async createAssetType(
    @Req() req,
    @Body() createAssetTypeDto: CreateAssetTypeDto,
  ) {
    return this.assetService.createAssetType(
      req.user.employeeId,
      createAssetTypeDto,
    );
  }

  // =====================================================
  // Asset Type
  // =====================================================

  // Update Asset Type
  @Put('type/update')
  async updateAssetType(
    @Req() req,
    @Body() updateAssetTypeDto: UpdateAssetTypeDto,
  ) {
    return this.assetService.updateAssetType(
      req.user.employeeId,
      updateAssetTypeDto,
    );
  }

  // =====================================================
  // Asset Type
  // =====================================================

  // Activate / Deactivate Asset Type
  @Put('type/status')
  async updateAssetTypeStatus(
    @Req() req,
    @Body() updateAssetTypeStatusDto: UpdateAssetTypeStatusDto,
  ) {
    return this.assetService.updateAssetTypeStatus(
      req.user.employeeId,
      updateAssetTypeStatusDto,
    );
  }

  // =====================================================
  // Asset Type
  // =====================================================

  // Get Active Asset Types
  @Get('types')
  async getAssetTypes() {
    return this.assetService.getAssetTypes();
  }
  
// Tracking for Employee
  @Get('return')
async getAssetRequestStatus(
  @Req() req,
) {
  return this.assetService.getAssetRequestStatus(
    req.user.employeeId,
  );
}

}

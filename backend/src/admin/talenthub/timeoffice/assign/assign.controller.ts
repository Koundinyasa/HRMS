import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { AssignService } from './assign.service';

import { UpdateGeoLocationDto } from './dto/update-geo-location.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@Controller('admin/timeattendance/timeoffice/assign')
@UseGuards(JwtAuthGuard)
export class AssignController {
  constructor(
    private readonly assignService: AssignService,
  ) {}

  // =========================================================
  // GEO-LOCATION
  // =========================================================

  // 1. Get Employee Geo-Location List
  @Get('geo-location')
  async getGeoLocationList() {
    return this.assignService.getGeoLocationList();
  }

  // 2. Get Location List
  @Get('geo-location/locations')
  async getLocations() {
    return this.assignService.getLocations();
  }

  // 3. Get Employee Geo-Location Details
  @Get('geo-location/:employeeId')
  async getGeoLocationDetails(
    @Param('employeeId') employeeId: string,
  ) {
    return this.assignService.getGeoLocationDetails(
      employeeId,
    );
  }

  // 4. Update Employee Geo-Location
  @Put('geo-location')
  async updateGeoLocation(
    @Body() dto: UpdateGeoLocationDto,
  ) {
    return this.assignService.updateGeoLocation(dto);
  }

  // =========================================================
  // POLICY UPDATE
  // =========================================================

  // 5. Get Employee Policy List
  @Get('policy-update')
  async getPolicyUpdateList() {
    return this.assignService.getPolicyUpdateList();
  }

  // 6. Get Policy List
  @Get('policy-update/policies')
  async getPolicies() {
    return this.assignService.getPolicies();
  }

  // 7. Update Employee Policy
  @Put('policy-update')
  async updatePolicy(
    @Body() dto: UpdatePolicyDto,
  ) {
    return this.assignService.updatePolicy(dto);
  }
}
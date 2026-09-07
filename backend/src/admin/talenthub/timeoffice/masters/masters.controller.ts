import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Query,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';

import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';

import { MastersService } from './masters.service';
import {FileInterceptor,} from '@nestjs/platform-express';

import { AttendancePolicyDto } from './dto/attendance-policy.dto';
import { AttendanceIpDto } from './dto/attendance-ip.dto';
import { WorkHoursPolicyDto } from './dto/work-hours-policy.dto';
import { LateInPolicyDto } from './dto/late-in-policy.dto';
import { EarlyOutPolicyDto } from './dto/early-out-policy.dto';
import { OnDutyPolicyDto } from './dto/on-duty-policy.dto';
import { WorkFromHomePolicyDto } from './dto/work-from-home-policy.dto';
import { PermissionsPolicyDto } from './dto/permissions-policy.dto';
import { AdvancedPolicyDto } from './dto/advanced-policy.dto';
import { ShiftPatternDto } from './dto/shift-pattern.dto';
import { ShiftMasterDto } from './dto/shift-master.dto';
import { GeoLocationDto } from './dto/geo-location.dto';

@Controller('admin/timeattendance/timeoffice/masters')
@UseGuards(JwtAuthGuard)
export class MastersController {
  constructor(
    private readonly mastersService: MastersService,
  ) {}

  // =========================================================
  // POLICY - ATTENDANCE
  // =========================================================

  @Get('policy/attendance')
  async getAttendancePolicy() {
    return this.mastersService.getAttendancePolicy();
  }

  @Put('policy/attendance')
  async updateAttendancePolicy(
    @Body() dto: AttendancePolicyDto,
  ) {
    return this.mastersService.updateAttendancePolicy(dto);
  }

  @Post('policy/attendance/ip')
  async addAttendanceIp(
    @Body() dto: AttendanceIpDto,
  ) {
    return this.mastersService.addAttendanceIp(dto);
  }

  // =========================================================
  // POLICY - WORK HOURS
  // =========================================================

  @Get('policy/workhours')
  async getWorkHoursPolicy() {
    return this.mastersService.getWorkHoursPolicy();
  }

  @Put('policy/workhours')
  async updateWorkHoursPolicy(
    @Body() dto: WorkHoursPolicyDto,
  ) {
    return this.mastersService.updateWorkHoursPolicy(dto);
  }

  // =========================================================
  // POLICY - LATE IN
  // =========================================================

  @Get('policy/latein')
  async getLateInPolicy() {
    return this.mastersService.getLateInPolicy();
  }

  @Put('policy/latein')
  async updateLateInPolicy(
    @Body() dto: LateInPolicyDto,
  ) {
    return this.mastersService.updateLateInPolicy(dto);
  }

  // =========================================================
  // POLICY - EARLY OUT
  // =========================================================

  @Get('policy/earlyout')
  async getEarlyOutPolicy() {
    return this.mastersService.getEarlyOutPolicy();
  }

  @Put('policy/earlyout')
  async updateEarlyOutPolicy(
    @Body() dto: EarlyOutPolicyDto,
  ) {
    return this.mastersService.updateEarlyOutPolicy(dto);
  }

  // =========================================================
  // POLICY - ON DUTY
  // =========================================================

  @Get('policy/onduty')
  async getOnDutyPolicy() {
    return this.mastersService.getOnDutyPolicy();
  }

  @Put('policy/onduty')
  async updateOnDutyPolicy(
    @Body() dto: OnDutyPolicyDto,
  ) {
    return this.mastersService.updateOnDutyPolicy(dto);
  }

  // =========================================================
  // POLICY - WORK FROM HOME
  // =========================================================

  @Get('policy/workfromhome')
  async getWorkFromHomePolicy() {
    return this.mastersService.getWorkFromHomePolicy();
  }

  @Put('policy/workfromhome')
  async updateWorkFromHomePolicy(
    @Body() dto: WorkFromHomePolicyDto,
  ) {
    return this.mastersService.updateWorkFromHomePolicy(dto);
  }

  // =========================================================
  // POLICY - PERMISSIONS
  // =========================================================

  @Get('policy/permissions')
  async getPermissionsPolicy() {
    return this.mastersService.getPermissionsPolicy();
  }

  @Put('policy/permissions')
  async updatePermissionsPolicy(
    @Body() dto: PermissionsPolicyDto,
  ) {
    return this.mastersService.updatePermissionsPolicy(dto);
  }

  // =========================================================
  // POLICY - ADVANCED
  // =========================================================

  @Get('policy/advanced')
  async getAdvancedPolicy() {
    return this.mastersService.getAdvancedPolicy();
  }

  @Put('policy/advanced')
  async updateAdvancedPolicy(
    @Body() dto: AdvancedPolicyDto,
  ) {
    return this.mastersService.updateAdvancedPolicy(dto);
  }
  // =========================================================
// SHIFT PATTERN
// =========================================================

// 18. Get Shift Pattern List

@Get('shiftpattern')
async getShiftPatterns() {
  return this.mastersService.getShiftPatterns();
}

// 19. Get Shift Pattern Details

@Get('shiftpattern/:shiftPatternId')
async getShiftPatternDetails(
  @Param('shiftPatternId') shiftPatternId: string,
) {
  return this.mastersService.getShiftPatternDetails(
    shiftPatternId,
  );
}

// 20. Add Shift Pattern

@Post('shiftpattern')
async addShiftPattern(
  @Body() dto: ShiftPatternDto,
) {
  return this.mastersService.addShiftPattern(dto);
}

// 21. Update Shift Pattern

@Put('shiftpattern/:shiftPatternId')
async updateShiftPattern(
  @Param('shiftPatternId') shiftPatternId: string,
  @Body() dto: ShiftPatternDto,
) {
  return this.mastersService.updateShiftPattern(
    shiftPatternId,
    dto,
  );
}
// =========================================================
// SHIFT MASTER
// =========================================================

// 22. Get Shift Master List

@Get('shiftmaster')
async getShiftMasters() {
  return this.mastersService.getShiftMasters();
}

// 23. Get Shift Master Details

@Get('shiftmaster/:shiftId')
async getShiftMasterDetails(
  @Param('shiftId') shiftId: string,
) {
  return this.mastersService.getShiftMasterDetails(
    shiftId,
  );
}

// 24. Add Shift Master

@Post('shiftmaster')
async addShiftMaster(
  @Body() dto: ShiftMasterDto,
) {
  return this.mastersService.addShiftMaster(dto);
}

// 25. Update Shift Master

@Put('shiftmaster/:shiftId')
async updateShiftMaster(
  @Param('shiftId') shiftId: string,
  @Body() dto: ShiftMasterDto,
) {
  return this.mastersService.updateShiftMaster(
    shiftId,
    dto,
  );
}

// 26. Delete Shift Master

@Delete('shiftmaster/:shiftId')
async deleteShiftMaster(
  @Param('shiftId') shiftId: string,
) {
  return this.mastersService.deleteShiftMaster(
    shiftId,
  );
}
// =========================================================
// GEO LOCATION
// =========================================================

// 27. Get Geo Location List

@Get('geolocation')
async getGeoLocations() {
  return this.mastersService.getGeoLocations();
}

// 28. Get Geo Location Details

@Get('geolocation/:locationId')
async getGeoLocationDetails(
  @Param('locationId') locationId: string,
) {
  return this.mastersService.getGeoLocationDetails(
    locationId,
  );
}

// 29. Add Geo Location

@Post('geolocation')
async addGeoLocation(
  @Body() dto: GeoLocationDto,
) {
  return this.mastersService.addGeoLocation(dto);
}

// 30. Update Geo Location

@Put('geolocation/:locationId')
async updateGeoLocation(
  @Param('locationId') locationId: string,
  @Body() dto: GeoLocationDto,
) {
  return this.mastersService.updateGeoLocation(
    locationId,
    dto,
  );
}

// 31. Delete Geo Location

@Delete('geolocation/:locationId')
async deleteGeoLocation(
  @Param('locationId') locationId: string,
) {
  return this.mastersService.deleteGeoLocation(
    locationId,
  );
}
// =========================================================
// IMPORT
// =========================================================


// 32. Import Master Data

@Post('import')
@UseInterceptors(
  FileInterceptor('file'),
)
async importMasterData(
  @UploadedFile() file: any,
) {
  return this.mastersService.importMasterData(
    file,
  );
}
}
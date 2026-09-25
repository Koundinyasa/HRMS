import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';

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

@Injectable()
export class MastersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // =========================================================
  // POLICY - ATTENDANCE
  // =========================================================

  async getAttendancePolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_Attendance_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching attendance policy:', error);

      throw new InternalServerErrorException(
        'Unable to fetch attendance policy.',
      );
    }
  }

  async updateAttendancePolicy(dto: AttendancePolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ConsiderFirstIn', dto.considerFirstIn ?? null)
        .input('ConsiderLastOut', dto.considerLastOut ?? null)
        .input('AutoCalculateAttendance', dto.autoCalculateAttendance ?? null)
        .input('EffectiveFrom', dto.effectiveFrom ?? null)
        .execute('USP_Masters_Policy_Attendance_Update');

      return {
        success: true,
        message: 'Attendance policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating attendance policy:', error);

      throw new InternalServerErrorException(
        'Unable to update attendance policy.',
      );
    }
  }

  async addAttendanceIp(dto: AttendanceIpDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('IpAddress', dto.ipAddress)
        .input('Remarks', dto.remarks ?? null)
        .execute('USP_Masters_Policy_Attendance_IP_Add');

      return {
        success: true,
        message: 'IP address added successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error adding attendance IP:', error);

      throw new InternalServerErrorException('Unable to add IP address.');
    }
  }

  // =========================================================
  // POLICY - WORK HOURS
  // =========================================================

  async getWorkHoursPolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_WorkHours_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching work hours policy:', error);

      throw new InternalServerErrorException(
        'Unable to fetch work hours policy.',
      );
    }
  }

  async updateWorkHoursPolicy(dto: WorkHoursPolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('MinimumHoursForHalfDay', dto.minimumHoursForHalfDay ?? null)
        .input('MinimumHoursForFullDay', dto.minimumHoursForFullDay ?? null)
        .input('IncludeEarlyInMinutes', dto.includeEarlyInMinutes ?? null)
        .input('MaximumEarlyInMinutes', dto.maximumEarlyInMinutes ?? null)
        .input('EffectiveFrom', dto.effectiveFrom ?? null)
        .execute('USP_Masters_Policy_WorkHours_Update');

      return {
        success: true,
        message: 'Work hours policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating work hours policy:', error);

      throw new InternalServerErrorException(
        'Unable to update work hours policy.',
      );
    }
  }

  // =========================================================
  // POLICY - LATE IN
  // =========================================================

  async getLateInPolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_LateIn_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching late in policy:', error);

      throw new InternalServerErrorException('Unable to fetch late in policy.');
    }
  }

  async updateLateInPolicy(dto: LateInPolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('GracePeriodMinutes', dto.gracePeriodMinutes ?? null)
        .input('GracePeriodRestriction', dto.gracePeriodRestriction ?? null)
        .input('ConsiderGracePeriod', dto.considerGracePeriod ?? null)
        .input('EffectiveFrom', dto.effectiveFrom ?? null)
        .execute('USP_Masters_Policy_LateIn_Update');

      return {
        success: true,
        message: 'Late in policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating late in policy:', error);

      throw new InternalServerErrorException(
        'Unable to update late in policy.',
      );
    }
  }

  // =========================================================
  // POLICY - EARLY OUT
  // =========================================================

  async getEarlyOutPolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_EarlyOut_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching early out policy:', error);

      throw new InternalServerErrorException(
        'Unable to fetch early out policy.',
      );
    }
  }

  async updateEarlyOutPolicy(dto: EarlyOutPolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('GracePeriodMinutes', dto.gracePeriodMinutes ?? null)
        .input('GracePeriodRestriction', dto.gracePeriodRestriction ?? null)
        .input('ConsiderGracePeriod', dto.considerGracePeriod ?? null)
        .input('EffectiveFrom', dto.effectiveFrom ?? null)
        .execute('USP_Masters_Policy_EarlyOut_Update');

      return {
        success: true,
        message: 'Early out policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating early out policy:', error);

      throw new InternalServerErrorException(
        'Unable to update early out policy.',
      );
    }
  }

  // =========================================================
  // POLICY - ON DUTY
  // =========================================================

  async getOnDutyPolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_OnDuty_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching on duty policy:', error);

      throw new InternalServerErrorException('Unable to fetch on duty policy.');
    }
  }

  async updateOnDutyPolicy(dto: OnDutyPolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('AllowOnDuty', dto.allowOnDuty ?? null)
        .input(
          'RequiredApprovalForOdPunches',
          dto.requiredApprovalForOdPunches ?? null,
        )
        .execute('USP_Masters_Policy_OnDuty_Update');

      return {
        success: true,
        message: 'On duty policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating on duty policy:', error);

      throw new InternalServerErrorException(
        'Unable to update on duty policy.',
      );
    }
  }

  // =========================================================
  // POLICY - WORK FROM HOME
  // =========================================================

  async getWorkFromHomePolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_WorkFromHome_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching work from home policy:', error);

      throw new InternalServerErrorException(
        'Unable to fetch work from home policy.',
      );
    }
  }

  async updateWorkFromHomePolicy(dto: WorkFromHomePolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('AllowWorkFromHome', dto.allowWorkFromHome ?? null)
        .input('MaximumWfhAllowed', dto.maximumWfhAllowed ?? null)
        .input(
          'RestrictPastDatedWfhRequest',
          dto.restrictPastDatedWfhRequest ?? null,
        )
        .input('RestrictWfhRequestOn', dto.restrictWfhRequestOn ?? null)
        .input(
          'RequiredApprovalForWfhPunches',
          dto.requiredApprovalForWfhPunches ?? null,
        )
        .execute('USP_Masters_Policy_WorkFromHome_Update');

      return {
        success: true,
        message: 'Work from home policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating work from home policy:', error);

      throw new InternalServerErrorException(
        'Unable to update work from home policy.',
      );
    }
  }

  // =========================================================
  // POLICY - PERMISSIONS
  // =========================================================

  async getPermissionsPolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_Permissions_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching permissions policy:', error);

      throw new InternalServerErrorException(
        'Unable to fetch permissions policy.',
      );
    }
  }

  async updatePermissionsPolicy(dto: PermissionsPolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('AllowOfficialPermission', dto.allowOfficialPermission ?? null)
        .input('OfficialMinimumMinutes', dto.officialMinimumMinutes ?? null)
        .input('OfficialMaximumMinutes', dto.officialMaximumMinutes ?? null)
        .input('OfficialMaximumLimit', dto.officialMaximumLimit ?? null)
        .input(
          'OfficialMaximumDaysPerMonth',
          dto.officialMaximumDaysPerMonth ?? null,
        )
        .input(
          'ConsiderOfficialWorkStatus',
          dto.considerOfficialWorkStatus ?? null,
        )
        .input(
          'IncludeOfficialDurationInNetWorkHours',
          dto.includeOfficialDurationInNetWorkHours ?? null,
        )
        .input('AllowPersonalPermission', dto.allowPersonalPermission ?? null)
        .input('PersonalMinimumMinutes', dto.personalMinimumMinutes ?? null)
        .input('PersonalMaximumMinutes', dto.personalMaximumMinutes ?? null)
        .input('PersonalMaximumLimit', dto.personalMaximumLimit ?? null)
        .input(
          'PersonalMaximumDaysPerMonth',
          dto.personalMaximumDaysPerMonth ?? null,
        )
        .input(
          'ConsiderPersonalWorkStatus',
          dto.considerPersonalWorkStatus ?? null,
        )
        .input(
          'IncludePersonalDurationInNetWorkHours',
          dto.includePersonalDurationInNetWorkHours ?? null,
        )
        .execute('USP_Masters_Policy_Permissions_Update');

      return {
        success: true,
        message: 'Permissions policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating permissions policy:', error);

      throw new InternalServerErrorException(
        'Unable to update permissions policy.',
      );
    }
  }

  // =========================================================
  // POLICY - ADVANCED
  // =========================================================

  async getAdvancedPolicy() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_Policy_Advanced_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching advanced policy:', error);

      throw new InternalServerErrorException(
        'Unable to fetch advanced policy.',
      );
    }
  }

  async updateAdvancedPolicy(dto: AdvancedPolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('BreakLateInBufferMinutes', dto.breakLateInBufferMinutes ?? null)
        .input(
          'BreakEarlyOutBufferMinutes',
          dto.breakEarlyOutBufferMinutes ?? null,
        )
        .input('AdvancedBreakDeduction', dto.advancedBreakDeduction ?? null)
        .input('DefinedBreakDuration', dto.definedBreakDuration ?? null)
        .input(
          'ApplySandwichLeaveForWeekOff',
          dto.applySandwichLeaveForWeekOff ?? null,
        )
        .input('OneSideWeekOffPrefix', dto.oneSideWeekOffPrefix ?? null)
        .input('OneSideWeekOffSuffix', dto.oneSideWeekOffSuffix ?? null)
        .input('OneSideWeekOffBoth', dto.oneSideWeekOffBoth ?? null)
        .input(
          'ApplySandwichRuleForHoliday',
          dto.applySandwichRuleForHoliday ?? null,
        )
        .input('HolidayPrefix', dto.holidayPrefix ?? null)
        .input('HolidaySuffix', dto.holidaySuffix ?? null)
        .input('HolidayBoth', dto.holidayBoth ?? null)
        .execute('USP_Masters_Policy_Advanced_Update');

      return {
        success: true,
        message: 'Advanced policy updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating advanced policy:', error);

      throw new InternalServerErrorException(
        'Unable to update advanced policy.',
      );
    }
  }
  // =========================================================
  // SHIFT PATTERN
  // =========================================================

  // 18. Get Shift Pattern List

  async getShiftPatterns() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_ShiftPattern_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching shift patterns:', error);

      throw new InternalServerErrorException('Unable to fetch shift patterns.');
    }
  }

  // 19. Get Shift Pattern Details

  async getShiftPatternDetails(shiftPatternId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ShiftPatternId', shiftPatternId)
        .execute('USP_Masters_ShiftPattern_Details_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching shift pattern details:', error);

      throw new InternalServerErrorException(
        'Unable to fetch shift pattern details.',
      );
    }
  }

  // 20. Add Shift Pattern

  async addShiftPattern(dto: ShiftPatternDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('PatternName', dto.patternName)
        .input('PatternCode', dto.patternCode ?? null)
        .input('PatternType', dto.patternType ?? null)
        .input('EmployeeWiseWeekOff', dto.employeeWiseWeekOff ?? null)
        .input('ShiftMasterId', dto.shiftMasterId ?? null)
        .input('EffectiveFrom', dto.effectiveFrom ?? null)
        .execute('USP_Masters_ShiftPattern_Add');

      return {
        success: true,
        message: 'Shift pattern added successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error adding shift pattern:', error);

      throw new InternalServerErrorException('Unable to add shift pattern.');
    }
  }

  // 21. Update Shift Pattern

  async updateShiftPattern(shiftPatternId: string, dto: ShiftPatternDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ShiftPatternId', shiftPatternId)
        .input('PatternName', dto.patternName)
        .input('PatternCode', dto.patternCode ?? null)
        .input('PatternType', dto.patternType ?? null)
        .input('EmployeeWiseWeekOff', dto.employeeWiseWeekOff ?? null)
        .input('ShiftMasterId', dto.shiftMasterId ?? null)
        .input('EffectiveFrom', dto.effectiveFrom ?? null)
        .execute('USP_Masters_ShiftPattern_Update');

      return {
        success: true,
        message: 'Shift pattern updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating shift pattern:', error);

      throw new InternalServerErrorException('Unable to update shift pattern.');
    }
  }
  // =========================================================
  // SHIFT MASTER
  // =========================================================

  // 22. Get Shift Master List

  async getShiftMasters() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_ShiftMaster_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching shift masters:', error);

      throw new InternalServerErrorException('Unable to fetch shift masters.');
    }
  }

  // 23. Get Shift Master Details

  async getShiftMasterDetails(shiftId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ShiftId', shiftId)
        .execute('USP_Masters_ShiftMaster_Details_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching shift master details:', error);

      throw new InternalServerErrorException(
        'Unable to fetch shift master details.',
      );
    }
  }

  // 24. Add Shift Master

  async addShiftMaster(dto: ShiftMasterDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ShiftName', dto.shiftName)
        .input('ShiftCode', dto.shiftCode ?? null)
        .input('StartTime', dto.startTime ?? null)
        .input('EndTime', dto.endTime ?? null)
        .input('Remarks', dto.remarks ?? null)
        .execute('USP_Masters_ShiftMaster_Add');

      return {
        success: true,
        message: 'Shift master added successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error adding shift master:', error);

      throw new InternalServerErrorException('Unable to add shift master.');
    }
  }

  // 25. Update Shift Master

  async updateShiftMaster(shiftId: string, dto: ShiftMasterDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ShiftId', shiftId)
        .input('ShiftName', dto.shiftName)
        .input('ShiftCode', dto.shiftCode ?? null)
        .input('StartTime', dto.startTime ?? null)
        .input('EndTime', dto.endTime ?? null)
        .input('Remarks', dto.remarks ?? null)
        .execute('USP_Masters_ShiftMaster_Update');

      return {
        success: true,
        message: 'Shift master updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating shift master:', error);

      throw new InternalServerErrorException('Unable to update shift master.');
    }
  }

  // 26. Delete Shift Master

  async deleteShiftMaster(shiftId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('ShiftId', shiftId)
        .execute('USP_Masters_ShiftMaster_Delete');

      return {
        success: true,
        message: 'Shift master deleted successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error deleting shift master:', error);

      throw new InternalServerErrorException('Unable to delete shift master.');
    }
  }
  // =========================================================
  // GEO LOCATION
  // =========================================================

  // 27. Get Geo Location List

  async getGeoLocations() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_Masters_GeoLocation_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching geo locations:', error);

      throw new InternalServerErrorException('Unable to fetch geo locations.');
    }
  }

  // 28. Get Geo Location Details

  async getGeoLocationDetails(locationId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LocationId', locationId)
        .execute('USP_Masters_GeoLocation_Details_Get');

      return {
        success: true,
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error fetching geo location details:', error);

      throw new InternalServerErrorException(
        'Unable to fetch geo location details.',
      );
    }
  }

  // 29. Add Geo Location

  async addGeoLocation(dto: GeoLocationDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LocationName', dto.locationName)
        .input('LocationCode', dto.locationCode ?? null)
        .input('Latitude', dto.latitude ?? null)
        .input('Longitude', dto.longitude ?? null)
        .input('Radius', dto.radius ?? null)
        .execute('USP_Masters_GeoLocation_Add');

      return {
        success: true,
        message: 'Geo location added successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error adding geo location:', error);

      throw new InternalServerErrorException('Unable to add geo location.');
    }
  }

  // 30. Update Geo Location

  async updateGeoLocation(locationId: string, dto: GeoLocationDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LocationId', locationId)
        .input('LocationName', dto.locationName)
        .input('LocationCode', dto.locationCode ?? null)
        .input('Latitude', dto.latitude ?? null)
        .input('Longitude', dto.longitude ?? null)
        .input('Radius', dto.radius ?? null)
        .execute('USP_Masters_GeoLocation_Update');

      return {
        success: true,
        message: 'Geo location updated successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error updating geo location:', error);

      throw new InternalServerErrorException('Unable to update geo location.');
    }
  }

  // 31. Delete Geo Location

  async deleteGeoLocation(locationId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('LocationId', locationId)
        .execute('USP_Masters_GeoLocation_Delete');

      return {
        success: true,
        message: 'Geo location deleted successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error deleting geo location:', error);

      throw new InternalServerErrorException('Unable to delete geo location.');
    }
  }
  // =========================================================
  // IMPORT
  // =========================================================

  // 32. Import Master Data

  async importMasterData(file: any) {
    try {
      if (!file) {
        throw new InternalServerErrorException('Import file is required.');
      }

      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('FileName', file.originalname)
        .execute('USP_Masters_Import_Save');

      return {
        success: true,
        message: 'Master data imported successfully.',
        data: result.recordset,
      };
    } catch (error) {
      console.error('Error importing master data:', error);

      throw new InternalServerErrorException('Unable to import master data.');
    }
  }
}

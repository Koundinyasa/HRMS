import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DatabaseService } from '../../../../database/database.service';

import { UpdateGeoLocationDto } from './dto/update-geo-location.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';

@Injectable()
export class AssignService {
  constructor(private readonly databaseService: DatabaseService) {}

  // =========================================================
  // GEO-LOCATION
  // =========================================================

  // 1. Get Employee Geo-Location List
  async getGeoLocationList() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Assign_GeoLocation_Get');

      return result.recordset;
    } catch (error) {
      console.error('Error fetching geo-location list:', error);

      throw new InternalServerErrorException(
        'Unable to fetch geo-location list.',
      );
    }
  }

  // 2. Get Location List
  async getLocations() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Assign_GeoLocation_Locations_Get');

      return result.recordset;
    } catch (error) {
      console.error('Error fetching locations:', error);

      throw new InternalServerErrorException('Unable to fetch locations.');
    }
  }

  // 3. Get Employee Geo-Location Details
  async getGeoLocationDetails(employeeId: string) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeId', employeeId)
        .execute('USP_TimeOffice_Assign_GeoLocation_Details_Get');

      return result.recordset;
    } catch (error) {
      console.error('Error fetching geo-location details:', error);

      throw new InternalServerErrorException(
        'Unable to fetch geo-location details.',
      );
    }
  }

  // 4. Update Employee Geo-Location
  async updateGeoLocation(dto: UpdateGeoLocationDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeIds', dto.employeeIds.join(','))
        .input('LocationId', dto.locationId)
        .input('EffectiveDate', dto.effectiveDate)
        .execute('USP_TimeOffice_Assign_GeoLocation_Update');

      return result.recordset;
    } catch (error) {
      console.error('Error updating geo-location:', error);

      throw new InternalServerErrorException('Unable to update geo-location.');
    }
  }

  // =========================================================
  // POLICY UPDATE
  // =========================================================

  // 5. Get Employee Policy List
  async getPolicyUpdateList() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Assign_PolicyUpdate_Get');

      return result.recordset;
    } catch (error) {
      console.error('Error fetching policy update list:', error);

      throw new InternalServerErrorException(
        'Unable to fetch policy update list.',
      );
    }
  }

  // 6. Get Policy List
  async getPolicies() {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .execute('USP_TimeOffice_Assign_Policies_Get');

      return result.recordset;
    } catch (error) {
      console.error('Error fetching policies:', error);

      throw new InternalServerErrorException('Unable to fetch policies.');
    }
  }

  // 7. Update Employee Policy
  async updatePolicy(dto: UpdatePolicyDto) {
    try {
      const pool = await this.databaseService.connect();

      const result = await pool
        .request()
        .input('EmployeeIds', dto.employeeIds.join(','))
        .input('FromPolicyId', dto.fromPolicyId)
        .input('ToPolicyId', dto.toPolicyId)
        .input('EffectiveDate', dto.effectiveDate)
        .input('Temporary', dto.temporary)
        .execute('USP_TimeOffice_Assign_PolicyUpdate');

      return result.recordset;
    } catch (error) {
      console.error('Error updating policy:', error);

      throw new InternalServerErrorException('Unable to update policy.');
    }
  }
}

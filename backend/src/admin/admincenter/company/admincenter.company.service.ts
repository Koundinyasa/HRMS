import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
 
import { DatabaseService } from '../../../database/database.service';
import * as sql from 'mssql';
 
import { UpdatePTSlabDto } from './dto/update-pt-slab.dto';
import { CompanyConfigurationDto } from './dto/company-configuration.dto';
 
import {
  PFConfigurationDto,
  PFDefaultConfigurationDto,
} from './dto/pf-configuration.dto';
 
import {
  ESIConfigurationDto,
  ESIDefaultConfigurationDto,
} from './dto/esi-configuration.dto';
 
import { PTConfigurationResponseDto } from './dto/pt-configuration.dto';
 
import {
  LWFConfigurationDto,
  LWFDefaultConfigurationDto,
} from './dto/lwf-configuration.dto';
 
import { EstablishmentConfigurationDto } from './dto/establishment-configuration.dto';
 
@Injectable()
export class AdmincentercompanyService {
  constructor(
    private readonly dbService: DatabaseService,
  ) {}
 
  // Format date without UTC/local timezone conversion
private formatDateValue(value: any): any {
  if (value === null || value === undefined || value === '') {
    return value;
  }
 
  if (value instanceof Date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(value);
 
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;
 
    return `${year}-${month}-${day}`;
  }
 
  if (typeof value === 'string') {
    const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
 
    if (dateMatch) {
      return dateMatch[1];
    }
  }
 
  return value;
}
 
  // Format date fields in a single record
 
  private formatRecordDateFields(
    record: any,
    dateFields: string[],
  ): any {
    if (!record) {
      return record;
    }
 
    const formattedRecord = { ...record };
 
    for (const field of dateFields) {
      formattedRecord[field] = this.formatDateValue(
        formattedRecord[field],
      );
    }
 
    return formattedRecord;
  }
 
  // Format date fields in multiple records
 
  private formatRecordsDateFields(
    records: any[],
    dateFields: string[],
  ): any[] {
    return (records ?? []).map((record) =>
      this.formatRecordDateFields(record, dateFields),
    );
  }
 
  // Get Company Configuration
 
  async getCompanyConfiguration(
    companyId: number,
  ): Promise<CompanyConfigurationDto> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetAdminConfigurationData');
 
      return this.formatRecordDateFields(
        result.recordsets[0]?.[0],
        ['DateOfEstablishment'],
      ) as CompanyConfigurationDto;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to fetch company configuration.',
      );
    }
  }
 
  // Get PF Configuration
 
  async getPFConfiguration(
    companyId: number,
  ): Promise<PFConfigurationDto> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetAdminConfigurationData');
 
      return {
        group: result.recordsets[1],
        configuration: this.formatRecordsDateFields(
          result.recordsets[2],
          ['Effective From'],
        ),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to fetch PF configuration.',
      );
    }
  }
 
  // Get ESI Configuration
 
  async getESIConfiguration(
    companyId: number,
  ): Promise<ESIConfigurationDto> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetAdminConfigurationData');
 
      return {
        group: result.recordsets[3],
        configuration: this.formatRecordsDateFields(
          result.recordsets[4],
          ['Effective From'],
        ),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to fetch ESI configuration.',
      );
    }
  }
 
  // Get PT Configuration
 
  async getPTConfiguration(
    companyId: number,
  ): Promise<PTConfigurationResponseDto> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetAdminConfigurationData');
 
      return {
        group: result.recordsets[5],
        slabs: this.formatRecordsDateFields(
          result.recordsets[6],
          ['Effective From'],
        ),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to fetch PT configuration.',
      );
    }
  }
 
  // Get LWF Configuration
 
  async getLWFConfiguration(
    companyId: number,
  ): Promise<LWFConfigurationDto> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetAdminConfigurationData');
 
      return {
        group: result.recordsets[7],
        configuration: this.formatRecordsDateFields(
          result.recordsets[8],
          ['Effective From'],
        ),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to fetch LWF configuration.',
      );
    }
  }
 
  // Get Establishment Configuration
 
  async getEstablishmentConfiguration(
    companyId: number,
  ): Promise<EstablishmentConfigurationDto> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .execute('USP_GetAdminConfigurationData');
 
      return result.recordsets[9][0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to fetch establishment configuration.',
      );
    }
  }
 
  // Update Company Configuration
 
  async updateCompanyConfiguration(
    companyId: number,
    modifiedBy: string,
    dto: CompanyConfigurationDto,
  ): Promise<any> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input('CompanyCode', sql.VarChar(50), dto.companyCode)
        .input('CIN_LPIN', sql.VarChar(50), dto.cin_LPIN)
        .input('TAN', sql.VarChar(50), dto.tan)
        .input('Website', sql.VarChar(255), dto.website)
        .input(
          'DateOfEstablishment',
          sql.Date,
          dto.dateOfEstablishment,
        )
        .input('IsPFApplicable', sql.Bit, dto.isPFApplicable)
        .input('IsESIApplicable', sql.Bit, dto.isESIApplicable)
        .input('IsPTApplicable', sql.Bit, dto.isPTApplicable)
        .input('IsTDSApplicable', sql.Bit, dto.isTDSApplicable)
        .input('IsLWFAvailable', sql.Bit, dto.isLWFAvailable)
        .input('TDSFilingMarToFeb', sql.Bit, dto.tdsFilingMarToFeb)
        .input('ContactMobile', sql.VarChar(20), dto.contactMobile)
        .input('Address1', sql.VarChar(255), dto.address1)
        .input('Address2', sql.VarChar(255), dto.address2)
        .input('Address3', sql.VarChar(255), dto.address3)
        .input('Modifiedby', sql.VarChar(100), String(modifiedBy))
        .input(
          'CompanyLogoPath',
          sql.VarChar(500),
          dto.companyLogoPath ?? null,
        )
        .execute('USP_UpdateCompanyDetails');
 
      return result.recordset[0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to update company configuration.',
      );
    }
  }
 
  // Update PF Configuration
 
  async updatePFConfiguration(
    companyId: number,
    modifiedBy: number,
    dto: PFDefaultConfigurationDto,
  ): Promise<any> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyId', sql.Int, companyId)
        .input('id', sql.Int, dto.id)
        .input('PFGroupId', sql.Int, dto.pfGroupId)
        .input('EffectiveFrom', sql.Date, dto.effectiveFrom)
        .input(
          'EmployeeEPFRate',
          sql.Decimal(10, 2),
          dto.epfPercentage,
        )
        .input(
          'EmployerEPFRate',
          sql.Decimal(10, 2),
          dto.employerEPFPercentage,
        )
        .input(
          'PensionFundRate',
          sql.Decimal(10, 2),
          dto.pensionFundPercentage,
        )
        .input(
          'SalaryCutOff',
          sql.Decimal(18, 2),
          dto.cutoff,
        )
        .input(
          'AccountNo02Rate',
          sql.Decimal(10, 2),
          dto.accountNo02Rate,
        )
        .input(
          'AccountNo21Rate',
          sql.Decimal(10, 2),
          dto.accountNo21Rate,
        )
        .input(
          'MinimumChargesAccNo02',
          sql.Decimal(18, 2),
          dto.minimumChargesAccNo02,
        )
        .input('PFOnPayDays', sql.Bit, dto.pfOnPayDays)
        .input('RoundOffTypeId', sql.Int, dto.roundOffTypeId)
        .input(
          'RestrictEmployerShare',
          sql.Bit,
          dto.restrictEmployerShare,
        )
        .input(
          'RestrictEmployerEmployeeWise',
          sql.Bit,
          dto.restrictEmployerEmployeeWise,
        )
        .input('IsDefault', sql.Bit, dto.isDefault)
        .input('IsActive', sql.Bit, dto.isActive)
        .input('ModifiedBy', sql.BigInt, Number(modifiedBy))
        .execute('USP_UpdatePFDetails');
 
      return result.recordset?.[0];
    } catch (error) {
      console.error('PF Update Error:', error);
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to update PF configuration.',
      );
    }
  }
 
  // Update ESI Configuration
 
  async updateESIConfiguration(
    companyId: number,
    modifiedBy: number,
    dto: ESIDefaultConfigurationDto,
  ): Promise<any> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('Id', sql.Int, dto.id)
        .input('CompanyId', sql.Int, companyId)
        .input('ESIGroupid', sql.Int, dto.esiGroupId)
        .input('EffectiveFrom', sql.Date, dto.effectiveFrom)
        .input('CutOffAmount', sql.Decimal(18, 2), dto.cutOffAmount)
        .input('EmployeeRate', sql.Decimal(10, 2), dto.employeeRate)
        .input('EmployerRate', sql.Decimal(10, 2), dto.employerRate)
        .input(
          'MinimumDailyWage',
          sql.Decimal(18, 2),
          dto.minimumDailyWage,
        )
        .input('RoundOffTypeid', sql.Int, dto.roundOffTypeId)
        .input('IsDefault', sql.Bit, dto.isDefault)
        .input('IsActive', sql.Bit, dto.isActive)
        .input('ModifiedBy', sql.Int, modifiedBy)
        .execute('USP_UpdateESIDetails');
 
      return result.recordset?.[0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to update ESI configuration.',
      );
    }
  }
 
  // Update LWF Configuration
 
  async updateLWFConfiguration(
    companyId: number,
    modifiedBy: number,
    dto: LWFDefaultConfigurationDto,
  ): Promise<any> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('ID', sql.Int, dto.id)
        .input('Companyid', sql.Int, companyId)
        .input('Stateid', sql.Int, dto.stateId)
        .input('LWFGroupID', sql.Int, dto.lwfGroupId)
        .input('EffectiveFrom', sql.Date, dto.effectiveFrom)
        .input('CutOffAmount', sql.Decimal(18, 2), dto.cutoffAmount)
        .input(
          'EmployeeContribution',
          sql.Decimal(18, 2),
          dto.employeeContribution,
        )
        .input(
          'EmployerContribution',
          sql.Decimal(18, 2),
          dto.employerContribution,
        )
        .input('DeductJan', sql.Bit, dto.january)
        .input('DeductFeb', sql.Bit, dto.february)
        .input('DeductMar', sql.Bit, dto.march)
        .input('DeductApr', sql.Bit, dto.april)
        .input('DeductMay', sql.Bit, dto.may)
        .input('DeductJun', sql.Bit, dto.june)
        .input('DeductJul', sql.Bit, dto.july)
        .input('DeductAug', sql.Bit, dto.august)
        .input('DeductSep', sql.Bit, dto.september)
        .input('DeductOct', sql.Bit, dto.october)
        .input('DeductNov', sql.Bit, dto.november)
        .input('DeductDec', sql.Bit, dto.december)
        .input('ModifiedBy', sql.BigInt, modifiedBy)
        .input('IsActive', sql.Bit, dto.isActive)
        .input('IsDefault', sql.Bit, dto.isDefault)
        .execute('USP_UpdateLWFConfigurationDetails');
 
      return result.recordset?.[0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to update LWF configuration.',
      );
    }
  }
 
  // Update PT Slab using USP_UpdatePTSlab
 
  async updatePTSlab(
    modifiedBy: number,
    dto: UpdatePTSlabDto,
  ): Promise<any> {
    try {
      const pool = await this.dbService.connect();
 
      const request = pool
        .request()
        .input('ID', sql.Int, dto.id)
        .input('FromSalary', sql.Decimal(18, 2), dto.fromSalary ?? null)
        .input('ToSalary', sql.Decimal(18, 2), dto.toSalary ?? null)
        .input('PTAmount', sql.Decimal(18, 2), dto.ptAmount ?? null)
        .input('ModifiedBy', sql.Int, modifiedBy);
 
      if (dto.isActive !== undefined) {
        request.input('IsActive', sql.Bit, dto.isActive);
      }
 
      const result = await request.execute('USP_UpdatePTSlab');
 
      return result.recordset?.[0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to update PT Slab details.',
      );
    }
  }
 
  // Update Establishment Configuration
 
  async updateEstablishmentConfiguration(
    companyId: number,
    modifiedBy: number,
    dto: EstablishmentConfigurationDto,
  ): Promise<any> {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('CompanyID', sql.Int, companyId)
        .input(
          'EstablishmentName',
          sql.NVarChar,
          dto.establishmentName,
        )
        .input(
          'EstablishmentAddress',
          sql.NVarChar,
          dto.establishmentAddress,
        )
        .input(
          'EmployerName',
          sql.NVarChar,
          dto.employerName,
        )
        .input(
          'EmployerAddress',
          sql.NVarChar,
          dto.employerAddress,
        )
        .input(
          'PrincipalEmployerName',
          sql.NVarChar,
          dto.principalEmployerName,
        )
        .input(
          'PrincipalEmployerAddress',
          sql.NVarChar,
          dto.principalEmployerAddress,
        )
        .input(
          'ContractorName',
          sql.NVarChar,
          dto.contractorName,
        )
        .input(
          'ContractorAddress',
          sql.NVarChar,
          dto.contractorAddress,
        )
        .input(
          'ManagerName',
          sql.NVarChar,
          dto.managerName,
        )
        .input(
          'ManagerAddress',
          sql.NVarChar,
          dto.managerAddress,
        )
        .input(
          'NatureOfBusiness',
          sql.NVarChar,
          dto.natureOfBusiness,
        )
        .input('IsActive', sql.Bit, dto.isActive)
        .input('ModifiedBy', sql.BigInt, modifiedBy)
        .execute('USP_UpdateEstablishmentDetails');
 
      return result.recordset?.[0];
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Failed to update Establishment configuration.',
      );
    }
  }
 
  // Upload Company Document
 
  async uploadDocument(file: Express.Multer.File) {
    return {
      message: 'Document uploaded successfully',
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
 
  // Salary Round Off and Period Type Dropdowns
 
  async getSalaryRoundOff() {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .execute('USP_GetPayrollMasters');
 
      return {
        statusCode: 200,
        message: 'Payroll dropdown options fetched successfully',
        data: {
          salaryRoundOff: result.recordsets?.[2] ?? [],
          periodType: result.recordsets?.[3] ?? [],
        },
      };
    } catch (error) {
      console.error('Payroll Dropdown Error:', error);
 
      throw new InternalServerErrorException(
        'Failed to fetch payroll dropdown options.',
      );
    }
  }
}
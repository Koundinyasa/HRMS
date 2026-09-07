// import {
//   BadRequestException,
//   Injectable,
// } from '@nestjs/common';

// import * as sql from 'mssql';

// import { DatabaseService } from '../../../database/database.service';

// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { UpdateRoleStatusDto } from './dto/update-role-status.dto';

// @Injectable()
// export class RolesService {
//   constructor(
//     private readonly dbService: DatabaseService,
//   ) {}

//   async getRoles(companyId: number) {
//     try {
//       const pool = await this.dbService.getConnection();

//       const result = await pool
//         .request()
//         .input(
//           'CompanyID',
//           sql.Int,
//           companyId,
//         )
//         .execute('USP_GetRoles');

//       return {
//         success: true,
//         statusCode: 200,
//         message: 'Roles fetched successfully.',
//         data: result.recordset || [],
//       };
//     } catch (error) {
//       console.error('getRoles failed:', error);

//       throw new BadRequestException(
//         error.message || 'Failed to fetch roles.',
//       );
//     }
//   }

//   async createRole(
//     dto: CreateRoleDto,
//     createdBy: number,
//     companyId: number,
//   ) {
//     try {
//       const pool = await this.dbService.getConnection();

//       const result = await pool
//         .request()
//         .input(
//           'RoleName',
//           sql.VarChar(100),
//           dto.roleName,
//         )
//         .input(
//           'CompanyID',
//           sql.Int,
//           companyId,
//         )
//         .input(
//           'CreatedBy',
//           sql.Int,
//           createdBy,
//         )
//         .execute('USP_CreateRole');

//       return {
//         success: true,
//         statusCode: 201,
//         message: 'Role created successfully.',
//         data: result.recordset?.[0] || null,
//       };
//     } catch (error) {
//       console.error('createRole failed:', error);

//       throw new BadRequestException(
//         error.message || 'Failed to create role.',
//       );
//     }
//   }

//   async updateRole(
//     roleId: number,
//     dto: UpdateRoleDto,
//     modifiedBy: number,
//     companyId: number,
//   ) {
//     try {
//       const pool = await this.dbService.getConnection();

//       const result = await pool
//         .request()
//         .input(
//           'RoleID',
//           sql.Int,
//           roleId,
//         )
//         .input(
//           'RoleName',
//           sql.VarChar(100),
//           dto.roleName,
//         )
//         .input(
//           'CompanyID',
//           sql.Int,
//           companyId,
//         )
//         .input(
//           'ModifiedBy',
//           sql.Int,
//           modifiedBy,
//         )
//         .execute('USP_UpdateRole');

//       return {
//         success: true,
//         statusCode: 200,
//         message: 'Role updated successfully.',
//         data: result.recordset?.[0] || null,
//       };
//     } catch (error) {
//       console.error('updateRole failed:', error);

//       throw new BadRequestException(
//         error.message || 'Failed to update role.',
//       );
//     }
//   }

//   async updateRoleStatus(
//     roleId: number,
//     dto: UpdateRoleStatusDto,
//     modifiedBy: number,
//     companyId: number,
//   ) {
//     try {
//       const pool = await this.dbService.getConnection();

//       const result = await pool
//         .request()
//         .input(
//           'RoleID',
//           sql.Int,
//           roleId,
//         )
//         .input(
//           'IsActive',
//           sql.Bit,
//           dto.isActive,
//         )
//         .input(
//           'CompanyID',
//           sql.Int,
//           companyId,
//         )
//         .input(
//           'ModifiedBy',
//           sql.Int,
//           modifiedBy,
//         )
//         .execute('USP_UpdateRoleStatus');

//       return {
//         success: true,
//         statusCode: 200,
//         message: 'Role status updated successfully.',
//         data: result.recordset?.[0] || null,
//       };
//     } catch (error) {
//       console.error('updateRoleStatus failed:', error);

//       throw new BadRequestException(
//         error.message || 'Failed to update role status.',
//       );
//     }
//   }
// }
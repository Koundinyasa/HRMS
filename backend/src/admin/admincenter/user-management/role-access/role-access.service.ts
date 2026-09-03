// import {
//   BadRequestException,
//   Injectable,
// } from '@nestjs/common';

// import * as sql from 'mssql';

// import { DatabaseService } from '../../../database/database.service';

// import { UpdateRoleAccessDto } from './dto/update-role-access.dto';

// @Injectable()
// export class RoleAccessService {
//   constructor(
//     private readonly dbService: DatabaseService,
//   ) {}

//   async getRoleAccess(
//     roleId: number,
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
//           'CompanyID',
//           sql.Int,
//           companyId,
//         )
//         .execute('USP_GetRoleAccess');

//       return {
//         success: true,
//         statusCode: 200,
//         message: 'Role access fetched successfully.',
//         data: result.recordset || [],
//       };
//     } catch (error) {
//       console.error('getRoleAccess failed:', error);

//       throw new BadRequestException(
//         error.message || 'Failed to fetch role access.',
//       );
//     }
//   }

//   async updateRoleAccess(
//     dto: UpdateRoleAccessDto,
//     companyId: number,
//     modifiedBy: number,
//   ) {
//     try {
//       const pool = await this.dbService.getConnection();

//       const result = await pool
//         .request()
//         .input(
//           'RoleID',
//           sql.Int,
//           dto.roleId,
//         )
//         .input(
//           'MenuID',
//           sql.Int,
//           dto.menuId,
//         )
//         .input(
//           'CompanyID',
//           sql.Int,
//           companyId,
//         )
//         .input(
//           'CanCreate',
//           sql.Bit,
//           dto.canCreate,
//         )
//         .input(
//           'CanRead',
//           sql.Bit,
//           dto.canRead,
//         )
//         .input(
//           'CanUpdate',
//           sql.Bit,
//           dto.canUpdate,
//         )
//         .input(
//           'CanDelete',
//           sql.Bit,
//           dto.canDelete,
//         )
//         .input(
//           'CanAudit',
//           sql.Bit,
//           dto.canAudit,
//         )
//         .input(
//           'ModifiedBy',
//           sql.Int,
//           modifiedBy,
//         )
//         .execute('USP_UpdateRoleAccess');

//       return {
//         success: true,
//         statusCode: 200,
//         message: 'Role access updated successfully.',
//         data: result.recordset?.[0] || null,
//       };
//     } catch (error) {
//       console.error('updateRoleAccess failed:', error);

//       throw new BadRequestException(
//         error.message || 'Failed to update role access.',
//       );
//     }
//   }
// }
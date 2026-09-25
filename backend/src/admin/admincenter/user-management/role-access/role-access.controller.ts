// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   ParseIntPipe,
//   Put,
//   Req,
//   UseGuards,
// } from '@nestjs/common';

// import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

// import { RoleAccessService } from './role-access.service';
// import { UpdateRoleAccessDto } from './dto/update-role-access.dto';

// @UseGuards(JwtAuthGuard)
// @Controller('admin/user-management/role-access')
// export class RoleAccessController {
//   constructor(
//     private readonly roleAccessService: RoleAccessService,
//   ) {}

//   @Get(':roleId')
//   async getRoleAccess(
//     @Param('roleId', ParseIntPipe) roleId: number,
//     @Req() req: any,
//   ) {
//     console.log('USER:', req.user);

//     const companyId = req.user.companyId;

//     return this.roleAccessService.getRoleAccess(
//       roleId,
//       companyId,
//     );
//   }

//   @Put()
//   async updateRoleAccess(
//     @Body() dto: UpdateRoleAccessDto,
//     @Req() req: any,
//   ) {
//     const companyId = req.user.companyId;
//     const modifiedBy = req.user.employeeId;

//     return this.roleAccessService.updateRoleAccess(
//       dto,
//       companyId,
//       modifiedBy,
//     );
//   }
// }

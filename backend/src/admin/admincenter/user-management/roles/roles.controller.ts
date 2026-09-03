// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   ParseIntPipe,
//   Patch,
//   Post,
//   Put,
//   Req,
//   UseGuards,
// } from '@nestjs/common';

// //import { RolesService } from './roles.service';

// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
// import { UpdateRoleStatusDto } from './dto/update-role-status.dto';

// import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
// @Controller('admin/user-management/roles')
// export class RolesController {
//   constructor(
//     private readonly rolesService: RolesService,
//   ) {}

//   @Get()
//   async getRoles(@Req() req: any) {
//     console.log('USER:', req.user);

//     const companyId = req.user.companyId;

//     return this.rolesService.getRoles(
//       companyId,
//     );
//   }

//   @Post()
//   async createRole(
//     @Body() dto: CreateRoleDto,
//     @Req() req: any,
//   ) {
//     const createdBy = req.user.employeeId;
//     const companyId = req.user.companyId;

//     return this.rolesService.createRole(
//       dto,
//       createdBy,
//       companyId,
//     );
//   }

//   @Put(':id')
//   async updateRole(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() dto: UpdateRoleDto,
//     @Req() req: any,
//   ) {
//     const modifiedBy = req.user.employeeId;
//     const companyId = req.user.companyId;

//     return this.rolesService.updateRole(
//       id,
//       dto,
//       modifiedBy,
//       companyId,
//     );
//   }

//   @Patch(':id/status')
//   async updateRoleStatus(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() dto: UpdateRoleStatusDto,
//     @Req() req: any,
//   ) {
//     const modifiedBy = req.user.employeeId;
//     const companyId = req.user.companyId;

//     return this.rolesService.updateRoleStatus(
//       id,
//       dto,
//       modifiedBy,
//       companyId,
//     );
//   }
// }
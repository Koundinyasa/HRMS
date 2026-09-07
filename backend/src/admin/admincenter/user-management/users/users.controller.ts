// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Param,
//   Body,
//   Query,
//   Req,
// } from '@nestjs/common';

// import { UsersService } from './users.service';

// import { GetUsersDto } from './dto/get-users.dto';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { UpdateUserStatusDto } from './dto/update-user-status.dto';


// @Controller('admin/users')
// export class UsersController {

//   constructor(
//     private readonly usersService: UsersService,
//   ) {}


//   // 1. Get Users List
//   @Get()
//   async getUsers(
//     @Query() dto:GetUsersDto,
//     @Req() req,
//   ){

//     return this.usersService.getUsers(
//       dto,
//       req.user.companyId,
//     );
//   }



//   // 2. Add User
//   @Post()
//   async createUser(
//     @Body() dto:CreateUserDto,
//     @Req() req,
//   ){

//     return this.usersService.createUser(
//       dto,
//       req.user.userId,
//       req.user.companyId,
//     );
//   }



//   // 3. Get User Details
//   @Get(':id')
//   async getUserDetails(
//     @Param('id') id:number,
//   ){

//     return this.usersService.getUserDetails(
//       id,
//     );
//   }



//   // 4. Update User
//   @Put(':id')
//   async updateUser(
//     @Param('id') id:number,
//     @Body() dto:UpdateUserDto,
//     @Req() req,
//   ){

//     return this.usersService.updateUser(
//       id,
//       dto,
//       req.user.userId,
//     );
//   }



//   // 5. Update Status
//   @Put(':id/status')
//   async updateStatus(
//     @Param('id') id:number,
//     @Body() dto:UpdateUserStatusDto,
//     @Req() req,
//   ){

//     return this.usersService.updateStatus(
//       id,
//       dto,
//       req.user.userId,
//     );
//   }

// }
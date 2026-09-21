// import {
//   Controller,
//   Get,
//   Req,
//   UseGuards,
//   Post,
//   Body,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { MyprofileService } from './myprofile.service';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
 
// @Controller('employee/myprofile')
// @UseGuards(JwtAuthGuard)
// export class MyprofileController {
//   constructor(
//     private readonly myprofileService: MyprofileService,
//   ) {}
 
//   @Get('info')
//   async getMyProfile(@Req() req: any) {
//     return await this.myprofileService.getEmployeeInfo(
//       req.user.employeeId,
//     );
//   }
 
//   @Post('documents/upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadDocument(
//     @Req() req: any,
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: any,
//   ) {
//     return await this.myprofileService.uploadDocument(
//       req.user.employeeId,
//       body,
//       file,
//     );
//   }
 
//   @Get('test')
//   test() {
//     return {
//       message: 'Myprofile controller working',
//     };
//   }
// }



import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyprofileService } from './myprofile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
 
@Controller('employee/myprofile')
@UseGuards(JwtAuthGuard)
export class MyprofileController {
  constructor(
    private readonly myprofileService: MyprofileService,
  ) {}
 
  @Get('info')
  async getMyProfile(@Req() req: any) {
    return await this.myprofileService.getEmployeeInfo(
      req.user.employeeId,
    );
  }
 
  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return await this.myprofileService.uploadDocument(
      req.user.employeeId,
      body,
      file,
    );
  }
 
  @Get('test')
  test() {
    return {
      message: 'Myprofile controller working',
    };
  }
}
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../../common/guards/permission.guard';
import { AdmincentercompanyService} from './admincenter.company.service';
import { CompanyConfigurationDto } from './dto/company-configuration.dto';
import { PFConfigurationDto, PFDefaultConfigurationDto } from './dto/pf-configuration.dto';
import {
  ESIConfigurationDto,
  ESIDefaultConfigurationDto,
} from './dto/esi-configuration.dto';
import { PTConfigurationDto, PTConfigurationResponseDto } from './dto/pt-configuration.dto';
import { LWFConfigurationDto, LWFDefaultConfigurationDto } from './dto/lwf-configuration.dto';
import { EstablishmentConfigurationDto } from './dto/establishment-configuration.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { diskStorage } from 'multer';
import { Permission } from '../../../common/decorators/permission.decorator';

const ADMIN_DASHBOARD_MENU_ID = 1 || 2;

@Controller('admin/configuration')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdmincentercompanyController {
  constructor(
    private readonly admincenterService: AdmincentercompanyService,
  ) {}

  @Get('company')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanView')
  getCompanyConfiguration(
    @Req() req,
  ): Promise<CompanyConfigurationDto> {
    return this.admincenterService.getCompanyConfiguration(
      req.user.companyId,
    );
  }

  @Get('pf')
  getPFConfiguration(
    @Req() req,
  ): Promise<PFConfigurationDto> {
    return this.admincenterService.getPFConfiguration(
      req.user.companyId,
    );
  }

  @Get('esi')
  getESIConfiguration(
    @Req() req,
  ): Promise<ESIConfigurationDto> {
    return this.admincenterService.getESIConfiguration(
      req.user.companyId,
    );
  }

  // @Get('pt')
  // getPTConfiguration(
  //   @Req() req,
  // ): Promise<PTConfigurationDto> {
  //   return this.admincenterService.getPTConfiguration(
  //     req.user.companyId,
  //   );
  // }

  @Get('pt')
  getPTConfiguration(
    @Req() req,
  ): Promise<PTConfigurationResponseDto> {
    return this.admincenterService.getPTConfiguration(
      req.user.companyId,
    );
  }

  @Get('lwf')
  getLWFConfiguration(
    @Req() req,
  ): Promise<LWFConfigurationDto> {
    return this.admincenterService.getLWFConfiguration(
      req.user.companyId,
    );
  }

  @Get('establishment')
  getEstablishmentConfiguration(
    @Req() req,
  ): Promise<EstablishmentConfigurationDto> {
    return this.admincenterService.getEstablishmentConfiguration(
      req.user.companyId,
    );
  }



@Put('company')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanEdit')
  updateCompanyConfiguration(
    @Req() req,
    @Body() dto: CompanyConfigurationDto,
  ): Promise<void> {

    return this.admincenterService.updateCompanyConfiguration(
      req.user.companyId,
      req.user.createdBy,
      dto,
    );
  }
 
  @Put('pf')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanEdit')
  updatePFConfiguration(
    @Req() req,
    @Body() dto: PFDefaultConfigurationDto,
  ): Promise<void> {
    return this.admincenterService.updatePFConfiguration(
      req.user.companyId,
      req.user.createdBy,
      dto,
    );
  }
 
  @Put('esi')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanEdit')
  updateESIConfiguration(
    @Req() req,
    @Body() dto: ESIDefaultConfigurationDto,
  ): Promise<void> {
    return this.admincenterService.updateESIConfiguration(
      req.user.companyId,
      req.user.createdBy,
      dto,
    );
  }
 
 
  @Put('lwf')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanEdit')
  updateLWFConfiguration(
    @Req() req,
    @Body() dto: LWFDefaultConfigurationDto,
  ): Promise<void> {
    return this.admincenterService.updateLWFConfiguration(
      req.user.companyId,
      req.user.createdBy,
      dto,
    );
  }
 
  @Put('pt')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanEdit')
  updatePTConfiguration(
    @Req() req,
    @Body() dto: PTConfigurationDto,
  ): Promise<void> {
    return this.admincenterService.updatePTConfiguration(
      req.user.companyId,
      req.user.createdBy,
      dto,
    );
  }
     
 
  @Put('establishment')
  @Permission(ADMIN_DASHBOARD_MENU_ID, 'CanEdit')
  updateEstablishmentConfiguration(
    @Req() req,
    @Body() dto: EstablishmentConfigurationDto,
  ): Promise<void> {
    return this.admincenterService.updateEstablishmentConfiguration(
      req.user.companyId,
      req.user.createdBy,
      dto,
    );
  }
 

  @Post('documents/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/company-documents',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.admincenterService.uploadDocument(file);
  }
}
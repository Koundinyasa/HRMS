import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { diskStorage } from 'multer';

import { AdmincentercompanyService } from './admincenter.company.service';

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
import { UpdatePTSlabDto } from './dto/update-pt-slab.dto';
import {
  LWFConfigurationDto,
  LWFDefaultConfigurationDto,
} from './dto/lwf-configuration.dto';
import { EstablishmentConfigurationDto } from './dto/establishment-configuration.dto';

import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMIN_PORTAL_ROLES } from '../../../common/constants/roles';
import { RequiresMenu } from '../../../common/decorators/module-gate.decorator';
import { MenuCode } from '../../../common/constants/menu-codes';

@Roles(...ADMIN_PORTAL_ROLES)
@RequiresMenu(MenuCode.CompanyDetails)
@Controller('admin/configuration')
export class AdmincentercompanyController {
  constructor(
    private readonly admincenterService: AdmincentercompanyService,
  ) {}

  // Company Configuration

  @Get('company')
  getCompanyConfiguration(
    @Req() req,
  ): Promise<CompanyConfigurationDto> {
    return this.admincenterService.getCompanyConfiguration(
      req.user.companyId,
    );
  }

  @Put('company')
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

  // PF Configuration

  @Get('pf')
  getPFConfiguration(
    @Req() req,
  ): Promise<PFConfigurationDto> {
    return this.admincenterService.getPFConfiguration(
      req.user.companyId,
    );
  }

  @Put('pf')
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

  // ESI Configuration

  @Get('esi')
  getESIConfiguration(
    @Req() req,
  ): Promise<ESIConfigurationDto> {
    return this.admincenterService.getESIConfiguration(
      req.user.companyId,
    );
  }

  @Put('esi')
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

  // PT Configuration

  @Get('pt')
  getPTConfiguration(
    @Req() req,
  ): Promise<PTConfigurationResponseDto> {
    return this.admincenterService.getPTConfiguration(
      req.user.companyId,
    );
  } 

  @Put('pt')
updatePTSlab(
  @Req() req,
  @Body() dto: UpdatePTSlabDto,
) {
  return this.admincenterService.updatePTSlab(
    Number(req.user.createdBy),
    dto,
  );
}

  // LWF Configuration

  @Get('lwf')
  getLWFConfiguration(
    @Req() req,
  ): Promise<LWFConfigurationDto> {
    return this.admincenterService.getLWFConfiguration(
      req.user.companyId,
    );
  }

  @Put('lwf')
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

  // Establishment Configuration

  @Get('establishment')
  getEstablishmentConfiguration(
    @Req() req,
  ): Promise<EstablishmentConfigurationDto> {
    return this.admincenterService.getEstablishmentConfiguration(
      req.user.companyId,
    );
  }

  @Put('establishment')
  updateEstablishmentConfiguration(
    @Req() req,
    @Body() dto: EstablishmentConfigurationDto,
  ) {
    return this.admincenterService.updateEstablishmentConfiguration(
      req.user.companyId,
      req.user.createdBy,
      dto,
    );
  }

  // Company Document Upload

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
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.admincenterService.uploadDocument(file);
  }



   
@Get('salary-round-off')
getSalaryRoundOff() {
  return this.admincenterService.getSalaryRoundOff();
}
}
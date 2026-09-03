import {
  Controller,
  Get,
  Param,
  UseGuards,Body, Put
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { UpdateLeavePolicySettingsDto } from './dto/update-leave-policy-settings.dto';

@Controller('admin/ta/leave/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
  ) {}

  // ==========================================
  //Policies
  // ==========================================
  // get policies
  @Get('policies')
  async getLeavePolicies() {
    return this.settingsService.getLeavePolicies();
  }
  
// Policy Leaves

    @Get('policies/:policyId/leaves')
    async getPolicyLeaves(
    @Param('policyId') policyId: number,
    ) {
    return this.settingsService.getPolicyLeaves(
        policyId,
    );
    }
    
// Leave Policy Settings


@Get('policies/:policyId/leaves/:leaveId')
async getLeavePolicySettings(
  @Param('policyId') policyId: number,
  @Param('leaveId') leaveId: number,
) {
  return this.settingsService.getLeavePolicySettings(
    policyId,
    leaveId,
  );
}
// Save Leave Policy Settings

@Put('policies/:policyId/leaves/:leaveId')
async updateLeavePolicySettings(
  @Param('policyId') policyId: number,
  @Param('leaveId') leaveId: number,
  @Body() dto: UpdateLeavePolicySettingsDto,
) {
  return this.settingsService.updateLeavePolicySettings(
    policyId,
    leaveId,
    dto,
  );
}
}
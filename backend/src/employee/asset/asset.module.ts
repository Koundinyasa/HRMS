import { Module } from '@nestjs/common';

import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}

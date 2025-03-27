import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

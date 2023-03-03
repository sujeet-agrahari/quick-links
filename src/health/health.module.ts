import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [Logger, HealthService],
})
export class HealthModule {}

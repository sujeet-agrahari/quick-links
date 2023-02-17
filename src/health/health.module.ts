import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppHealthIndicator } from './app.health';
import { HealthController } from './health.controller';
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [Logger, AppHealthIndicator],
})
export class HealthModule {}

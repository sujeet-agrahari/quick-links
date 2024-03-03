import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.healthService.isHealthy('quick-links'),
    ]);
  }

  @Get('/status')
  async getVersion(): Promise<{ status: string; version: string }> {
    return {
      status: 'OK',
      version: process.env.npm_package_version,
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { Public } from 'src/auth/guards/public.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.healthService.isHealthy('quick-links'),
    ]);
  }

  @Get('status')
  async getVersion(): Promise<{ status: string; version: string }> {
    return {
      status: 'OK',
      version:
        this.configService.get('APP_VERSION') ||
        process.env.npm_package_version,
    };
  }
}

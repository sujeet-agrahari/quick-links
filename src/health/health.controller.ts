import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { AppHealthIndicator } from './app.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private appHealthIndicator: AppHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.appHealthIndicator.isHealthy('quick-links'),
    ]);
  }
}

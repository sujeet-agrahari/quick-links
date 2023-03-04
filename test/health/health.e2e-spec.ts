import { HttpModule } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from 'src/health/health.service';
import * as request from 'supertest';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule, HttpModule],
      providers: [
        {
          provide: HealthService,
          useValue: {
            isHealth: jest.fn(),
          },
        },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('GET /health', () => {
    it('should return all quick-links', async () => {
      return request(app.getHttpServer())
        .get(`/quick-links`)
        .expect(200)
        .expect([]);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});

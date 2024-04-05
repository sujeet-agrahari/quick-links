import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { QuickLinkModule } from '../../src/quick-link/quicklink.module';

describe('QuickLinkController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        QuickLinkModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          database: 'postgres',
          username: 'postgres',
          password: 'password',
          port: 5433,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('GET /quick-links', () => {
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

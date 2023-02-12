import { Test, TestingModule } from '@nestjs/testing';
import { QuickLinkController } from './quicklink.controller';
import { QuickLinkService } from './quicklink.service';

describe('AppController', () => {
  let appController: QuickLinkController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QuickLinkController],
      providers: [QuickLinkService],
    }).compile();

    appController = app.get<QuickLinkController>(QuickLinkController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getLinks()).toBe('Hello World!');
    });
  });
});

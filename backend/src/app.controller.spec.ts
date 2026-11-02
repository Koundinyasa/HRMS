import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseService } from './database/database.service';

describe('AppController', () => {
  let appController: AppController;
  let healthCheck: jest.Mock;

  beforeEach(async () => {
    healthCheck = jest.fn();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: DatabaseService, useValue: { healthCheck } }],
    }).compile();

    appController = app.get(AppController);
  });

  describe('health check', () => {
    it('reports success when the database answers', async () => {
      healthCheck.mockResolvedValue(undefined);

      await expect(appController.checkDb()).resolves.toEqual({
        success: true,
        message: 'Database connected successfully',
      });
    });

    it('returns 503 without internal error text when the database is down', async () => {
      healthCheck.mockRejectedValue(new Error('ECONNREFUSED 10.0.0.5:1433'));

      const call = appController.checkDb();

      await expect(call).rejects.toThrow(ServiceUnavailableException);
      await expect(call).rejects.toThrow('Database connection failed');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard.summary.dto';

const dashboard = {
  welcome: {},
  menus: [],
  summary: {},
} as unknown as DashboardSummaryDto;

describe('AdminDashboardController', () => {
  let controller: AdminDashboardController;
  let getDashboard: jest.Mock;

  beforeEach(async () => {
    getDashboard = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDashboardController],
      providers: [
        {
          provide: AdminDashboardService,
          useValue: { getDashboard },
        },
      ],
    }).compile();

    controller = module.get(AdminDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /admin/dashboard/summary', () => {
    it('passes the logged-in employee id to the service and returns its result', async () => {
      getDashboard.mockResolvedValue(dashboard);

      const result = await controller.getSummary({ employeeId: 'EMP001' });

      expect(result).toBe(dashboard);
      expect(getDashboard).toHaveBeenCalledTimes(1);
      expect(getDashboard).toHaveBeenCalledWith('EMP001');
    });

    it('propagates InternalServerErrorException when the service throws', async () => {
      getDashboard.mockRejectedValue(new InternalServerErrorException('DB error'));

      await expect(
        controller.getSummary({ employeeId: 'EMP001' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});

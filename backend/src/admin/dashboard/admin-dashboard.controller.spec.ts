import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard.summary.dto';

const dbResult: DashboardSummaryDto = {
  totalEmployees: 0,
  totalEmployeesChange: 0,
  confirmationPending: 0,
  confirmationPendingChange: 0,
  joinedEmployee: 0,
  joinedEmployeeChange: 0,
  payrollMonth: 0,
  payrollMonthChange: 0,
  leftEmployee: 0,
  leftEmployeeChange: 0,
  openPositions: 0,
  openPositionsChange: 0,
};



describe('AdminDashboardController', () => {
  let controller: AdminDashboardController;
  let service: AdminDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDashboardController],
      providers: [
        {
          provide: AdminDashboardService,
          useValue: {
            getSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminDashboardController>(AdminDashboardController);
    service = module.get<AdminDashboardService>(AdminDashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /api/admin/dashboard/summary', () => {
    it('should return the summary from the service', async () => {
      jest.spyOn(service, 'getSummary').mockResolvedValue(dbResult);
      const result = await controller.getSummary();
      expect(result).toEqual(dbResult);
      expect(service.getSummary).toHaveBeenCalledTimes(1);
    });

    it('should propagate InternalServerErrorException when service throws', async () => {
      jest
        .spyOn(service, 'getSummary')
        .mockRejectedValue(new InternalServerErrorException('DB error'));

      await expect(controller.getSummary()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('response should have all required DTO fields', async () => {
      jest.spyOn(service, 'getSummary').mockResolvedValue(dbResult);
      const result = await controller.getSummary();

      const requiredKeys: (keyof DashboardSummaryDto)[] = [
        'totalEmployees',
        'totalEmployeesChange',
        'confirmationPending',
        'confirmationPendingChange',
        'joinedEmployee',
        'joinedEmployeeChange',
        'payrollMonth',
        'payrollMonthChange',
        'leftEmployee',
        'leftEmployeeChange',
        'openPositions',
        'openPositionsChange',
      ];

      requiredKeys.forEach((key) => {
        expect(result).toHaveProperty(key);
      });
    });
  });
});
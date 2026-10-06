import { Test, TestingModule } from '@nestjs/testing';
import { AdmincenterClassificationService } from './admincenter.classification.service';
import { DatabaseService } from '../../../database/database.service';

describe('AdmincenterClassificationService', () => {
  let service: AdmincenterClassificationService;
  const execute = jest.fn();
  const request = {
    input: jest.fn().mockReturnThis(),
    execute,
  };
  const databaseService = {
    connect: jest.fn().mockResolvedValue({
      request: jest.fn(() => request),
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdmincenterClassificationService,
        { provide: DatabaseService, useValue: databaseService },
      ],
    }).compile();

    service = module.get<AdmincenterClassificationService>(
      AdmincenterClassificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('treats company-master branches without an active flag as active', async () => {
    execute.mockResolvedValue({
      recordsets: [
        [],
        [],
        [],
        [],
        [],
        [
          { BranchID: 1, BranchName: 'Head Office' },
          { BranchID: 2, BranchName: 'Closed Office', IsActive: false },
          { BranchID: 3, BranchName: 'Active Office', IsActive: true },
        ],
      ],
    });

    await expect(service.getBranches(1)).resolves.toEqual({
      Branches: [
        {
          Id: 1,
          BranchName: 'Head Office',
          Address: '',
          State: '',
          IsActive: 1,
        },
        {
          Id: 2,
          BranchName: 'Closed Office',
          Address: '',
          State: '',
          IsActive: 0,
        },
        {
          Id: 3,
          BranchName: 'Active Office',
          Address: '',
          State: '',
          IsActive: 1,
        },
      ],
    });
  });
});

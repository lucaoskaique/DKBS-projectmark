import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DrizzleService } from '@src/database/drizzle.service';

describe('UsersService', () => {
  let service: UsersService;
  let drizzleService: jest.Mocked<DrizzleService>;

  beforeEach(async () => {
    const mockDrizzleService = {
      db: {
        insert: jest.fn(),
        select: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DrizzleService, useValue: mockDrizzleService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    drizzleService = module.get(DrizzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

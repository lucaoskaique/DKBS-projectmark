/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { DrizzleService } from '../database/drizzle.service';

describe('TopicsController', () => {
  let controller: TopicsController;
  let topicsService: jest.Mocked<TopicsService>;

  beforeEach(async () => {
    const mockTopicsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockDrizzleService = {
      db: {
        insert: jest.fn(),
        select: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        { provide: TopicsService, useValue: mockTopicsService },
        { provide: DrizzleService, useValue: mockDrizzleService },
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
    topicsService = module.get(TopicsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

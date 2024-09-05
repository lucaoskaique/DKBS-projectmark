import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { DrizzleService } from '../database/drizzle.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { NotFoundException } from '@nestjs/common';

describe('TopicsService', () => {
  let service: TopicsService;
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
        TopicsService,
        { provide: DrizzleService, useValue: mockDrizzleService },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    drizzleService = module.get(DrizzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new topic', async () => {
      const createTopicDto: CreateTopicDto = {
        name: 'Test Topic',
        content: 'Test Content',
      };
      const createdTopic = { id: 1, ...createTopicDto, parentTopicId: null };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([createdTopic]),
      };
      (drizzleService.db.insert as jest.Mock).mockReturnValue(
        mockInsert as any,
      );

      const result = await service.create(createTopicDto);
      expect(result).toEqual(createdTopic);
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const topics = [
        { id: 1, name: 'Topic 1' },
        { id: 2, name: 'Topic 2' },
      ];

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(topics),
      };

      (drizzleService.db.select as jest.Mock).mockReturnValue(
        mockSelect as any,
      );
      const result = await service.findAll();
      expect(result).toEqual(topics);
    });
  });

  describe('findOne', () => {
    it('should return a single topic', async () => {
      const topic = { id: 1, name: 'Topic 1' };

      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([topic]),
      };
      (drizzleService.db.select as jest.Mock).mockReturnValue(
        mockSelect as any,
      );
      const result = await service.findOne(1);
      expect(result).toEqual(topic);
    });

    it('should throw NotFoundException if topic is not found', async () => {
      const mockSelect = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([]),
      };
      (drizzleService.db.select as jest.Mock).mockReturnValue(
        mockSelect as any,
      );
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const updateTopicDto: UpdateTopicDto = {
        name: 'Updated Topic',
        content: 'Updated Content',
        parentTopicId: 2,
      };
      const updatedTopic = { id: 1, ...updateTopicDto };

      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([updatedTopic]),
      };
      (drizzleService.db.update as jest.Mock).mockReturnValue(
        mockUpdate as any,
      );

      const result = await service.update(1, updateTopicDto);
      expect(result).toEqual(updatedTopic);
    });

    it('should throw NotFoundException if topic is not found', async () => {
      const mockUpdate = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };
      (drizzleService.db.update as jest.Mock).mockReturnValue(
        mockUpdate as any,
      );

      await expect(
        service.update(1, { name: 'Test', content: 'Test', parentTopicId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a topic', async () => {
      const deletedTopic = { id: 1, name: 'Deleted Topic' };

      const mockDelete = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([deletedTopic]),
      };
      (drizzleService.db.delete as jest.Mock).mockReturnValue(
        mockDelete as any,
      );

      const result = await service.remove(1);
      expect(result).toEqual(deletedTopic);
    });

    it('should throw NotFoundException if topic is not found', async () => {
      const mockDelete = {
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]),
      };
      (drizzleService.db.delete as jest.Mock).mockReturnValue(
        mockDelete as any,
      );

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});

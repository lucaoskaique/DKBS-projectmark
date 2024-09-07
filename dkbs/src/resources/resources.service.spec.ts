import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { DrizzleService } from '@src/database/drizzle.service';
import { Type } from '@src/database/database-schema';

describe('ResourcesService', () => {
  let service: ResourcesService;
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
        ResourcesService,
        { provide: DrizzleService, useValue: mockDrizzleService },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    drizzleService = module.get(DrizzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new resource', async () => {
      const createResourceDto = {
        name: 'Test Resource',
        content: 'Test Content',
        topicId: 1,
        url: 'http://example.com/resource',
        type: Type.Article,
      };

      const createdResource = { id: 1, ...createResourceDto };

      const mockInsert = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([createdResource]),
      };
      (drizzleService.db.insert as jest.Mock).mockReturnValue(
        mockInsert as any,
      );

      const result = await service.create(createResourceDto);
      expect(result).toEqual(createdResource);
    });
  });

  describe('findAll', () => {
    it('should return an array of resources', async () => {
      const resources = [
        {
          id: 1,
          name: 'Test Resource',
          content: 'Test Content',
          topicId: 1,
          url: 'http://example.com/resource',
          type: Type.Article,
        },
      ];

      (drizzleService.db.select as jest.Mock).mockResolvedValue(resources);

      const result = await service.findAll();
      expect(result).toEqual(resources);
    });
  });

  describe('findOne', () => {
    it('should return a single resource', async () => {
      const resource = {
        id: 1,
        name: 'Test Resource',
        content: 'Test Content',
        topicId: 1,
        url: 'http://example.com/resource',
        type: Type.Article,
      };

      (drizzleService.db.select as jest.Mock).mockResolvedValue([resource]);

      const result = await service.findOne(1);
      expect(result).toEqual(resource);
    });
  });

  describe('update', () => {
    it('should update a resource', async () => {
      const updateResourceDto = {
        name: 'Updated Resource',
        content: 'Updated Content',
        topicId: 2,
        url: 'http://example.com/updated-resource',
        type: Type.Video,
      };

      const resource = {
        id: 1,
        name: 'Test Resource',
        content: 'Test Content',
        topicId: 1,
        url: 'http://example.com/resource',
        type: Type.Article,
      };

      (drizzleService.db.select as jest.Mock).mockResolvedValue([resource]);

      const mockUpdate = {
        where: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([resource]),
      };
      (drizzleService.db.update as jest.Mock).mockReturnValue(
        mockUpdate as any,
      );

      const result = await service.update(1, updateResourceDto);
      expect(result).toEqual(resource);
    });
  });

  describe('remove', () => {
    it('should remove a resource', async () => {
      const resource = {
        id: 1,
        name: 'Test Resource',
        content: 'Test Content',
        topicId: 1,
        url: 'http://example.com/resource',
        type: Type.Article,
      };

      (drizzleService.db.select as jest.Mock).mockResolvedValue([resource]);

      const mockDelete = {
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([resource]),
      };
      (drizzleService.db.delete as jest.Mock).mockReturnValue(
        mockDelete as any,
      );

      const result = await service.remove(1);
      expect(result).toEqual(resource);
    });
  });
});

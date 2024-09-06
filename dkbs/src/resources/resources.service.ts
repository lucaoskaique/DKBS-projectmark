import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { DrizzleService } from '../database/drizzle.service';
import { resources } from '../database/database-schema';

@Injectable()
export class ResourcesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createResourceDto: CreateResourceDto) {
    const createdResource = await this.drizzleService.db
      .insert(resources)
      .values({
        topicId: createResourceDto.topicId,
        url: createResourceDto.url,
        description: createResourceDto.description,
        type: createResourceDto.type,
      })
      .returning();

    return createdResource[0];
  }

  findAll() {
    return `This action returns all resources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }

  update(id: number, updateResourceDto: UpdateResourceDto) {
    return `This action updates a #${id} resource`;
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}

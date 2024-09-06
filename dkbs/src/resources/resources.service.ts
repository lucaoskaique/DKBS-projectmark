import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { DrizzleService } from '../database/drizzle.service';
import { resources } from '../database/database-schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ResourcesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createResourceDto: CreateResourceDto) {
    const createdResource = await this.drizzleService.db
      .insert(resources)
      .values({
        topicId: createResourceDto.topicId,
        url: createResourceDto.url,
        type: createResourceDto.type,
        description: createResourceDto.description || null,
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

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    const updatedResource = await this.drizzleService.db
      .update(resources)
      .set({
        url: updateResourceDto.url,
        description: updateResourceDto.description,
        type: updateResourceDto.type,
      })
      .where(eq(resources.id, id))
      .returning();

    return updatedResource[0];
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}

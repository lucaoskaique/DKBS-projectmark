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

  async findAll() {
    return await this.drizzleService.db.select().from(resources).execute();
  }

  async findOne(id: number) {
    const resource = await this.drizzleService.db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .execute();

    return resource[0];
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

  async remove(id: number) {
    await this.drizzleService.db
      .delete(resources)
      .where(eq(resources.id, id))
      .execute();
  }
}

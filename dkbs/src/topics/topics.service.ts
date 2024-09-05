import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { DrizzleService } from '../database/drizzle.service';
import { topics } from '../database/database-schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TopicsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create({ name, content, parentTopicId }: CreateTopicDto) {
    const createdTopic = await this.drizzleService.db
      .insert(topics)
      .values({
        name,
        content,
        parentTopicId: parentTopicId || null,
      })
      .returning();

    return createdTopic[0];
  }

  async findAll() {
    return await this.drizzleService.db.select().from(topics).execute();
  }

  async findOne(id: number) {
    const topic = await this.drizzleService.db
      .select()
      .from(topics)
      .where(eq(topics.id, id))
      .execute();

    if (!topic[0]) {
      throw new NotFoundException();
    }

    return topic[0];
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    const updatedTopic = await this.drizzleService.db
      .update(topics)
      .set({
        ...updateTopicDto,
      })
      .where(eq(topics.id, id))
      .returning();

    if (!updatedTopic[0]) {
      throw new NotFoundException();
    }

    return updatedTopic[0];
  }

  async remove(id: number) {
    const deletedTopic = await this.drizzleService.db
      .delete(topics)
      .where(eq(topics.id, id))
      .returning();

    if (!deletedTopic[0]) {
      throw new NotFoundException();
    }

    return deletedTopic[0];
  }
}

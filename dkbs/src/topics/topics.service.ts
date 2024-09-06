import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { DrizzleService } from '../database/drizzle.service';
import { topics } from '../database/database-schema';
import { eq, and, desc, or } from 'drizzle-orm';

interface TopicNode {
  id: number;
  name: string;
  parentTopicId: number | null;
  children: TopicNode[];
}

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
        version: 1,
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
      throw new NotFoundException('No topics found');
    }

    if (topic[0].latestVersion !== topic[0].version) {
      return this.findLatestVersion(id);
    }

    return topic[0];
  }

  async findLatestVersion(id: number) {
    const latestTopic = await this.drizzleService.db
      .select()
      .from(topics)
      .where(
        and(
          eq(topics.parentTopicId, id),
          eq(topics.version, topics.latestVersion),
        ),
      )
      .execute();

    if (!latestTopic[0]) {
      throw new NotFoundException(
        `Latest version of topic with id ${id} not found`,
      );
    }

    return latestTopic[0];
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    const currentTopic = await this.findOne(id);

    const newVersion = currentTopic.version + 1;

    const updatedTopic = await this.drizzleService.db
      .insert(topics)
      .values({
        name: updateTopicDto.name || currentTopic.name,
        content: updateTopicDto.content || currentTopic.content,
        parentTopicId: currentTopic.id,
        version: newVersion,
        latestVersion: newVersion,
      })
      .returning();

    await this.drizzleService.db
      .update(topics)
      .set({ latestVersion: newVersion })
      .where(eq(topics.id, id));

    return updatedTopic[0];
  }

  async remove(id: number) {
    const deletedTopic = await this.drizzleService.db
      .update(topics)
      .set({ isDeleted: true })
      .where(and(eq(topics.id, id), eq(topics.version, topics.latestVersion)))
      .returning();

    if (!deletedTopic[0]) {
      throw new NotFoundException();
    }

    return deletedTopic[0];
  }

  async getTopicHistory(id: number) {
    return await this.drizzleService.db
      .select()
      .from(topics)
      .where(eq(topics.id, id))
      .orderBy(desc(topics.version))
      .execute();
  }

  async getChildTopics(parentId: number) {
    return await this.drizzleService.db
      .select()
      .from(topics)
      .where(
        and(
          eq(topics.parentTopicId, parentId),
          eq(topics.version, topics.latestVersion),
          eq(topics.isDeleted, false),
        ),
      )
      .execute();
  }

  async findSpecificVersion(id: number, version: number) {
    const topic = await this.drizzleService.db
      .select()
      .from(topics)
      .where(
        and(
          or(eq(topics.id, id), eq(topics.parentTopicId, id)),
          eq(topics.version, version),
        ),
      )
      .execute();

    if (!topic[0]) {
      throw new NotFoundException(
        `Topic with id ${id} and version ${version} not found`,
      );
    }

    return topic[0];
  }

  async getTopicVersions(id: number) {
    const allVersions = await this.drizzleService.db
      .select({
        id: topics.id,
        version: topics.version,
        updatedAt: topics.updatedAt,
        parentTopicId: topics.parentTopicId,
        name: topics.name,
      })
      .from(topics)
      .where(or(eq(topics.id, id), eq(topics.parentTopicId, id)))
      .orderBy(desc(topics.version))
      .execute();

    return allVersions;
  }

  async findShortestPath(
    startTopicId: number,
    endTopicId: number,
  ): Promise<number[]> {
    const visited: Set<number> = new Set();
    const queue: { topicId: number; path: number[] }[] = [
      { topicId: startTopicId, path: [startTopicId] },
    ];

    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) continue;

      const { topicId, path } = item;

      if (topicId === endTopicId) {
        return path;
      }

      if (visited.has(topicId)) {
        continue;
      }

      visited.add(topicId);

      const childTopics = await this.getChildTopics(topicId);

      for (const childTopic of childTopics) {
        if (!visited.has(childTopic.id)) {
          queue.push({
            topicId: childTopic.id,
            path: [...path, childTopic.id],
          });
        }
      }
    }

    throw new NotFoundException('No path found');
  }

  async getTopicTree(topicId: number): Promise<any> {
    const topic = await this.findOne(topicId);
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    const buildTree = async (currentTopicId: number): Promise<any> => {
      const currentTopic = await this.findOne(currentTopicId);
      const childTopics = await this.getChildTopics(currentTopicId);

      const node: TopicNode = {
        id: currentTopic.id,
        name: currentTopic.name,
        parentTopicId: currentTopic.parentTopicId,
        children: [],
      };

      for (const childTopic of childTopics) {
        const childNode = await buildTree(childTopic.id);
        node.children.push(childNode);
      }

      return node;
    };

    return buildTree(topicId);
  }
}

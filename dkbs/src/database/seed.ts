import { NewTopic, topics } from './database-schema';
import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const generateTopicRows = (
  count: number,
  parentId: number | null = null,
): NewTopic[] => {
  const rows: NewTopic[] = [];

  for (let i = 0; i < count; i++) {
    rows.push({
      name: faker.lorem.words(3),
      content: faker.lorem.paragraph(),
      parentTopicId: parentId,
      version: 1,
      latestVersion: 1,
    });
  }

  return rows;
};

export async function seed() {
  console.log('Seeding...');
  const client = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: false,
  });

  const db = drizzle(client);

  await db.delete(topics);

  const rootTopics = ['Programming', 'Mathematics', 'Science', 'History'].map(
    (name) => ({
      name,
      content: faker.lorem.paragraph(),
      parentTopicId: null,
      version: 1,
      latestVersion: 1,
    }),
  );

  const createdRootTopics = (await db
    .insert(topics)
    .values(rootTopics)
    .returning()) as NewTopic[];

  // Create child topics for each root topic
  for (const rootTopic of createdRootTopics) {
    const childTopics = generateTopicRows(
      faker.number.int({ min: 2, max: 5 }),
      rootTopic.id,
    );
    await db.insert(topics).values(childTopics);

    // Create grandchild topics for some child topics
    const [firstChild] = await db
      .select()
      .from(topics)
      .where(eq(topics.parentTopicId, rootTopic.id))
      .limit(1);
    if (firstChild) {
      const grandchildTopics = generateTopicRows(
        faker.number.int({ min: 1, max: 3 }),
        firstChild.id,
      );
      await db.insert(topics).values(grandchildTopics);
    }
  }

  console.timeEnd('DB has been seeded');
}

seed()
  .then(() => {
    console.log('All created!');
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit(0);
  });

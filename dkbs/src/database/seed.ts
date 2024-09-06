import { topics } from './database-schema';
// import { faker } from '@faker-js/faker';
import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const createTestTopicStructure = async (db: any) => {
  const rootTopic = await db
    .insert(topics)
    .values({
      name: 'Root',
      content: 'Root topic',
      parentTopicId: null,
      version: 1,
      latestVersion: 1,
    })
    .returning()
    .then((res) => res[0]);

  const level1Topics = await Promise.all(
    [1, 2, 3].map(async (i) => {
      return db
        .insert(topics)
        .values({
          name: `Level 1 Topic ${i}`,
          content: `Content for Level 1 Topic ${i}`,
          parentTopicId: rootTopic.id,
          version: 1,
          latestVersion: 1,
        })
        .returning()
        .then((res) => res[0]);
    }),
  );

  const level2Topics = await Promise.all(
    level1Topics.flatMap(async (parent, i) => {
      return Promise.all(
        [1, 2].map(async (j) => {
          return db
            .insert(topics)
            .values({
              name: `Level 2 Topic ${i + 1}.${j}`,
              content: `Content for Level 2 Topic ${i + 1}.${j}`,
              parentTopicId: parent.id,
              version: 1,
              latestVersion: 1,
            })
            .returning()
            .then((res) => res[0]);
        }),
      );
    }),
  );

  const level3Topic = await db
    .insert(topics)
    .values({
      name: 'Level 3 Topic',
      content: 'Content for Level 3 Topic',
      parentTopicId: level2Topics[0][0].id,
      version: 1,
      latestVersion: 1,
    })
    .returning()
    .then((res) => res[0]);

  console.log('Test topic structure created');

  return {
    rootTopic,
    level1Topics,
    level2Topics: level2Topics.flat(),
    level3Topic,
  };
};

// const generateTopicRows = (
//   count: number,
//   parentId: number | null = null,
//   parentVersion: number = 1,
// ): NewTopic[] => {
//   const rows: NewTopic[] = [];

//   for (let i = 0; i < count; i++) {
//     const version = parentVersion + 1;
//     rows.push({
//       name: faker.lorem.words(3),
//       content: faker.lorem.paragraph(),
//       parentTopicId: parentId,
//       version: version,
//       latestVersion: version,
//     });
//   }

//   return rows;
// };

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

  const testStructure = await createTestTopicStructure(db);
  console.log('Test structure topic IDs:');
  console.log('Root:', testStructure.rootTopic.id);
  console.log(
    'Level 1:',
    testStructure.level1Topics.map((t) => t.id),
  );
  console.log(
    'Level 2:',
    testStructure.level2Topics.map((t) => t.id),
  );
  console.log('Level 3:', testStructure.level3Topic.id);

  // const rootTopics = ['Programming', 'Mathematics', 'Science', 'History'].map(
  //   (name) => ({
  //     name,
  //     content: faker.lorem.paragraph(),
  //     parentTopicId: null,
  //     version: 1,
  //     latestVersion: 1,
  //   }),
  // );

  // // const createdRootTopics = (await db
  // //   .insert(topics)
  // //   .values(rootTopics)
  // //   .returning()) as NewTopic[];

  // // // Create child topics for each root topic
  // // for (const rootTopic of createdRootTopics) {
  // //   const childTopics = generateTopicRows(
  // //     faker.number.int({ min: 2, max: 5 }),
  // //     rootTopic.id,
  // //     rootTopic.version,
  // //   );
  // //   await db.insert(topics).values(
  // //     childTopics.map((topic) => ({
  // //       name: topic.name,
  // //       content: topic.content,
  // //       parentTopicId: topic.parentTopicId,
  // //       version: topic.version,
  // //       latestVersion: topic.latestVersion,
  // //     })),
  // //   );

  // //   // Create grandchild topics for some child topics
  // //   const [firstChild] = await db
  // //     .select()
  // //     .from(topics)
  // //     .where(eq(topics.parentTopicId, rootTopic.id))
  // //     .limit(1);
  // //   if (firstChild) {
  // //     const grandchildTopics = generateTopicRows(
  // //       faker.number.int({ min: 1, max: 3 }),
  // //       firstChild.id,
  // //       firstChild.version,
  // //     );
  // //     await db.insert(topics).values(
  // //       grandchildTopics.map((topic) => ({
  // //         name: topic.name,
  // //         content: topic.content,
  // //         parentTopicId: topic.parentTopicId,
  // //         version: topic.version,
  // //         latestVersion: topic.latestVersion,
  // //       })),
  // //     );
  // //   }
  // // }

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

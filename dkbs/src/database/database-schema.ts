import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  version: integer('version').notNull().default(1),
  latestVersion: integer('latest_version').notNull().default(1),
  parentTopicId: integer('parent_topic_id').references(() => topics.id),
  isDeleted: boolean('is_deleted').notNull().default(false),
});

const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id')
    .references(() => topics.id)
    .notNull(),
  url: varchar('url').notNull(),
  description: text('description'),
  type: varchar('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  role: varchar('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const databaseSchema = {
  topics,
  resources,
  users,
};

export { topics, resources, users };

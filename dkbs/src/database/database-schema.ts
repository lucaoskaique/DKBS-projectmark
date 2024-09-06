import { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

export enum Type {
  Video = 'VIDEO',
  Article = 'ARTICLE',
  Pdf = 'PDF',
}

export enum Role {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const resourceTypeEnum = pgEnum('type', enumToPgEnum(Type));
export const userRoleEnum = pgEnum('role', enumToPgEnum(Role));

export const topics = pgTable('topics', {
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

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id')
    .references(() => topics.id)
    .notNull(),
  url: varchar('url').notNull(),
  description: text('description'),
  type: resourceTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  role: userRoleEnum('role').default(Role.Viewer),
  createdAt: timestamp('created_at').defaultNow(),
});

export const databaseSchema = {
  topics,
  resources,
  users,
};

const RESOURCE_TYPE = resourceTypeEnum.enumValues;
const USER_ROLE = userRoleEnum.enumValues;
export type ResourceType = (typeof RESOURCE_TYPE)[number];
export type UserRole = (typeof USER_ROLE)[number];

export type Topic = InferSelectModel<typeof topics>;
export type Resource = InferSelectModel<typeof resources>;
export type User = InferSelectModel<typeof users>;

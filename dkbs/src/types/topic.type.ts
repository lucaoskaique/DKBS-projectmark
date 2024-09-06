export type Topic = {
  id: number;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  latestVersion: number;
  parentTopicId: number | null;
  isDeleted: boolean;
};

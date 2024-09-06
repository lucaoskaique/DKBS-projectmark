ALTER TABLE "topics" ADD COLUMN "latest_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;
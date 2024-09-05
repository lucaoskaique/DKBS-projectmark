ALTER TABLE "resources" ALTER COLUMN "topic_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "url" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "resources" ALTER COLUMN "type" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ALTER COLUMN "version" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE varchar;
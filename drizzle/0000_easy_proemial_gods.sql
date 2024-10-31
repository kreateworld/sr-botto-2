DO $$ BEGIN
 CREATE TYPE "vote_type" AS ENUM('up', 'down');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artworks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist_name" text NOT NULL,
	"artist_avatar" text NOT NULL,
	"artist_profile_url" text,
	"image" text NOT NULL,
	"image_url" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"date_added" timestamp DEFAULT now() NOT NULL,
	"curator_address" text NOT NULL,
	"curator_name" text,
	"curator_avatar" text,
	"score" integer DEFAULT 0 NOT NULL
);

-- Rest of the migration remains unchanged
import { pgTable, serial, text, timestamp, integer, boolean, uuid, pgEnum } from 'drizzle-orm/pg-core';

// Create an enum for vote types
export const voteTypeEnum = pgEnum('vote_type', ['up', 'down']);

export const artworks = pgTable('artworks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  artistName: text('artist_name').notNull(),
  artistAvatar: text('artist_avatar').notNull(),
  artistProfileUrl: text('artist_profile_url'),
  image: text('image').notNull(),
  imageUrl: text('image_url').notNull(),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  dateAdded: timestamp('date_added').defaultNow().notNull(),
  curatorAddress: text('curator_address').notNull(),
  curatorName: text('curator_name'),
  curatorAvatar: text('curator_avatar'),
  score: integer('score').default(0).notNull(),
});
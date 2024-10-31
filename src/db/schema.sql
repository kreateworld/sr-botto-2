-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for vote types
CREATE TYPE vote_type AS ENUM ('up', 'down');

-- Artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  artist_avatar TEXT NOT NULL,
  artist_profile_url TEXT,
  image TEXT NOT NULL,
  image_url TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  comments INTEGER NOT NULL DEFAULT 0,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  curator_address TEXT NOT NULL,
  curator_name TEXT,
  curator_avatar TEXT,
  score INTEGER NOT NULL DEFAULT 0
);

-- Rest of the schema remains unchanged
import 'dotenv/config';
import { supabase } from '../lib/supabase';

const testArtworks = [
  {
    title: "Morning Dew in the Forest",
    artist_name: "Sarah Chen",
    artist_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    artist_profile_url: "https://unsplash.com/@sarah_chen",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
    image_url: "https://unsplash.com/photos/morning-dew-forest",
    likes: 245,
    comments: 18,
    curator_address: "0x1234567890123456789012345678901234567890",
    curator_name: "Alex Thompson",
    curator_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50",
    score: 245
  },
  {
    title: "Urban Dreams at Midnight",
    artist_name: "Marcus Rivera",
    artist_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    artist_profile_url: "https://unsplash.com/@marcus_rivera",
    image: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=800",
    image_url: "https://unsplash.com/photos/urban-dreams-midnight",
    likes: 189,
    comments: 24,
    curator_address: "0x2345678901234567890123456789012345678901",
    curator_name: "Emma Wilson",
    curator_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50",
    score: 189
  },
  {
    title: "Serenity in Motion",
    artist_name: "Emma Wilson",
    artist_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    artist_profile_url: "https://unsplash.com/@emma_wilson",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
    image_url: "https://unsplash.com/photos/serenity-motion",
    likes: 324,
    comments: 42,
    curator_address: "0x3456789012345678901234567890123456789012",
    curator_name: "David Kim",
    curator_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    score: 324
  }
];

// Validate environment variables
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Required environment variables are missing');
  process.exit(1);
}

async function seedArtworks() {
  try {
    // Clear existing data
    const { error: deleteError } = await supabase
      .from('artworks')
      .delete()
      .neq('id', 0); // Delete all records

    if (deleteError) {
      throw deleteError;
    }

    // Insert test artworks
    const { data, error } = await supabase
      .from('artworks')
      .insert(testArtworks)
      .select();

    if (error) {
      throw error;
    }

    console.log('Successfully seeded artworks:', data);
  } catch (error) {
    console.error('Error seeding artworks:', error);
    process.exit(1);
  }
}

// Run the seed function
seedArtworks();
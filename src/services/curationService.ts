import { supabase } from '../lib/supabase';
import { cleanUrl } from './superrareService';
import type { SuperRareArtwork } from './superrareService';
import type { CreateArtworkDTO } from './supabase';

export async function submitCuration(
  artwork: SuperRareArtwork,
  curatorAddress: string,
  curatorName?: string,
  curatorAvatar?: string
) {
  console.log('Submitting curation:', { artwork, curatorAddress });

  // Transform SuperRare data to our database format
  const artworkData: CreateArtworkDTO = {
    title: artwork.metadata.title,
    artistName: artwork.creator?.primaryProfile?.sr?.srName || 'Unknown Artist',
    artistAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${artwork.creator?.primaryProfile?.sr?.srName || artwork.universalTokenId}`,
    artistProfileUrl: `https://superrare.com/${artwork.creator?.primaryProfile?.sr?.srName}`,
    image: artwork.metadata.proxyImageMediumUri || artwork.metadata.proxyVideoMediumUri || '',
    imageUrl: cleanUrl(`https://superrare.com/artwork/${artwork.universalTokenId}`),
    curatorAddress,
    curatorName,
    curatorAvatar,
    score: 0,
    likes: 0,
    comments: 0
  };

  console.log('Transformed artwork data:', artworkData);

  // Validate required fields
  if (!artworkData.image) {
    console.error('Missing image URL in artwork data');
    throw new Error('Artwork must have either an image or video');
  }

  // Check if artwork already exists
  const { data: existing, error: checkError } = await supabase
    .from('artworks')
    .select('id')
    .eq('image_url', artworkData.imageUrl)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing artwork:', checkError);
    throw checkError;
  }

  if (existing) {
    console.log('Artwork already exists:', existing);
    throw new Error('This artwork has already been submitted');
  }

  // Insert new artwork
  const { data, error } = await supabase
    .from('artworks')
    .insert([artworkData])
    .select()
    .single();

  if (error) {
    console.error('Failed to submit curation:', error);
    throw new Error(`Failed to submit artwork: ${error.message}`);
  }

  console.log('Successfully submitted artwork:', data);
  return data;
}
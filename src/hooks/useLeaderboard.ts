import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Artwork } from '../types/artwork';

export function useLeaderboard(limit: number = 15) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('artworks')
        .select('*')
        .order('likes', { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;

      const formattedArtworks: Artwork[] = data.map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        artist: {
          name: artwork.artist_name,
          avatar: artwork.artist_avatar,
          profileUrl: artwork.artist_profile_url
        },
        image: artwork.image,
        imageUrl: artwork.image_url,
        likes: artwork.likes,
        comments: artwork.comments,
        dateAdded: artwork.date_added,
        score: artwork.score,
        curator: {
          address: artwork.curator_address,
          name: artwork.curator_name || undefined,
          avatar: artwork.curator_avatar || undefined
        }
      }));

      setArtworks(formattedArtworks);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const refetch = useCallback(() => {
    return fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { artworks, isLoading, error, refetch };
}
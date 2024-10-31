import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Artwork } from '../types/artwork';

export function useArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('artworks')
        .select('*')
        .order('date_added', { ascending: false });

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
        score: artwork.score
      }));

      setArtworks(formattedArtworks);
    } catch (err) {
      console.error('Failed to fetch artworks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch artworks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();

    // Subscribe to all changes in the artworks table
    const channel = supabase
      .channel('artworks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'artworks'
        },
        async (payload) => {
          console.log('Received real-time update:', payload);

          if (payload.eventType === 'INSERT') {
            const newArtwork = payload.new;
            const formattedArtwork: Artwork = {
              id: newArtwork.id,
              title: newArtwork.title,
              artist: {
                name: newArtwork.artist_name,
                avatar: newArtwork.artist_avatar,
                profileUrl: newArtwork.artist_profile_url
              },
              image: newArtwork.image,
              imageUrl: newArtwork.image_url,
              likes: newArtwork.likes,
              comments: newArtwork.comments,
              dateAdded: newArtwork.date_added,
              score: newArtwork.score
            };
            
            setArtworks(current => [formattedArtwork, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setArtworks(current =>
              current.map(artwork =>
                artwork.id === payload.new.id
                  ? {
                      ...artwork,
                      likes: payload.new.likes,
                      comments: payload.new.comments,
                      score: payload.new.score
                    }
                  : artwork
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setArtworks(current =>
              current.filter(artwork => artwork.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { artworks, isLoading, error, refetch: fetchArtworks };
}
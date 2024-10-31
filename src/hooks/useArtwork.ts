import { useState, useEffect } from 'react';
import { artworkService } from '../services/supabase';

export function useArtwork(id: number) {
  const [artwork, setArtwork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtwork() {
      try {
        setLoading(true);
        const data = await artworkService.getArtworkById(id);
        setArtwork(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artwork');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchArtwork();
    }
  }, [id]);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await artworkService.getArtworkById(id);
      setArtwork(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artwork');
    } finally {
      setLoading(false);
    }
  };

  return { artwork, loading, error, refetch };
}
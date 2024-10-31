import { useState } from 'react';
import { fetchSupeRareArtwork, type SuperRareArtwork } from '../services/superrareService';

export function useSuperRare() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtwork = async (url: string): Promise<SuperRareArtwork | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const artwork = await fetchSupeRareArtwork(url);
      return artwork;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch artwork';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchArtwork,
    isLoading,
    error
  };
}
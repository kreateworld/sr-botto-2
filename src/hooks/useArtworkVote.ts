import { useState } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { artworkService } from '../services/supabase';

export function useArtworkVote(artworkId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userAddress = useAddress();

  const vote = async (voteType: 'up' | 'down') => {
    if (!userAddress) {
      throw new Error('User must be connected to vote');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await artworkService.vote({
        artworkId,
        userAddress,
        voteType
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to vote';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserVote = async () => {
    if (!userAddress) return null;

    try {
      return await artworkService.getUserVote(artworkId, userAddress);
    } catch (err) {
      console.error('Failed to get user vote:', err);
      return null;
    }
  };

  return {
    vote,
    getUserVote,
    isLoading,
    error
  };
}
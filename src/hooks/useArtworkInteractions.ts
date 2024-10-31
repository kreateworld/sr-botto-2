import { useState } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { addComment, deleteComment, updateVote } from '../db/queries';

export function useArtworkInteractions(artworkId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userAddress = useAddress();

  const handleAddComment = async (
    text: string,
    position: { x: number, y: number },
    userName?: string,
    userAvatar?: string
  ) => {
    if (!userAddress) {
      throw new Error('User must be connected to add a comment');
    }

    setIsLoading(true);
    setError(null);

    try {
      const comment = await addComment(
        artworkId,
        text,
        userAddress,
        userName || null,
        userAvatar || null,
        position
      );
      return comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add comment';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!userAddress) {
      throw new Error('User must be connected to delete a comment');
    }

    setIsLoading(true);
    setError(null);

    try {
      const deleted = await deleteComment(commentId, userAddress);
      return deleted;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!userAddress) {
      throw new Error('User must be connected to vote');
    }

    setIsLoading(true);
    setError(null);

    try {
      const vote = await updateVote(artworkId, userAddress, voteType);
      return vote;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update vote';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
    vote: handleVote,
    isLoading,
    error,
  };
}
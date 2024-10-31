import { useState } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { artworkService, commentService } from '../services/supabase';
import type { CreateCommentDTO } from '../services/supabase';

export function useArtworkComments(artworkId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userAddress = useAddress();

  const addComment = async (
    text: string,
    position: { x: number; y: number },
    userName?: string,
    userAvatar?: string
  ) => {
    if (!userAddress) {
      throw new Error('User must be connected to add a comment');
    }

    setIsLoading(true);
    setError(null);

    try {
      const commentData: CreateCommentDTO = {
        artworkId,
        text,
        userAddress,
        userName,
        userAvatar,
        positionX: Math.round(position.x),
        positionY: Math.round(position.y)
      };

      const comment = await artworkService.addComment(commentData);
      return comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add comment';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!userAddress) {
      throw new Error('User must be connected to delete a comment');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await artworkService.deleteComment(commentId, userAddress);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getComments = async () => {
    try {
      return await commentService.getArtworkComments(artworkId);
    } catch (err) {
      console.error('Failed to get comments:', err);
      return [];
    }
  };

  return {
    addComment,
    deleteComment,
    getComments,
    isLoading,
    error
  };
}
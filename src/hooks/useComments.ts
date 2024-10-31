import { useState, useCallback } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import * as commentService from '../services/commentService';
import type { Position, Comment, CommentWithPosition } from '../types/comment';

export function useComments(artworkId: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userAddress = useAddress();

  const addComment = useCallback(async (
    text: string,
    position: Position,
    userName?: string,
    userAvatar?: string
  ) => {
    if (!userAddress) {
      throw new Error('Must be connected to add comments');
    }

    setIsLoading(true);
    setError(null);

    try {
      const comment = await commentService.createComment(
        artworkId,
        text,
        userAddress,
        position,
        userName,
        userAvatar
      );
      return comment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add comment';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [artworkId, userAddress]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!userAddress) {
      throw new Error('Must be connected to delete comments');
    }

    setIsLoading(true);
    setError(null);

    try {
      await commentService.deleteComment(commentId, userAddress, artworkId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [artworkId, userAddress]);

  const updatePosition = useCallback(async (
    commentId: string,
    position: Position
  ) => {
    if (!userAddress) {
      throw new Error('Must be connected to move comments');
    }

    setIsLoading(true);
    setError(null);

    try {
      await commentService.updateCommentPosition(commentId, userAddress, position);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update comment position';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  const fetchComments = useCallback(async (): Promise<CommentWithPosition[]> => {
    try {
      const comments = await commentService.getComments(artworkId);
      return comments.map(comment => ({
        ...comment,
        position: {
          x: comment.position_x,
          y: comment.position_y
        }
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch comments';
      setError(message);
      return [];
    }
  }, [artworkId]);

  return {
    addComment,
    deleteComment,
    updatePosition,
    fetchComments,
    isLoading,
    error
  };
}
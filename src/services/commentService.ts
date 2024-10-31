import { supabase } from '../lib/supabase';
import type { Comment, Position } from '../types/comment';

export async function createComment(
  artworkId: number,
  text: string,
  userAddress: string,
  position: Position,
  userName?: string,
  userAvatar?: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      artwork_id: artworkId,
      text,
      user_address: userAddress,
      user_name: userName,
      user_avatar: userAvatar,
      position_x: Math.round(position.x),
      position_y: Math.round(position.y)
    }])
    .select()
    .single();

  if (error) throw error;

  // Increment comment count on artwork
  const { error: updateError } = await supabase.rpc('increment_comments', {
    artwork_id: artworkId
  });

  if (updateError) throw updateError;

  return data;
}

export async function deleteComment(
  commentId: string,
  userAddress: string,
  artworkId: number
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('comments')
    .update({ is_deleted: true })
    .match({ 
      id: commentId, 
      user_address: userAddress,
      artwork_id: artworkId 
    });

  if (deleteError) throw deleteError;

  // Decrement comment count on artwork
  const { error: updateError } = await supabase.rpc('decrement_comments', {
    artwork_id: artworkId
  });

  if (updateError) throw updateError;
}

export async function getComments(artworkId: number): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      text,
      user_address,
      user_name,
      user_avatar,
      position_x,
      position_y,
      created_at,
      is_deleted
    `)
    .eq('artwork_id', artworkId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateCommentPosition(
  commentId: string,
  userAddress: string,
  position: Position
): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .update({
      position_x: Math.round(position.x),
      position_y: Math.round(position.y)
    })
    .match({ 
      id: commentId, 
      user_address: userAddress 
    });

  if (error) throw error;
}
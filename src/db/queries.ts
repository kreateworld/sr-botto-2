import { supabase } from './index';
import type { CreateArtworkDTO } from '../services/supabase';
import type { Database } from '../types/database';

export async function getArtworkWithDetails(id: number) {
  const { data: artwork, error: artworkError } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .single();

  if (artworkError) throw artworkError;
  if (!artwork) return null;

  const [{ data: comments }, { data: votes }] = await Promise.all([
    supabase
      .from('comments')
      .select('*')
      .eq('artwork_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('votes')
      .select('*')
      .eq('artwork_id', id)
  ]);

  return {
    id: artwork.id,
    title: artwork.title,
    artist_name: artwork.artist_name,
    artist_avatar: artwork.artist_avatar,
    artist_profile_url: artwork.artist_profile_url,
    image: artwork.image,
    image_url: artwork.image_url,
    likes: artwork.likes,
    comments: artwork.comments,
    date_added: artwork.date_added,
    curator_address: artwork.curator_address,
    curator_name: artwork.curator_name,
    curator_avatar: artwork.curator_avatar,
    score: artwork.score,
    commentsList: comments || [],
    votesList: votes || []
  };
}

export async function createArtwork(artwork: CreateArtworkDTO) {
  const { data, error } = await supabase
    .from('artworks')
    .insert([{
      title: artwork.title,
      artist_name: artwork.artistName,
      artist_avatar: artwork.artistAvatar,
      artist_profile_url: artwork.artistProfileUrl,
      image: artwork.image,
      image_url: artwork.imageUrl,
      curator_address: artwork.curatorAddress,
      curator_name: artwork.curatorName,
      curator_avatar: artwork.curatorAvatar
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addComment(
  artworkId: number,
  text: string,
  userAddress: string,
  userName: string | null,
  userAvatar: string | null,
  position: { x: number; y: number }
) {
  const { data: comment, error: commentError } = await supabase
    .from('comments')
    .insert([{
      artwork_id: artworkId,
      text,
      user_address: userAddress,
      user_name: userName,
      user_avatar: userAvatar,
      position_x: position.x,
      position_y: position.y,
    }])
    .select()
    .single();

  if (commentError) throw commentError;

  const { error: updateError } = await supabase.rpc('increment_comments', {
    artwork_id: artworkId
  });

  if (updateError) throw updateError;

  return comment;
}

export async function deleteComment(id: string, userAddress: string) {
  const { data: comment, error: commentError } = await supabase
    .from('comments')
    .update({ is_deleted: true })
    .match({ id, user_address: userAddress })
    .select()
    .single();

  if (commentError) throw commentError;

  if (comment && 'artwork_id' in comment) {
    const { error: updateError } = await supabase.rpc('decrement_comments', {
      artwork_id: comment.artwork_id
    });

    if (updateError) throw updateError;
  }

  return comment;
}

export async function updateVote(
  artworkId: number,
  userAddress: string,
  voteType: 'up' | 'down'
) {
  const { data: existingVote, error: fetchError } = await supabase
    .from('votes')
    .select()
    .match({ artwork_id: artworkId, user_address: userAddress })
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  if (existingVote && 'vote_type' in existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote if clicking the same type
      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .match({ id: existingVote.id });

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase.rpc('update_artwork_score', {
        artwork_id: artworkId,
        score_change: voteType === 'up' ? -1 : 1,
        likes_change: voteType === 'up' ? -1 : 0
      });

      if (updateError) throw updateError;

      return null;
    } else {
      // Change vote type
      const { data: updatedVote, error: updateError } = await supabase
        .from('votes')
        .update({ vote_type: voteType })
        .match({ id: existingVote.id })
        .select()
        .single();

      if (updateError) throw updateError;

      const { error: scoreError } = await supabase.rpc('update_artwork_score', {
        artwork_id: artworkId,
        score_change: voteType === 'up' ? 2 : -2,
        likes_change: voteType === 'up' ? 1 : -1
      });

      if (scoreError) throw scoreError;

      return updatedVote;
    }
  } else {
    // Create new vote
    const { data: newVote, error: insertError } = await supabase
      .from('votes')
      .insert([{
        artwork_id: artworkId,
        user_address: userAddress,
        vote_type: voteType,
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    const { error: updateError } = await supabase.rpc('update_artwork_score', {
      artwork_id: artworkId,
      score_change: voteType === 'up' ? 1 : -1,
      likes_change: voteType === 'up' ? 1 : 0
    });

    if (updateError) throw updateError;

    return newVote;
  }
}
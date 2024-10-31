import { supabase } from '../lib/supabase';
import type { Artwork } from '../db';

export interface CreateArtworkDTO {
  title: string;
  artistName: string;
  artistAvatar: string;
  artistProfileUrl?: string;
  image: string;
  imageUrl: string;
  curatorAddress: string;
  curatorName?: string;
  curatorAvatar?: string;
}

export interface CreateCommentDTO {
  artworkId: number;
  text: string;
  userAddress: string;
  userName?: string;
  userAvatar?: string;
  positionX: number;
  positionY: number;
}

export interface VoteDTO {
  artworkId: number;
  userAddress: string;
  voteType: 'up' | 'down';
}

export const artworkService = {
  async getArtworks() {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('score', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getArtworkById(id: number) {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        comments (
          id,
          text,
          user_address,
          user_name,
          user_avatar,
          position_x,
          position_y,
          created_at,
          is_deleted
        ),
        votes (
          user_address,
          vote_type
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createArtwork(artwork: CreateArtworkDTO) {
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
        curator_avatar: artwork.curatorAvatar,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addComment(comment: CreateCommentDTO) {
    const { data: commentData, error: commentError } = await supabase
      .from('comments')
      .insert([{
        artwork_id: comment.artworkId,
        text: comment.text,
        user_address: comment.userAddress,
        user_name: comment.userName,
        user_avatar: comment.userAvatar,
        position_x: comment.positionX,
        position_y: comment.positionY,
      }])
      .select()
      .single();

    if (commentError) throw commentError;

    // Increment the comments count
    const { error: updateError } = await supabase.rpc('increment_comments', {
      artwork_id: comment.artworkId
    });

    if (updateError) throw updateError;

    return commentData;
  },

  async deleteComment(commentId: string, userAddress: string) {
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .match({ id: commentId, user_address: userAddress })
      .select()
      .single();

    if (commentError) throw commentError;

    if (comment) {
      const { error: updateError } = await supabase.rpc('decrement_comments', {
        artwork_id: comment.artwork_id
      });

      if (updateError) throw updateError;
    }

    return comment;
  },

  async vote(voteData: VoteDTO) {
    const { data: existingVote, error: fetchError } = await supabase
      .from('votes')
      .select()
      .match({
        artwork_id: voteData.artworkId,
        user_address: voteData.userAddress
      })
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingVote) {
      if (existingVote.vote_type === voteData.voteType) {
        // Remove vote if clicking the same type
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .match({ id: existingVote.id });

        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase.rpc('update_artwork_score', {
          artwork_id: voteData.artworkId,
          score_change: voteData.voteType === 'up' ? -1 : 1,
          likes_change: voteData.voteType === 'up' ? -1 : 0
        });

        if (updateError) throw updateError;

        return null;
      } else {
        // Change vote type
        const { data: updatedVote, error: updateError } = await supabase
          .from('votes')
          .update({ vote_type: voteData.voteType })
          .match({ id: existingVote.id })
          .select()
          .single();

        if (updateError) throw updateError;

        const { error: scoreError } = await supabase.rpc('update_artwork_score', {
          artwork_id: voteData.artworkId,
          score_change: voteData.voteType === 'up' ? 2 : -2,
          likes_change: voteData.voteType === 'up' ? 1 : -1
        });

        if (scoreError) throw scoreError;

        return updatedVote;
      }
    } else {
      // Create new vote
      const { data: newVote, error: insertError } = await supabase
        .from('votes')
        .insert([{
          artwork_id: voteData.artworkId,
          user_address: voteData.userAddress,
          vote_type: voteData.voteType,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      const { error: updateError } = await supabase.rpc('update_artwork_score', {
        artwork_id: voteData.artworkId,
        score_change: voteData.voteType === 'up' ? 1 : -1,
        likes_change: voteData.voteType === 'up' ? 1 : 0
      });

      if (updateError) throw updateError;

      return newVote;
    }
  },

  async getUserVote(artworkId: number, userAddress: string) {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .match({
        artwork_id: artworkId,
        user_address: userAddress
      })
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.vote_type || null;
  }
};

export const commentService = {
  async getArtworkComments(artworkId: number) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('artwork_id', artworkId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
};
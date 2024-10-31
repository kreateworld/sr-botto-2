import { supabase } from '../lib/supabase';
import type { VoteType } from '../types/artwork';

export async function handleVote(artworkId: number, userAddress: string, voteType: VoteType) {
  try {
    const { data: existingVote, error: fetchError } = await supabase
      .from('votes')
      .select()
      .match({ artwork_id: artworkId, user_address: userAddress })
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same type
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .match({ id: existingVote.id });

        if (deleteError) throw deleteError;

        await updateArtworkScore(artworkId, voteType === 'up' ? -1 : 1);
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

        await updateArtworkScore(artworkId, voteType === 'up' ? 2 : -2);
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

      await updateArtworkScore(artworkId, voteType === 'up' ? 1 : -1);
      return newVote;
    }
  } catch (error) {
    console.error('Vote operation failed:', error);
    throw error;
  }
}

async function updateArtworkScore(artworkId: number, scoreChange: number) {
  const { error } = await supabase.rpc('update_artwork_score', {
    artwork_id: artworkId,
    score_change: scoreChange,
    likes_change: scoreChange > 0 ? 1 : -1
  });

  if (error) throw error;
}
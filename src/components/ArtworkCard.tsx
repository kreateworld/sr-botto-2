import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, ExternalLink, Maximize2 } from 'lucide-react';
import { useAddress } from "@thirdweb-dev/react";
import { handleVote } from '../services/artworkService';
import { supabase } from '../lib/supabase';
import type { Artwork, VoteType } from '../types/artwork';
import ArtworkModal from './ArtworkModal';
import ConnectWalletPrompt from './modals/ConnectWalletPrompt';
import { cn } from '../utils/cn';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  if (!artwork) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Artwork data is missing</p>
      </div>
    );
  }

  const [likes, setLikes] = useState(artwork.likes || 0);
  const [voted, setVoted] = useState<VoteType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const address = useAddress();

  useEffect(() => {
    const fetchUserVote = async () => {
      if (!address) return;

      try {
        const { data, error } = await supabase
          .from('votes')
          .select('vote_type')
          .eq('artwork_id', artwork.id)
          .eq('user_address', address)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching vote:', error);
          return;
        }

        if (data) {
          setVoted(data.vote_type as VoteType);
        }
      } catch (error) {
        console.error('Failed to fetch user vote:', error);
      }
    };

    fetchUserVote();
  }, [address, artwork.id]);

  const handleVoteClick = async (type: VoteType) => {
    if (!address) {
      setShowWalletPrompt(true);
      return;
    }

    if (isVoting) return;

    try {
      setIsVoting(true);
      await handleVote(artwork.id, address, type);
      
      if (voted === type) {
        setVoted(null);
        setLikes(prev => prev - (type === 'up' ? 1 : 0));
      } else {
        setVoted(type);
        setLikes(prev => {
          if (voted) {
            return type === 'up' ? prev + 2 : prev - 2;
          }
          return type === 'up' ? prev + 1 : prev - 1;
        });
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleQuickVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await handleVoteClick('up');
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <div className="p-2">
      <div className={cn(
        "bg-zinc-50 dark:bg-[#171717] rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all",
        voted === 'up' && "m-8 ring-2 ring-green-500/50",
        voted === 'down' && "m-8 ring-2 ring-red-500/50"
      )}>
        <div className="relative aspect-square w-full pt-6 mb-4 flex justify-center group">
          {/* Action buttons - Always visible on mobile, shown on hover for desktop */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 md:transition-opacity md:duration-200 md:opacity-0 md:group-hover:opacity-100">
            <a 
              href={artwork.imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-zinc-50 dark:bg-[#171717]/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm p-2 rounded-full hover:bg-white/80 dark:hover:bg-black/80 text-gray-600 dark:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-zinc-50 dark:bg-[#171717]/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm p-2 rounded-full hover:bg-white/80 dark:hover:bg-black/80 text-gray-600 dark:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          
          <img
            src={artwork.image}
            alt={artwork.title}
            onClick={handleQuickVote}
            className="h-full w-full cursor-upvote object-contain sm:max-h-[90vh] sm:max-w-[92%]"
          />
        </div>
        
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
              {artwork.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVoteClick('up')}
                disabled={isVoting}
                className={`p-2 rounded-full transition-colors ${
                  voted === 'up' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 text-gray-500 dark:text-gray-400'
                }`}
              >
                <ThumbsUp className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => handleVoteClick('down')}
                disabled={isVoting}
                className={`p-2 rounded-full transition-colors ${
                  voted === 'down' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : 'hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-gray-500 dark:text-gray-400'
                }`}
              >
                <ThumbsDown className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-2 border-t border-zinc-200 dark:border-zinc-800">
            <a 
              href={artwork.artist.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm capitalize text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {artwork.artist.name}
            </a>
            
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm font-medium">{likes}</span>
              </div>
              <button
                onClick={handleCommentClick}
                className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{artwork.comments}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ArtworkModal
          artwork={{
            ...artwork,
            likes,
            score: artwork.score
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      <ConnectWalletPrompt 
        isOpen={showWalletPrompt} 
        onClose={() => setShowWalletPrompt(false)} 
      />
    </div>
  );
};

export default ArtworkCard;
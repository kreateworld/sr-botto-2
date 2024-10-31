import React, { useState, useEffect } from 'react';
import { X, ThumbsUp, MessageCircle, TrendingUp, Eye, EyeOff, Link2, MessageSquareOff } from 'lucide-react';
import { useWalletInfo } from '../hooks/useWalletInfo';
import { useComments } from '../hooks/useComments';
import type { CommentWithPosition } from '../types/comment';
import CommentForm from './CommentForm';
import CommentBubble from './CommentBubble';
import CommentsList from './CommentsList';
import XShareButton from './XShareButton';
import ConnectWalletPrompt from './modals/ConnectWalletPrompt';
import { cn } from '../utils/cn';

const generateRandomPosition = () => ({
  x: Math.floor(Math.random() * 80) + 10,
  y: Math.floor(Math.random() * 80) + 10
});

const RareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 30 20" fill="none" className="text-white">
    <path d="M5.30334 5.12947L10.1145 0H4.81116L0 5.12947L9.5356 16.3575L12.1613 13.2053L5.30334 5.12947Z" fill="currentColor"/>
    <path d="M15.7206 0H6.28906V1.5718H15.7206V0Z" fill="currentColor"/>
    <path d="M9.53451 16.3553L10.9395 18.0117L21.6784 5.12514L16.9561 0H14.2676L18.94 5.06877L9.53451 16.3553Z" fill="currentColor"/>
  </svg>
);

interface ArtworkModalProps {
  artwork: {
    id: number;
    title: string;
    artist: {
      name: string;
      profileUrl?: string;
    };
    image: string;
    imageUrl: string;
    likes?: number;
    comments?: number;
    score?: number;
  };
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const { isConnected, displayName, avatarUrl } = useWalletInfo();
  const { addComment, deleteComment, updatePosition, fetchComments, isLoading } = useComments(artwork.id);
  const [comments, setComments] = useState<CommentWithPosition[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [commentPosition, setCommentPosition] = useState({ x: 50, y: 50 });
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showBubbles, setShowBubbles] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showQuickCommentForm, setShowQuickCommentForm] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const imageContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadComments();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = '';
    };
  }, []);

  const loadComments = async () => {
    const fetchedComments = await fetchComments();
    setComments(fetchedComments);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (isDragging || !showBubbles || !showComments) return;
    
    if (!isConnected) {
      setShowConnectPrompt(true);
      return;
    }

    if (!isMobile) {
      const rect = imageContainerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setCommentPosition({ x, y });
    }

    setShowCommentForm(true);
    setSelectedComment(null);
  };

  const handleCommentSubmit = async (text: string, isQuickComment: boolean = false) => {
    try {
      const position = isQuickComment ? generateRandomPosition() : commentPosition;
      await addComment(text, position, displayName, avatarUrl);
      await loadComments();
      setShowCommentForm(false);
      setShowQuickCommentForm(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleQuickCommentSubmit = async (text: string) => {
    await handleCommentSubmit(text, true);
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await loadComments();
      setSelectedComment(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleBubbleDragEnd = async (commentId: string, newPosition: { x: number; y: number }) => {
    try {
      await updatePosition(commentId, newPosition);
      await loadComments();
    } catch (error) {
      console.error('Failed to update comment position:', error);
    }
    setIsDragging(false);
    setShowCommentForm(false);
  };

  const handleCommentSelect = (commentId: string) => {
    if (isDragging || showCommentForm) return;
    setSelectedComment(selectedComment === commentId ? null : commentId);
  };

  const handleFrontrun = () => {
    window.open(`${artwork.imageUrl}?frontrun=true`, '_blank');
  };

  const handleAddCommentClick = () => {
    if (!isConnected) {
      setShowConnectPrompt(true);
      return;
    }
    setShowQuickCommentForm(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(artwork.imageUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:flex md:items-center md:justify-center">
        <div className="h-full w-full md:w-[95vw] md:h-[90vh] md:max-w-7xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm md:rounded-xl flex flex-col">
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {artwork.title}
                </h2>
                <a
                  href={artwork.artist.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  by {artwork.artist.name}
                </a>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 p-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{artwork.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>{artwork.comments || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{artwork.score || 0}</span>
                </div>
              </div>

              {!isMobile && (
                <button
                  onClick={() => setShowBubbles(!showBubbles)}
                  className="flex items-center gap-1.5 px-2 py-1 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                >
                  {showBubbles ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Artwork Container */}
            <div className="relative flex-shrink-0 h-[40vh] md:h-auto md:flex-1" ref={imageContainerRef}>
              <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="h-full w-full object-contain sm:max-h-[90vh] sm:max-w-[92%]"
                />
                
                {!isMobile && (
                  <div 
                    className="absolute inset-0"
                    style={{ cursor: showCommentForm ? 'default' : undefined }}
                    onClick={handleImageClick}
                  >
                    <div className={`relative w-full h-full pointer-events-auto ${!showCommentForm && !isDragging && showBubbles && showComments ? 'cursor-comment' : ''}`}>
                      {showBubbles && showComments && comments.map((comment) => (
                        <CommentBubble
                          key={comment.id}
                          comment={comment}
                          isSelected={selectedComment === comment.id}
                          onSelect={handleCommentSelect}
                          onDragStart={() => setIsDragging(true)}
                          onDragEnd={handleBubbleDragEnd}
                          onDelete={handleCommentDelete}
                          containerRef={imageContainerRef}
                        />
                      ))}

                      {showCommentForm && showBubbles && showComments && (
                        <CommentForm
                          position={commentPosition}
                          onSubmit={handleCommentSubmit}
                          onCancel={() => setShowCommentForm(false)}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Toggle Comments Button (Desktop Only) */}
                {!isMobile && (
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="absolute bottom-4 right-4 px-3 py-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg flex items-center gap-2 text-sm text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {showComments ? (
                      <>
                        <MessageSquareOff className="w-4 h-4 text-red-400" />
                        
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Header & Comments Section */}
            <div className="w-full md:w-1/3 flex flex-col min-h-0 md:border-l border-zinc-200 dark:border-zinc-800">
              {/* Desktop Header */}
              <div className="hidden md:block p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {artwork.title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <a
                    href={artwork.artist.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    by {artwork.artist.name}
                  </a>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {artwork.likes || 0} likes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {artwork.comments || 0} comments
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {artwork.score || 0} score
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 md:px-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFrontrun}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:shadow-sm flex items-center justify-center gap-2"
                  >
                    <RareIcon />
                    Frontrun with $RARE
                  </button>

                  <div className="flex items-center">
                    <XShareButton url={artwork.imageUrl} />
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors relative"
                      title="Copy link"
                    >
                      <Link2 className="w-5 h-5" />
                      {showCopiedToast && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded whitespace-nowrap">
                          Copied!
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto">
                <CommentsList
                  comments={comments}
                  selectedComment={selectedComment}
                  onCommentSelect={handleCommentSelect}
                  isLoading={isLoading}
                  onAddComment={handleAddCommentClick}
                  isMobile={isMobile}
                />
              </div>

              {/* Add Comment Section */}
              <div className="sticky bottom-0 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800">
                {showQuickCommentForm ? (
                  <CommentForm
                    isMobile={true}
                    onSubmit={handleQuickCommentSubmit}
                    onCancel={() => setShowQuickCommentForm(false)}
                  />
                ) : (
                  <button
                    onClick={handleAddCommentClick}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-[#212121] hover:bg-zinc-100 hover:dark:bg-zinc-950 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:border-zinc-800 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Add Comment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConnectWalletPrompt 
        isOpen={showConnectPrompt} 
        onClose={() => setShowConnectPrompt(false)} 
      />
    </>
  );
};

export default ArtworkModal;
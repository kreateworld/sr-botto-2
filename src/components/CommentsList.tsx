import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';
import { useWalletInfo } from '../hooks/useWalletInfo';
import type { CommentWithPosition } from '../types/comment';
import { cn } from '../utils/cn';

interface CommentsListProps {
  comments: CommentWithPosition[];
  selectedComment: string | null;
  onCommentSelect: (id: string) => void;
  onAddComment: () => void;
  isLoading?: boolean;
  isMobile?: boolean;
}

const COMMENTS_PER_PAGE = 5;

const CommentsList = ({ 
  comments, 
  selectedComment, 
  onCommentSelect, 
  onAddComment,
  isLoading,
  isMobile 
}: CommentsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const totalPages = Math.ceil(sortedComments.length / COMMENTS_PER_PAGE);
  const { displayName } = useWalletInfo();
  
  const paginatedComments = sortedComments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                <div>
                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded mt-1" />
                </div>
              </div>
              <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          {sortedComments.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>No comments yet.</p>
              <p className="text-sm mt-2">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedComments.map((comment) => (
                <button
                  key={comment.id}
                  onClick={() => onCommentSelect(comment.id)}
                  className={cn(
                    "w-full text-left p-3 md:p-4 rounded-lg transition-all",
                    selectedComment === comment.id
                      ? "bg-indigo-50 dark:bg-zinc-900 ring-2 ring-indigo-500 dark:ring-indigo-400"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900/90 active:bg-zinc-100 dark:active:bg-zinc-800"
                  )}
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={comment.user_avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.user_address}`}
                        alt={comment.user_name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate">
                        {comment.user_name || displayName}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base line-clamp-3">
                    {comment.text}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="sticky bottom-0 p-3 md:p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
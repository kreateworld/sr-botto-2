import React, { useRef, useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWalletInfo } from '../hooks/useWalletInfo';
import type { CommentWithPosition } from '../types/comment';

interface CommentBubbleProps {
  comment: CommentWithPosition;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: () => void;
  onDragEnd: (commentId: string, position: { x: number; y: number }) => void;
  onDelete: (commentId: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const CommentBubble = ({
  comment,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
  onDelete,
  containerRef,
}: CommentBubbleProps) => {
  const { displayName, address } = useWalletInfo();
  const isOwner = comment.user_address === address;
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(() => calculatePosition());

  function calculatePosition() {
    if (!containerRef.current) return { x: 0, y: 0 };
    const container = containerRef.current;
    return {
      x: (comment.position.x / 100) * container.clientWidth,
      y: (comment.position.y / 100) * container.clientHeight
    };
  }

  // Update position when container size changes
  React.useEffect(() => {
    const updatePosition = () => {
      if (!isDragging) {
        setPosition(calculatePosition());
      }
    };

    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isDragging, comment.position]);

  const handleDragStart = (e: DraggableEvent) => {
    if (!isOwner) return;
    e.stopPropagation();
    setIsDragging(true);
    onDragStart();
    onSelect(comment.id);
  };

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    if (!containerRef.current) return;
    setPosition({ x: data.x, y: data.y });
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    if (!containerRef.current || !isOwner) return;
    e.stopPropagation();
    setIsDragging(false);

    const container = containerRef.current;
    const x = (data.x / container.clientWidth) * 100;
    const y = (data.y / container.clientHeight) * 100;

    // Ensure the bubble stays within bounds
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    onDragEnd(comment.id, { x: boundedX, y: boundedY });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(comment.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(comment.id);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={!isOwner}
      position={position}
      bounds="parent"
      cancel=".comment-content"
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div 
        ref={nodeRef}
        className={`absolute z-30 select-none ${isSelected ? 'z-40' : ''}`}
        style={{ cursor: isOwner ? 'grab' : 'pointer' }}
      >
        <div className="relative">
          <button
            onClick={handleClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isOwner 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-black/50 backdrop-blur-sm text-white hover:bg-indigo-600'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>

        {isSelected && (
          <div className="comment-content absolute left-full ml-2 top-0 w-64 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg shadow-lg p-4 transition-all duration-200 ease-in-out">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={comment.user_avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.user_address}`}
                alt={comment.user_name || comment.user_address}
                className="w-6 h-6 rounded-full ring-2 ring-white/10 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-gray-900 dark:text-white truncate">
                  {comment.user_name || displayName}
                </span>
                {isOwner && (
                  <span className="ml-2 text-xs bg-green-100/80 dark:bg-green-900/80 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full flex-shrink-0 backdrop-blur-sm">
                    You
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{comment.text}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {new Date(comment.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default CommentBubble;
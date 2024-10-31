import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../utils/cn';

interface CommentFormProps {
  position?: { x: number; y: number };
  onSubmit: (text: string) => void;
  onCancel: () => void;
  isMobile?: boolean;
}

const CommentForm = ({ position, onSubmit, onCancel, isMobile = false }: CommentFormProps) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  if (isMobile) {
    return (
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something nice..."
          className="w-full h-24 p-3 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!text.trim()}
            className={cn(
              "px-3 py-1.5 text-sm bg-zinc-50 dark:bg-[#212121] hover:bg-zinc-100 hover:dark:bg-zinc-950 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:border-zinc-800 rounded-lg flex items-center gap-1",
              text.trim() 
                ? "hover:bg-blue-700" 
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      className="absolute z-40"
      style={{ 
        left: `calc(${position?.x}% - 128px)`,
        top: `calc(${position?.y}% - 96px)`
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-64 bg-white dark:bg-zinc-950 rounded-lg shadow-lg p-4"
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full h-24 p-2 mb-2 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!text.trim()}
            className={cn(
              "px-3 py-1.5 text-sm bg-zinc-50 dark:bg-[#212121] hover:bg-zinc-100 hover:dark:bg-zinc-950 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:border-zinc-800 rounded-lg flex items-center gap-1",
              text.trim() 
                ? "hover:bg-blue-700" 
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
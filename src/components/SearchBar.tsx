import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center w-full md:w-64">
      <div className="flex items-center w-full bg-[gray-100] dark:bg-[#171717] border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="flex-shrink-0 p-3 text-gray-500 dark:text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value.trim());
            }}
            placeholder="Search artworks..."
            className="w-full h-10 pl-2 bg-[gray-100] dark:bg-[#171717] border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </form>

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
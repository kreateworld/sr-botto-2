import React, { useState, useRef, useEffect } from 'react';
import { ArrowDownWideNarrow } from 'lucide-react';

type SortField = 'added' | 'votes' | 'comments';

interface SortDropdownProps {
  value: SortField;
  onChange: (value: SortField) => void;
}

const options: { value: SortField; label: string }[] = [
  { value: 'added', label: 'Added' },
  { value: 'votes', label: 'Votes' },
  { value: 'comments', label: 'Comments' },
];

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${
          isOpen
            ? 'bg-blue-200 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <ArrowDownWideNarrow className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === option.value
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
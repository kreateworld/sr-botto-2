import React from 'react';

interface XShareButtonProps {
  url: string;
}

const XShareButton = ({ url }: XShareButtonProps) => {
  const getShareUrl = () => {
    const text = encodeURIComponent(`@BottoDAO is looking to acquire this artwork on SuperRare! ${url}`);
    return `https://twitter.com/intent/tweet?text=${text}`;
  };

  return (
    <a
      href={getShareUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
      title="Share on X"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    </a>
  );
};

export default XShareButton;
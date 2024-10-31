import React, { useState, useEffect } from 'react';
import { Trophy, ExternalLink, Maximize2, RotateCw } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import XShareButton from '../components/XShareButton';
import ArtworkModal from '../components/ArtworkModal';
import { formatAddress } from '../utils/address';
import { cn } from '../utils/cn';

const LOADING_TIMEOUT = 5000; // 5 seconds

const ArtworkPreview = ({ src, alt }: { src: string; alt: string }) => (
  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
    <div className="bg-white dark:bg-[#0f0f0f] rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 p-2">
      <img 
        src={src} 
        alt={alt}
        className="w-auto h-auto max-w-[300px] max-h-[300px] rounded-lg object-contain"
      />
    </div>
  </div>
);

const LeaderboardPage = () => {
  const { artworks, isLoading, error, refetch } = useLeaderboard();
  const [selectedArtwork, setSelectedArtwork] = useState<any | null>(null);
  const [showRefresh, setShowRefresh] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const deadline = new Date('2024-11-17T22:00:00-05:00').getTime();
      const now = new Date().getTime();
      const remaining = deadline - now;

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      setShowRefresh(false);
      timeoutId = setTimeout(() => {
        setShowRefresh(true);
      }, LOADING_TIMEOUT);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          <div className="text-gray-600 dark:text-gray-400">
            Voting ends in: <span className="font-semibold text-red-700 dark:text-red-400">{timeRemaining}</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Top 15 curations by the DAO:
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f0f0f] rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 mb-64">
        {isLoading ? (
          <div className="p-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              {showRefresh && (
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                  Refresh
                </button>
              )}
            </div>
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-xl">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artwork</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artist</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Curated By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Upvotes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider last:rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {artworks.map((artwork, index) => (
                <tr 
                  key={artwork.id}
                  className={cn(
                    "bg-white dark:bg-[#0f0f0f] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
                    index === artworks.length - 1 && "last:rounded-b-xl"
                  )}
                >
                  <td className="px-4 py-4 whitespace-nowrap first:rounded-bl-xl">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      ) : index === 1 ? (
                        <Trophy className="w-5 h-5 text-gray-400" />
                      ) : index === 2 ? (
                        <Trophy className="w-5 h-5 text-amber-700" />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center group relative">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-lg object-cover" 
                          src={artwork.image} 
                          alt={artwork.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {artwork.title}
                        </div>
                      </div>
                      <ArtworkPreview src={artwork.image} alt={artwork.title} />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {artwork.artist.profileUrl ? (
                      <a
                        href={artwork.artist.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {artwork.artist.name}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {artwork.artist.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0">
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={artwork.curator.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${artwork.curator.address}`}
                          alt={artwork.curator.name || 'Curator'}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {artwork.curator.name || formatAddress(artwork.curator.address)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(artwork.dateAdded).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {artwork.likes}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {artwork.score}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right last:rounded-br-xl">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={artwork.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <XShareButton url={artwork.imageUrl} />
                      <button
                        onClick={() => setSelectedArtwork(artwork)}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
};

export default LeaderboardPage;
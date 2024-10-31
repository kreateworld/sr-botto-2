import React, { useState } from 'react';
import { Trophy, ExternalLink, Maximize2 } from 'lucide-react';
import XShareButton from './XShareButton';
import ArtworkModal from './ArtworkModal';

interface Artwork {
  id: number;
  thumbnail: string;
  title: string;
  artist: {
    name: string;
    avatar: string;
    profileUrl?: string;
  };
  curator: {
    name: string;
    avatar: string;
  };
  curatedDate: string;
  upvotes: number;
  downvotes: number;
  url: string;
  image?: string;
}

const calculateScore = (upvotes: number, downvotes: number): number => {
  const total = upvotes + downvotes;
  if (total === 0) return 0;
  
  // Wilson score interval lower bound
  const z = 1.96; // 95% confidence
  const p = upvotes / total;
  const n = total;
  
  const left = p + (z * z) / (2 * n);
  const right = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  const under = 1 + (z * z) / n;
  
  return ((left - right) / under) * 100;
};

const LeaderboardTable = () => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const artworks: Artwork[] = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=150",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
      title: "Morning Dew in the Forest",
      artist: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50",
        profileUrl: "https://superrare.com/sarah_chen",
      },
      curator: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50",
      },
      curatedDate: "2024-03-15T10:30:00Z",
      upvotes: 245,
      downvotes: 12,
      url: "https://superrare.com/artwork/morning-dew",
    },
  ];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artwork</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artist</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Curated by</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Upvotes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Downvotes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {artworks.map((artwork, index) => (
              <tr 
                key={artwork.id}
                className="bg-white dark:bg-[#0f0f0f] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 ? (
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">{index + 1}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-lg object-cover" 
                        src={artwork.thumbnail} 
                        alt={artwork.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {artwork.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img 
                        className="h-8 w-8 rounded-full" 
                        src={artwork.artist.avatar} 
                        alt={artwork.artist.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {artwork.artist.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img 
                        className="h-8 w-8 rounded-full" 
                        src={artwork.curator.avatar} 
                        alt={artwork.curator.name}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {artwork.curator.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(artwork.curatedDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {artwork.upvotes}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                    {artwork.downvotes}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {calculateScore(artwork.upvotes, artwork.downvotes).toFixed(1)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={artwork.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <XShareButton url={artwork.url} />
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
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={{
            id: selectedArtwork.id,
            title: selectedArtwork.title,
            artist: selectedArtwork.artist,
            image: selectedArtwork.image || selectedArtwork.thumbnail,
            imageUrl: selectedArtwork.url,
          }}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  );
};

export default LeaderboardTable;
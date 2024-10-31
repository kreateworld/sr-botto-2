import { useState, useCallback } from 'react';
import type { Artwork } from '../types/artwork';

export function useArtworkSearch(artworks: Artwork[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtworks = useCallback(() => {
    if (!searchQuery.trim()) return artworks;

    const query = searchQuery.toLowerCase();
    return artworks.filter(artwork => 
      artwork.title.toLowerCase().includes(query) ||
      artwork.artist.name.toLowerCase().includes(query)
    );
  }, [artworks, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredArtworks: filteredArtworks()
  };
}
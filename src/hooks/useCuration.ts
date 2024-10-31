import { useState } from 'react';
import { useAddress } from "@thirdweb-dev/react";
import { supabase } from '../lib/supabase';
import { useSuperRare } from './useSuperRare';
import { useWalletInfo } from './useWalletInfo';
import { useArtworks } from './useArtworks';
import { cleanUrl } from '../services/superrareService';

export function useCuration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchArtwork } = useSuperRare();
  const address = useAddress();
  const { displayName, avatarUrl } = useWalletInfo();
  const { refetch } = useArtworks();

  const checkExists = async (url: string): Promise<boolean> => {
    try {
      const cleanedUrl = cleanUrl(url);
      const { data, error: checkError } = await supabase
        .from('artworks')
        .select('id')
        .eq('image_url', cleanedUrl)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking artwork existence:', error);
      return false;
    }
  };

  const submit = async (url: string) => {
    if (!address) {
      throw new Error('Must be connected to submit curation');
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanedUrl = cleanUrl(url);
      
      // Double-check existence before submission
      const exists = await checkExists(cleanedUrl);
      if (exists) {
        throw new Error('This artwork has already been submitted');
      }

      const artwork = await fetchArtwork(cleanedUrl);
      if (!artwork) {
        throw new Error('Failed to fetch artwork data');
      }

      const { error: insertError } = await supabase
        .from('artworks')
        .insert([{
          title: artwork.metadata.title,
          artist_name: artwork.creator?.primaryProfile?.sr?.srName || 'Unknown Artist',
          artist_avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${artwork.creator?.primaryProfile?.sr?.srName || artwork.universalTokenId}`,
          artist_profile_url: `https://superrare.com/${artwork.creator?.primaryProfile?.sr?.srName}`,
          image: artwork.metadata.proxyImageMediumUri || artwork.metadata.proxyVideoMediumUri,
          image_url: cleanedUrl,
          curator_address: address,
          curator_name: displayName,
          curator_avatar: avatarUrl,
        }]);

      if (insertError) {
        throw insertError;
      }

      // Refetch artworks after successful submission
      await refetch();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit artwork';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submit,
    checkExists,
    isLoading,
    error,
  };
}
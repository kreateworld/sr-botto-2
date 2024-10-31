import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useCuration } from '../hooks/useCuration';
import { useSuperRare } from '../hooks/useSuperRare';
import { useArtworks } from '../hooks/useArtworks';
import type { Artwork } from '../types/artwork';
import { cn } from '../utils/cn';

interface CurationModalProps {
  onClose: () => void;
}

const CurationModal: React.FC<CurationModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [artworkUrl, setArtworkUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [previewArtwork, setPreviewArtwork] = useState<Artwork | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { fetchArtwork, isLoading: isFetching } = useSuperRare();
  const { submit, checkExists, isLoading: isSubmitting } = useCuration();
  const { refetch } = useArtworks();

  const validateUrl = (url: string) => {
    const superrareRegex = /^(https?:\/\/)?(www\.)?superrare\.com\/artwork\//;
    return superrareRegex.test(url);
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setArtworkUrl(url);
    setError(null);
    const isValid = validateUrl(url);
    setIsValidUrl(url ? isValid : null);

    if (isValid) {
      try {
        const exists = await checkExists(url);
        if (exists) {
          setError('This artwork has already been submitted');
          setPreviewArtwork(null);
          return;
        }

        const artwork = await fetchArtwork(url);
        if (artwork) {
          setPreviewArtwork({
            id: 0,
            title: artwork.metadata.title,
            artist: {
              name: artwork.creator?.primaryProfile?.sr?.srName || 'Unknown Artist',
              avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${artwork.creator?.primaryProfile?.sr?.srName || artwork.universalTokenId}`,
              profileUrl: `https://superrare.com/${artwork.creator?.primaryProfile?.sr?.srName}`
            },
            image: artwork.metadata.proxyImageMediumUri || artwork.metadata.proxyVideoMediumUri || '',
            imageUrl: url,
            likes: 0,
            comments: 0,
            dateAdded: new Date().toISOString(),
            score: 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch artwork preview:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch artwork');
        setPreviewArtwork(null);
      }
    } else {
      setPreviewArtwork(null);
    }
  };

  const handleSubmit = async () => {
    if (!previewArtwork) return;
    
    try {
      await submit(artworkUrl);
      await refetch();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit curation');
    }
  };

  const steps = [
    "Step 1",
    "Step 2",
    "Step 3"
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full md:max-w-2xl bg-white dark:bg-[#0f0f0f] rounded-t-xl md:rounded-xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-zinc-900">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            Submit a $RARE Artwork
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                      index + 1 <= currentStep
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400"
                    )}>
                      {index + 1}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-2 md:mx-4",
                      index + 1 < currentStep
                        ? "bg-indigo-600"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-center text-sm md:text-base text-gray-600 dark:text-gray-400">
              {currentStep === 1 && "Browse through SuperRare and find an artwork you think the DAO should acquire!"}
              {currentStep === 2 && "Make sure this artwork is able to be purchased with $RARE tokens."}
              {currentStep === 3 && "Submit this artwork! Use the refresh button if the artwork isn't appearing."}
            </p>
   <hr className="border-gray-400/10"/>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                 Add SuperRare Artwork URL
                </label>
             
                <div className="space-y-2">
                  <input
                    type="url"
                    value={artworkUrl}
                    onChange={handleUrlChange}
                    disabled={isFetching}
                    placeholder="https://superrare.com/artwork/..."
                    className={cn(
                      "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 dark:bg-zinc-700 dark:border-gray-600 dark:text-white text-sm md:text-base",
                      error
                        ? "border-red-500 ring-red-200 dark:border-red-500 dark:ring-red-800"
                        : isValidUrl === null
                          ? "border-gray-300 dark:border-gray-600"
                          : isValidUrl
                            ? "border-green-500 ring-green-200 dark:border-green-500 dark:ring-green-800"
                            : "border-red-500 ring-red-200 dark:border-red-500 dark:ring-red-800"
                    )}
                  />
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  {isValidUrl === false && !error && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Please enter a valid SuperRare artwork URL
                    </p>
                  )}
                </div>
              </div>

              {isFetching && (
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              )}

              {previewArtwork && !isFetching && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                      <img
                        src={previewArtwork.image}
                        alt={previewArtwork.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                        {previewArtwork.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {previewArtwork.artist.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleBack}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg",
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            )}
            disabled={currentStep === 1}
          >
            Back
          </button>
          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              disabled={!previewArtwork || isSubmitting || !!error}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Curation'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && (!artworkUrl || !isValidUrl || !!error)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurationModal;
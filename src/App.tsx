import React, { useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ArrowUpDown, Shuffle, RotateCw } from 'lucide-react';
import HomeHead from './components/head/HomeHead';
import AboutHead from './components/head/AboutHead';
import LeaderboardHead from './components/head/LeaderboardHead';
import Sidebar from './components/Sidebar';
import ArtworkCard from './components/ArtworkCard';
import CurationModal from './components/CurationModal';
import CountdownAlert from './components/CountdownAlert';
import SortDropdown from './components/SortDropdown';
import SearchBar from './components/SearchBar';
import ScrollToTop from './components/ScrollToTop';
import AboutPage from './pages/AboutPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { useArtworks } from './hooks/useArtworks';
import { useArtworkSearch } from './hooks/useArtworkSearch';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

type SortField = 'added' | 'votes' | 'comments';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 9;

function App() {
  const location = useLocation();
  const [showCurationModal, setShowCurationModal] = useState(false);
  const [sortField, setSortField] = useState<SortField>('added');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [randomSeed, setRandomSeed] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const { artworks, isLoading, error, refetch } = useArtworks();
  const { searchQuery, setSearchQuery, filteredArtworks } = useArtworkSearch(artworks || []);

  const loadMore = useCallback(() => {
    if (!isLoading && filteredArtworks && displayCount < filteredArtworks.length) {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE);
    }
  }, [isLoading, filteredArtworks, displayCount]);

  const { targetRef } = useInfiniteScroll(loadMore);

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (randomSeed > 0) {
      return Math.random() - 0.5;
    }

    let comparison = 0;
    
    switch (sortField) {
      case 'added':
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
      case 'votes':
        comparison = a.likes - b.likes;
        break;
      case 'comments':
        comparison = a.comments - b.comments;
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const displayedArtworks = sortedArtworks.slice(0, displayCount);
  const hasMore = filteredArtworks && displayCount < filteredArtworks.length;

  const toggleSortDirection = () => {
    setRandomSeed(0);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const handleSortChange = (value: SortField) => {
    setRandomSeed(0);
    setSortField(value);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const handleShuffle = () => {
    setSortField('added');
    setSortDirection('desc');
    setRandomSeed(prev => prev + 1);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setDisplayCount(ITEMS_PER_PAGE);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  return (
    <ThemeProvider>
      {location.pathname === '/' && <HomeHead />}
      {location.pathname === '/about' && <AboutHead />}
      {location.pathname === '/leaderboard' && <LeaderboardHead />}
      
      <div className="min-h-screen bg-zinc-50 dark:bg-transparent">
        <Sidebar />
        <main className="lg:pl-64 p-4 lg:p-8">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={
                <div className="max-w-7xl mx-auto space-y-8">
                  <CountdownAlert />
                  
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Browse $RARE Artworks
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      The DAO is looking to acquire some $RARE artworks on SuperRare! Browse through submissions here.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="order-2 md:order-1">
                      <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="flex items-center justify-center gap-2 order-1 md:order-2">
                      <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${
                          isRefreshing
                            ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <RotateCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={handleShuffle}
                        className={`p-2 rounded-lg transition-colors ${
                          randomSeed > 0 
                            ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <Shuffle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={toggleSortDirection}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                      >
                        <ArrowUpDown 
                          className={`w-5 h-5 transition-transform ${
                            sortDirection === 'desc' ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <SortDropdown value={sortField} onChange={handleSortChange} />
                      <button
                        onClick={() => setShowCurationModal(true)}
                        className="px-4 py-2 bg-zinc-50 dark:bg-[#212121] hover:bg-zinc-100 hover:dark:bg-zinc-950 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:border-zinc-800 text-sm rounded-lg transition-colors"
                      >
                        Submit Curation
                      </button>
                    </div>
                  </div>
                  
                  {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  ) : isLoading || isRefreshing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 animate-pulse">
                          <div className="aspect-square w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg mb-4" />
                          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {displayedArtworks.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-600 dark:text-gray-400">
                            {searchQuery ? 'No artworks match your search.' : 'No artworks available.'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedArtworks.map((artwork) => (
                              <ErrorBoundary key={artwork.id}>
                                <ArtworkCard artwork={artwork} />
                              </ErrorBoundary>
                            ))}
                          </div>
                          {hasMore ? (
                            <div 
                              ref={targetRef}
                              className="mt-8 flex justify-center"
                            >
                              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : displayedArtworks.length > 0 && (
                            <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                              No more artworks to load
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              } />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
          </ErrorBoundary>
        </main>

        <ScrollToTop />

        {showCurationModal && (
          <CurationModal onClose={() => setShowCurationModal(false)} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
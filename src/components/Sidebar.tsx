import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sun, Moon, Gift, X, Menu, Trophy } from 'lucide-react';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

const BottoLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 72 21" 
    className="w-20 h-6 fill-current"
  >
    <g>
      <path d="M0,0L0,0l2,1.9c0.2,0.2,0.3,0.3,0.3,0.7v15.5c0,0.4,0,0.5-0.3,0.7l-2,1.9v0.1h11.1c4.6,0,7.6-2.1,7.6-5.8   c0-3.2-2.8-5-6.8-5.1V9.8c3.7-0.3,6.1-2,6.1-5C18,1.6,15.1,0,10.6,0C10.6,0,0,0,0,0z M9,10.2c2.8,0,3.9,1.7,3.9,4.9s-1.1,5-3.8,5   H8.3c-0.6,0-0.7,0-0.7-0.6v-9.3H9z M7.6,1.2c0-0.5,0.1-0.6,0.5-0.6h1c2.2,0,3.3,1.8,3.3,4.4c0,2.9-1.2,4.7-3.4,4.7H7.6V1.2z"/>
      <path d="M27.9,6.5c1.5,0,2.4,1.3,2.4,7s-0.9,7-2.4,7c-1.5,0-2.4-1.3-2.4-7C25.5,7.7,26.4,6.5,27.9,6.5z M27.9,21   c4.7,0,7.8-2.6,7.8-7.5c0-5-3.1-7.6-7.8-7.6s-7.8,2.6-7.8,7.5C20.1,18.5,23.2,21,27.9,21z"/>
      <path d="M46.2,6.1h-3.6v-5h-0.1l-4.1,4.6C38.1,6,38,6,37.5,6h-1.3v0.6h1.6v10.2c0,2.7,1.3,4,3.8,4c2.8,0,4-1.7,4.3-3.4h-0.1   c-0.3,0.6-0.9,1.1-1.7,1.1c-1,0-1.6-0.8-1.6-2.1V6.5h3.6L46.2,6.1L46.2,6.1z"/>
      <path d="M56.2,6.1h-3.6v-5h-0.1l-4.1,4.6C48.1,6,48,6,47.5,6h-1.3v0.6h1.6v10.2c0,2.7,1.3,4,3.8,4c2.8,0,4-1.7,4.3-3.4h-0.1   c-0.3,0.6-0.9,1.1-1.7,1.1c-1,0-1.6-0.8-1.6-2.1V6.5h3.6L56.2,6.1L56.2,6.1z"/>
      <path d="M64.2,6.5c1.5,0,2.4,1.3,2.4,7s-0.9,7-2.4,7s-2.4-1.3-2.4-7C61.8,7.7,62.7,6.5,64.2,6.5z M64.2,21c4.7,0,7.8-2.6,7.8-7.5   c0-5-3.1-7.6-7.8-7.6s-7.8,2.6-7.8,7.5C56.4,18.5,59.5,21,64.2,21z"/>
    </g>
  </svg>
);

const RareIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="20" 
    viewBox="0 0 24 20" 
    className="w-5 h-5 fill-current"
  >
    <path d="M5.30334 5.12947L10.1145 0H4.81116L0 5.12947L9.5356 16.3575L12.1613 13.2053L5.30334 5.12947Z" />
    <path d="M15.7206 0H6.28906V1.5718H15.7206V0Z" />
    <path d="M9.53451 16.3553L10.9395 18.0117L21.6784 5.12514L16.9561 0H14.2676L18.94 5.06877L9.53451 16.3553Z" />
  </svg>
);

const AboutIcon = () => (
  <svg 
    width="350" 
    height="350" 
    viewBox="0 0 350 350" 
    className="w-5 h-5 fill-current"
  >
    <path d="M57.8125 45.0742V45.8159L82.6592 69.1792C85.626 72.146 85.9968 73.2585 85.9968 78.0796V272.774C85.9968 277.595 85.626 278.708 82.6592 281.674L57.8125 305.038V305.779H196.88C255.103 305.779 292.188 279.449 292.188 232.723C292.188 192.3 256.957 170.049 207.264 168.937V168.195C253.619 164.116 284.029 142.978 284.029 104.78C284.029 63.9874 248.057 45.0742 190.576 45.0742H57.8125ZM171.292 173.758C206.151 173.758 220.243 195.267 220.243 234.948C220.243 275.37 206.522 298.362 172.404 298.362H162.02C154.233 298.362 153.12 297.992 153.12 290.945V173.758H171.292ZM153.12 59.9081C153.12 53.6037 154.233 52.4911 159.795 52.4911H172.404C199.476 52.4911 213.939 74.7419 213.939 107.747C213.939 144.461 199.105 166.341 170.921 166.341H153.12V59.9081Z" />
  </svg>
);

const RewardsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Some Goodies...
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          It'd be pretty fun to reward everyone who participates with a $RARE Curator Badge, but nothing's set in stone. Maybe there's some $RARE up for grabs...
        </p>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const menuItems = [
    { icon: Home, label: 'Vote', path: '/' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: AboutIcon, label: 'About', path: '/about' },
  ];

  const actionItems = [
    { 
      icon: AboutIcon, 
      label: 'Visit Botto', 
      tooltip: 'Visit Botto',
      href: 'https://botto.com'
    },
    { 
      icon: Gift, 
      label: 'Rewards', 
      tooltip: 'Rewards!',
      onClick: () => setShowRewardsModal(true)
    },
    { 
      icon: isDark ? Sun : Moon, 
      label: 'Theme', 
      tooltip: 'Toggle Theme',
      onClick: toggleTheme 
    },
  ];

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 mb-8">
        <BottoLogo />
      </div>
      
      <nav className="flex-1">
        <a
          href="https://superrare.com/explore?artworks[hasSalePrice]=true&artworks[currencyType][]=RARE"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors mb-2 text-gray-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
        >
          <RareIcon />
          <span>$RARE Artworks</span>
        </a>

        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 w-full p-3 rounded-lg transition-colors mb-2",
              isActive
                ? "bg-white dark:bg-[#212121] text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {typeof item.icon === 'function' ? <item.icon className="w-5 h-5" /> : <item.icon />}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-4">
        <ConnectWallet
          theme={isDark ? "dark" : "light"}
          btnTitle="Connect"
          className="!w-full !px-4 !py-2 !m-2 !ring-0 dark:!ring-0 !ring-zinc-200 dark:!ring-zinc-800 !bg-zinc-50 dark:!bg-[#0f0f0f] !text-zinc-800 dark:!text-white hover:!bg-zinc-200 dark:hover:!bg-zinc-800 hover:!border-green-400 !text-sm !rounded-lg !transition-colors"
          modalTitle="Connect Your Wallet"
          modalSize="wide"
          welcomeScreen={{
            title: "Connect to Botto",
            subtitle: "Connect your wallet to curate with BottoDAO!"
          }}
          modalTitleIconUrl="/vite.svg"
        />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Made with 🤖 by BottoDAO
        </p>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-around">
            {actionItems.map((item) => (
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {typeof item.icon === 'function' ? <item.icon className="w-5 h-5" /> : <item.icon />}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1.5 bg-zinc-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    <div className="relative">
                      {item.tooltip}
                      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                        <div className="w-2 h-2 bg-zinc-900 transform rotate-45" />
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="group relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {typeof item.icon === 'function' ? <item.icon className="w-5 h-5" /> : <item.icon />}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1.5 bg-zinc-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    <div className="relative">
                      {item.tooltip}
                      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                        <div className="w-2 h-2 bg-zinc-900 transform rotate-45" />
                      </div>
                    </div>
                  </div>
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </>
  );

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-900 dark:text-white" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 h-screen bg-white dark:bg-[#171717] border-r border-zinc-200 dark:border-zinc-800 fixed left-0 top-0 p-6 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-40 w-full bg-white dark:bg-[#171717] p-6 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      <RewardsModal 
        isOpen={showRewardsModal} 
        onClose={() => setShowRewardsModal(false)} 
      />
    </>
  );
};

export default Sidebar;
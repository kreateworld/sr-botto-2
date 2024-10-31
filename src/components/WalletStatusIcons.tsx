import React from 'react';
import { useBottoStaking } from '../hooks/useBottoStaking';
import { cn } from '../utils/cn';

const EthereumIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    className="w-8 h-8"
  >
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z"/>
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
        <path d="M16.498 27.995v-6.028L9 17.616z"/>
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/>
      </g>
    </g>
  </svg>
);

const BaseIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="32" 
    height="32" 
    viewBox="0 0 146 146" 
    className="w-8 h-8"
    fill="none"
  >
    <circle cx="73" cy="73" r="73" fill="#0052FF"/>
    <path d="M73.323 123.729C101.617 123.729 124.553 100.832 124.553 72.5875C124.553 44.343 101.617 21.4463 73.323 21.4463C46.4795 21.4463 24.4581 42.0558 22.271 68.2887H89.9859V76.8864H22.271C24.4581 103.119 46.4795 123.729 73.323 123.729Z" fill="#E3E7E9"/>
  </svg>
);

const WalletStatusIcon: React.FC<{
  icon: React.ElementType;
  tooltip: string;
  active?: boolean;
  loading?: boolean;
}> = ({ icon: Icon, tooltip, active = false, loading = false }) => (
  <div className="group relative">
    <div className={cn(
      "rounded-full transition-all p-1 m-0.5",
      active && "ring-2 ring-green-500"
    )}>
      <Icon 
        className={cn(
          "w-8 h-8 transition-colors",
          loading ? "animate-pulse text-gray-300 dark:text-gray-700" : 
          active ? "text-[#627EEA]" : 
          "text-gray-400 dark:text-gray-600 filter grayscale"
        )}
      />
    </div>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-50">
      {tooltip}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
        <div className="w-2 h-2 bg-gray-900 transform rotate-45" />
      </div>
    </div>
  </div>
);

const WalletStatusIcons: React.FC = () => {
  const { isMainnetStaking, isBaseStaking, isLoading } = useBottoStaking();

  return (
    <div className="flex justify-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <WalletStatusIcon
          icon={EthereumIcon}
          tooltip={isMainnetStaking ? "Mainnet O.G." : "Stake on Mainnet"}
          active={isMainnetStaking}
          loading={isLoading}
        />
        <WalletStatusIcon
          icon={BaseIcon}
          tooltip={isBaseStaking ? "You're Based" : "You're not Based :("}
          active={isBaseStaking}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default WalletStatusIcons;
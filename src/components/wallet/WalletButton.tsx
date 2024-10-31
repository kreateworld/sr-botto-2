import React, { useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useConnectionStatus } from "@thirdweb-dev/react";
import { formatAddress } from '../../utils/address';

interface WalletButtonProps {
  address?: string | undefined;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
  error?: string | null;
  onErrorDismiss: () => void;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  address,
  onConnect,
  onDisconnect,
  isConnecting,
  error,
  onErrorDismiss
}) => {
  const connectionStatus = useConnectionStatus();
  const isLoading = connectionStatus === "connecting" || isConnecting;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(onErrorDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onErrorDismiss]);

  return (
    <div className="space-y-2">
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}
      
      <button 
        onClick={address ? onDisconnect : onConnect}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/20 rounded-lg hover:bg-gray-50 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? (
          <span>{isConnecting ? 'Connecting...' : 'Disconnecting...'}</span>
        ) : address ? (
          formatAddress(address)
        ) : (
          'Connect Wallet'
        )}
      </button>
    </div>
  );
};

export default WalletButton;
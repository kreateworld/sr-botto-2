import { useState, useCallback } from 'react';
import { useConnect, useDisconnect } from "@thirdweb-dev/react";
import { getWalletConfig } from '../utils/wallet';

export interface WalletConnectionState {
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
}

export function useWalletConnection(): WalletConnectionState {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const connectWallet = useConnect();
  const disconnectWallet = useDisconnect();

  const clearError = useCallback(() => setError(null), []);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const config = getWalletConfig();
      await connectWallet(config);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to connect wallet. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [connectWallet]);

  const disconnect = useCallback(async () => {
    try {
      setError(null);
      await disconnectWallet();
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to disconnect wallet. Please try again.';
      setError(errorMessage);
      throw err;
    }
  }, [disconnectWallet]);

  return {
    isConnecting,
    error,
    connect,
    disconnect,
    clearError
  };
}
import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useTheme } from '../../context/ThemeContext';

interface ConnectWalletPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please connect your wallet to interact with the artwork
        </p>
        <ConnectWallet
          theme={isDark ? "dark" : "light"}
          btnTitle="Connect Wallet"
          className="w-full"
          modalTitle="Connect Your Wallet"
          modalSize="wide"
          welcomeScreen={{
            title: "Connect to Botto",
            subtitle: "Connect your wallet to interact with the Botto community"
          }}
          modalTitleIconUrl="/vite.svg"
        />
      </div>
    </div>
  );
};

export default ConnectWalletPrompt;
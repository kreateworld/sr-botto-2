import { metamaskWallet, WalletConfig } from "@thirdweb-dev/react";

export const CHAIN_ID = 1; // Ethereum Mainnet

export const getWalletConfig = (): WalletConfig => ({
  recommended: true,
  wallet: metamaskWallet({
    recommended: true
  })
});
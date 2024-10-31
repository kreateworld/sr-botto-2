import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import { formatAddress, getAvatarUrl } from "../utils/address";

export interface WalletInfo {
  address: string | undefined;
  displayName: string;
  avatarUrl: string;
  isConnected: boolean;
  disconnect: () => void;
}

export function useWalletInfo(): WalletInfo {
  const address = useAddress();
  const disconnect = useDisconnect();
  
  const displayName = address ? formatAddress(address) : "";
  const avatarUrl = address ? getAvatarUrl(address) : "";
  
  return {
    address,
    displayName,
    avatarUrl,
    isConnected: !!address,
    disconnect
  };
}
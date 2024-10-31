import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAddress } from "@thirdweb-dev/react";

const PIPE_CONTRACT = '0x2e251bff6c091a1752e1f9983882f7ade82535da';
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

export function useTokenOwnership() {
  const [isTokenHolder, setIsTokenHolder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const address = useAddress();

  useEffect(() => {
    let mounted = true;

    async function checkOwnership() {
      if (!address) {
        setIsTokenHolder(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const provider = new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_PROJECT_ID}`
        );

        const contract = new ethers.Contract(
          PIPE_CONTRACT,
          ERC721_ABI,
          provider
        );

        const balance = await Promise.race([
          contract.balanceOf(address),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Contract call timeout')), 5000)
          )
        ]);

        if (mounted) {
          setIsTokenHolder(balance.gt(0));
        }
      } catch (error) {
        console.warn('Failed to check token ownership:', error);
        if (mounted) {
          setIsTokenHolder(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkOwnership();

    return () => {
      mounted = false;
    };
  }, [address]);

  return { isTokenHolder, isLoading };
}
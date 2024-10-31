import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAddress } from "@thirdweb-dev/react";

const GOVERNANCE_ABI = [
  "function userStakes(address account) external view returns (uint256)"
];

const MAINNET_GOVERNANCE = '0x19CD3998f106eCC40eE7668c19C47e18b491e8a6';
const BASE_GOVERNANCE = '0x8a7a5991aAf142B43E58253Bd6791e240084F0A9';
const MIN_STAKED_AMOUNT = ethers.utils.parseEther('100');

const ETHERSCAN_API_KEY = 'YS9BWMF8FQXHPGHSNUJ5IHD786QVJ8WZ2Q';
const BASESCAN_API_KEY = '9ZJEDS5J6N8I3PRKNS37VCRMMPKUGDIH4U';

export function useBottoStaking() {
  const [isMainnetStaking, setIsMainnetStaking] = useState(false);
  const [isBaseStaking, setIsBaseStaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const address = useAddress();

  useEffect(() => {
    let mounted = true;

    async function checkMainnetStaking() {
      try {
        const apiUrl = `https://api.etherscan.io/api?module=contract&action=read&address=${MAINNET_GOVERNANCE}&contractaddress=${MAINNET_GOVERNANCE}&apikey=${ETHERSCAN_API_KEY}&function=userStakes&parameter=${address}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === '1' && data.result) {
          const stakedAmount = ethers.BigNumber.from(data.result);
          return stakedAmount.gte(MIN_STAKED_AMOUNT);
        }

        // Fallback to direct contract call
        const provider = new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_PROJECT_ID}`
        );

        const contract = new ethers.Contract(
          MAINNET_GOVERNANCE,
          GOVERNANCE_ABI,
          provider
        );

        const stakedAmount = await Promise.race([
          contract.userStakes(address),
          new Promise((_, reject) => setTimeout(() => reject('Contract call timeout'), 5000))
        ]);

        return stakedAmount.gte(MIN_STAKED_AMOUNT);
      } catch (error) {
        console.error('Failed to check Mainnet BOTTO staking:', error);
        return false;
      }
    }

    async function checkBaseStaking() {
      try {
        const apiUrl = `https://api.basescan.org/api?module=contract&action=read&address=${BASE_GOVERNANCE}&contractaddress=${BASE_GOVERNANCE}&apikey=${BASESCAN_API_KEY}&function=userStakes&parameter=${address}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === '1' && data.result) {
          const stakedAmount = ethers.BigNumber.from(data.result);
          return stakedAmount.gte(MIN_STAKED_AMOUNT);
        }

        // Fallback to direct contract call
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
        const contract = new ethers.Contract(
          BASE_GOVERNANCE,
          GOVERNANCE_ABI,
          provider
        );

        const stakedAmount = await Promise.race([
          contract.userStakes(address),
          new Promise((_, reject) => setTimeout(() => reject('Contract call timeout'), 5000))
        ]);

        return stakedAmount.gte(MIN_STAKED_AMOUNT);
      } catch (error) {
        console.error('Failed to check Base BOTTO staking:', error);
        return false;
      }
    }

    async function checkStaking() {
      if (!address) {
        setIsMainnetStaking(false);
        setIsBaseStaking(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [mainnetStaking, baseStaking] = await Promise.all([
          checkMainnetStaking(),
          checkBaseStaking()
        ]);

        if (mounted) {
          setIsMainnetStaking(mainnetStaking);
          setIsBaseStaking(baseStaking);
        }
      } catch (error) {
        console.error('Failed to check BOTTO staking:', error);
        if (mounted) {
          setIsMainnetStaking(false);
          setIsBaseStaking(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkStaking();

    return () => {
      mounted = false;
    };
  }, [address]);

  return { 
    isMainnetStaking, 
    isBaseStaking,
    isLoading 
  };
}
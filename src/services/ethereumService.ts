import { ethers } from 'ethers';

const INFURA_PROJECT_ID = 'a8b5501c286e499d8e6b92eeac1bb163';
const PIPE_CONTRACT_ADDRESS = '0x2e251bff6c091a1752e1f9983882f7ade82535da';

// ERC1155 ABI for balanceOf function
const CONTRACT_ABI = [
  'function balanceOf(address account, uint256 id) view returns (uint256)'
];

export async function checkPipeOwnership(address: string): Promise<boolean> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
    );
    
    const contract = new ethers.Contract(
      PIPE_CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    // Check balance for token ID 1 (assuming this is the Pipe NFT ID)
    const balance = await contract.balanceOf(address, 1);
    return balance.gt(0);
  } catch (error) {
    console.error('Error checking token ownership:', error);
    return false;
  }
}
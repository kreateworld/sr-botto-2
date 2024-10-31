export const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const getAvatarUrl = (address: string): string => {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
};
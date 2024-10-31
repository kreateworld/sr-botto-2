export type VoteType = 'up' | 'down';

export interface Artwork {
  id: number;
  title: string;
  artist: {
    name: string;
    avatar: string;
    profileUrl?: string;
  };
  image: string;
  imageUrl: string;
  likes: number;
  comments: number;
  dateAdded: string;
  score: number;
  curator?: {
    address: string;
    name?: string;
    avatar?: string;
  };
}

export interface Vote {
  id: number;
  artwork_id: number;
  user_address: string;
  vote_type: VoteType;
  created_at: string;
}
export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: {
          id: number;
          title: string;
          artist_name: string;
          artist_avatar: string;
          artist_profile_url: string | null;
          image: string;
          image_url: string;
          likes: number;
          comments: number;
          date_added: string;
          curator_address: string;
          curator_name: string | null;
          curator_avatar: string | null;
          score: number;
        };
      };
      comments: {
        Row: {
          id: string;
          artwork_id: number;
          text: string;
          user_address: string;
          user_name: string | null;
          user_avatar: string | null;
          position_x: number;
          position_y: number;
          created_at: string;
          updated_at: string;
          is_deleted: boolean;
        };
      };
      votes: {
        Row: {
          id: number;
          artwork_id: number;
          user_address: string;
          vote_type: 'up' | 'down';
          created_at: string;
        };
      };
    };
  };
}
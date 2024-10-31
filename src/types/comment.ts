export interface Position {
  x: number;
  y: number;
}

export interface Comment {
  id: string;
  artwork_id: number;
  text: string;
  user_address: string;
  user_name?: string;
  user_avatar?: string;
  position_x: number;
  position_y: number;
  created_at: string;
  is_deleted: boolean;
}

export interface CommentWithPosition extends Omit<Comment, 'position_x' | 'position_y'> {
  position: Position;
}
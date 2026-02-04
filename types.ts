
export interface User {
  id: string;
  name: string;
  avatar: string;
  karma: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
  banner: string;
  memberCount: number;
  slug: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  votes: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  communityId: string;
  timestamp: number;
  votes: number;
  comments: Comment[];
  type: 'text' | 'image';
}

export type ViewMode = 'home' | 'community' | 'post';

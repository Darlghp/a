
import React from 'react';
import { Post, Community } from '../types.ts';
import PostCard from './PostCard.tsx';

interface FeedProps {
  posts: Post[];
  communities: Community[];
  onVote: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, communities, onVote, onDelete, onAddComment }) => {
  if (posts.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-300 text-center shadow-sm">
        <div className="text-7xl mb-6">🏜️</div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">Seu feed está vazio</h3>
        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
          O Privy é o seu espaço privado. Comece criando uma postagem ou uma nova comunidade para preencher este espaço.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {posts.map((post) => {
        const comm = communities.find(c => c.id === post.communityId);
        return (
          <PostCard 
            key={post.id} 
            post={post} 
            communityName={comm?.name || 'Geral'} 
            onVote={onVote} 
            onDelete={onDelete}
            onAddComment={onAddComment}
          />
        );
      })}
    </div>
  );
};

export default Feed;

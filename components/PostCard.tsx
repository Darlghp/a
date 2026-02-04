
import React, { useState } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  communityName: string;
  onVote: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, communityName, onVote, onDelete, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const timeAgo = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="bg-white rounded border border-gray-300 shadow-sm flex overflow-hidden">
      {/* Vote Bar */}
      <div className="w-10 bg-gray-50 flex flex-col items-center py-2 gap-1 shrink-0">
        <button 
          onClick={() => onVote(post.id, 1)}
          className="text-gray-500 hover:text-orange-600 hover:bg-gray-200 rounded p-1 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5L19.5 12h-5v7.5h-5V12h-5L12 4.5z" />
          </svg>
        </button>
        <span className="text-xs font-bold text-gray-800">{post.votes}</span>
        <button 
          onClick={() => onVote(post.id, -1)}
          className="text-gray-500 hover:text-blue-600 hover:bg-gray-200 rounded p-1 transition-colors"
        >
          <svg className="w-6 h-6 rotate-180" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5L19.5 12h-5v7.5h-5V12h-5L12 4.5z" />
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="p-3">
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-900 hover:underline cursor-pointer">c/{communityName}</span>
              <span>•</span>
              <span className="truncate">Postado por u/{post.author}</span>
              <span>•</span>
              <span className="whitespace-nowrap">{timeAgo(post.timestamp)}</span>
            </div>
            <button 
              onClick={() => onDelete(post.id)}
              className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              title="Excluir Postagem"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <h3 className="text-lg font-bold mb-2 leading-tight text-gray-900">{post.title}</h3>
          
          {post.type === 'text' ? (
            <p className="text-gray-700 text-sm mb-4 line-clamp-6 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          ) : (
            <div className="mb-4 bg-gray-50 rounded flex justify-center border border-gray-100 overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="max-h-[512px] object-contain w-full"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/400/300';
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded text-xs font-bold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments.length} Comentários
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded text-xs font-bold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartilhar
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded text-xs font-bold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Salvar
            </button>
          </div>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="border-t border-gray-100 bg-gray-50 p-4">
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea 
                className="w-full border rounded p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none min-h-[80px]"
                placeholder="O que você achou disso?"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Comentar
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {post.comments.length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-4">Nenhum comentário ainda. Seja o primeiro!</p>
              ) : (
                post.comments.sort((a,b) => b.timestamp - a.timestamp).map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0">
                      {c.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[10px] mb-1">
                        <span className="font-bold text-gray-900">u/{c.author}</span>
                        <span className="text-gray-400">{timeAgo(c.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

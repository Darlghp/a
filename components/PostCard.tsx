
import React, { useState } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  communityName: string;
  onVote: (id: string, delta: number) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, communityName, onVote, onTogglePin, onDelete, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<number>(0);

  const handleVoteAction = (delta: number) => {
    const change = delta === userVote ? -delta : delta - userVote;
    setUserVote(delta === userVote ? 0 : delta);
    onVote(post.id, change);
  };

  const timeAgo = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className={`bg-white rounded border ${post.isPinned ? 'border-[#0079D3]' : 'border-[#ccc]'} hover:border-[#898989] transition-colors flex overflow-hidden mb-3 shadow-sm relative`}>
      {/* Barra lateral de votos */}
      <div className={`w-10 ${post.isPinned ? 'bg-blue-50' : 'bg-[#F8F9FA]'} flex flex-col items-center py-2 gap-1 shrink-0`}>
        <button 
          onClick={() => handleVoteAction(1)}
          className={`p-1 rounded hover:bg-gray-200 transition-colors ${userVote === 1 ? 'text-[#FF4500]' : 'text-gray-500'}`}
        >
          <svg className="w-6 h-6" fill={userVote === 1 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span className={`text-xs font-bold ${userVote === 1 ? 'text-[#FF4500]' : userVote === -1 ? 'text-[#7193FF]' : 'text-gray-900'}`}>
          {post.votes}
        </span>
        <button 
          onClick={() => handleVoteAction(-1)}
          className={`p-1 rounded hover:bg-gray-200 transition-colors ${userVote === -1 ? 'text-[#7193FF]' : 'text-gray-500'}`}
        >
          <svg className="w-6 h-6 rotate-180" fill={userVote === -1 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="p-3">
          {post.isPinned && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#0079D3] mb-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.293 1.293a1 1 0 011.414 0l4.243 4.243a1 1 0 010 1.414l-2.404 2.404c.162.593.18 1.144.07 1.63L18.464 13.5a1 1 0 01-1.414 1.414l-2.535-2.85c-.486.11-1.037.092-1.63-.07L10.48 14.4l-.8 3a1 1 0 01-1.897.26l-1.5-4.5-4.5-1.5a1 1 0 01.26-1.897l3-.8 2.404-2.404c-.162-.593-.18-1.144-.07-1.63L4.536 2.5a1 1 0 011.414-1.414l2.535 2.85c.486-.11 1.037-.092 1.63.07l2.404-2.404z" />
              </svg>
              FIXADO PELO ADMINISTRADOR
            </div>
          )}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 mb-2">
            <span className="font-bold text-black hover:underline cursor-pointer">r/{communityName}</span>
            <span>•</span>
            <span className="truncate">u/{post.author}</span>
            <span>•</span>
            <span className="whitespace-nowrap">{timeAgo(post.timestamp)}</span>
          </div>

          <h3 className="text-lg font-medium mb-2 leading-tight text-[#1A1A1B]">{post.title}</h3>
          
          {post.type === 'text' && post.content && (
            <div className="text-[#1A1A1B] text-sm mb-3 line-clamp-[12] whitespace-pre-wrap leading-relaxed px-1">
              {post.content}
            </div>
          )}
        </div>

        {post.type === 'image' && post.imageUrl && (
          <div className="bg-[#F6F7F8] flex justify-center border-y border-[#EDEFF1] overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="max-h-[700px] w-full object-contain"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-2">
          {/* Ações */}
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
            
            <button 
              onClick={() => onTogglePin(post.id)}
              className={`flex items-center gap-2 ${post.isPinned ? 'text-[#0079D3] bg-blue-50' : 'text-gray-500 hover:bg-gray-100'} p-2 rounded text-xs font-bold transition-colors`}
              title={post.isPinned ? "Desafixar do topo" : "Fixar no topo"}
            >
              <svg className="w-5 h-5" fill={post.isPinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.293 1.293a1 1 0 011.414 0l4.243 4.243a1 1 0 010 1.414l-2.404 2.404c.162.593.18 1.144.07 1.63L18.464 13.5a1 1 0 01-1.414 1.414l-2.535-2.85c-.486.11-1.037.092-1.63-.07L10.48 14.4l-.8 3a1 1 0 01-1.897.26l-1.5-4.5-4.5-1.5a1 1 0 01.26-1.897l3-.8 2.404-2.404c-.162-.593-.18-1.144-.07-1.63L4.536 2.5a1 1 0 011.414-1.414l2.535 2.85c.486-.11 1.037-.092 1.63.07l2.404-2.404z" />
              </svg>
              {post.isPinned ? "Fixado" : "Fixar"}
            </button>

            <button 
              onClick={() => { if(confirm('Excluir esta postagem?')) onDelete(post.id); }}
              className="flex items-center gap-2 text-gray-400 hover:bg-red-50 hover:text-red-500 p-2 rounded text-xs font-bold ml-auto transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Sessão de Comentários */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <form onSubmit={(e) => { e.preventDefault(); onAddComment(post.id, newComment); setNewComment(''); }} className="mb-4">
                <textarea 
                  className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none"
                  placeholder="O que você achou?"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <div className="flex justify-end mt-1">
                  <button type="submit" className="bg-[#0079D3] text-white px-4 py-1 rounded-full text-xs font-bold hover:bg-[#005FA3]">Comentar</button>
                </div>
              </form>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {post.comments.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-4">Nenhum comentário ainda.</p>
                ) : (
                  post.comments.sort((a,b) => b.timestamp - a.timestamp).map(c => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                        {c.author.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span className="font-bold text-black">u/{c.author}</span>
                          <span>{timeAgo(c.timestamp)}</span>
                        </div>
                        <p className="text-sm text-[#1A1A1B] leading-snug">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

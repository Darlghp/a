
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
    <div className="bg-white rounded border border-[#ccc] hover:border-[#898989] transition-colors flex overflow-hidden mb-3">
      {/* Barra lateral de votos */}
      <div className="w-10 bg-[#F8F9FA] flex flex-col items-center py-2 gap-1 shrink-0">
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
          <svg className="w-6 h-6" fill={userVote === -1 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-2">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <span className="font-bold text-black hover:underline cursor-pointer">r/{communityName}</span>
          <span>•</span>
          <span>Postado por u/{post.author}</span>
          <span>há {timeAgo(post.timestamp)}</span>
        </div>

        <h3 className="text-lg font-medium mb-2 leading-tight text-[#1A1A1B]">{post.title}</h3>
        
        {post.type === 'text' && post.content && (
          <div className="text-[#1A1A1B] text-sm mb-3 line-clamp-5 whitespace-pre-wrap leading-relaxed px-1">
            {post.content}
          </div>
        )}

        {post.type === 'image' && post.imageUrl && (
          <div className="mb-3 bg-[#F6F7F8] rounded flex justify-center border border-[#EDEFF1] overflow-hidden">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="max-h-[512px] object-contain w-full"
            />
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded text-xs font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments.length} Comentários
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded text-xs font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartilhar
          </button>
          <button 
            onClick={() => { if(confirm('Excluir?')) onDelete(post.id); }}
            className="flex items-center gap-2 text-gray-500 hover:bg-red-50 hover:text-red-500 p-2 rounded text-xs font-bold ml-auto"
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
                placeholder="Comente sua opinião..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button type="submit" className="bg-[#0079D3] text-white px-4 py-1 rounded-full text-xs font-bold">Comentar</button>
              </div>
            </form>
            <div className="space-y-3">
              {post.comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="font-bold text-black">u/{c.author}</span>
                      <span>há {timeAgo(c.timestamp)}</span>
                    </div>
                    <p className="text-sm">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;

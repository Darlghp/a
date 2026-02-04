
import React, { useState, useEffect } from 'react';
import { User, Post, Community, ViewMode, Comment } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';

const App: React.FC = () => {
  const [currentUser] = useState<User>({
    id: 'user_1',
    name: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=ff4500',
    karma: 1250
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('privy_communities');
    return saved ? JSON.parse(saved) : [
      { id: 'c1', name: 'Geral', slug: 'geral', description: 'O lugar para tudo o que importa.', icon: '🏠', banner: 'https://picsum.photos/seed/general/800/200', memberCount: 1 },
      { id: 'c2', name: 'Tecnologia', slug: 'tecnologia', description: 'O futuro é agora.', icon: '💻', banner: 'https://picsum.photos/seed/tech/800/200', memberCount: 1 },
      { id: 'c3', name: 'Imagens', slug: 'imagens', description: 'Galeria privada de fotos.', icon: '🖼️', banner: 'https://picsum.photos/seed/images/800/200', memberCount: 1 }
    ];
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('privy_posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('privy_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('privy_communities', JSON.stringify(communities));
  }, [communities]);

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'timestamp' | 'votes' | 'comments'>) => {
    const post: Post = {
      ...newPost,
      id: `post_${Date.now()}`,
      timestamp: Date.now(),
      votes: 1,
      comments: []
    };
    setPosts(prev => [post, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleVote = (postId: string, delta: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, votes: p.votes + delta } : p));
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      author: currentUser.name,
      content,
      timestamp: Date.now(),
      votes: 1
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const handleCreateCommunity = (name: string, description: string) => {
    const newComm: Community = {
      id: `comm_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      icon: '📁',
      banner: `https://picsum.photos/seed/${name}/800/200`,
      memberCount: 1
    };
    setCommunities(prev => [...prev, newComm]);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCommunity = activeCommunityId ? post.communityId === activeCommunityId : true;
    return matchesSearch && matchesCommunity;
  });

  const activeCommunity = communities.find(c => c.id === activeCommunityId);

  return (
    <div className="min-h-screen bg-[#DAE0E6] text-[#1A1A1B]">
      <Navbar 
        onSearch={setSearchQuery} 
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onGoHome={() => { setCurrentView('home'); setActiveCommunityId(null); }}
        user={currentUser}
      />
      
      <div className="max-w-[1248px] mx-auto pt-16 flex justify-center gap-6 px-4">
        {/* Sidebar Esquerda */}
        <div className="hidden md:block w-64 shrink-0">
          <Sidebar 
            communities={communities} 
            activeId={activeCommunityId}
            onSelect={(id) => { setActiveCommunityId(id); setCurrentView('community'); }}
            onCreateCommunity={handleCreateCommunity}
          />
        </div>

        {/* Conteúdo Central */}
        <main className="flex-1 max-w-[640px] min-w-0">
          {/* Header de Comunidade se ativo */}
          {activeCommunity && currentView === 'community' && (
            <div className="bg-white rounded-md shadow-sm mb-4 overflow-hidden border border-[#ccc]">
              <div className="h-20 w-full bg-cover bg-center" style={{ backgroundImage: `url(${activeCommunity.banner})` }}></div>
              <div className="px-4 py-3 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-white -mt-10 flex items-center justify-center text-3xl shadow-sm">
                  {activeCommunity.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold">r/{activeCommunity.name}</h1>
                  <p className="text-gray-500 text-xs">c/{activeCommunity.slug}</p>
                </div>
              </div>
            </div>
          )}

          {/* Barra de Criação Estilo Reddit */}
          <div className="bg-white p-2 rounded border border-[#ccc] mb-4 flex items-center gap-2">
            <img src={currentUser.avatar} className="w-9 h-9 rounded-full bg-gray-200" alt="me" />
            <input 
              readOnly
              onClick={() => setIsCreateModalOpen(true)}
              placeholder="Criar postagem"
              className="flex-1 bg-[#F6F7F8] border border-[#EDEFF1] hover:bg-white hover:border-[#0079D3] rounded px-4 py-2 text-sm cursor-pointer outline-none"
            />
            <button onClick={() => setIsCreateModalOpen(true)} className="p-2 hover:bg-gray-100 rounded text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <Feed 
            posts={filteredPosts} 
            onVote={handleVote} 
            onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
            onAddComment={handleAddComment}
            communities={communities}
          />
        </main>

        {/* Sidebar Direita (Widgets) */}
        <div className="hidden lg:block w-[312px] shrink-0">
          <div className="bg-white rounded border border-[#ccc] overflow-hidden sticky top-16">
            <div className="h-8 bg-[#0079D3]"></div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
                <span className="font-bold">Privy Home</span>
              </div>
              <p className="text-sm mb-4 leading-snug">Sua página inicial personalizada do Privy. Controle tudo, veja tudo.</p>
              <div className="space-y-2 border-t pt-4">
                <button onClick={() => setIsCreateModalOpen(true)} className="w-full bg-[#0079D3] text-white font-bold py-1.5 rounded-full hover:bg-[#005FA3] transition-colors text-sm">
                  Criar Postagem
                </button>
                <button className="w-full border border-[#0079D3] text-[#0079D3] font-bold py-1.5 rounded-full hover:bg-blue-50 transition-colors text-sm">
                  Criar Comunidade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreatePost 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleCreatePost}
          communities={communities}
          activeCommunityId={activeCommunityId || undefined}
        />
      )}
    </div>
  );
};

export default App;

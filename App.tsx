
import React, { useState, useEffect } from 'react';
import { User, Post, Community, ViewMode, Comment } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Sidebar from './components/Sidebar.tsx';
import Feed from './components/Feed.tsx';
import CreatePost from './components/CreatePost.tsx';
import ManageCommunityModal from './components/ManageCommunityModal.tsx';

const App: React.FC = () => {
  const [currentUser] = useState<User>({
    id: 'user_1',
    name: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=ff4500',
    karma: 1250
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    try {
      const saved = localStorage.getItem('privy_communities');
      return saved ? JSON.parse(saved) : [
        { id: 'c1', name: 'Geral', slug: 'geral', description: 'O lugar para tudo o que importa.', icon: '🏠', banner: 'https://picsum.photos/seed/general/800/200', memberCount: 1 },
        { id: 'c2', name: 'Tecnologia', slug: 'tecnologia', description: 'O futuro é agora.', icon: '💻', banner: 'https://picsum.photos/seed/tech/800/200', memberCount: 1 },
        { id: 'c3', name: 'Imagens', slug: 'imagens', description: 'Galeria privada de fotos.', icon: '🖼️', banner: 'https://picsum.photos/seed/images/800/200', memberCount: 1 }
      ];
    } catch (e) {
      console.error("Erro ao carregar comunidades", e);
      return [];
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('privy_posts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar posts", e);
      return [];
    }
  });

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [communityToManage, setCommunityToManage] = useState<Community | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('privy_posts', JSON.stringify(posts));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert("Erro: O armazenamento do navegador está cheio! Tente apagar posts antigos ou usar imagens menores.");
      }
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('privy_communities', JSON.stringify(communities));
    } catch (e) {
      console.error("Erro ao salvar comunidades", e);
    }
  }, [communities]);

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'timestamp' | 'votes' | 'comments'>) => {
    const post: Post = {
      ...newPost,
      id: `post_${Date.now()}`,
      timestamp: Date.now(),
      votes: 1,
      comments: [],
      isPinned: false
    };
    setPosts(prev => [post, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleVote = (postId: string, delta: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, votes: p.votes + delta } : p));
  };

  const handleTogglePin = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p));
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

  const handleCreateCommunity = (name: string, description: string, icon: string, banner: string) => {
    const newComm: Community = {
      id: `comm_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      icon: icon || '📁',
      banner: banner || `https://picsum.photos/seed/${name}/800/200`,
      memberCount: 1
    };
    setCommunities(prev => [...prev, newComm]);
  };

  const handleUpdateCommunity = (updatedComm: Community) => {
    setCommunities(prev => prev.map(c => c.id === updatedComm.id ? updatedComm : c));
    setIsManageModalOpen(false);
  };

  const handleDeleteCommunity = (id: string) => {
    if (confirm('Deseja realmente excluir esta comunidade? Todos os posts nela serão mantidos no feed geral.')) {
      setCommunities(prev => prev.filter(c => c.id !== id));
      if (activeCommunityId === id) {
        setActiveCommunityId(null);
        setCurrentView('home');
      }
      setIsManageModalOpen(false);
    }
  };

  const handleResetData = () => {
    if (confirm("Isso apagará todas as suas postagens e comunidades para liberar espaço. Continuar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const filteredPosts = (Array.isArray(posts) ? posts : []).filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content?.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="hidden md:block w-64 shrink-0">
          <Sidebar 
            communities={communities} 
            activeId={activeCommunityId}
            onSelect={(id) => { setActiveCommunityId(id); setCurrentView('community'); }}
            onCreateCommunity={handleCreateCommunity}
          />
        </div>

        <main className="flex-1 max-w-[640px] min-w-0">
          {activeCommunity && currentView === 'community' && (
            <div className="bg-white rounded-md shadow-sm mb-4 overflow-hidden border border-[#ccc]">
              <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${activeCommunity.banner})` }}></div>
              <div className="px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-white -mt-12 flex items-center justify-center overflow-hidden shadow-md">
                    {activeCommunity.icon && (activeCommunity.icon.startsWith('data:') || activeCommunity.icon.startsWith('http')) ? (
                      <img src={activeCommunity.icon} className="w-full h-full object-cover" alt="Community icon" />
                    ) : (
                      <span className="text-4xl">{activeCommunity.icon || '📁'}</span>
                    )}
                  </div>
                  <div className="mt-1">
                    <h1 className="text-2xl font-bold">r/{activeCommunity.name}</h1>
                    <p className="text-gray-500 text-xs">c/{activeCommunity.slug}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setCommunityToManage(activeCommunity); setIsManageModalOpen(true); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 border border-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Modificar
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-2 rounded border border-[#ccc] mb-4 flex items-center gap-2 shadow-sm">
            <img src={currentUser.avatar} className="w-9 h-9 rounded-full bg-gray-200" alt="me" />
            <input 
              readOnly
              onClick={() => setIsCreateModalOpen(true)}
              placeholder="Criar postagem"
              className="flex-1 bg-[#F6F7F8] border border-[#EDEFF1] hover:bg-white hover:border-[#0079D3] rounded px-4 py-2 text-sm cursor-pointer outline-none transition-colors"
            />
          </div>

          <Feed 
            posts={filteredPosts} 
            onVote={handleVote} 
            onTogglePin={handleTogglePin}
            onDelete={(id) => { if(confirm('Excluir?')) setPosts(posts.filter(p => p.id !== id)); }}
            onAddComment={handleAddComment}
            communities={communities}
          />

          <div className="mt-8 mb-12 text-center">
            <button 
              onClick={handleResetData}
              className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
            >
              Resetar todos os dados (Limpar Armazenamento)
            </button>
          </div>
        </main>

        <div className="hidden lg:block w-[312px] shrink-0">
          <div className="bg-white rounded border border-[#ccc] overflow-hidden sticky top-16 shadow-sm">
            <div className="h-8 bg-[#0079D3]"></div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">P</div>
                <span className="font-bold">Privy Home</span>
              </div>
              <p className="text-sm mb-4 leading-snug text-gray-700">O seu Reddit privado. Aqui você é o dono, o moderador e o usuário único.</p>
              <div className="space-y-2 border-t pt-4">
                <button onClick={() => setIsCreateModalOpen(true)} className="w-full bg-[#0079D3] text-white font-bold py-1.5 rounded-full hover:bg-[#005FA3] transition-colors text-sm shadow-sm">
                  Criar Postagem
                </button>
                <button 
                  onClick={() => { setCommunityToManage(null); setIsManageModalOpen(true); }}
                  className="w-full border border-[#0079D3] text-[#0079D3] font-bold py-1.5 rounded-full hover:bg-blue-50 transition-colors text-sm"
                >
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

      {isManageModalOpen && (
        <ManageCommunityModal 
          onClose={() => setIsManageModalOpen(false)}
          onSubmit={handleUpdateCommunity}
          onDelete={handleDeleteCommunity}
          onCreate={handleCreateCommunity}
          community={communityToManage}
        />
      )}
    </div>
  );
};

export default App;

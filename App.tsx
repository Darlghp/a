
import React, { useState, useEffect } from 'react';
import { User, Post, Community, ViewMode, Comment } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Sidebar from './components/Sidebar.tsx';
import Feed from './components/Feed.tsx';
import CreatePost from './components/CreatePost.tsx';
import ManageCommunityModal from './components/ManageCommunityModal.tsx';
import { loadData, saveData } from './db.ts';

const App: React.FC = () => {
  const [currentUser] = useState<User>({
    id: 'user_1',
    name: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=ff4500',
    karma: 1250
  });

  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [communityToManage, setCommunityToManage] = useState<Community | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Carregamento inicial do IndexedDB
  useEffect(() => {
    const init = async () => {
      try {
        const savedComms = await loadData('communities');
        const savedPosts = await loadData('posts');
        
        if (savedComms.length > 0) {
          setCommunities(savedComms);
        } else {
          // Defaults se estiver vazio
          setCommunities([
            { id: 'c1', name: 'Geral', slug: 'geral', description: 'O lugar para tudo o que importa.', icon: '🏠', banner: 'https://picsum.photos/seed/general/800/200', memberCount: 1 },
            { id: 'c2', name: 'Tecnologia', slug: 'tecnologia', description: 'O futuro é agora.', icon: '💻', banner: 'https://picsum.photos/seed/tech/800/200', memberCount: 1 }
          ]);
        }
        setPosts(savedPosts);
      } catch (e) {
        console.error("Erro ao inicializar DB", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Salvamento automático no IndexedDB quando posts ou comunidades mudam
  useEffect(() => {
    if (!loading) {
      saveData('posts', posts);
    }
  }, [posts, loading]);

  useEffect(() => {
    if (!loading) {
      saveData('communities', communities);
    }
  }, [communities, loading]);

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
    if (confirm('Excluir esta comunidade?')) {
      setCommunities(prev => prev.filter(c => c.id !== id));
      if (activeCommunityId === id) setActiveCommunityId(null);
      setIsManageModalOpen(false);
    }
  };

  const handleResetData = () => {
    if (confirm("Apagar TUDO (incluindo imagens salvas)?")) {
      const request = indexedDB.deleteDatabase('PrivyDB');
      request.onsuccess = () => window.location.reload();
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCommunity = activeCommunityId ? post.communityId === activeCommunityId : true;
    return matchesSearch && matchesCommunity;
  });

  const activeCommunity = communities.find(c => c.id === activeCommunityId);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-[#0079D3]">Carregando seu Privy...</div>;

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
                    {activeCommunity.icon?.startsWith('data:') || activeCommunity.icon?.startsWith('http') ? (
                      <img src={activeCommunity.icon} className="w-full h-full object-cover" alt="Icon" />
                    ) : (
                      <span className="text-4xl">{activeCommunity.icon || '📁'}</span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">r/{activeCommunity.name}</h1>
                    <p className="text-gray-500 text-xs">c/{activeCommunity.slug}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setCommunityToManage(activeCommunity); setIsManageModalOpen(true); }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-300"
                >
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
            <button onClick={handleResetData} className="text-xs text-gray-400 hover:text-red-500 underline">
              Limpar todo o Banco de Dados (IndexedDB)
            </button>
          </div>
        </main>

        <div className="hidden lg:block w-[312px] shrink-0">
          <div className="bg-white rounded border border-[#ccc] overflow-hidden sticky top-16 shadow-sm">
            <div className="h-8 bg-[#0079D3]"></div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
                <span className="font-bold">Privy Home</span>
              </div>
              <p className="text-sm mb-4 leading-snug">Sua rede social privada com armazenamento massivo via IndexedDB.</p>
              <div className="space-y-2 border-t pt-4">
                <button onClick={() => setIsCreateModalOpen(true)} className="w-full bg-[#0079D3] text-white font-bold py-1.5 rounded-full text-sm">Criar Postagem</button>
                <button onClick={() => { setCommunityToManage(null); setIsManageModalOpen(true); }} className="w-full border border-[#0079D3] text-[#0079D3] font-bold py-1.5 rounded-full text-sm">Criar Comunidade</button>
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

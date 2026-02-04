
import React, { useState, useEffect } from 'react';
import { User, Post, Community, ViewMode, Comment } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';

const App: React.FC = () => {
  const [currentUser] = useState<User>({
    id: 'user_1',
    name: 'Administrador',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    karma: 1250
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('privy_communities');
    return saved ? JSON.parse(saved) : [
      { id: 'c1', name: 'Geral', slug: 'geral', description: 'Comunidade para tudo o que importa.', icon: '🌐', banner: 'https://picsum.photos/seed/general/800/200', memberCount: 1 },
      { id: 'c2', name: 'Tecnologia', slug: 'tecnologia', description: 'Discussões sobre o futuro e gadgets.', icon: '💻', banner: 'https://picsum.photos/seed/tech/800/200', memberCount: 1 },
      { id: 'c3', name: 'Fotografia', slug: 'foto', description: 'Compartilhe seus melhores cliques.', icon: '📸', banner: 'https://picsum.photos/seed/photo/800/200', memberCount: 1 }
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

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta postagem?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
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
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
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
    <div className="min-h-screen bg-[#DAE0E6]">
      <Navbar 
        onSearch={setSearchQuery} 
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onGoHome={() => { setCurrentView('home'); setActiveCommunityId(null); }}
        user={currentUser}
      />
      
      <div className="max-w-6xl mx-auto pt-16 flex flex-col md:flex-row gap-6 px-4">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0 order-2 md:order-1">
          <Sidebar 
            communities={communities} 
            activeId={activeCommunityId}
            onSelect={(id) => { setActiveCommunityId(id); setCurrentView('community'); window.scrollTo(0, 0); }}
            onCreateCommunity={handleCreateCommunity}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 order-1 md:order-2">
          {activeCommunity && currentView === 'community' && (
            <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-300">
              <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${activeCommunity.banner})` }}></div>
              <div className="p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-white -mt-12 flex items-center justify-center text-4xl shadow-md">
                  {activeCommunity.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">c/{activeCommunity.name}</h1>
                  <p className="text-gray-500 text-sm">{activeCommunity.description}</p>
                </div>
              </div>
            </div>
          )}

          <Feed 
            posts={filteredPosts} 
            onVote={handleVote} 
            onDelete={handleDeletePost}
            onAddComment={handleAddComment}
            communities={communities}
          />
        </main>

        {/* Right Sidebar - Info */}
        <div className="hidden lg:block w-72 shrink-0 order-3">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-300 sticky top-20">
            <h2 className="font-bold mb-2 flex items-center gap-2">
              <span className="w-4 h-4 bg-orange-600 rounded-full"></span>
              Sobre este Privy
            </h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Bem-vindo ao seu painel de controle. Este é um ambiente 100% privado rodando localmente no seu navegador. Você tem controle total sobre o conteúdo e as comunidades.
            </p>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Postagens</span>
                <span className="font-semibold text-gray-900">{posts.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Comunidades</span>
                <span className="font-semibold text-gray-900">{communities.length}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full mt-6 bg-blue-600 text-white font-bold py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              Criar Postagem
            </button>
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

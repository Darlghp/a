
import React, { useState } from 'react';
import { Post, Community } from '../types';

interface CreatePostProps {
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'timestamp' | 'votes' | 'commentCount'>) => void;
  communities: Community[];
  activeCommunityId?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onSubmit, communities, activeCommunityId }) => {
  const [type, setType] = useState<'text' | 'image'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCommId, setSelectedCommId] = useState(activeCommunityId || communities[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCommId) return;

    onSubmit({
      title,
      content,
      imageUrl: type === 'image' ? imageUrl : undefined,
      type,
      author: 'Administrador',
      communityId: selectedCommId,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#DAE0E6] w-full max-w-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Criar uma postagem</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="mb-4">
            <select 
              className="w-full sm:w-64 bg-white border rounded p-2 text-sm font-bold"
              value={selectedCommId}
              onChange={(e) => setSelectedCommId(e.target.value)}
            >
              <option value="" disabled>Escolha uma comunidade</option>
              {communities.map(c => (
                <option key={c.id} value={c.id}>c/{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg p-2 mb-4">
            <div className="flex border-b">
              <button 
                onClick={() => setType('text')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${type === 'text' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Post
              </button>
              <button 
                onClick={() => setType('image')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${type === 'image' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imagens
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <input 
                className="w-full border rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Título"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
              />

              {type === 'text' ? (
                <textarea 
                  className="w-full border rounded p-2 text-sm min-h-[160px] outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Texto (opcional)"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50">
                    {imageUrl ? (
                      <div className="relative w-full">
                        <img src={imageUrl} className="max-h-64 mx-auto rounded" alt="Preview" />
                        <button 
                          onClick={() => setImageUrl('')}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <input 
                          type="file" 
                          id="image-upload" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                        />
                        <label 
                          htmlFor="image-upload"
                          className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700"
                        >
                          Upload de Imagem
                        </label>
                        <p className="mt-2 text-xs text-gray-400">ou cole o link abaixo</p>
                      </>
                    )}
                  </div>
                  <input 
                    className="w-full border rounded p-2 text-sm outline-none"
                    placeholder="Link da imagem (opcional se fez upload)"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                  />
                </div>
              )}

              <div className="flex justify-end pt-4 gap-3 border-t">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={!title || !selectedCommId}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  Postar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

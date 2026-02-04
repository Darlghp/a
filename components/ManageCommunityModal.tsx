
import React, { useState, useEffect } from 'react';
import { Community } from '../types';

interface ManageCommunityModalProps {
  onClose: () => void;
  onSubmit: (comm: Community) => void;
  onDelete: (id: string) => void;
  onCreate: (name: string, desc: string) => void;
  community: Community | null;
}

const ManageCommunityModal: React.FC<ManageCommunityModalProps> = ({ onClose, onSubmit, onDelete, onCreate, community }) => {
  const [name, setName] = useState(community?.name || '');
  const [slug, setSlug] = useState(community?.slug || '');
  const [description, setDescription] = useState(community?.description || '');
  const [icon, setIcon] = useState(community?.icon || '🌐');
  const [banner, setBanner] = useState(community?.banner || 'https://picsum.photos/seed/new/800/200');

  useEffect(() => {
    if (community) {
      setName(community.name);
      setSlug(community.slug);
      setDescription(community.description);
      setIcon(community.icon);
      setBanner(community.banner);
    }
  }, [community]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (community) {
      onSubmit({
        ...community,
        name,
        slug,
        description,
        icon,
        banner
      });
    } else {
      onCreate(name, description);
      onClose();
    }
  };

  const isImageIcon = icon.startsWith('data:') || icon.startsWith('http');

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="bg-[#EDEFF1] p-4 border-b flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            {community ? 'Configurações da Comunidade' : 'Criar uma Comunidade'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 p-1 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-xs font-bold mb-2 text-gray-700">NOME DA COMUNIDADE</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400 font-bold">r/</span>
              <input 
                className="w-full border border-gray-300 rounded p-2 pl-7 text-sm outline-none focus:border-[#0079D3] transition-colors"
                placeholder="nome_da_comunidade"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-gray-700">DESCRIÇÃO</label>
            <textarea 
              className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-[#0079D3] min-h-[80px]"
              placeholder="Fale sobre o que é esta comunidade..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2 text-gray-700">ÍCONE (FOTO OU EMOJI)</label>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden shrink-0">
                  {isImageIcon ? (
                    <img src={icon} className="w-full h-full object-cover" alt="Icon preview" />
                  ) : (
                    <span className="text-2xl">{icon}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <input 
                    className="w-full border border-gray-300 rounded p-1 text-xs outline-none focus:border-[#0079D3]"
                    value={icon}
                    placeholder="Emoji ou URL"
                    onChange={e => setIcon(e.target.value)}
                  />
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-[10px] font-bold py-1 px-2 rounded text-center border border-gray-300 transition-colors">
                    Upload Foto
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setIcon)} />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 text-gray-700">SLUG DA URL</label>
              <input 
                className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-[#0079D3]"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2 text-gray-700">BANNER DA COMUNIDADE</label>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-100 border rounded overflow-hidden">
                <img src={banner} className="w-full h-full object-cover" alt="Banner preview" />
              </div>
              <div className="flex gap-2">
                <input 
                  className="flex-1 border border-gray-300 rounded p-2 text-xs outline-none focus:border-[#0079D3]"
                  placeholder="URL do Banner"
                  value={banner}
                  onChange={e => setBanner(e.target.value)}
                />
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-[10px] font-bold py-2 px-3 rounded text-center border border-gray-300 transition-colors whitespace-nowrap flex items-center">
                  Mudar Foto
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setBanner)} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex flex-col gap-3">
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-[#0079D3] text-[#0079D3] rounded-full text-sm font-bold hover:bg-blue-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-[#0079D3] text-white rounded-full text-sm font-bold hover:bg-[#005FA3] transition-colors shadow-sm"
              >
                {community ? 'Salvar Alterações' : 'Criar Comunidade'}
              </button>
            </div>

            {community && (
              <button 
                type="button"
                onClick={() => onDelete(community.id)}
                className="w-full mt-2 text-xs font-bold text-red-500 hover:text-red-700 p-2 border border-transparent hover:border-red-50 rounded transition-colors"
              >
                Excluir Comunidade Permanentemente
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageCommunityModal;

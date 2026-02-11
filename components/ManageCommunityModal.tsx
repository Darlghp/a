
import React, { useState, useEffect } from 'react';
import { Community } from '../types';
import { resizeImage } from '../db.ts';

interface ManageCommunityModalProps {
  onClose: () => void;
  onSubmit: (comm: Community) => void;
  onDelete: (id: string) => void;
  onCreate: (name: string, desc: string, icon: string, banner: string) => void;
  community: Community | null;
}

const ManageCommunityModal: React.FC<ManageCommunityModalProps> = ({ onClose, onSubmit, onDelete, onCreate, community }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🌐');
  const [banner, setBanner] = useState('https://picsum.photos/seed/new/800/200');
  const [processing, setProcessing] = useState(false);

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
      setProcessing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resized = await resizeImage(reader.result as string, 800, 800);
        setter(resized);
        setProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || processing) return;

    if (community) {
      onSubmit({ ...community, name, slug, description, icon, banner });
    } else {
      onCreate(name, description, icon, banner);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="bg-[#EDEFF1] p-4 border-b flex justify-between items-center font-bold text-gray-700">
          <h2 className="text-sm uppercase tracking-wider">{community ? 'Configurações' : 'Nova Comunidade'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-200 p-1 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-xs font-bold mb-2">NOME</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400 font-bold">r/</span>
              <input className="w-full border rounded p-2 pl-7 text-sm outline-none focus:border-[#0079D3]" required value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">DESCRIÇÃO</label>
            <textarea className="w-full border rounded p-2 text-sm outline-none min-h-[80px]" value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2 text-gray-700">ÍCONE</label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border bg-gray-50 flex items-center justify-center overflow-hidden">
                  {icon.startsWith('data:') || icon.startsWith('http') ? <img src={icon} className="w-full h-full object-cover" /> : <span className="text-xl">{icon}</span>}
                </div>
                <label className="cursor-pointer bg-gray-100 px-2 py-1 rounded text-[10px] font-bold border">Upload<input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setIcon)} /></label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2">SLUG</label>
              <input className="w-full border rounded p-2 text-sm outline-none" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">BANNER</label>
            <div className="w-full h-20 bg-gray-100 border rounded overflow-hidden mb-2">
              <img src={banner} className="w-full h-full object-cover" />
            </div>
            <label className="cursor-pointer bg-gray-100 px-4 py-1.5 rounded text-xs font-bold border block text-center">Mudar Banner<input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setBanner)} /></label>
          </div>

          <div className="pt-4 border-t flex flex-col gap-3">
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-[#0079D3] text-[#0079D3] rounded-full text-sm font-bold">Cancelar</button>
              <button type="submit" disabled={processing} className="px-6 py-2 bg-[#0079D3] text-white rounded-full text-sm font-bold disabled:opacity-50">{processing ? 'Processando...' : community ? 'Salvar' : 'Criar'}</button>
            </div>
            {community && <button type="button" onClick={() => onDelete(community.id)} className="text-xs font-bold text-red-500 hover:underline">Excluir Comunidade</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageCommunityModal;

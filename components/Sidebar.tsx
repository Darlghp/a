
import React, { useState } from 'react';
import { Community } from '../types';

interface SidebarProps {
  communities: Community[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onCreateCommunity: (name: string, desc: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ communities, activeId, onSelect, onCreateCommunity }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <aside className="sticky top-16 space-y-4">
      <div className="text-[#1A1A1B]">
        <h2 className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Feeds</h2>
        <button 
          onClick={() => onSelect(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[#E8EAEB] transition-colors text-sm ${activeId === null ? 'bg-[#E8EAEB] font-bold' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Início
        </button>
      </div>
      
      <div>
        <h2 className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex justify-between items-center">
          Comunidades
          <button onClick={() => setShowCreate(!showCreate)} className="p-1 hover:bg-gray-200 rounded text-gray-900">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </h2>

        {showCreate && (
          <div className="px-3 py-2 space-y-2 bg-white border border-[#ccc] rounded m-2 shadow-sm">
            <input 
              className="w-full text-xs border rounded p-1.5 outline-none" 
              placeholder="Nome r/"
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (onCreateCommunity(newName, ''), setNewName(''), setShowCreate(false))}
            />
            <button 
              onClick={() => { onCreateCommunity(newName, ''); setNewName(''); setShowCreate(false); }}
              className="w-full bg-[#0079D3] text-white text-[10px] font-bold py-1 rounded"
            >
              Confirmar
            </button>
          </div>
        )}

        <div className="space-y-0.5">
          {communities.map((c) => (
            <button 
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[#E8EAEB] transition-colors text-sm truncate ${activeId === c.id ? 'bg-[#E8EAEB] font-bold' : ''}`}
            >
              <span className="text-lg w-5 text-center">{c.icon}</span>
              r/{c.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

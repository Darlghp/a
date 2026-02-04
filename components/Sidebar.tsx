
import React from 'react';
import { Community } from '../types';

interface SidebarProps {
  communities: Community[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onCreateCommunity: (name: string, desc: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ communities, activeId, onSelect }) => {
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
          Minhas Comunidades
        </h2>

        <div className="space-y-0.5 mt-1">
          {communities.length === 0 ? (
            <p className="px-3 py-2 text-[10px] text-gray-400 italic">Nenhuma comunidade ainda.</p>
          ) : (
            communities.map((c) => (
              <button 
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[#E8EAEB] transition-colors text-sm truncate ${activeId === c.id ? 'bg-[#E8EAEB] font-bold' : ''}`}
              >
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-gray-100">
                  {c.icon.startsWith('data:') || c.icon.startsWith('http') ? (
                    <img src={c.icon} className="w-full h-full object-cover" alt="icon" />
                  ) : (
                    <span className="text-sm">{c.icon}</span>
                  )}
                </div>
                <span className="truncate flex-1 text-left">r/{c.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


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
  const [newDesc, setNewDesc] = useState('');

  return (
    <aside className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Suas Comunidades</h2>
      </div>
      
      <div className="py-2">
        <button 
          onClick={() => onSelect(null)}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-3 ${activeId === null ? 'bg-gray-100 border-l-4 border-orange-600' : ''}`}
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Página Inicial</span>
        </button>

        {communities.map((c) => (
          <button 
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-3 ${activeId === c.id ? 'bg-gray-100 border-l-4 border-orange-600' : ''}`}
          >
            <span className="text-xl">{c.icon}</span>
            <span className="truncate flex-1 font-medium">c/{c.name}</span>
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        {!showCreate ? (
          <button 
            onClick={() => setShowCreate(true)}
            className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-full hover:bg-blue-100 text-sm transition-colors"
          >
            Nova Comunidade
          </button>
        ) : (
          <div className="space-y-2">
            <input 
              className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" 
              placeholder="Nome"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <input 
              className="w-full text-sm border rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none" 
              placeholder="Descrição"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (newName) {
                    onCreateCommunity(newName, newDesc);
                    setNewName('');
                    setNewDesc('');
                    setShowCreate(false);
                  }
                }}
                className="flex-1 bg-blue-600 text-white text-xs font-bold py-1 rounded"
              >
                Criar
              </button>
              <button 
                onClick={() => setShowCreate(false)}
                className="flex-1 bg-gray-200 text-gray-700 text-xs font-bold py-1 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;


import React from 'react';
import { User } from '../types';

interface NavbarProps {
  onSearch: (q: string) => void;
  onOpenCreate: () => void;
  onGoHome: () => void;
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenCreate, onGoHome, user }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-gray-300 flex items-center px-4 gap-4 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          P
        </div>
        <span className="hidden sm:inline font-bold text-lg tracking-tight">privy</span>
      </div>

      <div className="flex-1 max-w-2xl mx-auto flex items-center bg-gray-100 border border-transparent focus-within:border-blue-500 focus-within:bg-white rounded-full px-4 h-9">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          placeholder="Pesquisar no Privy" 
          className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none px-2"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenCreate}
          className="p-1 sm:px-4 sm:py-1 rounded-full text-gray-700 hover:bg-gray-100 flex items-center gap-1 transition-colors"
        >
          <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline font-medium">Criar</span>
        </button>
        
        <div className="flex items-center gap-2 ml-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
          <img src={user.avatar} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200" alt="Avatar" />
          <div className="hidden lg:block text-xs">
            <p className="font-bold">{user.name}</p>
            <p className="text-gray-500">{user.karma} karma</p>
          </div>
          <svg className="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

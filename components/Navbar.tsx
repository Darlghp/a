
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
    <nav className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-[#ccc] flex items-center px-5 gap-4 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
        <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center text-white font-bold text-2xl">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm4.5 11.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zM10 14c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm-4.5-2.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"/>
          </svg>
        </div>
        <span className="hidden lg:inline font-bold text-xl tracking-tighter">reddit<span className="font-normal">privy</span></span>
      </div>

      <div className="flex-1 max-w-[700px] flex items-center bg-[#F6F7F8] border border-[#EDEFF1] hover:bg-white hover:border-[#0079D3] rounded-full px-3 h-9 transition-colors">
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
        <button onClick={onOpenCreate} className="p-2 hover:bg-gray-100 rounded text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer hover:border-[#ccc] border border-transparent p-1 rounded-sm">
          <img src={user.avatar} className="w-6 h-6 rounded bg-gray-200" alt="Avatar" />
          <div className="hidden md:block">
            <p className="text-[10px] font-bold leading-tight">{user.name}</p>
            <p className="text-[10px] text-gray-400 leading-tight">1.2k karma</p>
          </div>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

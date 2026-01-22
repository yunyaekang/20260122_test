
import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">AI AutoScan</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <span className="text-sm font-medium text-slate-500">업무 자동화 자가 진단 서비스</span>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full h-full">
          {children}
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 AI AutoScan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

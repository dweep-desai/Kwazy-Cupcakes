import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              J
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              JanSetu
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium text-slate-700 leading-none">
                    {user.role.name.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 font-mono">
                    {user.aadhar}
                  </span>
                </div>
                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-medium border border-slate-200">
                  {user.role.name[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-sm text-slate-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

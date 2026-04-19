import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-primary rounded-lg flex-center">
            <span className="text-[#064e3b] font-bold">N</span>
          </div>
          <span className="text-xl font-bold gradient-text">NutriTrack</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className={`text-sm font-medium no-underline transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>Dashboard</Link>
          <Link to="/meal-log" className={`text-sm font-medium no-underline transition-colors ${isActive('/meal-log') ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>Meal Log</Link>
          <Link to="/food-search" className={`text-sm font-medium no-underline transition-colors ${isActive('/food-search') ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>Foods</Link>
          <Link to="/analytics" className={`text-sm font-medium no-underline transition-colors ${isActive('/analytics') ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>Analytics</Link>
          <Link to="/profile" className={`flex-center w-10 h-10 rounded-full border border-border overflow-hidden hover:border-primary transition-all ${isActive('/profile') ? 'border-primary' : ''}`}>
            <div className="w-full h-full bg-slate-800 flex-center text-xs font-bold uppercase">{user.name.charAt(0)}</div>
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-outline py-2 px-4 text-xs">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

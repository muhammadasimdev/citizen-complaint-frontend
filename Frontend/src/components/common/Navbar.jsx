import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Search, PlusCircle, Activity, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseMark } from '../ui/PulseMark';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const role = user ? (user.role || 'citizen') : null;

  const links = (() => {
    if (role === 'officer' || role === 'admin') {
      return [
        { to: '/officer-dashboard', label: 'Officer Dashboard', icon: Activity },
        { to: '/browse', label: 'Browse Issues', icon: Search },
      ];
    }
    if (role === 'citizen') {
      return [
        { to: '/browse', label: 'Browse Issues', icon: Search },
        { to: '/my-complaints', label: 'My Complaints', icon: Activity },
      ];
    }
    return [{ to: '/browse', label: 'Browse Issues', icon: Search }];
  })();

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <PulseMark size={34} />
              <span className="font-bold text-lg text-[#16211c] tracking-tight">Civic Pulse</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} current={location.pathname} icon={<link.icon className="w-4 h-4" />}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === 'citizen' && (
              <Link
                to="/report"
                className="hidden md:flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" /> Report Issue
              </Link>
            )}

            {user ? (
              <div className="hidden md:flex items-center gap-3 pl-3 border-l border-stone-200">
                <div className="text-right leading-tight">
                  <div className="text-sm font-semibold text-[#16211c]">{user.username}</div>
                  <div className="text-[11px] font-medium text-emerald-700 capitalize">{role}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-[#16211c] hover:bg-stone-100 text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                  Sign up
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-[#16211c] hover:bg-stone-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-stone-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === link.to ? 'bg-emerald-50 text-emerald-800' : 'text-[#16211c] hover:bg-stone-100'
                  }`}
                >
                  <link.icon className="w-4 h-4" /> {link.label}
                </Link>
              ))}

              {role === 'citizen' && (
                <Link
                  to="/report"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white"
                >
                  <PlusCircle className="w-4 h-4" /> Report Issue
                </Link>
              )}

              <div className="pt-3 mt-3 border-t border-stone-200">
                {user ? (
                  <div className="flex items-center justify-between px-3">
                    <div>
                      <div className="text-sm font-semibold text-[#16211c]">{user.username}</div>
                      <div className="text-[11px] font-medium text-emerald-700 capitalize">{role}</div>
                    </div>
                    <button onClick={handleLogout} className="text-sm font-semibold text-rose-600 flex items-center gap-1.5">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 px-1">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-stone-200">
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, current, children, icon }) {
  const active = current === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
        active ? 'text-emerald-800' : 'text-stone-500 hover:text-[#16211c] hover:bg-stone-100'
      }`}
    >
      {active && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-emerald-50 rounded-lg -z-10" />}
      {icon}
      {children}
    </Link>
  );
}

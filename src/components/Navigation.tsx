import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, User, Menu, X, Calendar, LogOut, ChevronRight } from 'lucide-react';
import { AuthUser } from '../types';

interface NavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export function Navigation({ currentRoute, onNavigate, user, onLogout }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Streamlined navigation tabs: Clean and focused when user is signed in vs public
  const navItems = user
    ? [
        { label: 'Concierge', route: '/experience' },
        { label: 'Booking', route: '/booking' },
        { label: 'My Bookings', route: '/my-bookings' },
      ]
    : [
        { label: 'Experience', route: '/experience' },
        { label: 'Booking', route: '/booking' },
        { label: 'Technology', route: '/technology' },
        { label: 'About', route: '/about' },
      ];

  return (
    <header
      id="aria-global-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080b]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Left */}
          <button
            id="nav-brand-logo"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 p-[1px] transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#08080b] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-white transition-colors">
                ARIA
              </span>
              <span className="block font-mono text-[9px] tracking-[0.2em] uppercase text-zinc-400 -mt-1">
                CONCIERGE
              </span>
            </div>
          </button>

          {/* Center Links (Desktop) */}
          <nav id="nav-center-menu" className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/10 p-1.5 rounded-full backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.label.toLowerCase()}`}
                  onClick={() => onNavigate(item.route)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-normal transition-all ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-white/15 border border-white/20 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-talk-to-aria-cta"
              onClick={() => onNavigate('/experience')}
              className="px-5 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
            >
              <Mic className="w-3.5 h-3.5 text-black animate-pulse" />
              <span>TALK TO ARIA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Account Icon / Dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    id="nav-account-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-950 border border-white/10 shadow-2xl p-1.5 z-50 backdrop-blur-xl"
                      >
                        <div className="px-3 py-2 border-b border-white/5">
                          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                        </div>
                        <button
                          id="nav-user-profile"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('/profile');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>
                        <button
                          id="nav-user-bookings"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('/my-bookings');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>My Bookings</span>
                        </button>
                        <button
                          id="nav-user-logout"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('/login')}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-medium text-zinc-300 hover:text-white"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="nav-mobile-talk-btn"
              onClick={() => onNavigate('/experience')}
              className="px-3 py-1.5 rounded-full bg-white text-black text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow"
            >
              <Mic className="w-3 h-3 text-black" />
              <span>TALK</span>
            </button>
            <button
              id="nav-mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-zinc-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-3 rounded-2xl bg-zinc-950/95 border border-white/10 backdrop-blur-2xl p-4 shadow-2xl overflow-hidden"
            >
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = currentRoute === item.route;
                  return (
                    <button
                      key={item.route}
                      onClick={() => {
                        onNavigate(item.route);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

                <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="px-3 py-1 text-xs text-zinc-400">
                        Signed in as <span className="text-white font-semibold">{user.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('/my-bookings');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5"
                      >
                        My Bookings
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/profile');
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onNavigate('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Login / Sign Up</span>
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

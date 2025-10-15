import React, { useState } from 'react';

interface NavbarProps {
  user?: {
    email: string;
    role: 'admin' | 'user';
  } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    onLogout?.();
  };

  return (
    <nav className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Ekstraklasa-inspired logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg border-2 border-primary-foreground/20">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-1 bg-primary-foreground rounded-full mb-1"></div>
                    <div className="flex space-x-0.5">
                      <div className="w-1 h-3 bg-primary-foreground rounded-full"></div>
                      <div className="w-1 h-3 bg-primary-foreground rounded-full"></div>
                      <div className="w-1 h-3 bg-primary-foreground rounded-full"></div>
                      <div className="w-1 h-3 bg-primary-foreground rounded-full"></div>
                    </div>
                  </div>
                </div>
                {/* Polish flag accent */}
                <div className="absolute -top-1 -right-1 w-3 h-2 bg-accent rounded-sm border border-accent-foreground/30"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-foreground leading-tight">Fantasy</h1>
                <p className="text-sm font-semibold text-primary -mt-1">Ekstraklasa</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {user && (
              <>
                <a
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </a>
                {user.role === 'admin' && (
                  <a
                    href="/admin"
                    className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Admin Panel
                  </a>
                )}
              </>
            )}
          </div>

          {/* Profile Menu */}
          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="ml-2 text-foreground hidden md:block">{user.email}</span>
                  <svg
                    className={`ml-1 h-5 w-5 text-muted-foreground transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg py-1 z-10 border border-border">
                    <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                      Signed in as {user.role}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent focus:outline-none focus:bg-accent"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {user && (
        <div className="sm:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent"
            >
              Dashboard
            </a>
            {user.role === 'admin' && (
              <a
                href="/admin"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent"
              >
                Admin Panel
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

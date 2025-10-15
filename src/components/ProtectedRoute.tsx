import React, { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual authentication check
    // This is a mock implementation
    const checkAuth = async () => {
      try {
        // Simulate API call to check authentication
        const mockUser: User | null = null; // Set to null for unauthenticated, or provide mock user

        setUser(mockUser);

        if (!mockUser) {
          // Not authenticated
          window.location.href = redirectTo;
          return;
        }

        if (requiredRole && mockUser.role !== requiredRole) {
          // Not authorized for required role
          window.location.href = '/dashboard'; // Redirect to user dashboard
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = redirectTo;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

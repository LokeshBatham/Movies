"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      router.push('/');
    }
  };

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/');
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    login,
    logout,
    requireAuth,
    isAuthenticated: !!user
  };
}

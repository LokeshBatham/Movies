"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

export default function SignIn() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/movies');
    }
  }, [user, router]);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the login function from useAuth hook
        login(data.user, data.token);
        
        // Redirect to movies page
        router.push('/movies');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if checking authentication
  if (authLoading) {
    return (
      <div className='logindiv back'>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className='logindiv back'>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Sign in</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md items-center px-4">
        <input 
          className='input w-full text-sm md:text-base' 
          placeholder='Email' 
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input 
          className='input w-full text-sm md:text-base' 
          placeholder='Password'  
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        {error && (
          <div className="text-red-400 text-xs md:text-sm text-center w-full">
            {error}
          </div>
        )}

        <button 
          className='login-button w-full text-sm md:text-base' 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Demo credentials */}
      {/* <div className="mt-4 text-center text-sm text-gray-300">
        <p>Demo credentials:</p>
        <p>Email: admin@example.com | Password: password123</p>
        <p>Email: user@example.com | Password: user123</p>
      </div> */}
    </div>
  );
}

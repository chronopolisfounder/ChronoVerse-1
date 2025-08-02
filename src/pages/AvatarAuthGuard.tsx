import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AvatarProfile from '@/pages/AvatarProfile';

export default function AvatarAuthGuard() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session))
      .catch(err => {
        console.error('Session fetch error:', err);
        setMessage('❌ Unable to connect—check your network.');
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) navigate('/avatar-profile', { replace: true });
      }
    );
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('Logging in…');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`❌ ${error.message}`);
    } catch (err: any) {
      console.error('Login error:', err);
      setMessage('❌ Failed to fetch—network or CORS issue.');
    }
  }

  async function handleGoogleSignIn() {
    setMessage('Signing in with Google…');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/avatar-profile`
        }
      });
      
      if (error) {
        console.error('Google Sign-In Error:', error);
        setMessage(`❌ Google Sign-In Failed: ${error.message}`);
      }
    } catch (err: any) {
      console.error('Google Sign-In Catch Error:', err);
      setMessage('❌ Unable to initiate Google Sign-In');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-default)' }}>
        <div className="w-full max-w-sm p-6 bg-[var(--bg-glass)] glass rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Avatar Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="w-full p-2 rounded bg-[var(--primary)] text-white">
              Log In
            </button>
          </form>
          
          {/* Google Sign-In Button */}
          <div className="mt-4">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full p-2 rounded bg-white text-gray-700 border border-gray-300 flex items-center justify-center"
            >
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google logo" 
                className="w-6 h-6 mr-2"
              />
              Sign in with Google
            </button>
          </div>
          
          {message && <p className="mt-4 text-center">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <button onClick={handleLogout} className="p-2 rounded bg-[var(--primary)] text-white">
          Logout
        </button>
      </div>
      <AvatarProfile />
    </>
  );
}
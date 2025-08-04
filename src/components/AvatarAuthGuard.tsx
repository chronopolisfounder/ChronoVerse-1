import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AvatarProfile from '@/pages/AvatarProfile';

const AvatarAuthGuard: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser]         = useState<User | null>(null);
  const [loading, setLoading]   = useState(true);
  const [avatarName, setAvatarName] = useState('');
  const [bio, setBio]               = useState('');
  const [updating, setUpdating]     = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Determine if user needs to fill out avatarName + bio
  const needsProfileCompletion =
    user &&
    (!user.user_metadata?.avatarName || !user.user_metadata?.bio);

  // 1) Update profile metadata (avatarName & bio)
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !avatarName.trim() || !bio.trim()) return;

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatarName: avatarName.trim(), bio: bio.trim() }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setUpdating(false);
    }
  };

  // 2) Sign in with email/password
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email    = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error('Login error:', error.message);
    } catch (err) {
      console.error('Login exception:', err);
    }
  };

  // 3) OAuth sign-in (Google / GitHub)
  const handleOAuth = (provider: 'google' | 'github') => {
    supabase.auth.signInWithOAuth({ provider });
  };

  // 4) Email sign-up prompt
  const handleSignUp = () => {
    const email    = prompt('Enter your email for sign up:');
    const password = prompt('Enter your password:');
    if (email && password) {
      supabase.auth.signUp({
        email,
        password,
        options: {
          // Supabase will use your Dashboard Site URL & Redirect URLs
          emailRedirectTo: `${window.location.origin}/avatar-profile`
        }
      });
    }
  };

  // 5) Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Not signed in → login / OAuth / sign-up
  if (!session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.8))',
             backdropFilter: 'blur(20px)'
           }}>
        <Card className="w-full max-w-md glass-card border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl neon-text">ChronoVerse Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => handleOAuth('google')} className="w-full btn-neon">
              Continue with Google
            </Button>
            <Button onClick={() => handleOAuth('github')} className="w-full btn-neon" variant="outline">
              Continue with GitHub
            </Button>

            <div className="relative my-4">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-accent/20" />
              </span>
              <span className="relative flex justify-center text-xs uppercase bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="text-center mt-2">
              <Button variant="link" onClick={handleSignUp}>
                Don't have an account? Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Signed in but profile incomplete → complete profile form
  if (needsProfileCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.8))',
             backdropFilter: 'blur(20px)'
           }}>
        <Card className="w-full max-w-md glass-card border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl neon-text">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="avatarName">Avatar Name</Label>
                <Input
                  id="avatarName"
                  value={avatarName}
                  onChange={e => setAvatarName(e.target.value)}
                  placeholder="Enter your avatar name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-neon" disabled={updating}>
                {updating ? 'Saving...' : 'Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fully signed in & profile complete → show AvatarProfile
  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <Button onClick={handleLogout} className="p-2 rounded bg-[var(--primary)] text-white">
          Logout
        </Button>
      </div>
      <AvatarProfile />
    </>
  );
};

export default AvatarAuthGuard;

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
// src/components/AvatarAuthGuard.tsx
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import AvatarProfile from '@/pages/AvatarProfile'   // ← exact filename & casing
<<<<<<< HEAD

const AvatarAuthGuard = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarName, setAvatarName] = useState('')
  const [bio, setBio]         = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })
=======

const AvatarAuthGuard = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarName, setAvatarName] = useState('')
  const [bio, setBio]         = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !avatarName.trim() || !bio.trim()) return

    setUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatarName: avatarName.trim(), bio: bio.trim() }
      })
      if (error) throw error
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setUpdating(false)
    }
  }

  const needsProfileCompletion = user &&
    (!user.user_metadata?.avatarName || !user.user_metadata?.bio)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent" />
      </div>
    )
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
        backdropFilter: 'blur(20px)'
      }}>
=======
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
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

<<<<<<< HEAD
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !avatarName.trim() || !bio.trim()) return
=======
  // Determine if user needs to fill out avatarName + bio
  const needsProfileCompletion =
    user &&
    (!user.user_metadata?.avatarName || !user.user_metadata?.bio);

  // 1) Update profile metadata (avatarName & bio)
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !avatarName.trim() || !bio.trim()) return;
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14

    setUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatarName: avatarName.trim(), bio: bio.trim() }
<<<<<<< HEAD
      })
      if (error) throw error
    } catch (err) {
      console.error('Error updating profile:', err)
=======
      });
      if (error) throw error;
    } catch (err) {
      console.error('Error updating profile:', err);
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
    } finally {
      setUpdating(false)
    }
  }

<<<<<<< HEAD
  const needsProfileCompletion = user &&
    (!user.user_metadata?.avatarName || !user.user_metadata?.bio)
=======
  // 2) Sign in with email/password
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email    = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14

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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent" />
      </div>
    )
  }

  // Not signed in → login / OAuth / sign-up
  if (!session || !user) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
        backdropFilter: 'blur(20px)'
      }}>
=======
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,20,0.8))',
             backdropFilter: 'blur(20px)'
           }}>
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
        <Card className="w-full max-w-md glass-card border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl neon-text">ChronoVerse Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
<<<<<<< HEAD
            <div className="space-y-4">
              <Button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                className="w-full btn-neon"
              >
                Continue with Google
              </Button>
              <Button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
                className="w-full btn-neon"
                variant="outline"
              >
                Continue with GitHub
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-accent/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                const email = form.get('email') as string
                const password = form.get('password') as string
                supabase.auth.signInWithPassword({ email, password })
              }}
              className="space-y-4"
            >
<<<<<<< HEAD
=======
=======
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
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
<<<<<<< HEAD
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  const email = prompt('Enter email for sign up:')
                  const password = prompt('Enter password:')
                  if (email && password) {
                    supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
                  }
                }}
              >
                Don&apos;t have an account? Sign up
=======
<<<<<<< HEAD
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  const email = prompt('Enter email for sign up:')
                  const password = prompt('Enter password:')
                  if (email && password) {
                    supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
                  }
                }}
              >
                Don&apos;t have an account? Sign up
=======
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="text-center mt-2">
              <Button variant="link" onClick={handleSignUp}>
                Don't have an account? Sign up
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
    )
  }

  if (needsProfileCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
        backdropFilter: 'blur(20px)'
      }}>
<<<<<<< HEAD
=======
=======
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
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14
              <Button
                type="submit"
                className="w-full btn-neon"
                disabled={updating || !avatarName.trim() || !bio.trim()}
              >
=======
              <Button type="submit" className="w-full btn-neon" disabled={updating}>
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
                {updating ? 'Saving...' : 'Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
<<<<<<< HEAD
    )
  }

  return <AvatarProfile />
}

export default AvatarAuthGuard
=======
<<<<<<< HEAD
    )
  }

  return <AvatarProfile />
}

export default AvatarAuthGuard
=======
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
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5
>>>>>>> 922fa4431cde738da585f32df9c3d1338134be14

are you sure?  import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AvatarProfile from '@/pages/AvatarProfile';

const AvatarAuthGuard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarName, setAvatarName] = useState('');
  const [bio, setBio] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !avatarName.trim() || !bio.trim()) return;

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          avatarName: avatarName.trim(),
          bio: bio.trim()
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  const needsProfileCompletion = user && 
    (!user.user_metadata?.avatarName || !user.user_metadata?.bio);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" 
           style={{ 
             background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
             backdropFilter: 'blur(20px)'
           }}>
        <Card className="w-full max-w-md glass-card border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl neon-text">ChronoVerse Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              supabase.auth.signInWithPassword({ email, password });
            }} className="space-y-4">
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
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => {
                  const email = prompt('Enter your email for sign up:');
                  const password = prompt('Enter your password:');
                  if (email && password) {
                    supabase.auth.signUp({ 
                      email, 
                      password,
                      options: {
                        emailRedirectTo: `${window.location.origin}/`
                      }
                    });
                  }
                }}
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (needsProfileCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{ 
             background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
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
                  onChange={(e) => setAvatarName(e.target.value)}
                  placeholder="Enter your avatar name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full btn-neon"
                disabled={updating || !avatarName.trim() || !bio.trim()}
              >
                {updating ? 'Saving...' : 'Complete Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AvatarProfile />;
};

export default AvatarAuthGuard;
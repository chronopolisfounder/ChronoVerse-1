<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User as UserIcon, 
  Palette,
  Activity,
  Heart,
  Brain,
  Zap,
  Shield,
  Settings,
  Camera,
  Edit
} from 'lucide-react';
import GlowingAvatar from '@/components/GlowingAvatar';
import { User } from '@/entities/User';

// Render a simple SVG avatar based on config
const generateAvatarSVG = (config) => {
  const skinTones = ['#F5DEB3', '#DEB887', '#CD853F', '#A0522D', '#8B4513', '#654321'];
  const hairColors = ['#000000', '#8B4513', '#DAA520', '#FF6347', '#9370DB', '#00CED1'];
  const eyeColors = ['#000000', '#8B4513', '#228B22', '#4169E1', '#9370DB'];
  const { skinTone, hairColor, eyeColor } = config;
  return (
    <svg width="200" height="240" viewBox="0 0 200 240" className="mx-auto">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.2)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0.05)" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill="url(#bgGrad)" rx="20" />
      <ellipse cx="100" cy="80" rx="45" ry="50" fill={skinTones[skinTone-1]} />
      <path d="M55 60 Q100 30 145 60 Q145 45 100 40 Q55 45 55 60 Z" fill={hairColors[hairColor-1]} />
      <ellipse cx="85" cy="75" rx="5" ry="7" fill="white" />
      <ellipse cx="115" cy="75" rx="5" ry="7" fill="white" />
      <circle cx="85" cy="75" r="3" fill={eyeColors[eyeColor-1]} />
      <circle cx="115" cy="75" r="3" fill={eyeColors[eyeColor-1]} />
    </svg>
  );
};

const AvatarProfile: React.FC = () => {
  const [user, setUser] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState({ skinTone: 3, hairColor: 1, eyeColor: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const biometricData = useMemo(() => [
    { label: 'Neural Activity', value: 87, color: 'text-blue-400' },
    { label: 'Cardiac Rhythm', value: 72, color: 'text-red-400' },
    { label: 'Energy Level', value: 94, color: 'text-yellow-400' },
    { label: 'Stress Index', value: 23, color: 'text-green-400' },
  ], []);
  const avatarStats = useMemo(() => [
    { label: 'Level', value: '42', icon: Zap },
    { label: 'Experience', value: '15,420 XP', icon: Activity },
    { label: 'Reputation', value: '9.2/10', icon: Shield },
    { label: 'Missions', value: '127', icon: UserIcon },
  ], []);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await User.me();
        setUser(me);
        if (me.avatar_config) setAvatarConfig(me.avatar_config);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const saveAvatar = async () => {
    setSaving(true);
    await User.updateMyUserData({ avatar_config: avatarConfig });
    setSaving(false);
  };

  if (loading) return null;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      {/* Profile Header */}
      <div className="relative glass-card theme-shape p-8 overflow-hidden" style={{ backgroundImage: `url(/lovable-uploads/756d965b-2bd7-4327-af75-be0075afe937.png)`, backgroundSize:'cover', backgroundPosition:'center', backgroundBlendMode:'multiply' }}>
        <div className="absolute inset-0 bg-accent/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-32 h-32">
            <GlowingAvatar size={128} />
            <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 btn-neon" onClick={() => { /* trigger file upload */ }}>
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2 neon-text">{user?.name || 'ChronoNaut_042'}</h1>
            <p className="text-muted-foreground mb-4">Elite Time Traveler • Dimensional Explorer • Protocol Specialist</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="secondary" className="bg-accent/20">Level 42</Badge>
              <Badge variant="secondary" className="bg-primary/20">Elite Status</Badge>
              <Badge variant="secondary" className="bg-secondary/20">Verified</Badge>
            </div>
          </div>
          <Button className="btn-neon"><Edit className="w-4 h-4 mr-2"/>Customize Avatar</Button>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass border-accent/20">
          <TabsTrigger value="appearance" className="flex items-center space-x-2"><Palette className="w-4 h-4"/><span>Appearance</span></TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center space-x-2"><Activity className="w-4 h-4"/><span>Stats</span></TabsTrigger>
          <TabsTrigger value="biometrics" className="flex items-center space-x-2"><Heart className="w-4 h-4"/><span>Biometrics</span></TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2"><Settings className="w-4 h-4"/><span>Settings</span></TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-accent/20">
              <CardHeader><CardTitle>3D Avatar Viewer</CardTitle><CardDescription>Customize your digital appearance</CardDescription></CardHeader>
              <CardContent>
                <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center border-2 border-dashed border-accent/30">
                  {generateAvatarSVG(avatarConfig)}
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={saveAvatar} disabled={saving}>{saving? 'Saving…' : 'Save Avatar'}</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-accent/20">
              <CardHeader><CardTitle>Customization</CardTitle><CardDescription>Modify appearance attributes</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {/* Example control for skin tone */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                  <span>Skin Tone</span>
                  <select value={avatarConfig.skinTone} onChange={e => setAvatarConfig(c => ({ ...c, skinTone: +e.target.value }))}>
                    {[1,2,3,4,5,6].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avatarStats.map((stat,i)=>(
              <Card key={i} className="glass-card border-accent/20 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <div className="text-2xl font-bold text-accent mb-1">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="biometrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-accent/20">
              <CardHeader><CardTitle className="flex items-center space-x-2"><Brain className="w-5 h-5 text-accent"/><span>Neural Interface</span></CardTitle><CardDescription>Real-time biometric monitoring</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {biometricData.map((m,idx)=>(
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between"><span className="text-sm">{m.label}</span><span className={`text-sm font-medium ${m.color}`}>{m.value}%</span></div>
                    <Progress value={m.value} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-accent/20">
              <CardHeader><CardTitle>Health Summary</CardTitle><CardDescription>Overall wellness indicators</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center"><div className="text-4xl font-bold text-green-400 mb-2">Excellent</div><p className="text-muted-foreground">Overall Health Status</p></div>
                <div className="space-y-3">
                  {['Good','Low','High'].map((label,i)=>(
                    <div key={i} className="flex justify-between"><span>{['Sleep Quality','Stress Level','Mental Focus'][i]}</span><Badge variant="secondary" className={`bg-${['green','yellow','blue'][i]}-500/20 text-${['green','yellow','blue'][i]}-400`}>{label}</Badge></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card border-accent/20">
            <CardHeader><CardTitle>Avatar Preferences</CardTitle><CardDescription>Configure your avatar settings</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {['Animation Quality','Rendering Detail','Physics Simulation','Voice Synthesis','Gesture Recognition'].map((s,i)=>(
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20"><span>{s}</span><div className="flex items-center space-x-2"><Badge variant="outline">Enabled</Badge><Button size="sm" variant="outline" className="glass border-accent/20">Configure</Button></div></div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvatarProfile;
=======
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
>>>>>>> b48370fd28be94b666d23e8c349f60322336ffc5

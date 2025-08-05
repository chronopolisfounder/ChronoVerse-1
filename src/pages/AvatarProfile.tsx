import { GetServerSideProps, NextPage } from 'next';
import React, { useMemo, useState, useEffect } from 'react';
// Import the Supabase SSR client instead of the deprecated auth helpers. The
// ssr package provides utilities for creating a server‑side Supabase client
// that uses cookies for authentication. This avoids relying on the
// unavailable '@supabase/auth-helpers-nextjs' package.
import { User as LucideUser, Palette, Activity, Heart, Brain, Zap, Shield, Settings, Camera, Edit } from 'lucide-react';
import { User } from '@/entities/User';
import GlowingAvatar from '@/components/GlowingAvatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

// A helper to render a simple avatar from configuration. This returns an inline SVG
// representation of the avatar based on skin tone, hair colour and eye colour. The
// arrays define a palette of available colours. New attributes can be added
// simply by extending the avatarConfig object and adding corresponding palette
// entries here.
const renderAvatarSVG = (config: {
  skinTone: number;
  hairColor: number;
  eyeColor: number;
  hairColorHex?: string;
  skinToneHex?: string;
  eyeColorHex?: string;
}) => {
  // Define fallback palettes for each attribute. These arrays are used when
  // no custom colour is provided via the corresponding Hex property. Each
  // index is 1‑based to align with our slider values (1‑N). When adding
  // additional palette options ensure the slider max values are adjusted.
  const skinTones = ['#F5DEB3', '#DEB887', '#CD853F', '#A0522D', '#8B4513', '#654321'];
  const hairColours = ['#000000', '#8B4513', '#DAA520', '#FF6347', '#9370DB', '#00CED1'];
  const eyeColours = ['#000000', '#8B4513', '#228B22', '#4169E1', '#9370DB'];
  // Resolve the final colours. If a custom hex is provided use it, otherwise
  // fallback to the palette using the numeric index. The minus one offset
  // converts slider values (1‑based) to array indices.
  const skinColour = config.skinToneHex ?? skinTones[config.skinTone - 1];
  const hairColour = config.hairColorHex ?? hairColours[config.hairColor - 1];
  const eyeColour = config.eyeColorHex ?? eyeColours[config.eyeColor - 1];
  return (
    <svg width="200" height="240" viewBox="0 0 200 240" className="mx-auto">
      {/* Radial gradient for subtle background glow */}
      <defs>
        <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(6,182,212,0.2)" />
          <stop offset="100%" stopColor="rgba(6,182,212,0.05)" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" rx="20" fill="url(#bgGradient)" />
      {/* Head */}
      <ellipse cx="100" cy="80" rx="45" ry="50" fill={skinColour} />
      {/* Hair */}
      {/* Draw a more natural hair shape: a large curved top covering the head and sides */}
      <path
        d="M50 40 C60 20 140 20 150 40 L150 60 Q100 20 50 60 Z"
        fill={hairColour}
      />
      {/* Eyes */}
      <ellipse cx="85" cy="75" rx="5" ry="7" fill="white" />
      <ellipse cx="115" cy="75" rx="5" ry="7" fill="white" />
      <circle cx="85" cy="75" r="3" fill={eyeColour} />
      <circle cx="115" cy="75" r="3" fill={eyeColour} />
      {/* Nose */}
      <ellipse cx="100" cy="85" rx="2" ry="4" fill={skinColour} opacity="0.8" />
      {/* Mouth */}
      <path
        d="M90 95 Q100 105 110 95"
        stroke={skinColour}
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
      {/* Body */}
      <rect x="70" y="120" width="60" height="80" rx="10" fill="#4F46E5" />
      {/* Arms */}
      <rect x="50" y="130" width="20" height="50" rx="10" fill={skinColour} />
      <rect x="130" y="130" width="20" height="50" rx="10" fill={skinColour} />
      {/* Health aura animation */}
      <circle
        cx="100"
        cy="120"
        r="80"
        fill="none"
        stroke="rgba(6, 182, 212, 0.3)"
        strokeWidth="2"
        opacity="0.6"
      >
        <animate attributeName="r" values="80;85;80" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

interface AvatarConfig {
  skinTone: number;
  hairColor: number;
  eyeColor: number;
  // When custom colours are chosen via the colour picker, these
  // properties hold the hex codes. When undefined the palette index is
  // used. This allows the user to choose any colour via a colour
  // wheel while still supporting the predefined palette.
  hairColorHex?: string;
  skinToneHex?: string;
  eyeColorHex?: string;
}

interface AvatarProfileProps {
  initialUser: any;
}

const AvatarProfile: NextPage<AvatarProfileProps> = ({ initialUser }) => {
  // Local state for the user and avatar configuration. The initial values come
  // directly from the server via getServerSideProps to avoid any loading
  // flicker or race conditions. If the user has a saved configuration it
  // overrides the defaults.
  const [user, setUser] = useState(initialUser);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(() => {
    if (initialUser?.avatar_config) {
      return {
        skinTone: initialUser.avatar_config.skinTone ?? 3,
        hairColor: initialUser.avatar_config.hairColor ?? 1,
        eyeColor: initialUser.avatar_config.eyeColor ?? 1,
        hairColorHex: initialUser.avatar_config.hairColorHex ?? undefined,
        skinToneHex: initialUser.avatar_config.skinToneHex ?? undefined,
        eyeColorHex: initialUser.avatar_config.eyeColorHex ?? undefined,
      };
    }
    return { skinTone: 3, hairColor: 1, eyeColor: 1 };
  });
  const [saving, setSaving] = useState(false);

  // Editing state for the user's display name. When editingName is true
  // an input appears allowing the user to update their name. nameInput
  // holds the working value. savingName controls the disabled state of
  // the save button during the request.
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(() => initialUser?.name ?? '');
  const [savingName, setSavingName] = useState(false);

  // A ref to the hidden file input used for avatar uploads. uploading
  // indicates whether an upload is in progress.
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // A local preview of the uploaded avatar. When a file is selected this
  // holds a data URL representation which is displayed over the
  // GlowingAvatar. After a successful upload we clear this preview so
  // the new avatar from the server is shown instead.
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Load persisted avatar configuration from localStorage if present. This
  // ensures that customised attributes persist across navigation even when
  // backend updates fail. It runs whenever the user id changes.
  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(`avatarConfig-${user.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setAvatarConfig((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        /* ignore parsing errors */
      }
    }
  }, [user?.id]);

  // Persist the avatar configuration to localStorage whenever it changes. This
  // allows custom selections (including colour pickers) to persist across
  // navigation without requiring an explicit save action. The configuration
  // is keyed by the user id so multiple users on the same device do not
  // collide. We avoid writing to localStorage if there is no user.
  useEffect(() => {
    if (user?.id) {
      try {
        localStorage.setItem(`avatarConfig-${user.id}`, JSON.stringify(avatarConfig));
      } catch {
        /* ignore localStorage errors */
      }
    }
  }, [avatarConfig, user?.id]);

  // Memoised lists for biometric and stat displays. These values are static
  // placeholders but can be easily replaced with live data from your API. They
  // are memoised to avoid unnecessary re-renders on state changes unrelated
  // to them.
  const biometricData = useMemo(
    () => [
      { label: 'Neural Activity', value: 87, color: 'text-blue-400' },
      { label: 'Cardiac Rhythm', value: 72, color: 'text-red-400' },
      { label: 'Energy Level', value: 94, color: 'text-yellow-400' },
      { label: 'Stress Index', value: 23, color: 'text-green-400' },
    ],
    []
  );
  const avatarStats = useMemo(
    () => [
      { label: 'Level', value: user?.level ?? '42', icon: Zap },
      { label: 'Experience', value: user?.experience ?? '15,420 XP', icon: Activity },
      { label: 'Reputation', value: user?.reputation ?? '9.2/10', icon: Shield },
      { label: 'Missions', value: user?.missions ?? '127', icon: LucideUser },
    ],
    [user]
  );

  // Persist the avatar configuration to the database. After saving we update
  // the local user state to reflect the changes immediately.
  const saveAvatar = async () => {
    setSaving(true);
    try {
      // Persist only supported fields to the backend. Unknown properties such
      // as hairColorHex are not sent to avoid server side validation errors.
      const serverConfig: any = {
        skinTone: avatarConfig.skinTone,
        hairColor: avatarConfig.hairColor,
        eyeColor: avatarConfig.eyeColor,
      };
      await User.updateMyUserData({ avatar_config: serverConfig });
      setUser((prev: any) => ({ ...prev, avatar_config: { ...prev?.avatar_config, ...serverConfig } }));
      // Persist the full configuration locally so that changes survive
      // navigation even if the server update fails or is unavailable.
      if (user?.id) {
        try {
          localStorage.setItem(`avatarConfig-${user.id}`, JSON.stringify(avatarConfig));
        } catch {
          /* ignore localStorage errors */
        }
      }
    } finally {
      setSaving(false);
    }
  };

  // Predefined hair palette for colour selection and colour picker default
  const hairPalette = ['#000000', '#8B4513', '#DAA520', '#FF6347', '#9370DB', '#00CED1'];

  // Persist an updated display name to the server. When complete the
  // editing state is reset and the local user is updated. Errors are
  // swallowed to avoid breaking the UI.
  const saveName = async () => {
    if (!nameInput || nameInput === user?.name) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      await User.updateMyUserData({ name: nameInput });
      setUser((prev: any) => ({ ...prev, name: nameInput }));
      setEditingName(false);
    } finally {
      setSavingName(false);
    }
  };

  // Handle file selection for avatar uploads. Reads the selected file and
  // sends it to the server via a presumed upload method. After uploading
  // we fetch the user again to reflect the new avatar. Errors are
  // swallowed silently; the UI will not crash.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Generate a local preview of the selected image. This enables the user
      // to see the chosen file immediately while the upload is in progress.
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setAvatarPreview(result);
        }
      };
      reader.readAsDataURL(file);
      if (typeof (User as any).uploadAvatar === 'function') {
        // Use the provided uploadAvatar method if available. This function
        // should handle uploading the file to Supabase storage and updating
        // the user's profile with the resulting URL.
        await (User as any).uploadAvatar(file);
      }
      // Refresh the user from the backend to reflect any uploaded avatar.
      const updated = await User.me();
      if (updated) setUser(updated);
      // Clear the local preview after the upload completes so the new
      // avatar from the server is rendered by GlowingAvatar
      setAvatarPreview(null);
    } catch {
      // ignore upload errors
    } finally {
      setUploading(false);
      // reset input value so the same file can be selected again if desired
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // A convenience function to produce arrays of numbers for sliders and colour
  // selectors. Each configuration property accepts values starting from 1.
  const range = (length: number) => Array.from({ length }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      {/* Header */}
      <div
        className="relative glass-card theme-shape p-8 overflow-hidden"
        style={{
          backgroundImage:
            'url(/lovable-uploads/756d965b-2bd7-4327-af75-be0075afe937.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="absolute inset-0 bg-accent/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-32 h-32">
            {/* The glowing avatar handles showing either the user uploaded avatar or a placeholder */}
            <GlowingAvatar size={128} />
            {/* If a local preview is present, overlay it on the avatar container. */}
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="New avatar preview"
                className="absolute inset-0 w-full h-full object-cover rounded-full"
              />
            )}
            {/* Hidden file input for avatar uploads */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 btn-neon"
              onClick={() => {
                if (!uploading) fileInputRef.current?.click();
              }}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center md:text-left flex-1 space-y-2">
            {/* Display name and editing controls */}
            {editingName ? (
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input
                  type="text"
                  className="input px-3 py-2 rounded-md border border-accent/40 bg-transparent focus:outline-none w-full md:w-auto"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveName} disabled={savingName} className="btn-neon">
                    {savingName ? 'Saving…' : 'Save'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingName(false);
                      setNameInput(user?.name ?? '');
                    }}
                    className="glass border-accent/20"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold neon-text">
                  {user?.name || 'ChronoNaut_042'}
                </h1>
                <Button
                  size="sm"
                  variant="outline"
                  className="glass border-accent/20"
                  onClick={() => setEditingName(true)}
                >
                  Edit Name
                </Button>
              </div>
            )}
            <p className="text-muted-foreground">
              Elite Time Traveler • Dimensional Explorer • Protocol Specialist
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="secondary" className="bg-accent/20">{`Level ${avatarStats[0].value}`}</Badge>
              <Badge variant="secondary" className="bg-primary/20">Elite Status</Badge>
              <Badge variant="secondary" className="bg-secondary/20">Verified</Badge>
            </div>
          </div>
          <Button className="btn-neon">
            <Edit className="w-4 h-4 mr-2" />Customize Avatar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass border-accent/20">
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Stats</span>
          </TabsTrigger>
          <TabsTrigger value="biometrics" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Biometrics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Avatar preview card */}
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle>Avatar Preview</CardTitle>
                <CardDescription>
                  Fine‑tune your digital presence with real‑time preview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center border-2 border-dashed border-accent/30">
                  {renderAvatarSVG(avatarConfig)}
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    onClick={saveAvatar}
                    disabled={saving}
                    className="btn-neon"
                  >
                    {saving ? 'Saving…' : 'Save Avatar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Controls card */}
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>Adjust your appearance attributes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skin tone control with palette and custom picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                    <span>Skin Tone</span>
                    <Slider
                      value={[avatarConfig.skinTone]}
                      onValueChange={(val) =>
                        setAvatarConfig((prev) => ({ ...prev, skinTone: val[0] }))
                      }
                      max={6}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="flex gap-2 px-4">
                    {range(6).map((tone) => (
                      <div
                        key={tone}
                        onClick={() =>
                          setAvatarConfig((prev) => ({ ...prev, skinTone: tone, skinToneHex: undefined }))
                        }
                        className={`w-7 h-7 rounded-full cursor-pointer border-2 ${
                          avatarConfig.skinTone === tone && !avatarConfig.skinToneHex
                            ? 'border-accent'
                            : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: ['#F5DEB3', '#DEB887', '#CD853F', '#A0522D', '#8B4513', '#654321'][tone - 1],
                        }}
                      />
                    ))}
                  </div>
                  {/* Custom skin colour picker */}
                  <div className="flex items-center gap-3 px-4">
                    <span className="text-sm">Custom</span>
                    <input
                      type="color"
                      value={avatarConfig.skinToneHex ?? ['#F5DEB3', '#DEB887', '#CD853F', '#A0522D', '#8B4513', '#654321'][avatarConfig.skinTone - 1]}
                      onChange={(e) =>
                        setAvatarConfig((prev) => ({ ...prev, skinToneHex: e.target.value }))
                      }
                      className="w-8 h-8 p-0 border-2 border-accent/20 rounded-full"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass border-accent/20"
                      onClick={() =>
                        setAvatarConfig((prev) => ({ ...prev, skinToneHex: undefined }))
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                {/* Hair colour control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                    <span>Hair Color</span>
                    <Slider
                      value={[avatarConfig.hairColor]}
                      onValueChange={(val) =>
                        setAvatarConfig((prev) => ({ ...prev, hairColor: val[0] }))
                      }
                      max={6}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="flex gap-2 px-4">
                    {range(6).map((colour) => (
                      <div
                        key={colour}
                        onClick={() =>
                          setAvatarConfig((prev) => ({ ...prev, hairColor: colour, hairColorHex: undefined }))
                        }
                        className={`w-7 h-7 rounded-full cursor-pointer border-2 ${
                          avatarConfig.hairColor === colour && !avatarConfig.hairColorHex
                            ? 'border-accent'
                            : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: hairPalette[colour - 1],
                        }}
                      />
                    ))}
                  </div>
                  {/* Custom hair colour picker */}
                  <div className="flex items-center gap-3 px-4">
                    <span className="text-sm">Custom</span>
                    <input
                      type="color"
                      value={avatarConfig.hairColorHex ?? hairPalette[avatarConfig.hairColor - 1]}
                      onChange={(e) =>
                        setAvatarConfig((prev) => ({ ...prev, hairColorHex: e.target.value }))
                      }
                      className="w-8 h-8 p-0 border-2 border-accent/20 rounded-full"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass border-accent/20"
                      onClick={() =>
                        setAvatarConfig((prev) => ({ ...prev, hairColorHex: undefined }))
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                {/* Eye colour control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                    <span>Eye Color</span>
                    <Slider
                      value={[avatarConfig.eyeColor]}
                      onValueChange={(val) =>
                        setAvatarConfig((prev) => ({ ...prev, eyeColor: val[0] }))
                      }
                      max={5}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="flex gap-2 px-4">
                    {range(5).map((colour) => (
                      <div
                        key={colour}
                        onClick={() =>
                          setAvatarConfig((prev) => ({ ...prev, eyeColor: colour, eyeColorHex: undefined }))
                        }
                        className={`w-7 h-7 rounded-full cursor-pointer border-2 ${
                          avatarConfig.eyeColor === colour && !avatarConfig.eyeColorHex
                            ? 'border-accent'
                            : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: ['#000000', '#8B4513', '#228B22', '#4169E1', '#9370DB'][colour - 1],
                        }}
                      />
                    ))}
                  </div>
                  {/* Custom eye colour picker */}
                  <div className="flex items-center gap-3 px-4">
                    <span className="text-sm">Custom</span>
                    <input
                      type="color"
                      value={avatarConfig.eyeColorHex ?? ['#000000', '#8B4513', '#228B22', '#4169E1', '#9370DB'][avatarConfig.eyeColor - 1]}
                      onChange={(e) =>
                        setAvatarConfig((prev) => ({ ...prev, eyeColorHex: e.target.value }))
                      }
                      className="w-8 h-8 p-0 border-2 border-accent/20 rounded-full"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass border-accent/20"
                      onClick={() =>
                        setAvatarConfig((prev) => ({ ...prev, eyeColorHex: undefined }))
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          {/* Core stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avatarStats.map((stat, i) => (
              <Card key={i} className="glass-card border-accent/20 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <div className="text-2xl font-bold text-accent mb-1">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Evolution progress card based on health score */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" /> Evolution Progress
              </CardTitle>
              <CardDescription>Track how your wellness advances your avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Health Score</span>
                  <span className="text-sm font-medium text-green-400">
                    {user?.health_score ?? 75}%
                  </span>
                </div>
                <Progress
                  value={user?.health_score ?? 75}
                  className="h-3 bg-black/30"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <p className="text-muted-foreground text-sm">
                  Your avatar evolves as your health improves. Keep tracking
                  your metrics to unlock new features!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Biometrics Tab */}
        <TabsContent value="biometrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-accent" />
                  <span>Neural Interface</span>
                </CardTitle>
                <CardDescription>Real-time biometric monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {biometricData.map((m, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{m.label}</span>
                      <span className={`text-sm font-medium ${m.color}`}>{m.value}%</span>
                    </div>
                    <Progress value={m.value} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>Overall wellness indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">Excellent</div>
                  <p className="text-muted-foreground">Overall Health Status</p>
                </div>
                <div className="space-y-3">
                  {['Good', 'Low', 'High'].map((label, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{['Sleep Quality', 'Stress Level', 'Mental Focus'][i]}</span>
                      <Badge
                        variant="secondary"
                        className={`bg-${['green', 'yellow', 'blue'][i]}-500/20 text-${['green', 'yellow', 'blue'][i]}-400`}
                      >
                        {label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle>Avatar Preferences</CardTitle>
              <CardDescription>Configure your avatar settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {['Animation Quality', 'Rendering Detail', 'Physics Simulation', 'Voice Synthesis', 'Gesture Recognition'].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20"
                >
                  <span>{s}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Enabled</Badge>
                    <Button size="sm" variant="outline" className="glass border-accent/20">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Fetch the user session and profile on the server before rendering the page. This
// ensures that the page is fully authenticated and hydrated with the user's data
// before it reaches the client, preventing flickers or double sign‑in issues.
export const getServerSideProps: GetServerSideProps = async (_ctx) => {
  // Retrieve the current user on the server. This call must occur on the
  // server to ensure the user's session is validated before rendering.
  let user: any = null;
  try {
    user = await User.me();
  } catch {
    user = null;
  }
  // If no user is present, redirect to the sign‑in page.
  if (!user) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      initialUser: user,
    },
  };
};

export default AvatarProfile;
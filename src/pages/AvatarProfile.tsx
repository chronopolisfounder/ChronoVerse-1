import React, { useEffect, useState, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import { createServerClient } from '@supabase/ssr'
import { supabase } from '@/integrations/supabase/client'
import AvatarHeader, { AvatarTab } from '@/components/AvatarHeader'
import AvatarCustomization from '@/components/AvatarCustomization'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import {
  User as UserIcon,
  Palette,
  Activity,
  Heart,
  Brain,
  Zap,
  Shield,
  Settings,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Coins as CoinsIcon,
  Sparkles
} from 'lucide-react'

const AVATAR_BUCKET = 'avatars'

type BiometricMetric = { label: string; value: number; color: string }
type StatItem = { label: string; value: string | number; icon: React.ComponentType<any>; key: string }
type AvatarProfileProps = {}

const biometricData: BiometricMetric[] = [
  { label: 'Neural Activity', value: 87, color: 'text-blue-400' },
  { label: 'Cardiac Rhythm', value: 72, color: 'text-red-400' },
  { label: 'Energy Level', value: 94, color: 'text-yellow-400' },
  { label: 'Stress Index', value: 23, color: 'text-green-400' },
]

const defaultStats: StatItem[] = [
  { label: 'Level', value: 42, icon: Zap, key: 'level' },
  { label: 'Experience', value: 15420, icon: Activity, key: 'xp' },
  { label: 'Reputation', value: 9.2, icon: Shield, key: 'reputation' },
  { label: 'Missions', value: 127, icon: UserIcon, key: 'missions' },
]

const customizationOptions = [
  'Hair Style',
  'Facial Features',
  'Body Type',
  'Clothing',
  'Accessories',
]

const preferenceOptions = [
  'Animation Quality',
  'Rendering Detail',
  'Physics Simulation',
  'Voice Synthesis',
  'Gesture Recognition',
]

// Fixed getServerSideProps
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return ctx.req.cookies[name]
          },
        },
      }
    )
    const { data: { session } } = await supabaseServer.auth.getSession()
    return { props: { initialSession: session } }
  } catch (error) {
    console.error('getServerSideProps error:', error)
    return { props: { initialSession: null } }
  }
}

const AvatarProfile: React.FC<AvatarProfileProps> = () => {
  const [userName, setUserName] = useState<string>('ChronoNaut_042')
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState<string>('ChronoNaut_042')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<AvatarTab>('appearance')
  const [loadingUser, setLoadingUser] = useState(true)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [chronoCoins, setChronoCoins] = useState<number>(420)
  const [claimingCoins, setClaimingCoins] = useState(false)
  const [editingStats, setEditingStats] = useState(false)
  const [stats, setStats] = useState(defaultStats)
  const [tempStats, setTempStats] = useState(defaultStats)
  const [hairStyle, setHairStyle] = useState('Default')
  const [hairColor, setHairColor] = useState('#ffcc00')
  const [animationQuality, setAnimationQuality] = useState(3)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [lastLogin, setLastLogin] = useState<string | null>(null)

  // Fetch user info (ID, name, avatar, email, last login)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user...')
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Error fetching user:', error)
          setLoadingUser(false)
          return
        }

        if (data.user) {
          console.log('User found:', data.user.id)
          setUserId(data.user.id)
          setUserEmail(data.user.email)
          setLastLogin(data.user.last_sign_in_at || '')
          
          const name =
            (data.user.user_metadata?.avatarName as string) ||
            (data.user.user_metadata?.full_name as string) ||
            data.user.email ||
            'ChronoNaut_042'
          
          setUserName(name)
          setTempName(name)
          
          // Check for avatar URL
          if (data.user.user_metadata?.avatarUrl) {
            setAvatarUrl(data.user.user_metadata.avatarUrl)
          } else {
            // Try to get from storage
            const { data: imgUrl } = supabase.storage
              .from(AVATAR_BUCKET)
              .getPublicUrl(`${data.user.id}/avatar.png`)
            if (imgUrl?.publicUrl) {
              // Only set if the image actually exists (you might want to add a check)
              setAvatarUrl(imgUrl.publicUrl)
            }
          }
        } else {
          console.log('No user found')
        }
      } catch (error) {
        console.error('Error in fetchUser:', error)
      } finally {
        setLoadingUser(false)
      }
    }
    fetchUser()
  }, [])

  // Fixed save name function
  const saveNameToSupabase = async (name: string) => {
    if (!name.trim()) {
      toast.error('Name cannot be empty!')
      return
    }

    try {
      console.log('Saving name:', name)
      const { error } = await supabase.auth.updateUser({ 
        data: { avatarName: name.trim() } 
      })
      
      if (error) {
        console.error('Error saving name:', error)
        toast.error('Failed to save name!')
        return
      }
      
      setUserName(name.trim())
      setTempName(name.trim())
      setEditingName(false)
      toast.success('Avatar name updated!')
      console.log('Name saved successfully')
    } catch (error) {
      console.error('Error in saveNameToSupabase:', error)
      toast.error('Failed to save name!')
    }
  }

  // Fixed save avatar function
  const saveAvatarToSupabase = async (file: File) => {
    if (!userId) {
      toast.error('Please log in first!')
      return
    }

    try {
      console.log('Uploading avatar...')
      const filePath = `${userId}/avatar.png`
      
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, { upsert: true, contentType: file.type })
      
      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast.error('Failed to upload avatar!')
        return
      }
      
      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath)
      
      if (data?.publicUrl) {
        console.log('Avatar uploaded, updating user metadata...')
        setAvatarUrl(data.publicUrl)
        
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({ 
          data: { avatarUrl: data.publicUrl } 
        })
        
        if (updateError) {
          console.error('Error updating user metadata:', updateError)
          toast.error('Avatar uploaded but failed to save reference!')
        } else {
          toast.success('Avatar updated!')
          console.log('Avatar saved successfully')
        }
      }
    } catch (error) {
      console.error('Error in saveAvatarToSupabase:', error)
      toast.error('Failed to upload avatar!')
    }
  }

  // ChronoCoin claim (demo)
  const claimCoins = async () => {
    setClaimingCoins(true)
    setTimeout(() => {
      setChronoCoins(c => c + 50)
      setClaimingCoins(false)
      toast.success('You claimed 50 ChronoCoins!')
    }, 1200)
  }

  // Edit stats logic
  const onEditStats = () => {
    setTempStats([...stats]) // Create a copy
    setEditingStats(true)
  }
  
  const onSaveStats = () => {
    setStats([...tempStats]) // Create a copy
    setEditingStats(false)
    toast.success('Stats updated!')
  }
  
  const onCancelStats = () => {
    setTempStats([...stats]) // Reset to original
    setEditingStats(false)
  }

  // Theme manager button
  const handleThemeManager = () => {
    toast('Theme Manager coming soon!')
  }

  // Face photo upload (demo: triggers toast)
  const handleFaceUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => toast('Face photo uploaded (AI mapping soon)')
    input.click()
  }

  // Customization: Hair style & color
  const handleHairStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => setHairStyle(e.target.value)
  const handleHairColorChange = (e: React.ChangeEvent<HTMLInputElement>) => setHairColor(e.target.value)

  // AvatarHeader props
  const header = useMemo(
    () => ({
      displayName: (
        <span className="flex items-center gap-2">
          {editingName ? (
            <>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && saveNameToSupabase(tempName)}
                className="px-2 py-1 bg-[#112] text-accent rounded border border-accent/50 outline-none w-44"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={() => saveNameToSupabase(tempName)}>
                <Save size={16} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { setTempName(userName); setEditingName(false) }}>
                <X size={16} />
              </Button>
            </>
          ) : (
            <>
              <span>{userName}</span>
              <Button size="icon" variant="ghost" onClick={() => setEditingName(true)}>
                <Edit size={16} />
              </Button>
            </>
          )}
        </span>
      ),
      avatarUrl,
      level: stats[0].value,
      statusLabel: 'Elite Status',
      verified: true,
      onCustomize: () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e: any) => {
          const file = e.target.files?.[0]
          if (file) saveAvatarToSupabase(file)
        }
        input.click()
      },
      activeTab,
      onTabChange: setActiveTab,
    }),
    [editingName, tempName, userName, avatarUrl, activeTab, userId, stats]
  )

  // Show loading state
  if (loadingUser) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-accent animate-pulse">Loading Profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <AvatarHeader {...header} />

      {/* ChronoCoin Balance */}
      <div className="flex items-center gap-4 justify-end mb-2">
        <Badge className="px-3 py-2 flex items-center gap-2 text-base bg-yellow-400/10 text-yellow-300 border-yellow-400/40">
          <CoinsIcon className="w-5 h-5 mr-1" />
          {chronoCoins} ChronoCoin
        </Badge>
        <Button size="sm" disabled={claimingCoins} onClick={claimCoins}>
          <Sparkles className="w-4 h-4 mr-1" /> {claimingCoins ? 'Claiming...' : 'Claim 50'}
        </Button>
      </div>

      {/* Customizer & Theme manager */}
      <div className="flex justify-end mb-4 gap-2">
        <Button
          variant={showCustomizer ? 'secondary' : 'default'}
          onClick={() => setShowCustomizer(v => !v)}
        >
          {showCustomizer ? 'Close Avatar Customization' : 'Customize Avatar'}
        </Button>
        <Button variant="outline" onClick={handleThemeManager}>
          <Palette className="w-4 h-4 mr-1" />
          Theme Manager
        </Button>
        <Button variant="outline" onClick={handleFaceUpload}>
          <ImageIcon className="w-4 h-4 mr-1" />
          Upload Face Photo
        </Button>
      </div>

      {/* Avatar Customization Panel */}
      {showCustomizer && (
        <div className="mb-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Edit Hair Style & Color</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 flex-col md:flex-row items-center">
              <div>
                <label className="block mb-1 text-sm">Hair Style:</label>
                <select className="border rounded px-2 py-1" value={hairStyle} onChange={handleHairStyleChange}>
                  <option>Default</option>
                  <option>Short</option>
                  <option>Long</option>
                  <option>Ponytail</option>
                  <option>Mohawk</option>
                  <option>Buzzcut</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm">Hair Color:</label>
                <input type="color" value={hairColor} onChange={handleHairColorChange} className="h-8 w-16 rounded border" />
              </div>
              <div className="ml-4 text-xs">
                <span className="inline-block w-4 h-4 rounded-full border" style={{ background: hairColor, marginRight: 4 }}></span>
                {hairColor}
              </div>
            </CardContent>
          </Card>
          <AvatarCustomization
            onSave={state => {
              toast('Avatar customization saved!')
              setShowCustomizer(false)
            }}
          />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="relative z-10 grid w-full grid-cols-4 glass border-accent/20">
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" /><span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" /><span>Stats</span>
          </TabsTrigger>
          <TabsTrigger value="biometrics" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" /><span>Biometrics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" /><span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle>3D Avatar Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="aspect-square bg-secondary/20 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-accent/30 relative"
                  style={{
                    boxShadow: `0 0 40px 4px ${biometricData[0].color.replace('text-', '').replace('-400', '')}44`
                  }}
                >
                  <UserIcon className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <p className="text-muted-foreground">3D Avatar Viewer</p>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Badge variant="secondary">{hairStyle}</Badge>
                    <span className="w-4 h-4 rounded-full border" style={{ background: hairColor }}></span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle>Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customizationOptions.map((opt, i) => (
                  <div key={i} className="p-4 rounded-lg bg-secondary/20 border border-accent/20 flex items-center justify-between">
                    <span>{opt}</span>
                    <Button size="sm" variant="outline" className="glass border-accent/20">Edit</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="flex justify-end mb-2">
            {!editingStats ? (
              <Button size="sm" variant="outline" onClick={onEditStats}><Edit className="w-4 h-4 mr-1" />Edit Stats</Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={onSaveStats}><Save className="w-4 h-4 mr-1" />Save</Button>
                <Button size="sm" variant="outline" onClick={onCancelStats}><X className="w-4 h-4 mr-1" />Cancel</Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(editingStats ? tempStats : stats).map((stat, i) => (
              <Card key={i} className="glass-card border-accent/20 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                  {editingStats && stat.key !== 'level' ? (
                    <input
                      type="number"
                      step={stat.key === 'reputation' ? 0.1 : 1}
                      value={tempStats[i].value as number}
                      onChange={e => {
                        const newVal = stat.key === 'reputation'
                          ? parseFloat(e.target.value) || 0
                          : parseInt(e.target.value, 10) || 0
                        setTempStats(ts => {
                          const arr = [...ts]
                          arr[i] = { ...arr[i], value: newVal }
                          return arr
                        })
                      }}
                      className="text-2xl font-bold text-accent mb-1 bg-transparent border-b border-accent/30 w-20 text-center"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-accent mb-1">
                      {stat.key === 'xp' ? `${stat.value} XP` : stat.key === 'reputation' ? `${stat.value}/10` : stat.value}
                    </div>
                  )}
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="biometrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-accent" />
                  <span>Neural Interface</span>
                </CardTitle>
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
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">Excellent</div>
                  <p className="text-muted-foreground">Overall Health Status</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sleep Quality</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">Good</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Stress Level</span>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Low</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Mental Focus</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">High</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle>Avatar Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ChronoVerse: Animation Quality slider */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                <span>Animation Quality</span>
                <div className="flex items-center space-x-3 w-48">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[animationQuality]}
                    onValueChange={([val]) => setAnimationQuality(val)}
                  />
                  <Badge variant="secondary">{animationQuality}/5</Badge>
                </div>
              </div>
              {preferenceOptions.slice(1).map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                  <span>{s}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Enabled</Badge>
                    <Button size="sm" variant="outline" className="glass border-accent/20">Configure</Button>
                  </div>
                </div>
              ))}
              <div className="pt-4 text-muted-foreground text-sm">
                <div><b>User Email:</b> {userEmail || '—'}</div>
                <div><b>Last Login:</b> {lastLogin ? new Date(lastLogin).toLocaleString() : '—'}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AvatarProfile
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
    console.error('Server-side error:', error)
    return { props: { initialSession: null } }
  }
}

const biometricData = [
  { label: 'Neural Activity', value: 87, color: 'text-blue-400' },
  { label: 'Cardiac Rhythm', value: 72, color: 'text-red-400' },
  { label: 'Energy Level', value: 94, color: 'text-yellow-400' },
  { label: 'Stress Index', value: 23, color: 'text-green-400' },
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

const DEFAULT_PROFILE = {
  user_name: 'ChronoNaut_042',
  avatar_url: '',
  chrono_coins: 0,
  level: 1,
  xp: 0,
  reputation: 0,
  missions: 0,
  hair_style: 'Default',
  hair_color: '#ffcc00',
  animation_quality: 3,
  last_login: null,
}

const statKeys = [
  { label: 'Level', key: 'level', icon: Zap },
  { label: 'Experience', key: 'xp', icon: Activity },
  { label: 'Reputation', key: 'reputation', icon: Shield },
  { label: 'Missions', key: 'missions', icon: UserIcon },
]

interface AvatarProfileProps {
  initialSession?: any
}

const AvatarProfile: React.FC<AvatarProfileProps> = ({ initialSession }) => {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE })
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(profile.user_name)
  const [activeTab, setActiveTab] = useState<AvatarTab>('appearance')
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [editingStats, setEditingStats] = useState(false)
  const [tempStats, setTempStats] = useState<any>({})
  const [claimingCoins, setClaimingCoins] = useState(false)

  // Get user and load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        console.log('Loading profile...')
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error getting user:', userError)
          setLoading(false)
          return
        }
        
        if (!user) {
          console.log('No user found')
          setLoading(false)
          return
        }
        
        console.log('User found:', user.id)
        setUserId(user.id)
        
        // Try to get existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching profile:', fetchError)
        }
        
        let profileData = existingProfile
        
        // If no profile exists, create one
        if (!existingProfile) {
          console.log('Creating new profile...')
          const newProfile = {
            id: user.id,
            user_name: user.email?.split('@')[0] || DEFAULT_PROFILE.user_name,
            ...DEFAULT_PROFILE
          }
          
          const { data: createdProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single()
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
            toast.error('Failed to create profile')
            setLoading(false)
            return
          }
          
          profileData = createdProfile
          console.log('Profile created:', createdProfile)
        }
        
        // Set profile data
        const finalProfile = { ...DEFAULT_PROFILE, ...profileData }
        setProfile(finalProfile)
        setAvatarUrl(finalProfile.avatar_url)
        setTempName(finalProfile.user_name || DEFAULT_PROFILE.user_name)
        setTempStats({
          level: finalProfile.level || 1,
          xp: finalProfile.xp || 0,
          reputation: finalProfile.reputation || 0,
          missions: finalProfile.missions || 0,
        })
        
        console.log('Profile loaded successfully:', finalProfile)
        
      } catch (error) {
        console.error('Error in loadProfile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Generalized save field function
  const saveField = async (field: string, value: any) => {
    if (!userId) {
      console.error('No user ID available')
      return false
    }
    
    try {
      console.log(`Saving ${field}:`, value)
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          [field]: value, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId)
      
      if (error) {
        console.error(`Error updating ${field}:`, error)
        toast.error(`Failed to update ${field}`)
        return false
      }
      
      // Update local state
      setProfile(prev => ({ ...prev, [field]: value }))
      console.log(`Successfully updated ${field}`)
      return true
      
    } catch (error) {
      console.error(`Error saving ${field}:`, error)
      toast.error(`Failed to update ${field}`)
      return false
    }
  }

  // Save name function
  const saveName = async () => {
    if (tempName.trim() === '') {
      toast.error('Name cannot be empty')
      return
    }
    
    const success = await saveField('user_name', tempName.trim())
    if (success) {
      setEditingName(false)
      toast.success('Name updated successfully!')
    }
  }

  // Save avatar to Supabase Storage
  const saveAvatarToSupabase = async (file: File) => {
    if (!userId) {
      toast.error('Please log in first')
      return
    }
    
    try {
      console.log('Uploading avatar...')
      const filePath = `${userId}/avatar_${Date.now()}.${file.name.split('.').pop()}`
      
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, { 
          upsert: true, 
          contentType: file.type 
        })
      
      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast.error('Failed to upload avatar!')
        return
      }
      
      const { data } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath)
      
      if (data?.publicUrl) {
        console.log('Avatar uploaded, updating profile...')
        setAvatarUrl(data.publicUrl)
        const success = await saveField('avatar_url', data.publicUrl)
        if (success) {
          toast.success('Avatar updated successfully!')
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to upload avatar')
    }
  }

  // ChronoCoin claim function
  const claimCoins = async () => {
    if (!userId) return
    
    setClaimingCoins(true)
    try {
      const newCoins = (profile.chrono_coins || 0) + 50
      const success = await saveField('chrono_coins', newCoins)
      if (success) {
        toast.success('You claimed 50 ChronoCoins!')
      }
    } catch (error) {
      console.error('Error claiming coins:', error)
      toast.error('Failed to claim coins')
    } finally {
      setClaimingCoins(false)
    }
  }

  // Stats editing functions
  const onEditStats = () => setEditingStats(true)
  
  const onSaveStats = async () => {
    if (!userId) return
    
    try {
      let allSuccess = true
      for (const [key, value] of Object.entries(tempStats)) {
        const success = await saveField(key, value)
        if (!success) allSuccess = false
      }
      
      if (allSuccess) {
        setEditingStats(false)
        toast.success('Stats updated successfully!')
      }
    } catch (error) {
      console.error('Error saving stats:', error)
      toast.error('Failed to save stats')
    }
  }
  
  const onCancelStats = () => {
    // Reset temp stats to current profile values
    setTempStats({
      level: profile.level || 1,
      xp: profile.xp || 0,
      reputation: profile.reputation || 0,
      missions: profile.missions || 0,
    })
    setEditingStats(false)
  }

  // Theme manager (placeholder)
  const handleThemeManager = () => {
    toast('Theme Manager coming soon!')
  }

  // Face photo upload (placeholder)
  const handleFaceUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => toast('Face photo uploaded (AI mapping coming soon)')
    input.click()
  }

  // Hair customization functions
  const handleHairStyleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const success = await saveField('hair_style', e.target.value)
    if (success) {
      toast.success('Hair style updated!')
    }
  }
  
  const handleHairColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const success = await saveField('hair_color', e.target.value)
    if (success) {
      toast.success('Hair color updated!')
    }
  }
  
  const handleAnimationQuality = async (val: number) => {
    const success = await saveField('animation_quality', val)
    if (success) {
      toast.success('Animation quality updated!')
    }
  }

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
                onKeyPress={e => e.key === 'Enter' && saveName()}
                className="px-2 py-1 bg-[#112] text-accent rounded border border-accent/50 outline-none w-44"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={saveName}>
                <Save size={16} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { 
                setTempName(profile.user_name); 
                setEditingName(false) 
              }}>
                <X size={16} />
              </Button>
            </>
          ) : (
            <>
              <span>{profile.user_name}</span>
              <Button size="icon" variant="ghost" onClick={() => setEditingName(true)}>
                <Edit size={16} />
              </Button>
            </>
          )}
        </span>
      ),
      avatarUrl,
      level: profile.level,
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
    [editingName, tempName, profile, avatarUrl, activeTab, userId]
  )

  if (loading) {
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
          {profile.chrono_coins} ChronoCoin
        </Badge>
        <Button size="sm" disabled={claimingCoins} onClick={claimCoins}>
          <Sparkles className="w-4 h-4 mr-1" /> 
          {claimingCoins ? 'Claiming...' : 'Claim 50'}
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
                <select 
                  className="border rounded px-2 py-1 bg-background text-foreground" 
                  value={profile.hair_style} 
                  onChange={handleHairStyleChange}
                >
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
                <input 
                  type="color" 
                  value={profile.hair_color} 
                  onChange={handleHairColorChange} 
                  className="h-8 w-16 rounded border" 
                />
              </div>
              <div className="ml-4 text-xs">
                <span 
                  className="inline-block w-4 h-4 rounded-full border mr-1" 
                  style={{ background: profile.hair_color }}
                ></span>
                {profile.hair_color}
              </div>
            </CardContent>
          </Card>
          <AvatarCustomization
            onSave={(state) => {
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
                    <Badge variant="secondary">{profile.hair_style}</Badge>
                    <span 
                      className="w-4 h-4 rounded-full border" 
                      style={{ background: profile.hair_color }}
                    ></span>
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass border-accent/20"
                      onClick={() => toast(`${opt} customization coming soon!`)}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="flex justify-end mb-2">
            {!editingStats ? (
              <Button size="sm" variant="outline" onClick={onEditStats}>
                <Edit className="w-4 h-4 mr-1" />Edit Stats
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={onSaveStats}>
                  <Save className="w-4 h-4 mr-1" />Save
                </Button>
                <Button size="sm" variant="outline" onClick={onCancelStats}>
                  <X className="w-4 h-4 mr-1" />Cancel
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statKeys.map(({ label, key, icon: Icon }) => (
              <Card key={key} className="glass-card border-accent/20 text-center">
                <CardContent className="pt-6">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                  {editingStats && key !== 'level' ? (
                    <input
                      type="number"
                      step={key === 'reputation' ? 0.1 : 1}
                      min={0}
                      max={key === 'reputation' ? 10 : undefined}
                      value={tempStats[key] || 0}
                      onChange={e => {
                        let val: any = e.target.value
                        if (key === 'reputation') {
                          val = Math.max(0, Math.min(10, parseFloat(val) || 0))
                        } else {
                          val = parseInt(val, 10) || 0
                        }
                        setTempStats(ts => ({ ...ts, [key]: val }))
                      }}
                      className="text-2xl font-bold text-accent mb-1 bg-transparent border-b border-accent/30 w-20 text-center"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-accent mb-1">
                      {key === 'xp' ? `${profile[key]} XP` : 
                       key === 'reputation' ? `${profile[key]}/10` : 
                       profile[key]}
                    </div>
                  )}
                  <p className="text-muted-foreground">{label}</p>
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
              {/* Animation Quality slider */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                <span>Animation Quality</span>
                <div className="flex items-center space-x-3 w-48">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[profile.animation_quality]}
                    onValueChange={([val]) => handleAnimationQuality(val)}
                  />
                  <Badge variant="secondary">{profile.animation_quality}/5</Badge>
                </div>
              </div>
              {preferenceOptions.slice(1).map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20">
                  <span>{s}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Enabled</Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass border-accent/20"
                      onClick={() => toast(`${s} configuration coming soon!`)}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-4 text-muted-foreground text-sm">
                <div><b>User ID:</b> {userId || '—'}</div>
                <div><b>Last Login:</b> {profile.last_login ? new Date(profile.last_login).toLocaleString() : '—'}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AvatarProfile
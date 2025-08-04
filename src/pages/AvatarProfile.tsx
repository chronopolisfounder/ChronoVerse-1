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
  X
} from 'lucide-react'

const AVATAR_BUCKET = 'avatars'

type BiometricMetric = { label: string; value: number; color: string }
type StatItem = { label: string; value: string; icon: React.ComponentType<any> }
type AvatarProfileProps = {}

const biometricData: BiometricMetric[] = [
  { label: 'Neural Activity', value: 87, color: 'text-blue-400' },
  { label: 'Cardiac Rhythm', value: 72, color: 'text-red-400' },
  { label: 'Energy Level', value: 94, color: 'text-yellow-400' },
  { label: 'Stress Index', value: 23, color: 'text-green-400' },
]

const avatarStats: StatItem[] = [
  { label: 'Level', value: '42', icon: Zap },
  { label: 'Experience', value: '15,420 XP', icon: Activity },
  { label: 'Reputation', value: '9.2/10', icon: Shield },
  { label: 'Missions', value: '127', icon: UserIcon },
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseServer = createServerClient({ req: ctx.req, res: ctx.res })
  const { data: { session } } = await supabaseServer.auth.getSession()
  return { props: { initialSession: session } }
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

  // 1. Fetch user info (ID, name, avatar)
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data.user) {
        setUserId(data.user.id)
        const name =
          (data.user.user_metadata?.avatarName as string) ||
          (data.user.user_metadata?.full_name as string) ||
          data.user.email ||
          'ChronoNaut_042'
        setUserName(name)
        setTempName(name)
        if (data.user.user_metadata?.avatarUrl) {
          setAvatarUrl(data.user.user_metadata.avatarUrl)
        } else {
          const { data: imgUrl } = supabase.storage
            .from(AVATAR_BUCKET)
            .getPublicUrl(`${data.user.id}/avatar.png`)
          if (imgUrl?.publicUrl) setAvatarUrl(imgUrl.publicUrl)
        }
      }
      setLoadingUser(false)
      if (error) console.error('Error fetching user:', error)
    }
    fetchUser()
  }, [])

  // 2. Save name to Supabase metadata
  const saveNameToSupabase = async (name: string) => {
    const { error } = await supabase.auth.updateUser({ data: { avatarName: name } })
    if (error) {
      alert('Failed to save name!')
      console.error(error)
      return
    }
    setUserName(name)
    setTempName(name)
    setEditingName(false)
  }

  // 3. Save avatar image to Supabase Storage & metadata
  const saveAvatarToSupabase = async (file: File) => {
    if (!userId) return
    const filePath = `${userId}/avatar.png`
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, { upsert: true, contentType: file.type })
    if (uploadError) {
      alert('Failed to upload avatar!')
      console.error(uploadError)
      return
    }
    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath)
    if (data?.publicUrl) {
      setAvatarUrl(data.publicUrl)
      await supabase.auth.updateUser({ data: { avatarUrl: data.publicUrl } })
    }
  }

  // 4. Avatar/name edit logic for AvatarHeader
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
                className="px-2 py-1 bg-[#112] text-accent rounded border border-accent/50 w-44 outline-none"
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
      level: 42,
      statusLabel: 'Elite Status',
      verified: true,
      onCustomize: () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e: any) => {
          const file = e.target.files[0]
          if (file) saveAvatarToSupabase(file)
        }
        input.click()
      },
      activeTab,
      onTabChange: setActiveTab,
    }),
    [editingName, tempName, userName, avatarUrl, activeTab, userId]
  )

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <AvatarHeader {...header} />
      {/* Customizer Toggle Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant={showCustomizer ? 'secondary' : 'default'}
          onClick={() => setShowCustomizer(v => !v)}
        >
          {showCustomizer ? 'Close Avatar Customization' : 'Customize Avatar'}
        </Button>
      </div>

      {/* Avatar Customization Panel */}
      {showCustomizer && (
        <div className="mb-8">
          <AvatarCustomization onSave={state => { console.log('Avatar customization saved!', state); setShowCustomizer(false) }} />
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
              <CardHeader><CardTitle>3D Avatar Viewer</CardTitle></CardHeader>
              <CardContent>
                <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center border-2 border-dashed border-accent/30">
                  <UserIcon className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <p className="text-muted-foreground">3D Avatar Viewer</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-accent/20">
              <CardHeader><CardTitle>Customization</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {customizationOptions.map((opt, i) => (
                  <div key={i} className="p-4 rounded-lg bg-secondary/20 border border-accent/20 flex items-center justify-between">
                    <span>{opt}</span>
                    <Button size="sm" variant="outline" className="glass border-accent/20">Edit</Button>
                  </div>
                ))}

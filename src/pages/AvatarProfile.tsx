import React, { useEffect, useState, useMemo } from 'react'
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
  Sparkles,
  LogOut
} from 'lucide-react'

const AVATAR_BUCKET = 'avatars'

type BiometricMetric = { label: string; value: number; color: string }
type StatItem = { label: string; value: string | number; icon: React.ComponentType<any>; key: string }

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

const AvatarProfile: React.FC = () => {
  const [userName, setUserName] = useState<string>('ChronoNaut_042')
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState<string>('ChronoNaut_042')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<AvatarTab>('appearance')
  const [loadingUser, setLoadingUser] = useState(true)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
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

  // Detect client-side session
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setIsSignedIn(false)
        setLoadingUser(false)
        return
      }
      setIsSignedIn(true)
      setUserId(session.user.id)
      setUserEmail(session.user.email)
      setLastLogin(session.user.last_sign_in_at || '')
      const name =
        (session.user.user_metadata?.avatarName as string) ||
        (session.user.user_metadata?.full_name as string) ||
        session.user.email ||
        'ChronoNaut_042'
      setUserName(name)
      setTempName(name)
      if (session.user.user_metadata?.avatarUrl) {
        setAvatarUrl(session.user.user_metadata.avatarUrl)
      } else {
        const { data: imgUrl } = supabase.storage
          .from(AVATAR_BUCKET)
          .getPublicUrl(`${session.user.id}/avatar.png`)
        if (imgUrl?.publicUrl) {
          setAvatarUrl(imgUrl.publicUrl)
        }
      }
      setLoadingUser(false)
    }
    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsSignedIn(true)
        setUserId(session.user.id)
        setUserEmail(session.user.email)
        setLastLogin(session.user.last_sign_in_at || '')
      } else {
        setIsSignedIn(false)
        setUserId(null)
        setUserName('ChronoNaut_042')
        setUserEmail(null)
        setLastLogin(null)
        setAvatarUrl(undefined)
      }
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  // Sign in/out handlers
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/avatar-profile',
      },
    })
  }
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsSignedIn(false)
    setUserId(null)
    setUserName('ChronoNaut_042')
    setUserEmail(null)
    setLastLogin(null)
    setAvatarUrl(undefined)
    toast.success('Signed out!')
    window.location.reload()
  }

  // ...the rest (saveNameToSupabase, saveAvatarToSupabase, claimCoins, etc) remains the same...

  const saveNameToSupabase = async (name: string) => {
    if (!name.trim()) {
      toast.error('Name cannot be empty!')
      return
    }
    try {
      const { error } = await supabase.auth.updateUser({ data: { avatarName: name.trim() } })
      if (error) {
        toast.error('Failed to save name!')
        return
      }
      setUserName(name.trim())
      setTempName(name.trim())
      setEditingName(false)
      toast.success('Avatar name updated!')
    } catch (error) {
      toast.error('Failed to save name!')
    }
  }

  const saveAvatarToSupabase = async (file: File) => {
    if (!userId) {
      toast.error('Please log in first!')
      return
    }
    try {
      const filePath = `${userId}/avatar.png`
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, { upsert: true, contentType: file.type })
      if (uploadError) {
        toast.error('Failed to upload avatar!')
        return
      }
      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath)
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl)
        const { error: updateError } = await supabase.auth.updateUser({ data: { avatarUrl: data.publicUrl } })
        if (updateError) {
          toast.error('Avatar uploaded but failed to save reference!')
        } else {
          toast.success('Avatar updated!')
        }
      }
    } catch (error) {
      toast.error('Failed to upload avatar!')
    }
  }

  const claimCoins = async () => {
    setClaimingCoins(true)
    setTimeout(() => {
      setChronoCoins(c => c + 50)
      setClaimingCoins(false)
      toast.success('You claimed 50 ChronoCoins!')
    }, 1200)
  }

  const onEditStats = () => {
    setTempStats([...stats])
    setEditingStats(true)
  }
  const onSaveStats = () => {
    setStats([...tempStats])
    setEditingStats(false)
    toast.success('Stats updated!')
  }
  const onCancelStats = () => {
    setTempStats([...stats])
    setEditingStats(false)
  }

  const handleThemeManager = () => {
    toast('Theme Manager coming soon!')
  }
  const handleFaceUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => toast('Face photo uploaded (AI mapping soon)')
    input.click()
  }
  const handleHairStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => setHairStyle(e.target.value)
  const handleHairColorChange = (e: React.ChangeEvent<HTMLInputElement>) => setHairColor(e.target.value)

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

  // AUTH UI: if not signed in, show sign in button
  if (loadingUser) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-accent animate-pulse">Loading Profile...</div>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="mb-8 text-xl text-accent">Sign in to view your ChronoVerse Avatar</div>
        <Button onClick={handleSignIn}>
          <img src="/google.svg" alt="Google" className="w-6 h-6 mr-2" />
          Sign in with Google
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <AvatarHeader {...header} />

      {/* SIGN OUT BUTTON */}
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-1" />
          Sign Out
        </Button>
      </div>

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
      {/* ...rest of your UI remains unchanged... */}
      {/* Place the rest of your profile UI below here */}
      {/* (Customization, Tabs, etc.) */}
      {/* (Your original code) */}
      {/* ... */}
      {/* (Don't duplicate the lower return part, just keep as is) */}
    </div>
  )
}

export default AvatarProfile

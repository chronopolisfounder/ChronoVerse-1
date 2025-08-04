// src/pages/avatar-profile.tsx
import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { createServerClient } from '@supabase/ssr'
import { supabase } from '@/integrations/supabase/client'
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
  Camera,
  Edit,
} from 'lucide-react'
import GlowingAvatar from '@/components/GlowingAvatar'

// 1) SSR: fetch the session to hydrate your _app.tsx
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseServer = createServerClient({ req: ctx.req, res: ctx.res })
  const {
    data: { session },
  } = await supabaseServer.auth.getSession()

  return {
    props: {
      initialSession: session,
    },
  }
}

const AvatarProfile: React.FC = () => {
  // 2) Local state for the dynamic username
  const [userName, setUserName] = useState<string>('ChronoNaut_042')

  // 3) On mount, fetch the logged-in user via your raw client
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log('Supabase user:', user)
      if (user) {
        const name =
          user.user_metadata?.avatarName ||
          user.user_metadata?.full_name ||
          user.email ||
          'ChronoNaut_042'
        setUserName(name)
      }
    }
    fetchUser()
  }, [])

  // 4) Sample data
  const biometricData = [
    { label: 'Neural Activity', value: 87, color: 'text-blue-400' },
    { label: 'Cardiac Rhythm', value: 72, color: 'text-red-400' },
    { label: 'Energy Level', value: 94, color: 'text-yellow-400' },
    { label: 'Stress Index', value: 23, color: 'text-green-400' },
  ]

  const avatarStats = [
    { label: 'Level', value: '42', icon: Zap },
    { label: 'Experience', value: '15,420 XP', icon: Activity },
    { label: 'Reputation', value: '9.2/10', icon: Shield },
    { label: 'Missions', value: '127', icon: UserIcon },
  ]

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      {/* Profile Header */}
      <div
        className="relative glass-card theme-shape p-8 pb-40 overflow-hidden"
        style={{
          backgroundImage:
            'url(/lovable-uploads/756d965b-2bd7-4327-af75-be0075afe937.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="absolute inset-0 bg-accent/10 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-32 h-32">
            <GlowingAvatar size={128} />
            <Button
              size="sm"
              className="absolute -bottom-4 -right-2 rounded-full w-8 h-8 p-0 btn-neon z-20"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-2 neon-text">{userName}</h1>
            <p className="text-muted-foreground mb-4">
              Elite Time Traveler • Dimensional Explorer • Protocol Specialist
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="secondary" className="bg-accent/20">
                Level 42
              </Badge>
              <Badge variant="secondary" className="bg-primary/20">
                Elite Status
              </Badge>
              <Badge variant="secondary" className="bg-secondary/20">
                Verified
              </Badge>
            </div>
          </div>
          <Button className="btn-neon">
            <Edit className="w-4 h-4 mr-2" />
            Customize Avatar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="appearance" className="space-y-6 mt-12">
        <TabsList className="relative z-10 grid w-full grid-cols-4 glass border-accent/20">
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

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle>3D Avatar Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center border-2 border-dashed border-accent/30">
                  <UserIcon className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <p className="text-muted-foreground">3D Avatar Viewer</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle>Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Hair Style',
                  'Facial Features',
                  'Body Type',
                  'Clothing',
                  'Accessories',
                ].map((opt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg bg-secondary/20 border border-accent/20"
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="glass border-accent/20"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avatarStats.map((stat, i) => (
              <Card key={i} className="glass-card border-accent/20 text-center">
                <CardContent className="pt-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <div className="text-2xl font-bold text-accent mb-1">
                    {stat.value}
                  </div>
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
                      <span className={`text-sm font-medium ${m.color}`}>
                        {m.value}%
                      </span>
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
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    Excellent
                  </div>
                  <p className="text-muted-foreground">
                    Overall Health Status
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sleep Quality</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-400"
                    >
                      Good
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Stress Level</span>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/20 text-yellow-400"
                    >
                      Low
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Mental Focus</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-400"
                    >
                      High
                    </Badge>
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
              {[
                'Animation Quality',
                'Rendering Detail',
                'Physics Simulation',
                'Voice Synthesis',
                'Gesture Recognition',
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-accent/20"
                >
                  <span>{s}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Enabled</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass border-accent/20"
                    >
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
  )
}

export default AvatarProfile

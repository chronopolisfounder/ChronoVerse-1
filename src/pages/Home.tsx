import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  Zap, 
  Shield, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Settings 
} from 'lucide-react';

const Home = () => {
  const quickAccessPanels = [
    { title: 'System Status', icon: Shield, color: 'text-green-400', status: 'Optimal' },
    { title: 'Active Users', icon: Users, color: 'text-blue-400', count: '1,247' },
    { title: 'Energy Core', icon: Zap, color: 'text-yellow-400', level: '94%' },
    { title: 'Protocol Log', icon: Activity, color: 'text-purple-400', alerts: '3 New' },
  ];

  const recentActivities = [
    { time: '2m ago', action: 'System optimization completed', type: 'success' },
    { time: '5m ago', action: 'New protocol update deployed', type: 'info' },
    { time: '12m ago', action: 'HexaDome maintenance scheduled', type: 'warning' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      {/* Hero Section */}
      <div 
        className="relative glass-card theme-shape p-8 text-center overflow-hidden"
        style={{
          backgroundImage: `url(/lovable-uploads/316e324e-0a08-4e5a-b985-93307ca67002.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 neon-text">
            Welcome to ChronoVerse
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your gateway to the future of digital existence
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="btn-neon">
              <MapPin className="w-4 h-4 mr-2" />
              Explore Chronopolis
            </Button>
            <Button variant="outline" className="glass border-accent/20">
              <Settings className="w-4 h-4 mr-2" />
              System Control
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickAccessPanels.map((panel, index) => (
          <Card key={index} className="glass-card theme-shape border-accent/20 hover:neon-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <panel.icon className={`w-6 h-6 ${panel.color}`} />
                <Badge variant="secondary" className="bg-accent/20">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">{panel.title}</CardTitle>
              <div className="text-2xl font-bold text-accent">
                {panel.status || panel.count || panel.level || panel.alerts}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <Card className="glass-card theme-shape border-accent/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span>System Performance</span>
            </CardTitle>
            <CardDescription>Real-time ChronoVerse metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory</span>
                <span>58%</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network</span>
                <span>91%</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card theme-shape border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-accent" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card theme-shape border-accent/20 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-accent mb-2">1,247</div>
            <p className="text-muted-foreground">Active Chrononauts</p>
          </CardContent>
        </Card>
        <Card className="glass-card theme-shape border-accent/20 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-accent mb-2">94.7%</div>
            <p className="text-muted-foreground">System Uptime</p>
          </CardContent>
        </Card>
        <Card className="glass-card theme-shape border-accent/20 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-accent mb-2">₡ 2.4M</div>
            <p className="text-muted-foreground">ChronoCoin Supply</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Zap, 
  Activity, 
  Database, 
  Wifi, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Settings,
  BarChart3
} from 'lucide-react';

const ChronoSystemsPanel = () => {
  const [systems, setSystems] = useState([
    { id: 1, name: 'Core Engine', status: 'online', enabled: true, load: 87 },
    { id: 2, name: 'Quantum Field', status: 'online', enabled: true, load: 94 },
    { id: 3, name: 'Time Matrix', status: 'maintenance', enabled: false, load: 0 },
    { id: 4, name: 'Neural Link', status: 'online', enabled: true, load: 76 },
    { id: 5, name: 'Security Grid', status: 'online', enabled: true, load: 58 },
    { id: 6, name: 'Data Vault', status: 'warning', enabled: true, load: 95 },
  ]);

  const systemLogs = [
    { time: '14:32:17', level: 'INFO', message: 'Quantum field stabilization complete' },
    { time: '14:30:45', level: 'WARN', message: 'Data vault approaching capacity limit' },
    { time: '14:28:12', level: 'INFO', message: 'Neural link optimization successful' },
    { time: '14:25:33', level: 'ERROR', message: 'Time matrix offline for maintenance' },
    { time: '14:22:08', level: 'INFO', message: 'Security grid scan completed' },
  ];

  const toggleSystem = (id: number) => {
    setSystems(systems.map(system => 
      system.id === id ? { ...system, enabled: !system.enabled } : system
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-blue-400" />;
      default: return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-400';
      case 'WARN': return 'text-yellow-400';
      case 'ERROR': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      {/* Header */}
      <div 
        className="relative glass-card theme-shape p-8 overflow-hidden"
        style={{
          backgroundImage: `url(/lovable-uploads/2f23cdc3-1a10-4352-bef5-8e013b165ca7.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-4 neon-text">
            Chrono Systems Panel
          </h1>
          <p className="text-muted-foreground mb-6">
            Central control hub for all ChronoVerse core systems
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="btn-neon">
              <Shield className="w-4 h-4 mr-2" />
              Emergency Protocols
            </Button>
            <Button variant="outline" className="glass border-accent/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              System Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => (
          <Card key={system.id} className="glass-card border-accent/20 hover:neon-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{system.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(system.status)}
                  <Switch
                    checked={system.enabled}
                    onCheckedChange={() => toggleSystem(system.id)}
                    className="data-[state=checked]:bg-accent"
                  />
                </div>
              </div>
              <CardDescription className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  className={`${
                    system.status === 'online' ? 'bg-green-500/20 text-green-400' :
                    system.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    system.status === 'maintenance' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}
                >
                  {system.status.toUpperCase()}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>System Load</span>
                  <span className="font-medium">{system.load}%</span>
                </div>
                <Progress value={system.load} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last Update: 2m ago</span>
                  <span>{system.enabled ? 'Active' : 'Disabled'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Controls */}
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent" />
              <span>Quick Controls</span>
            </CardTitle>
            <CardDescription>Rapid system management</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button className="btn-glass h-16 flex-col">
              <Activity className="w-6 h-6 mb-2" />
              System Scan
            </Button>
            <Button className="btn-glass h-16 flex-col">
              <Database className="w-6 h-6 mb-2" />
              Backup Data
            </Button>
            <Button className="btn-glass h-16 flex-col">
              <Wifi className="w-6 h-6 mb-2" />
              Network Test
            </Button>
            <Button className="btn-glass h-16 flex-col">
              <Lock className="w-6 h-6 mb-2" />
              Security Lock
            </Button>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Real-time system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {systemLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/20">
                  <div className="text-xs text-muted-foreground min-w-[60px]">
                    {log.time}
                  </div>
                  <div className={`text-xs font-medium min-w-[50px] ${getLogColor(log.level)}`}>
                    {log.level}
                  </div>
                  <div className="text-sm flex-1">{log.message}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Comprehensive status monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">5/6</div>
              <p className="text-sm text-muted-foreground">Systems Online</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">1</div>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">78%</div>
              <p className="text-sm text-muted-foreground">Avg Load</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-1">99.7%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChronoSystemsPanel;
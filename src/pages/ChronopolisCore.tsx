import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Shield, Zap, Activity } from 'lucide-react';

const ChronopolisCore = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">Chronopolis Core</h1>
        <p className="text-muted-foreground">Central city management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Core Systems", icon: Shield, status: "Operational" },
          { title: "Power Grid", icon: Zap, status: "Full Capacity" },
          { title: "City Network", icon: Building, status: "Connected" },
          { title: "Monitor Array", icon: Activity, status: "Scanning" }
        ].map((item, i) => (
          <Card key={i} className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="w-5 h-5 mr-2 text-accent"/>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-accent/20">{item.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChronopolisCore;
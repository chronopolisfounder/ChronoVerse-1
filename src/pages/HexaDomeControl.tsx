import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hexagon, Power, Shield, Zap } from 'lucide-react';

const HexaDomeControl = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">HexaDome Control</h1>
        <p className="text-muted-foreground">Hexagonal dome structure management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Dome Status", icon: Hexagon, status: "Active" },
          { title: "Power Core", icon: Power, status: "100%" },
          { title: "Shield Array", icon: Shield, status: "Deployed" },
          { title: "Energy Flow", icon: Zap, status: "Stable" }
        ].map((item, i) => (
          <Card key={i} className="glass-card border-accent/20 theme-shape">
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

export default HexaDomeControl;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Glasses, Eye, Headphones, Gamepad2 } from 'lucide-react';

const VRExperience = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">VR Experience</h1>
        <p className="text-muted-foreground">Immersive virtual reality interface</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "VR Headset", icon: Glasses, status: "Connected" },
          { title: "Eye Tracking", icon: Eye, status: "Calibrated" },
          { title: "Audio System", icon: Headphones, status: "Spatial" },
          { title: "Controllers", icon: Gamepad2, status: "Paired" }
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

export default VRExperience;
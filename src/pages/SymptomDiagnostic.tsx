import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, Brain, Thermometer } from 'lucide-react';

const SymptomDiagnostic = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">Diagnostics</h1>
        <p className="text-muted-foreground">System health and performance monitoring</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "System Health", icon: Activity, status: "Optimal" },
          { title: "Core Temp", icon: Thermometer, value: "42°C" },
          { title: "Neural Load", icon: Brain, value: "67%" },
          { title: "Pulse Rate", icon: Heart, value: "120 BPM" }
        ].map((item, i) => (
          <Card key={i} className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="w-5 h-5 mr-2 text-accent"/>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-accent/20">
                {item.status || item.value}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SymptomDiagnostic;
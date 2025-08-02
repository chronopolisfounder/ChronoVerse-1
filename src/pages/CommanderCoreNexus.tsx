import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, AlertTriangle, Map, Users, Shield } from 'lucide-react';

const CommanderCoreNexus = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="relative glass-card p-8 overflow-hidden" style={{backgroundImage: `url(/lovable-uploads/cfec5169-45f3-488c-bce7-bcf541862e2d.png)`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'multiply'}}>
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-4 neon-text">Commander Core Nexus</h1>
          <p className="text-muted-foreground">High-level command interface with tactical overview</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <Card key={i} className="glass-card border-accent/20 theme-shape">
            <CardHeader><CardTitle className="flex items-center"><Command className="w-5 h-5 mr-2 text-accent"/>Tactical Panel {i}</CardTitle></CardHeader>
            <CardContent><Badge variant="secondary" className="bg-accent/20">Active</Badge></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default CommanderCoreNexus;
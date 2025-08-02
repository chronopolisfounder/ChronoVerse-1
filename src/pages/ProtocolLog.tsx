import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const ProtocolLog = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">Protocol Log</h1>
        <p className="text-muted-foreground">System activity and event monitoring</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Log Entries", count: "2,847", icon: FileText },
          { title: "Warnings", count: "12", icon: AlertTriangle },
          { title: "Completed", count: "1,834", icon: CheckCircle },
          { title: "Uptime", value: "99.7%", icon: Clock }
        ].map((item, i) => (
          <Card key={i} className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="w-5 h-5 mr-2 text-accent"/>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {item.count || item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProtocolLog;
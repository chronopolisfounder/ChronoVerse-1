import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, Thermometer, Utensils } from 'lucide-react';

const ChronoCooking = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">ChronoCooking</h1>
        <p className="text-muted-foreground">Temporal culinary management system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Active Recipes", count: "47", icon: ChefHat },
          { title: "Cook Time", value: "2h 15m", icon: Clock },
          { title: "Temperature", value: "375°F", icon: Thermometer },
          { title: "Ingredients", count: "23", icon: Utensils }
        ].map((item, i) => (
          <Card key={i} className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="w-5 h-5 mr-2 text-accent"/>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-accent">
                {item.count || item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChronoCooking;
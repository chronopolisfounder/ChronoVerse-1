import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, CreditCard, Truck } from 'lucide-react';

const ChronoShopping = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">ChronoShopping</h1>
        <p className="text-muted-foreground">Temporal marketplace and commerce hub</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Available Items", count: "2,847", icon: Package },
          { title: "Active Orders", count: "156", icon: ShoppingCart },
          { title: "Deliveries", count: "89", icon: Truck },
          { title: "Credits", count: "12.4k", icon: CreditCard }
        ].map((item, i) => (
          <Card key={i} className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="w-5 h-5 mr-2 text-accent"/>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{item.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChronoShopping;
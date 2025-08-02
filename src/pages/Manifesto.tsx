import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scroll, BookOpen, Feather, Star } from 'lucide-react';

const Manifesto = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card theme-shape p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">ChronoVerse Manifesto</h1>
        <p className="text-muted-foreground">Our principles and vision for the future</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scroll className="w-5 h-5 mr-2 text-accent"/>
              Core Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="outline" className="mr-2">Innovation</Badge>
            <Badge variant="outline" className="mr-2">Collaboration</Badge>
            <Badge variant="outline" className="mr-2">Progress</Badge>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-accent"/>
              Vision Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              To build a unified temporal interface that empowers users to navigate 
              the complexities of time and space with intuitive design.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Manifesto;
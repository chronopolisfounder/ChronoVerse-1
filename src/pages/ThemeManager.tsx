import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Zap, Eye } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes, ThemeName } from '@/types/themes';

const ThemeManager = () => {
  const { currentTheme, setTheme, allThemes } = useTheme();
  
  const handleThemeActivation = (themeName: ThemeName) => {
    setTheme(themeName);
  };

  const getShapeIcon = (shape: string) => {
    switch (shape) {
      case 'hex': return '⬡';
      case 'rounded': return '▢';
      case 'sharp': return '◼';
      case 'circle': return '●';
      case 'arch': return '⌒';
      case 'halo': return '○';
      case 'mesh': return '▦';
      case 'blocky': return '■';
      case 'capsule': return '◗';
      case 'lattice': return '⬚';
      case 'oval': return '⬭';
      case 'pentagon': return '⬟';
      case 'triangle': return '▲';
      case 'trapezoid': return '⏢';
      case 'diamond': return '◆';
      case 'parallelogram': return '▱';
      case 'ellipse': return '⬯';
      case 'chevron': return '⌄';
      case 'star5': return '⭐';
      case 'star6': return '✱';
      case 'hexagram': return '✡';
      case 'crescent': return '☾';
      case 'heart': return '♥';
      case 'shield': return '🛡';
      case 'arrowhead': return '➤';
      default: return '▢';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="glass-card theme-shape p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 neon-text">ChronoVerse Theme Manager</h1>
        <p className="text-muted-foreground">21 Unique UI Themes</p>
        <div className="mt-4">
          <Badge variant="secondary" className="text-sm">
            Active: {currentTheme.displayName}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(allThemes).map((theme) => (
            <Card 
            key={theme.name} 
            className={`glass-card theme-shape transition-all duration-300 cursor-pointer ${
              currentTheme.name === theme.name 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:ring-1 hover:ring-accent/50'
            }`}
            style={{
              background: `linear-gradient(135deg, ${theme.colors.background}CC, ${theme.colors.accent}22)`,
              borderColor: theme.colors.accent + '40'
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center">
                  <Palette className="w-4 h-4 mr-2" style={{ color: theme.colors.accent }} />
                  <span style={{ color: theme.colors.text }}>{theme.displayName}</span>
                </div>
                <span className="text-2xl">{getShapeIcon(theme.panelShape)}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Theme Preview */}
              <div className="theme-preview p-3 rounded-lg border" 
                   style={{ 
                     backgroundColor: theme.colors.background + 'AA',
                     borderColor: theme.colors.accent + '60'
                   }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.highlight }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.text }}></div>
                </div>
                <div className="h-2 rounded mb-1" style={{ backgroundColor: theme.colors.accent + '60' }}></div>
                <div className="h-2 rounded w-3/4" style={{ backgroundColor: theme.colors.highlight + '40' }}></div>
              </div>
              
              {/* Theme Details */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs" style={{ 
                  borderColor: theme.colors.accent + '60',
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background + '80'
                }}>
                  {theme.panelShape}
                </Badge>
                <Badge variant="outline" className="text-xs" style={{ 
                  borderColor: theme.colors.highlight + '60',
                  color: theme.colors.text,
                  backgroundColor: theme.colors.background + '80'
                }}>
                  {theme.animationClass}
                </Badge>
              </div>
              
              {/* Activation Button */}
              <Button 
                size="sm" 
                className="w-full transition-all duration-200"
                onClick={() => handleThemeActivation(theme.name)}
                style={{
                  backgroundColor: theme.colors.accent + (currentTheme.name === theme.name ? 'FF' : '80'),
                  color: theme.colors.background,
                  borderColor: theme.colors.accent
                }}
                disabled={currentTheme.name === theme.name}
              >
                {currentTheme.name === theme.name ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Active
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ThemeManager;
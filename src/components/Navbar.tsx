import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Settings, 
  Palette, 
  Home, 
  User, 
  Shield, 
  Gift, 
  Command, 
  Building, 
  Users, 
  FileText, 
  Search, 
  Activity, 
  Camera, 
  Vote, 
  ChefHat, 
  ShoppingCart, 
  Hexagon, 
  Map, 
  Scroll, 
  Database as Registry, 
  Glasses 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeName } from '@/types/themes';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Avatar Profile', path: '/avatar-profile', icon: User },
  { name: 'Chrono Systems', path: '/chrono-systems', icon: Shield },
  { name: 'Rewards Center', path: '/rewards', icon: Gift },
  { name: 'Commander Core', path: '/commander-core', icon: Command },
  { name: 'Chronopolis Sim', path: '/chronopolis-simulation', icon: Building },
  { name: 'Chronopolis Core', path: '/chronopolis-core', icon: Shield },
  { name: 'Community', path: '/community', icon: Users },
  { name: 'Protocol Log', path: '/protocol-log', icon: FileText },
  { name: 'Research Portal', path: '/research-portal', icon: Search },
  { name: 'Diagnostics', path: '/symptom-diagnostic', icon: Activity },
  { name: 'AR Portal', path: '/ar-portal', icon: Camera },
  { name: 'Voting Lab', path: '/voting-lab', icon: Vote },
  { name: 'ChronoCooking', path: '/chrono-cooking', icon: ChefHat },
  { name: 'ChronoShopping', path: '/chrono-shopping', icon: ShoppingCart },
  { name: 'HexaDome Control', path: '/hexadome-control', icon: Hexagon },
  { name: 'ChronoNav', path: '/chrono-nav', icon: Map },
  { name: 'Manifesto', path: '/manifesto', icon: Scroll },
  { name: 'Settings', path: '/system-settings', icon: Settings },
  { name: 'Registry', path: '/chrono-registry', icon: Registry },
  { name: 'VR Experience', path: '/vr-experience', icon: Glasses },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, setTheme, allThemes } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-accent/30 rounded-none navbar-responsive">
      <div className="w-full max-w-full px-2 sm:px-4 h-16 flex items-center justify-between overflow-hidden">
        {/* Logo */}
        <div className="flex items-center space-x-2 flex-shrink-0 min-w-0">
          <div className="w-8 h-8 hexagon bg-primary animate-pulse-glow flex-shrink-0"></div>
          <span className="text-lg sm:text-xl font-bold neon-text hover-float truncate">ChronoVerse</span>
        </div>

        {/* Desktop Navigation - Show ALL core nav buttons */}
        <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-4xl overflow-visible">
          {navItems.slice(0, 8).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`hover-float text-hover-glow flex-shrink-0 overflow-visible relative z-20 ${
                  isActive(item.path) ? 'bg-primary/20 border-primary/60' : 'border-primary/20'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">{item.name}</span>
                <span className="xl:hidden">{item.name.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Theme Manager & More Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Theme Manager */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="glass border-accent/20 hover-float text-hover-glow">
                <Palette className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Themes</span>
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">21</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-accent/20 w-64 bg-background/95 backdrop-blur-md z-[60]">
              <DropdownMenuItem onClick={() => navigate('/theme-manager')} className="hover-float">
                <Palette className="w-4 h-4 mr-2" />
                Theme Manager
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {Object.values(allThemes).slice(0, 6).map((theme) => (
                <DropdownMenuItem key={theme.name} onClick={() => setTheme(theme.name as ThemeName)} className="hover-float">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.colors.accent }}></div>
                  {theme.displayName}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => navigate('/theme-manager')} className="hover-float">
                <span className="text-accent">+ View All Themes</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Menu */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="glass border-accent/20 hover-float text-hover-glow">
                <Menu className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-accent/20 w-56 bg-background/95 backdrop-blur-md z-[60] overflow-visible">
              {navItems.slice(8).map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem 
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`hover-float ${isActive(item.path) ? 'bg-accent/20' : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
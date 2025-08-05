import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeName, themes } from '@/types/themes';

// Shape styles for background layer only - generous sizing to accommodate content
const getShapeStyles = (panelShape: string): string => {
  switch (panelShape) {
    case 'circle': 
      return `
        border-radius: 50%; 
        min-width: 8rem;
        min-height: 8rem;
        width: 100%;
        height: 100%;
      `;
    case 'oval': 
      return `
        border-radius: 50%; 
        min-width: 10rem;
        min-height: 6rem;
        width: 100%;
        height: 100%;
        transform: scaleY(0.8);
      `;
    case 'rounded-rectangle': 
      return `
        border-radius: 1rem; 
        min-width: 8rem;
        min-height: 4rem;
        width: 100%;
        height: 100%;
      `;
    case 'square': 
      return `
        border-radius: 0.75rem; 
        min-width: 8rem;
        min-height: 8rem;
        width: 100%;
        height: 100%;
      `;
    case 'hexagon': 
      return `
        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        min-width: 10rem;
        min-height: 6rem;
        width: 100%;
        height: 100%;
      `;
    case 'trapezoid': 
      return `
        clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
        min-width: 10rem;
        min-height: 5rem;
        width: 100%;
        height: 100%;
      `;
    case 'capsule': 
      return `
        border-radius: 50px; 
        min-width: 12rem;
        min-height: 4rem;
        width: 100%;
        height: 100%;
      `;
    case 'parallelogram': 
      return `
        clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);
        min-width: 10rem;
        min-height: 5rem;
        width: 100%;
        height: 100%;
      `;
    case 'rounded-diamond': 
      return `
        clip-path: polygon(50% 0%, 90% 50%, 50% 100%, 10% 50%);
        min-width: 10rem;
        min-height: 8rem;
        width: 100%;
        height: 100%;
      `;
    default: 
      return `
        border-radius: 1rem; 
        min-width: 8rem;
        min-height: 4rem;
        width: 100%;
        height: 100%;
      `;
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: ThemeName) => void;
  allThemes: typeof themes;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.ClericProtocol);

  const setTheme = (themeName: ThemeName) => {
    const newTheme = themes[themeName];
    if (!newTheme) {
      console.error(`Theme "${themeName}" not found, using default`);
      return;
    }
    
    setCurrentTheme(newTheme);
    
    // Apply theme colors to CSS custom properties - both theme and semantic tokens
    const root = document.documentElement;
    
    // Theme-specific variables
    root.style.setProperty('--theme-background', newTheme.colors.background);
    root.style.setProperty('--theme-text', newTheme.colors.text);
    root.style.setProperty('--theme-accent', newTheme.colors.accent);
    root.style.setProperty('--theme-highlight', newTheme.colors.highlight);
    root.style.setProperty('--theme-shadow', newTheme.colors.shadow);
    
    // Convert hex to HSL for semantic tokens
    const hexToHsl = (hex: string): string => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    // Apply to semantic design system tokens
    root.style.setProperty('--background', hexToHsl(newTheme.colors.background));
    root.style.setProperty('--foreground', hexToHsl(newTheme.colors.text));
    root.style.setProperty('--primary', hexToHsl(newTheme.colors.accent));
    root.style.setProperty('--primary-foreground', hexToHsl(newTheme.colors.background));
    root.style.setProperty('--secondary', hexToHsl(newTheme.colors.shadow));
    root.style.setProperty('--secondary-foreground', hexToHsl(newTheme.colors.text));
    root.style.setProperty('--accent', hexToHsl(newTheme.colors.accent));
    root.style.setProperty('--accent-foreground', hexToHsl(newTheme.colors.background));
    root.style.setProperty('--muted', hexToHsl(newTheme.colors.shadow));
    root.style.setProperty('--muted-foreground', hexToHsl(newTheme.colors.text));
    root.style.setProperty('--border', hexToHsl(newTheme.colors.accent));
    root.style.setProperty('--input', hexToHsl(newTheme.colors.accent));
    root.style.setProperty('--ring', hexToHsl(newTheme.colors.accent));
    
    // Apply layout and animation classes to body (controlled animations)
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('layout-') && !cls.startsWith('animate-'))
      .concat([newTheme.layoutClass, newTheme.animationClass])
      .join(' ');
      
    // Apply global theme styles to elements
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    
    // Remove existing dynamic styles
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Theme-specific text glow colors based on theme requirements
    const getThemeTextGlow = (themeName: ThemeName): string => {
      switch (themeName) {
        case 'CombatArenaNullZone':
          return '#9d4edd'; // Purple neon glow for Combat Arena
        case 'ShadowDirective':
          return '#ffffff'; // Crisp white neon glow for Shadow Directive
        case 'ArcologyBlock':
          return '#00ffd2'; // Electric-blue neon glow for Arcology Block
        case 'SyntheLoom':
          return '#00ffd2'; // Bright neon cyan for SyntheLoom
        case 'OrbitalCitadel':
          return '#3399ff'; // Bright neon-blue for Orbital Citadel
        default:
          return newTheme.colors.accent; // Default theme accent color
      }
    };
    
    const themeTextGlow = getThemeTextGlow(newTheme.name);
    
    style.textContent = `
      /* Universal BioLock Shell technique - text/buttons hover outside shapes */
      .glass-card.theme-shape, .theme-shape { 
        position: relative !important;
        isolation: isolate !important;
        contain: layout style !important;
        transition: all 0.25s ease-in-out !important;
        overflow: visible !important;
        z-index: 1 !important;
        padding: 2rem 2.5rem !important; /* Generous padding for content outside shapes */
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
      }
      
      /* Shape background layer - renders behind content with minimum sizing */
      .glass-card.theme-shape::before, .theme-shape::before {
        content: '' !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        ${getShapeStyles(newTheme.panelShape)}
        background: linear-gradient(135deg, ${newTheme.colors.background}CC, ${newTheme.colors.shadow}AA) !important;
        border: 1px solid ${newTheme.colors.accent}60 !important;
        transition: all 0.25s ease-in-out !important;
        z-index: -1 !important;
        min-width: 12rem !important;
        min-height: 8rem !important;
      }
      
      /* Content layer - renders independently above shapes */
      .glass-card.theme-shape > *, .theme-shape > * {
        position: relative !important;
        z-index: 10 !important;
        color: ${themeTextGlow} !important;
        text-shadow: 0 0 12px ${themeTextGlow}90, 0 0 24px ${themeTextGlow}50, 0 2px 4px rgba(0,0,0,0.8) !important;
        margin: 0.25rem 0 !important;
        transition: all 0.25s ease-out !important;
      }

      /* Specific theme fixes for navbar and text visibility */
      .theme-registry-origin .navbar-responsive,
      .theme-cleric-protocol .navbar-responsive,
      .theme-precog-lattice .navbar-responsive,
      .theme-orbital-citadel .navbar-responsive,
      .theme-biolock-shell .navbar-responsive,
      .theme-echo-subnet .navbar-responsive {
        background: linear-gradient(135deg, 
          hsl(var(--background) / 0.95), 
          hsl(var(--chrome-dark) / 0.8)
        );
        backdrop-filter: blur(12px);
      }
      
      /* BioLock Shell - Use Containment Node navbar implementation with correct selector */
      .layout-biolock .navbar-responsive {
        /* Remove oval clipping */
        clip-path: none !important;
        mask: none !important;
        overflow: visible auto !important;

        /* Pill-shaped flex container */
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 0.75rem !important;

        /* Horizontal scrolling */
        overflow-x: auto !important;
        white-space: nowrap !important;

        /* Rounded rectangle styling */
        padding: 0.75rem 1rem !important;
        border-radius: 1rem !important;
        backdrop-filter: blur(12px) !important;

        /* Background, border, shadow (from Containment Node) */
        background: rgba(20, 20, 20, 0.85) !important;
        border: 1px solid rgba(75, 170, 95, 0.3) !important;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.4) !important;
      }

      .layout-biolock .navbar-responsive a,
      .layout-biolock .navbar-responsive button {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        white-space: nowrap !important;
        padding: 0.5rem 1rem !important;
        flex-shrink: 0 !important;
      }

      /* Enhanced text contrast for problematic themes */
      .theme-orbital-citadel .hover-float,
      .theme-orbital-citadel .text-hover-glow,
      .theme-orbital-citadel button,
      .theme-orbital-citadel .btn {
        color: #3399ff !important;
        text-shadow: 0 0 15px #3399ff, 0 0 25px #3399ff50, 0 2px 4px rgba(0,0,0,0.9) !important;
      }

      .theme-echo-subnet .hover-float,
      .theme-cleric-protocol .hover-float {
        text-shadow: 0 0 12px hsl(var(--neon-cyan)), 0 0 20px hsl(var(--neon-cyan) / 0.7);
      }
      
      /* Hover effects - only shape scales, content stays fixed */
      .glass-card.theme-shape:hover::before, .theme-shape:hover::before {
        transform: translate(-50%, -50%) scale(1.05) !important;
        border-color: ${newTheme.colors.accent}80 !important;
        box-shadow: 0 0 25px ${newTheme.colors.accent}60 !important;
      }
      
      /* Enhanced text visibility with theme-specific neon glow */
      .neon-text { 
        color: ${themeTextGlow} !important;
        text-shadow: 0 0 15px ${themeTextGlow}90, 0 0 30px ${themeTextGlow}60, 0 2px 4px rgba(0,0,0,0.9) !important;
        transition: all 0.25s ease-out !important;
        position: relative !important;
        z-index: 15 !important;
      }
      
      /* Force theme-specific text colors for all interactive elements */
      button, .btn, [role="button"], .clickable {
        color: ${themeTextGlow} !important;
        text-shadow: 0 0 10px ${themeTextGlow}80, 0 0 20px ${themeTextGlow}50 !important;
        transition: all 0.25s ease-out !important;
        position: relative !important;
        z-index: 12 !important;
      }
      
      /* Override any problematic text colors */
      .text-black, [style*="color: black"], [style*="color: #000"] {
        color: ${themeTextGlow} !important;
        text-shadow: 0 0 8px ${themeTextGlow}80 !important;
      }
      
      /* Global Navbar & Button Alignment Fix - Works Across All Themes */
      
      /* Navbar Container - Horizontal Scroll Support */
      nav, .navbar-responsive {
        overflow-x: auto !important;
        flex-wrap: nowrap !important;
        scrollbar-gutter: stable !important;
        padding: 0.5rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }
      
      /* Navbar Links - Icon + Label Side by Side */
      nav a, nav button, .navbar-responsive a, .navbar-responsive button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 0.5rem !important;
        white-space: nowrap !important;
        padding: 0.5rem 1rem !important;
        min-height: 2.5rem !important;
        min-width: fit-content !important;
        flex-shrink: 0 !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        border-radius: 0.375rem !important;
        transition: all 0.2s ease !important;
        overflow: visible !important;
      }
      
      /* Icons within navbar buttons */
      nav a svg, nav button svg, .navbar-responsive a svg, .navbar-responsive button svg {
        margin-right: 0.5rem !important;
        flex-shrink: 0 !important;
        width: 1rem !important;
        height: 1rem !important;
      }
      
      /* Enhanced button styling with proper alignment */
      .btn-neon, button:not(.btn-ghost) { 
        border: 1px solid ${newTheme.colors.accent} !important;
        color: ${themeTextGlow} !important;
        background: linear-gradient(135deg, ${newTheme.colors.background}10, ${newTheme.colors.accent}05) !important;
        backdrop-filter: blur(8px) !important;
        transition: all 0.25s ease-out !important;
        position: relative !important;
        z-index: 25 !important;
        padding: 0.75rem 1.25rem !important;
        border-radius: 0.5rem !important;
        text-shadow: 0 0 12px ${themeTextGlow}80, 0 0 24px ${themeTextGlow}50 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.5rem !important;
        white-space: nowrap !important;
        min-height: 2.75rem !important;
        min-width: fit-content !important;
        font-size: 0.95rem !important;
        font-weight: 500 !important;
        line-height: 1.2 !important;
        flex-shrink: 0 !important;
        overflow: visible !important;
      }
      
      /* Page & Card Buttons - Icon + Label Layout */
      .glass-card button, .theme-shape button, .customization-panel button,
      main button, section button, .card button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0.5rem !important;
        padding: 0.75rem 1.25rem !important;
        white-space: nowrap !important;
        min-height: 3rem !important;
        min-width: fit-content !important;
        margin: 0.25rem !important;
        flex-shrink: 0 !important;
        overflow: visible !important;
      }
      
      /* Icons within all buttons */
      button svg, .btn-neon svg {
        margin-right: 0.5rem !important;
        flex-shrink: 0 !important;
        width: 1.1rem !important;
        height: 1.1rem !important;
      }
      
      /* Ensure button content stays contained */
      .btn-neon *, button:not(.btn-ghost) * {
        position: relative !important;
        z-index: 1 !important;
        max-width: 100% !important;
        text-overflow: inherit !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .btn-neon:hover, button:not(.btn-ghost):hover {
        background: ${newTheme.colors.accent}30 !important;
        color: ${newTheme.colors.background} !important;
        box-shadow: 0 0 20px ${newTheme.colors.accent}70 !important;
        text-shadow: none !important;
        transform: translateY(-2px) scale(1.02) !important; /* Slight scale on hover */
      }
      
      /* Combat Arena - Replace octagon with rounded rectangle and BioLock Shell method */
      ${newTheme.name === 'CombatArenaNullZone' ? `
        .layout-combatarena .theme-shape::before {
          border-radius: 1rem !important;
          clip-path: none !important;
          background: linear-gradient(135deg, rgba(204, 0, 0, 0.1), rgba(204, 0, 0, 0.05)) !important;
          border: 1px solid rgba(204, 0, 0, 0.3) !important;
          backdrop-filter: blur(8px) !important;
          min-width: 12rem !important;
          min-height: 8rem !important;
        }
        .layout-combatarena .theme-shape > * {
          color: #9d4edd !important;
          text-shadow: 0 0 15px #9d4edd90, 0 0 25px #9d4edd50, 0 2px 4px rgba(0,0,0,0.8) !important;
        }
      ` : ''}
      
      /* Codefall Core - Matrix-style navbar and proper text containment */
      ${newTheme.name === 'CodefallCore' ? `
        /* Matrix-style navbar with Digital-Rain Green text */
        .layout-codefall .navbar-responsive,
        .layout-codefall nav {
          background: #000000 !important; /* Pure black background */
          border-bottom: 1px solid rgba(0, 255, 0, 0.3) !important;
          backdrop-filter: blur(8px) !important;
        }
        
        /* Matrix-style navbar text with neon glow */
        .layout-codefall .navbar-responsive a,
        .layout-codefall nav a,
        .layout-codefall .navbar-responsive button,
        .layout-codefall nav button,
        .layout-codefall .navbar-responsive .text-lg,
        .layout-codefall nav .text-lg {
          color: #00FF00 !important; /* Digital-Rain Green */
          text-shadow: 0 0 4px rgba(0,255,0,0.8), 0 0 8px rgba(0,255,0,0.6), 0 0 12px rgba(0,255,0,0.4) !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
        }
        
        /* Matrix-style navbar hover effects */
        .layout-codefall .navbar-responsive a:hover,
        .layout-codefall nav a:hover,
        .layout-codefall .navbar-responsive button:hover,
        .layout-codefall nav button:hover {
          color: #00FF00 !important;
          text-shadow: 0 0 6px rgba(0,255,0,1), 0 0 12px rgba(0,255,0,0.8), 0 0 18px rgba(0,255,0,0.6) !important;
          background: rgba(0,255,0,0.1) !important;
        }
        
        /* Matrix-style navbar brand/logo */
        .layout-codefall .navbar-responsive .font-bold,
        .layout-codefall nav .font-bold {
          color: #00FF00 !important;
          text-shadow: 0 0 8px rgba(0,255,0,0.9), 0 0 16px rgba(0,255,0,0.7) !important;
        }
        
        .layout-codefall .glass-card, .layout-codefall .theme-shape {
          text-align: center !important;
          justify-content: center !important;
          align-items: center !important;
        }
        .layout-codefall button, .layout-codefall .btn {
          margin: 0 auto !important;
          display: block !important;
          position: relative !important;
          z-index: 1 !important;
        }
        
        /* Override BioLock Shell text floating - keep text contained in Codefall Core */
        .layout-codefall button *,
        .layout-codefall .btn *,
        .layout-codefall .glass-card *,
        .layout-codefall .theme-shape * {
          position: relative !important;
          z-index: 1 !important;
          transform: none !important;
          clip-path: none !important;
        }
        
        /* Ensure button text stays within button boundaries */
        .layout-codefall button,
        .layout-codefall .btn {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.375rem !important;
        }
        
        /* Remove any floating text effects specific to Codefall Core */
        .layout-codefall .hover-float {
          transform: none !important;
          position: relative !important;
        }
      ` : ''}
      
      /* Orbital Citadel - Remove octagon, use BioLock Shell transparent glass method */
      ${newTheme.name === 'OrbitalCitadel' ? `
        .layout-orbitalcitadel .theme-shape::before {
          border-radius: 1rem !important;
          clip-path: none !important;
          background: linear-gradient(135deg, rgba(51, 153, 255, 0.1), rgba(51, 153, 255, 0.05)) !important;
          border: 1px solid rgba(51, 153, 255, 0.3) !important;
          backdrop-filter: blur(8px) !important;
          min-width: 12rem !important;
          min-height: 8rem !important;
        }
        .layout-orbitalcitadel .theme-shape > * {
          color: #3399ff !important;
          text-shadow: 0 0 15px #3399ff90, 0 0 25px #3399ff50, 0 2px 4px rgba(0,0,0,0.8) !important;
        }
      ` : ''}
      
      /* NeuroSynth Mirage - BioLock Shell technique with rounded diamond */
      ${newTheme.name === 'NeuroSynthMirage' ? `
        .layout-neurosynth .theme-shape::before {
          border-radius: 12px !important;
          min-width: 14rem !important;
          min-height: 10rem !important;
          background: linear-gradient(135deg, rgba(170, 255, 255, 0.1), rgba(170, 255, 255, 0.05)) !important;
          border: 1px solid rgba(170, 255, 255, 0.3) !important;
          backdrop-filter: blur(8px) !important;
        }
        .layout-neurosynth .theme-shape > * {
          color: #aaffff !important;
          text-shadow: 0 0 15px #aaffff90, 0 0 25px #aaffff50, 0 2px 4px rgba(0,0,0,0.8) !important;
        }
      ` : ''}
      
      /* Echo Subnet - Remove double shapes and erratic movement */
      ${newTheme.name === 'EchoSubnet' ? `
        .layout-echo .glass-card::before {
          display: none !important;
        }
        .layout-echo .theme-shape {
          overflow: hidden !important;
        }
        .layout-echo .theme-shape::before {
          clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%) !important;
          animation: none !important;
          transform: translate(-50%, -50%) !important;
          border-radius: 0 !important;
        }
      ` : ''}
      
      /* Card styling without shape interference */
      .glass-card:not(.theme-shape) {
        background: linear-gradient(135deg, ${newTheme.colors.background}CC, ${newTheme.colors.shadow}88) !important;
        border-color: ${newTheme.colors.accent}40 !important;
        transition: all 0.25s ease-out !important;
      }
      
      /* Remove ALL aggressive animations - only allow subtle hover */
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-iteration-count: 1 !important;
      }
      
      /* Gentle button pulse on hover only */
      .hover-glow:hover, button:hover {
        box-shadow: 0 0 15px ${newTheme.colors.accent}50 !important;
        transition: box-shadow 0.25s ease-out !important;
      }
      
      /* Override Halo theme switching fix */
      ${newTheme.name === 'OverrideHalo' ? `
        .layout-overridehalo .glass-card::before {
          animation: none !important;
        }
      ` : ''}
      
      /* Responsive padding adjustments for zoom levels */
      @media (min-resolution: 125dpi) {
        .theme-shape {
          padding: 2.5rem 3rem !important;
        }
      }
      
      @media (min-resolution: 150dpi) {
        .theme-shape {
          padding: 3rem 3.5rem !important;
        }
      }
      
      @media (min-resolution: 200dpi) {
        .theme-shape {
          padding: 4rem 5rem !important;
        }
      }
    `;
    
    document.head.appendChild(style);
      
    // Store theme preference
    localStorage.setItem('chronoverse-theme', themeName);
  };

  useEffect(() => {
    // Load saved theme on mount
    const savedTheme = localStorage.getItem('chronoverse-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme, 
        setTheme, 
        allThemes: themes 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
export type ThemeName =
  | 'ClericProtocol'
  | 'PrecogLattice'
  | 'CodefallCore'
  | 'ContainmentNode'
  | 'KInterfaceDrive'
  | 'NeuroSynthMirage'
  | 'OrbitalCitadel'
  | 'EchoSubnet'
  | 'CryoVaultGrid'
  | 'FoglineDrift'
  | 'ShadowDirective'
  | 'BioLockShell'
  | 'VaultedHorizon'
  | 'SyntheLoom'
  | 'CombatArenaNullZone'
  | 'OverrideHalo'
  | 'CloneSpanConsole'
  | 'SimulationDeck'
  | 'ArcologyBlock'
  | 'ProtocolChain'
  | 'RegistryOrigin';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    highlight: string;
    shadow: string;
  };
  layoutClass: string;
  panelShape: string;
  animationClass: string;
}

export const themes: Record<ThemeName, Theme> = {
  ClericProtocol: {
    name: 'ClericProtocol',
    displayName: 'Cleric Protocol',
    colors: {
      background: '#0a0a0f',
      text: '#e8eaef',
      accent: '#00ffd2',
      highlight: '#ffc800',
      shadow: '#0b0d13',
    },
    layoutClass: 'layout-cleric',
    panelShape: 'circle',
    animationClass: 'animate-subtle-glow',
  },
  PrecogLattice: {
    name: 'PrecogLattice',
    displayName: 'Precog Lattice',
    colors: {
      background: '#0c0e14',
      text: '#f2f4f8',
      accent: '#7af3ff',
      highlight: '#ffd97a',
      shadow: '#0a0c14',
    },
    layoutClass: 'layout-lattice',
    panelShape: 'hexagon',
    animationClass: 'animate-subtle-pulse',
  },
  CodefallCore: {
    name: 'CodefallCore',
    displayName: 'Codefall Core',
    colors: {
      background: '#001100',
      text: '#00ff00',
      accent: '#00cc00',
      highlight: '#55ff55',
      shadow: '#002200',
    },
    layoutClass: 'layout-codefall',
    panelShape: 'rounded-rectangle',
    animationClass: 'animate-subtle-glow',
  },
  ContainmentNode: {
    name: 'ContainmentNode',
    displayName: 'Containment Node',
    colors: {
      background: '#141414',
      text: '#f0f0f0',
      accent: '#ff4444',
      highlight: '#ff7777',
      shadow: '#111111',
    },
    layoutClass: 'layout-containment',
    panelShape: 'oval',
    animationClass: 'animate-subtle-pulse',
  },
  KInterfaceDrive: {
    name: 'KInterfaceDrive',
    displayName: 'K-Interface Drive',
    colors: {
      background: '#121212',
      text: '#00ffff',
      accent: '#009999',
      highlight: '#33cccc',
      shadow: '#0b0b0b',
    },
    layoutClass: 'layout-kinterface',
    panelShape: 'rounded-rectangle',
    animationClass: 'animate-subtle-glow',
  },
  NeuroSynthMirage: {
    name: 'NeuroSynthMirage',
    displayName: 'NeuroSynth Mirage',
    colors: {
      background: '#050505',
      text: '#aaffff',
      accent: '#66cccc',
      highlight: '#99eeee',
      shadow: '#020202',
    },
    layoutClass: 'layout-neurosynth',
    panelShape: 'rounded-diamond',
    animationClass: 'animate-subtle-pulse',
  },
  OrbitalCitadel: {
    name: 'OrbitalCitadel',
    displayName: 'Orbital Citadel',
    colors: {
      background: '#0a1128',
      text: '#cce7ff',
      accent: '#0055cc',
      highlight: '#3399ff',
      shadow: '#071122',
    },
    layoutClass: 'layout-orbital',
    panelShape: 'hexagon',
    animationClass: 'animate-subtle-glow',
  },
  EchoSubnet: {
    name: 'EchoSubnet',
    displayName: 'Echo Subnet',
    colors: {
      background: '#121f3d',
      text: '#e0f0ff',
      accent: '#3399ff',
      highlight: '#66bbff',
      shadow: '#0c1626',
    },
    layoutClass: 'layout-echo',
    panelShape: 'trapezoid',
    animationClass: 'animate-subtle-pulse',
  },
  CryoVaultGrid: {
    name: 'CryoVaultGrid',
    displayName: 'CryoVault Grid',
    colors: {
      background: '#1a2633',
      text: '#d1e8f7',
      accent: '#7fd1ff',
      highlight: '#a9d8ff',
      shadow: '#131f29',
    },
    layoutClass: 'layout-cryovault',
    panelShape: 'hexagon',
    animationClass: 'animate-subtle-glow',
  },
  FoglineDrift: {
    name: 'FoglineDrift',
    displayName: 'Fogline Drift',
    colors: {
      background: '#252f3f',
      text: '#c8d8e4',
      accent: '#5f7a99',
      highlight: '#8aa0b8',
      shadow: '#1c2430',
    },
    layoutClass: 'layout-fogline',
    panelShape: 'capsule',
    animationClass: 'animate-subtle-pulse',
  },
  ShadowDirective: {
    name: 'ShadowDirective',
    displayName: 'Shadow Directive',
    colors: {
      background: '#0c0c0c',
      text: '#a0a0a0',
      accent: '#505050',
      highlight: '#707070',
      shadow: '#040404',
    },
    layoutClass: 'layout-shadow',
    panelShape: 'rounded-rectangle',
    animationClass: 'animate-subtle-glow',
  },
  BioLockShell: {
    name: 'BioLockShell',
    displayName: 'BioLock Shell',
    colors: {
      background: '#041e11',
      text: '#a6e7a1',
      accent: '#4baa5f',
      highlight: '#78d686',
      shadow: '#031409',
    },
    layoutClass: 'layout-biolock',
    panelShape: 'oval',
    animationClass: 'animate-subtle-pulse',
  },
  VaultedHorizon: {
    name: 'VaultedHorizon',
    displayName: 'Vaulted Horizon',
    colors: {
      background: '#102030',
      text: '#a3c6e5',
      accent: '#3f86ed',
      highlight: '#699ce8',
      shadow: '#0c1b2d',
    },
    layoutClass: 'layout-vaulted',
    panelShape: 'oval',
    animationClass: 'animate-subtle-glow',
  },
  SyntheLoom: {
    name: 'SyntheLoom',
    displayName: 'SyntheLoom',
    colors: {
      background: '#1b1f24',
      text: '#d1d1d1',
      accent: '#7a7a7a',
      highlight: '#aaaaaa',
      shadow: '#121518',
    },
    layoutClass: 'layout-syntheloom',
    panelShape: 'parallelogram',
    animationClass: 'animate-subtle-pulse',
  },
  CombatArenaNullZone: {
    name: 'CombatArenaNullZone',
    displayName: 'Combat Arena',
    colors: {
      background: '#220000',
      text: '#ff9999',
      accent: '#cc0000',
      highlight: '#ff3333',
      shadow: '#110000',
    },
    layoutClass: 'layout-combatarena',
    panelShape: 'rounded-rectangle',
    animationClass: 'animate-subtle-glow',
  },
  OverrideHalo: {
    name: 'OverrideHalo',
    displayName: 'Override Halo',
    colors: {
      background: '#101020',
      text: '#a0aaff',
      accent: '#4040ff',
      highlight: '#6060ff',
      shadow: '#080810',
    },
    layoutClass: 'layout-overridehalo',
    panelShape: 'circle',
    animationClass: 'animate-subtle-pulse',
  },
  CloneSpanConsole: {
    name: 'CloneSpanConsole',
    displayName: 'CloneSpan Console',
    colors: {
      background: '#121212',
      text: '#ccddff',
      accent: '#336699',
      highlight: '#5588bb',
      shadow: '#0b0b0b',
    },
    layoutClass: 'layout-clonespan',
    panelShape: 'rounded-diamond',
    animationClass: 'animate-subtle-glow',
  },
  SimulationDeck: {
    name: 'SimulationDeck',
    displayName: 'Simulation Deck',
    colors: {
      background: '#0a1018',
      text: '#d0d8e8',
      accent: '#3d6db3',
      highlight: '#5a85c1',
      shadow: '#060a0f',
    },
    layoutClass: 'layout-simulationdeck',
    panelShape: 'capsule',
    animationClass: 'animate-subtle-pulse',
  },
  ArcologyBlock: {
    name: 'ArcologyBlock',
    displayName: 'Arcology Block',
    colors: {
      background: '#1c1c1c',
      text: '#c5c5c5',
      accent: '#606060',
      highlight: '#808080',
      shadow: '#121212',
    },
    layoutClass: 'layout-arcology',
    panelShape: 'rounded-rectangle',
    animationClass: 'animate-subtle-glow',
  },
  ProtocolChain: {
    name: 'ProtocolChain',
    displayName: 'Protocol Chain',
    colors: {
      background: '#0d0d12',
      text: '#b0b0b5',
      accent: '#4f8cff',
      highlight: '#7aaaff',
      shadow: '#09090d',
    },
    layoutClass: 'layout-protocolchain',
    panelShape: 'hexagon',
    animationClass: 'animate-subtle-pulse',
  },
  RegistryOrigin: {
    name: 'RegistryOrigin',
    displayName: 'Registry: Origin',
    colors: {
      background: '#12141b',
      text: '#d6d7db',
      accent: '#00ffff',
      highlight: '#ffcc00',
      shadow: '#0e1015',
    },
    layoutClass: 'layout-registry',
    panelShape: 'square',
    animationClass: 'animate-subtle-glow',
  },
};
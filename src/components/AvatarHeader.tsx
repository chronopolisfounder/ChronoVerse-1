import React from 'react'
import { User as UserIcon, Palette, Activity, Heart, Settings } from 'lucide-react'

export type AvatarTab = 'appearance' | 'stats' | 'biometrics' | 'settings'

interface AvatarHeaderProps {
  displayName: React.ReactNode
  avatarUrl?: string
  level: number
  statusLabel: string
  verified: boolean
  onCustomize: () => void
  activeTab: AvatarTab
  onTabChange: (tab: AvatarTab) => void
}

const tabs: { label: string; value: AvatarTab; icon: React.ComponentType<any> }[] = [
  { label: 'Appearance', value: 'appearance', icon: Palette },
  { label: 'Stats', value: 'stats', icon: Activity },
  { label: 'Biometrics', value: 'biometrics', icon: Heart },
  { label: 'Settings', value: 'settings', icon: Settings },
]

const AvatarHeader: React.FC<AvatarHeaderProps> = ({
  displayName,
  avatarUrl,
  level,
  statusLabel,
  verified,
  onCustomize,
  activeTab,
  onTabChange,
}) => (
  <header className="bg-gradient-to-r from-[#112] to-[#223] p-6 rounded-b-lg space-y-4">
    <div className="max-w-4xl mx-auto flex items-center space-x-6">
      <div className="w-24 h-24 rounded-full bg-[#123] overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-full h-full text-[#456]" />
        )}
      </div>
      <div>
        <h1 className="text-4xl font-bold text-white">{displayName}</h1>
        <p className="text-sm text-gray-300 mt-1">
          Level {level} • {statusLabel} {verified && '• Verified'}
        </p>
      </div>
      <button
        onClick={onCustomize}
        className="ml-auto px-4 py-2 border border-[#0af] text-white rounded hover:bg-[#0af]/20"
      >
        Customize Avatar
      </button>
    </div>
    <nav className="max-w-4xl mx-auto">
      <ul className="flex space-x-4">
        {tabs.map(({ label, value, icon: Icon }) => (
          <li key={value}>
            <button
              onClick={() => onTabChange(value)}
              className={`flex items-center space-x-1 py-2 px-3 rounded-b-lg border-b-2 transition-colors ${
                activeTab === value
                  ? 'border-[#0af] text-white'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </header>
)

export default AvatarHeader

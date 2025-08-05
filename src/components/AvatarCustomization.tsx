// src/components/AvatarCustomization.tsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const HAIRSTYLES = ['Short', 'Long', 'Curly', 'Spiked', 'Bald']
const FACE_SHAPES = ['Oval', 'Round', 'Square', 'Angular']
const BODY_TYPES = ['Slim', 'Athletic', 'Stocky']
const CLOTHING = ['Flight Suit', 'Lab Coat', 'Streetwear', 'Stealth Suit']
const ACCESSORIES = ['Visor', 'Headset', 'Necklace', 'Chrono Badge']

type CustomizationState = {
  hairstyle: string
  faceShape: string
  bodyType: string
  clothing: string
  accessories: string[]
}

const defaultState: CustomizationState = {
  hairstyle: 'Short',
  faceShape: 'Oval',
  bodyType: 'Athletic',
  clothing: 'Flight Suit',
  accessories: []
}

const AvatarCustomization: React.FC<{
  onSave?: (state: CustomizationState) => void
}> = ({ onSave }) => {
  const [state, setState] = useState<CustomizationState>(defaultState)

  function handleAccessoryToggle(item: string) {
    setState((prev) => ({
      ...prev,
      accessories: prev.accessories.includes(item)
        ? prev.accessories.filter((a) => a !== item)
        : [...prev.accessories, item]
    }))
  }

  return (
    <div className="glass-card border-accent/20 p-8 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold neon-text mb-2">Customize Your Avatar</h2>

      {/* Hairstyle */}
      <div>
        <label className="block font-semibold mb-1">Hairstyle</label>
        <div className="flex gap-2 flex-wrap">
          {HAIRSTYLES.map((style) => (
            <Button
              key={style}
              type="button"
              variant={state.hairstyle === style ? 'default' : 'outline'}
              className="glass"
              onClick={() => setState((s) => ({ ...s, hairstyle: style }))}
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      {/* Face Shape */}
      <div>
        <label className="block font-semibold mb-1">Face Shape</label>
        <div className="flex gap-2 flex-wrap">
          {FACE_SHAPES.map((shape) => (
            <Button
              key={shape}
              type="button"
              variant={state.faceShape === shape ? 'default' : 'outline'}
              className="glass"
              onClick={() => setState((s) => ({ ...s, faceShape: shape }))}
            >
              {shape}
            </Button>
          ))}
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="block font-semibold mb-1">Body Type</label>
        <div className="flex gap-2 flex-wrap">
          {BODY_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant={state.bodyType === type ? 'default' : 'outline'}
              className="glass"
              onClick={() => setState((s) => ({ ...s, bodyType: type }))}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Clothing */}
      <div>
        <label className="block font-semibold mb-1">Clothing</label>
        <div className="flex gap-2 flex-wrap">
          {CLOTHING.map((item) => (
            <Button
              key={item}
              type="button"
              variant={state.clothing === item ? 'default' : 'outline'}
              className="glass"
              onClick={() => setState((s) => ({ ...s, clothing: item }))}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <label className="block font-semibold mb-1">Accessories</label>
        <div className="flex gap-2 flex-wrap">
          {ACCESSORIES.map((item) => (
            <Button
              key={item}
              type="button"
              variant={state.accessories.includes(item) ? 'default' : 'outline'}
              className="glass"
              onClick={() => handleAccessoryToggle(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          className="btn-neon"
          onClick={() => onSave?.(state)}
        >
          Save Customization
        </Button>
      </div>
    </div>
  )
}

export default AvatarCustomization

// src/entities/User.ts
import { supabase } from '@/integrations/supabase/client'
import type { UserProfile } from './types'

/**
 * User entity for fetching and updating user-specific data.
 */
export interface UserProfile {
  id: string
  email: string
  avatar_config?: Record<string, any>
  health_score?: number
  [key: string]: any
}

export class User {
  /** Fetch current user’s profile (session + extra fields) */
  static async me(): Promise<UserProfile> {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) {
      throw sessionError || new Error('No active session')
    }
    const user = sessionData.session.user

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('avatar_config, health_score')
      .eq('id', user.id)
      .single()
    if (profileError) throw profileError

    return {
      id: user.id,
      email: user.email || '',
      avatar_config: profile.avatar_config,
      health_score: profile.health_score,
      ...user.user_metadata,
    }
  }

  /** Upsert avatar_config back into profiles table */
  static async updateMyUserData(changes: Partial<Pick<UserProfile, 'avatar_config'>>): Promise<void> {
    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData?.session?.user
    if (!user) throw new Error('No active user session')

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...changes }, { returning: 'minimal' })
    if (error) throw error
  }
}

import { supabase } from '../lib/supabase';

export interface ProfileUpdateInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
}

export const profileService = {
  async getProfile(userId: string) {
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (pErr) throw pErr;

    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', userId);

    const roles = rolesData?.map((ur: any) => ur.roles?.name).filter(Boolean) || ['student'];

    return {
      ...profile,
      roles
    };
  },

  async updateProfile(userId: string, input: ProfileUpdateInput) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: input.firstName,
        last_name: input.lastName,
        display_name: input.displayName,
        avatar_url: input.avatarUrl,
        bio: input.bio,
        phone: input.phone,
        website: input.website,
        location: input.location,
        timezone: input.timezone,
        language: input.language
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

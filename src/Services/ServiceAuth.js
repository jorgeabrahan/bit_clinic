import { supabase } from '@/config/supabase';

export class ServiceAuth {
  static async restoreSession() {
    try {
      const resGetSession = await supabase.auth.getSession();
      const sessionUser = resGetSession.data?.session?.user;
      if (resGetSession.error || !sessionUser?.id) {
        throw resGetSession.error;
      }
      const resUserProfilesSelect = await supabase
        .from('user_profiles')
        .select(
          '*, pharmacy_managers(*, pharmacies(*)), branch_managers(*, branches(*))',
        )
        .eq('id', sessionUser?.id)
        .maybeSingle();
      if (resUserProfilesSelect.error) {
        throw resUserProfilesSelect.error;
      }
      return {
        ok: true,
        error: null,
        data: {
          email: sessionUser?.email,
          ...resUserProfilesSelect.data,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
        data: null,
      };
    }
  }
  static async signIn({ email = '', password = '' }) {
    try {
      const resSignIn = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (resSignIn.error || !resSignIn.data?.user?.id) {
        throw resSignIn.error;
      }
      const resUserProfilesSelect = await supabase
        .from('user_profiles')
        .select(
          '*, pharmacy_managers(*, pharmacies(*)), branch_managers(*, branches(*))',
        )
        .eq('id', resSignIn.data.user?.id)
        .maybeSingle();

      if (resUserProfilesSelect.error) {
        throw resUserProfilesSelect.error;
      }
      return {
        ok: true,
        error: null,
        data: {
          email: resSignIn.data.user?.email,
          ...resUserProfilesSelect.data,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
        data: null,
      };
    }
  }
  static async signUp({
    displayName = '',
    email = '',
    password = '',
    phone = '',
    birthdate = '',
  }) {
    try {
      const resSignUp = await supabase.auth.signUp({
        email,
        password,
      });
      if (resSignUp.error || !resSignUp.data?.user?.id) {
        throw resSignUp.error;
      }
      const resUserProfiles = await supabase
        .from('user_profiles')
        .insert({
          id: resSignUp.data.user?.id,
          display_name: displayName,
          phone,
          birthdate,
        })
        .select(
          '*, pharmacy_managers(*, pharmacies(*)), branch_managers(*, branches(*))',
        )
        .maybeSingle();

      if (resUserProfiles.error) {
        throw resUserProfiles.error;
      }
      return {
        ok: true,
        error: null,
        data: {
          id_user: resSignUp.data.user?.id,
          email: resSignUp.data.user?.email,
          ...resUserProfiles.data,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error,
        data: null,
      };
    }
  }
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return {
        ok: true,
        error: null,
        data: null,
      };
    } catch (error) {
      return {
        ok: false,
        error,
        data: null,
      };
    }
  }
}

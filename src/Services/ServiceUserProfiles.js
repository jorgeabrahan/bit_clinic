import { supabase } from '@/config/supabase';

export class ServiceUserProfiles {
  static async update({
    id = '',
    display_name = '',
    phone = '',
    birthdate = '',
  }) {
    try {
      const resUserProfilesUpdate = await supabase
        .from('user_profiles')
        .update({
          display_name,
          phone,
          birthdate,
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (resUserProfilesUpdate.error) {
        throw resUserProfilesUpdate.error;
      }
      return {
        ok: true,
        error: null,
        data: resUserProfilesUpdate.data,
      };
    } catch (error) {
      return {
        ok: false,
        error,
        data: null,
      };
    }
  }

  static async getBranchManagerAvailableUserById(id = '') {
    try {
      const branchCheck = await supabase
        .from('branch_managers')
        .select('id_user')
        .eq('id_user', id)
        .maybeSingle();

      if (branchCheck.data) {
        return {
          ok: false,
          error: 'Este usuario ya está asignado a una sucursal.',
          data: null,
        };
      }

      const pharmacyCheck = await supabase
        .from('pharmacy_managers')
        .select('id_user')
        .eq('id_user', id)
        .maybeSingle();

      if (pharmacyCheck.data) {
        return {
          ok: false,
          error:
            'Este usuario ya está asignado como administrador de una farmacia.',
          data: null,
        };
      }

      const profileRes = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!profileRes.data) {
        return {
          ok: false,
          error: 'Usuario no encontrado.',
          data: null,
        };
      }

      return {
        ok: true,
        error: null,
        data: profileRes.data,
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.message || 'Error al obtener al usuario',
        data: null,
      };
    }
  }
}

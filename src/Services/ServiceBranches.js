import { supabase } from '@/config/supabase';

export class ServiceBranches {
  static async getAll({ page = 1, limit = 10 }) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const query = supabase
        .from('branches')
        .select('*', { count: 'exact' })
        .range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      return {
        ok: true,
        data,
        total: count || 0,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        total: 0,
        error,
      };
    }
  }

  static async create(branchData) {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert(branchData)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        ok: true,
        data,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error,
      };
    }
  }

  static async update({
    id,
    name,
    department,
    city,
    address_line,
    latitude,
    longitude,
    offers_home_delivery,
    offers_drive_through,
    offers_in_store_service,
  }) {
    try {
      const { data, error } = await supabase
        .from('branches')
        .update({
          name,
          department,
          city,
          address_line,
          latitude,
          longitude,
          offers_home_delivery,
          offers_drive_through,
          offers_in_store_service,
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        ok: true,
        data,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error,
      };
    }
  }

  static async getAssignedUsers(id_branch) {
    try {
      const { data, error } = await supabase
        .from('branch_managers')
        .select('*, user_profiles(*)')
        .eq('id_branch', id_branch);

      if (error) throw error;

      return {
        ok: true,
        data: data.map((bm) => bm?.user_profiles),
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: error?.message || 'Error al obtener los usuarios asignados.',
      };
    }
  }

  static async assignUser({ id_user, id_branch }) {
    try {
      const { data, error } = await supabase
        .from('branch_managers')
        .insert({ id_user, id_branch })
        .select()
        .maybeSingle();

      if (error) throw error;

      return {
        ok: true,
        data,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: error?.message || 'Error al asignar al usuario a la sucursal.',
      };
    }
  }

  static async unassignUser(id_user) {
    try {
      const { error } = await supabase
        .from('branch_managers')
        .delete()
        .eq('id_user', id_user);

      if (error) throw error;

      return {
        ok: true,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        error:
          error?.message || 'Error al desasignar al usuario de la sucursal.',
      };
    }
  }
}

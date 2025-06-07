import { supabase } from '@/config/supabase';

export class ServiceMedicines {
  static async searchByName(name) {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .ilike('name', `%${name}%`)
        .limit(10);

      if (error) throw error;

      return {
        ok: true,
        data,
        error: null,
      };
    } catch (error) {
      return {
        ok: false,
        data: [],
        error: error?.message || 'Error al buscar medicamentos por nombre',
      };
    }
  }
}

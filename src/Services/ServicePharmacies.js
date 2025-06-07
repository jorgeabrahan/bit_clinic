import { supabase } from '@/config/supabase';

export class ServicePharmacies {
  static async update({
    id = '',
    commercial_name = '',
    legal_name = '',
    pharmacy_type = '',
    email = '',
    phone = '',
    website = '',
  }) {
    try {
      const resPharmaciesUpdate = await supabase
        .from('pharmacies')
        .update({
          commercial_name,
          legal_name,
          pharmacy_type,
          email,
          phone,
          website,
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (resPharmaciesUpdate.error) {
        throw resPharmaciesUpdate.error;
      }

      return {
        ok: true,
        error: null,
        data: resPharmaciesUpdate.data,
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

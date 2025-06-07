import DialogBranch from '@/components/dialogs/DialogBranch';
import useForm from '@/hooks/useForm';
import { ServicePharmacies } from '@/Services/ServicePharmacies';
import useStoreUser from '@/stores/useStoreUser';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function TabPharmacy() {
  const [openBranch, setOpenBranch] = useState(false);
  const user = useStoreUser((state) => state.user);
  const storeUpdateUserPharmacy = useStoreUser(
    (state) => state.updateUserPharmacy,
  );
  const pharmacy = useMemo(
    () => user?.pharmacy_managers?.pharmacies || {},
    [user],
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const {
    form,
    commercialName,
    legalName,
    pharmacyType,
    email,
    phone,
    website,
    onChange,
    setValue,
  } = useForm({
    commercialName: pharmacy.commercial_name || '',
    legalName: pharmacy.legal_name || '',
    pharmacyType: pharmacy.pharmacy_type || '',
    email: pharmacy.email || '',
    phone: pharmacy.phone || '',
    website: pharmacy.website || '',
  });

  useEffect(() => {
    setValue(form.commercialName.id, pharmacy.commercial_name || '');
    setValue(form.legalName.id, pharmacy.legal_name || '');
    setValue(form.pharmacyType.id, pharmacy.pharmacy_type || '');
    setValue(form.email.id, pharmacy.email || '');
    setValue(form.phone.id, pharmacy.phone || '');
    setValue(form.website.id, pharmacy.website || '');
  }, [pharmacy]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    form.clearErrors();
    setFormError('');
    setIsUpdating(true);

    const resPharmaciesUpdate = await ServicePharmacies.update({
      id: pharmacy.id,
      commercial_name: commercialName,
      legal_name: legalName,
      pharmacy_type: pharmacyType,
      email,
      phone,
      website,
    });
    setIsUpdating(false);
    setHasChanges(false);
    if (resPharmaciesUpdate.ok) {
      storeUpdateUserPharmacy(resPharmaciesUpdate.data);
      toast.success('Farmacia actualizada exitosamente');
      return;
    }
    const errorMessage = resPharmaciesUpdate.error?.message;
    setFormError(
      typeof errorMessage === 'string'
        ? errorMessage
        : 'Ocurrio un error al actualizar la farmacia',
    );
  };

  useEffect(() => {
    setHasChanges(
      commercialName !== pharmacy.commercial_name ||
        legalName !== pharmacy.legal_name ||
        pharmacyType !== pharmacy.pharmacy_type ||
        email !== pharmacy.email ||
        phone !== pharmacy.phone ||
        website !== pharmacy.website,
    );
  }, [
    commercialName,
    legalName,
    pharmacyType,
    email,
    phone,
    website,
    pharmacy,
  ]);

  return (
    <>
      <Box display='flex' justifyContent='flex-end' mb={2}>
        <Button
          variant='contained'
          startIcon={<SettingsIcon />}
          onClick={() => setOpenBranch(true)}
        >
          Administrar sucursales
        </Button>
      </Box>

      <Box component='form' onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label='Nombre comercial'
          margin='normal'
          required
          name={form.commercialName.id}
          value={form.commercialName.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.commercialName.error}
          helperText={form.commercialName.error}
        />
        <TextField
          fullWidth
          label='Razón social'
          margin='normal'
          required
          name={form.legalName.id}
          value={form.legalName.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.legalName.error}
          helperText={form.legalName.error}
        />
        <TextField
          fullWidth
          label='Tipo de farmacia'
          margin='normal'
          required
          name={form.pharmacyType.id}
          value={form.pharmacyType.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.pharmacyType.error}
          helperText={form.pharmacyType.error}
        />
        <TextField
          fullWidth
          label='Correo electrónico'
          margin='normal'
          type='email'
          required
          name={form.email.id}
          value={form.email.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.email.error}
          helperText={form.email.error}
        />
        <TextField
          fullWidth
          label='Teléfono'
          margin='normal'
          required
          name={form.phone.id}
          value={form.phone.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.phone.error}
          helperText={form.phone.error}
        />
        <TextField
          fullWidth
          label='Sitio web'
          margin='normal'
          required
          name={form.website.id}
          value={form.website.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.website.error}
          helperText={form.website.error}
        />

        {formError && (
          <Typography variant='body2' color='error' sx={{ mt: 1 }}>
            {formError}
          </Typography>
        )}

        <Button
          type='submit'
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
          disabled={!hasChanges || isUpdating}
        >
          Guardar cambios
        </Button>
      </Box>
      <DialogBranch isOpen={openBranch} onClose={() => setOpenBranch(false)} />
    </>
  );
}

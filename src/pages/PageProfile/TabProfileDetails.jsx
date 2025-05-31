import { Box, Button, TextField, Typography } from '@mui/material';
import useStoreUser from '@/stores/useStoreUser';
import useForm from '@/hooks/useForm';
import { useEffect, useState } from 'react';
import { UtilFormValidation } from '@/utils/UtilFormValidation';

export default function TabProfileDetails() {
  const user = useStoreUser((state) => state.user);

  const { form, display_name, birthdate, phone, onChange, setError } = useForm({
    display_name: user.display_name || '',
    birthdate: user.birthdate || '',
    phone: user.phone || '',
    email: user.email || '',
  });

  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [formError, setFormError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isSomethingChanged =
      display_name !== (user.display_name || '') ||
      birthdate !== (user.birthdate || '') ||
      phone !== (user.phone || '');

    setHasChanges(isSomethingChanged);
  }, [display_name, birthdate, phone, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.clearErrors();
    setFormError('');

    const birthdateValidationResult =
      UtilFormValidation.isValidBirthdate(birthdate);
    if (!birthdateValidationResult.isValid) {
      setError(form.birthdate.id, birthdateValidationResult.error);
    }
    const phoneValidation = UtilFormValidation.isValidPhone(phone);
    if (!phoneValidation.isValid) {
      setError(form.phone.id, phoneValidation.error);
    }

    if (!form.isValid()) return;
    setIsUpdatingUser(true);
    // logica de actualizacion y validacion en caso de que haya sido exitosa
    setIsUpdatingUser(false);
    setFormError('Error al actualizar los datos');
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 500, mt: 2 }}>
      <TextField
        fullWidth
        label='Correo electrónico'
        name={form.email.id}
        value={form.email.value}
        onChange={onChange}
        margin='normal'
        disabled
      />

      <TextField
        fullWidth
        label='Nombre visible'
        name={form.display_name.id}
        value={form.display_name.value}
        onChange={onChange}
        margin='normal'
        error={!!form.display_name.error}
        helperText={form.display_name.error}
      />

      <TextField
        fullWidth
        label='Fecha de nacimiento'
        type='date'
        name={form.birthdate.id}
        value={form.birthdate.value}
        onChange={onChange}
        margin='normal'
        InputLabelProps={{ shrink: true }}
        error={!!form.birthdate.error}
        helperText={form.birthdate.error}
      />

      <TextField
        fullWidth
        label='Teléfono'
        name={form.phone.id}
        value={form.phone.value}
        onChange={onChange}
        margin='normal'
        error={!!form.phone.error}
        helperText={form.phone.error}
      />

      {formError && (
        <Typography variant='body2' color='error' align='center' sx={{ mt: 2 }}>
          {formError}
        </Typography>
      )}

      <Button
        type='submit'
        variant='contained'
        sx={{ mt: 2 }}
        disabled={!hasChanges || isUpdatingUser}
      >
        {isUpdatingUser ? 'Actualizando...' : 'Actualizar'}
      </Button>
    </Box>
  );
}

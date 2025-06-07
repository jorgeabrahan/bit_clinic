import useForm from '@/hooks/useForm';
import { ServiceUserProfiles } from '@/Services/ServiceUserProfiles';
import useStoreUser from '@/stores/useStoreUser';
import { UtilFormValidation } from '@/utils/UtilFormValidation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function TabProfileDetails() {
  const user = useStoreUser((state) => state.user);
  const storeSetUser = useStoreUser((state) => state.setUser);
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
    const resUpdate = await ServiceUserProfiles.update({
      id: user.id,
      display_name,
      phone,
      birthdate,
    });
    setIsUpdatingUser(false);
    if (resUpdate.ok) {
      storeSetUser(resUpdate.data);
      toast.success('Perfil actualizado exitosamente');
      return;
    }
    const errorMessage = resUpdate.error?.message;
    setFormError(
      typeof errorMessage === 'string'
        ? errorMessage
        : 'Ocurrio un error al registrarte',
    );
  };
  const handleCopy = (toCopy = '', fieldName = '') => {
    navigator.clipboard.writeText(toCopy);
    toast.success(`${fieldName} copiado al portapapeles`);
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 500, mt: 2 }}>
      <TextField
        fullWidth
        label='Id'
        name={'Id'}
        value={user.id}
        margin='normal'
        disabled
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <Tooltip title={'Copiar ID'}>
                <IconButton
                  onClick={() => handleCopy(user.id, 'ID')}
                  edge='end'
                >
                  <ContentCopyIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label='Correo electrónico'
        name={form.email.id}
        value={form.email.value}
        onChange={onChange}
        margin='normal'
        disabled
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <Tooltip title={'Copiar Correo'}>
                <IconButton
                  onClick={() => handleCopy(user.email, 'Correo')}
                  edge='end'
                >
                  <ContentCopyIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
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
        fullWidth
        sx={{ mt: 2 }}
        disabled={!hasChanges || isUpdatingUser}
      >
        {isUpdatingUser ? 'Actualizando...' : 'Actualizar'}
      </Button>
    </Box>
  );
}

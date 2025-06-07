import useForm from '@/hooks/useForm';
import { ServiceAuth } from '@/Services/ServiceAuth';
import useStoreUser from '@/stores/useStoreUser';
import { UtilFormValidation } from '@/utils/UtilFormValidation';
import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function PageSignUp() {
  const navigate = useNavigate();
  const {
    form,
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    birthdate,
    onChange,
    setError,
  } = useForm({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthdate: '',
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [formError, setFormError] = useState('');
  const storeSetUser = useStoreUser((store) => store.setUser);
  const handleSubmit = async (event) => {
    event.preventDefault();
    form.clearErrors();
    setFormError('');
    const emailValidationResult = UtilFormValidation.isEmail(email);
    if (!emailValidationResult.isValid) {
      setError(form.email.id, emailValidationResult.error);
    }
    const passwordValidationResult =
      UtilFormValidation.isStrongPassword(password);
    if (!passwordValidationResult.isValid) {
      setError(form.password.id, passwordValidationResult.error);
    }
    const confirmPasswordValidationResult = UtilFormValidation.passwordsMatch(
      password,
      confirmPassword,
    );
    if (!confirmPasswordValidationResult.isValid) {
      setError(form.confirmPassword.id, confirmPasswordValidationResult.error);
    }
    const birthdateValidationResult =
      UtilFormValidation.isValidBirthdate(birthdate);
    if (!birthdateValidationResult.isValid) {
      setError(form.birthdate.id, birthdateValidationResult.error);
    }
    const phoneValidationResult = UtilFormValidation.isValidPhone(phone);
    if (!phoneValidationResult.isValid) {
      setError(form.phone.id, phoneValidationResult.error);
    }
    if (!form.isValid()) return;
    setIsCreatingUser(true);
    const resSignUp = await ServiceAuth.signUp({
      displayName: fullName,
      email,
      password,
      phone,
      birthdate,
    });
    setIsCreatingUser(false);
    if (resSignUp.ok) {
      form.reset();
      storeSetUser(resSignUp.data);
      navigate('/');
      return;
    }
    const errorMessage = resSignUp.error?.message;
    setFormError(
      typeof errorMessage === 'string'
        ? errorMessage
        : 'Ocurrio un error al registrarte',
    );
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        my: 6,
      }}
    >
      <Paper elevation={3} sx={{ p: 2, maxWidth: 500, width: '100%' }}>
        <Typography variant='h4' component='h1' fontWeight={800} gutterBottom>
          Crear cuenta
        </Typography>

        <Box component='form' onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label='Nombre completo'
            margin='normal'
            required
            disabled={isCreatingUser}
            name={form.fullName.id}
            value={form.fullName.value}
            onChange={onChange}
            error={!!form.fullName.error}
            helperText={form.fullName.error}
          />
          <TextField
            fullWidth
            label='Correo electrónico'
            margin='normal'
            type='email'
            required
            disabled={isCreatingUser}
            name={form.email.id}
            value={form.email.value}
            onChange={onChange}
            error={!!form.email.error}
            helperText={form.email.error}
          />
          <TextField
            fullWidth
            label='Contraseña'
            margin='normal'
            type='password'
            required
            disabled={isCreatingUser}
            name={form.password.id}
            value={form.password.value}
            onChange={onChange}
            error={!!form.password.error}
            helperText={form.password.error}
          />
          <TextField
            fullWidth
            label='Confirmar contraseña'
            margin='normal'
            type='password'
            required
            disabled={isCreatingUser}
            name={form.confirmPassword.id}
            value={form.confirmPassword.value}
            onChange={onChange}
            error={!!form.confirmPassword.error}
            helperText={form.confirmPassword.error}
          />
          <TextField
            fullWidth
            label='Teléfono'
            margin='normal'
            required
            disabled={isCreatingUser}
            name={form.phone.id}
            value={form.phone.value}
            onChange={onChange}
            error={!!form.phone.error}
            helperText={form.phone.error}
            placeholder='50433960188'
          />
          <TextField
            fullWidth
            label='Fecha de nacimiento'
            margin='normal'
            type='date'
            required
            disabled={isCreatingUser}
            name={form.birthdate.id}
            value={form.birthdate.value}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& input[type="date"]': {
                colorScheme: 'dark',
              },
            }}
            error={!!form.birthdate.error}
            helperText={form.birthdate.error}
          />
          {formError && (
            <Typography
              variant='body2'
              color='error'
              align='center'
              sx={{ mt: 2 }}
            >
              {formError}
            </Typography>
          )}
          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={isCreatingUser}
            sx={{ mt: 3 }}
          >
            Registrarse
          </Button>
          <Typography variant='body2' align='center' sx={{ mt: 2 }}>
            ¿Ya tienes una cuenta?{' '}
            <Link
              component={RouterLink}
              href='/sign-in'
              underline='hover'
              color='primary'
            >
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

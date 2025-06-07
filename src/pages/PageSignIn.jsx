import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';

import useForm from '@/hooks/useForm';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ServiceAuth } from '@/Services/ServiceAuth';
import useStoreUser from '@/stores/useStoreUser';

export default function PageSignIn() {
  const { form, email, password, onChange } = useForm({
    email: '',
    password: '',
  });
  const storeSetUser = useStoreUser((store) => store.setUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsAuthenticating(true);
    const resSignIn = await ServiceAuth.signIn({ email, password });
    setIsAuthenticating(false);
    if (resSignIn.ok) {
      form.reset();
      storeSetUser(resSignIn.data);
      navigate('/');
      return;
    }
    const errorMessage = resSignIn.error?.message;
    setFormError(
      typeof errorMessage === 'string'
        ? errorMessage
        : 'Ocurrio un error al iniciar sesión',
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
          Iniciar sesión
        </Typography>

        <Box component='form' onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label='Correo electrónico'
            margin='normal'
            type='email'
            required
            disabled={isAuthenticating}
            name={form.email.id}
            value={form.email.value}
            onChange={onChange}
          />
          <TextField
            fullWidth
            label='Contraseña'
            margin='normal'
            type='password'
            required
            disabled={isAuthenticating}
            name={form.password.id}
            value={form.password.value}
            onChange={onChange}
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
          <Button type='submit' variant='contained' fullWidth sx={{ mt: 3 }}>
            Ingresar
          </Button>
          <Typography variant='body2' align='center' sx={{ mt: 2 }}>
            ¿No tienes una cuenta?{' '}
            <Link
              component={RouterLink}
              to='/sign-up'
              underline='hover'
              color='primary'
            >
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

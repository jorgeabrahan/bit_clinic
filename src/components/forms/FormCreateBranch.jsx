import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import useForm from '@/hooks/useForm';
import { ServiceBranches } from '@/Services/ServiceBranches';
import useStoreUser from '@/stores/useStoreUser';
import { DEPARTMENTS } from '@/lib/constants/departments';
import { toast } from 'sonner';

export default function FormCreateBranch({ onCreated = () => {} }) {
  const user = useStoreUser((s) => s.user);
  const id_pharmacy = user?.pharmacy_managers?.id_pharmacy;

  const {
    form,
    name,
    department,
    city,
    address,
    latitude,
    longitude,
    homeDelivery,
    driveThrough,
    inStore,
    onChange,
    setError,
    setValue,
  } = useForm({
    name: '',
    department: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    homeDelivery: false,
    driveThrough: false,
    inStore: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.clearErrors();
    setFormError('');
    if (!name) setError(form.name.id, 'Requerido');
    if (!department) setError(form.department.id, 'Requerido');
    if (!city) setError(form.city.id, 'Requerido');
    if (!address) setError(form.address.id, 'Requerido');
    if (!latitude || isNaN(latitude))
      setError(form.latitude.id, 'Latitud inválida');
    if (!longitude || isNaN(longitude))
      setError(form.longitude.id, 'Longitud inválida');

    if (!form.isValid()) return;
    setIsSubmitting(true);
    const res = await ServiceBranches.create({
      id_pharmacy,
      name,
      department,
      city,
      address_line: address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      offers_home_delivery: homeDelivery,
      offers_drive_through: driveThrough,
      offers_in_store_service: inStore,
    });
    setIsSubmitting(false);
    if (res.ok) {
      form.reset();
      onCreated(res.data);
      toast.success('Sucursal creada exitosamente');
      return;
    }
    setFormError(res.error?.message || 'Error al crear la sucursal');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label='Nombre de la sucursal'
          margin='normal'
          required
          name={form.name.id}
          value={form.name.value}
          onChange={onChange}
          disabled={isSubmitting}
          error={!!form.name.error}
          helperText={form.name.error}
        />
        <FormControl fullWidth margin='normal' required disabled={isSubmitting}>
          <InputLabel id='department-label'>Departamento</InputLabel>
          <Select
            labelId='department-label'
            id={form.department.id}
            name={form.department.id}
            value={form.department.value}
            onChange={(e) => {
              onChange(e);
              setValue(form.city.id, '');
            }}
            error={!!form.department.error}
            label='Departamento'
          >
            <MenuItem disabled value=''>
              <em>Seleccione un departamento</em>
            </MenuItem>
            {DEPARTMENTS.map((dept) => (
              <MenuItem key={dept.name} value={dept.name}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin='normal'
          required
          disabled={isSubmitting || !form.department.value}
        >
          <InputLabel id='city-label'>Ciudad</InputLabel>
          <Select
            labelId='city-label'
            id={form.city.id}
            name={form.city.id}
            value={form.city.value}
            onChange={onChange}
            error={!!form.city.error}
            label='Ciudad'
          >
            <MenuItem disabled value=''>
              <em>Seleccione una ciudad</em>
            </MenuItem>
            {(
              DEPARTMENTS.find((d) => d.name === form.department.value)
                ?.cities || []
            ).map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label='Dirección'
          margin='normal'
          required
          name={form.address.id}
          value={form.address.value}
          onChange={onChange}
          disabled={isSubmitting}
          error={!!form.address.error}
          helperText={form.address.error}
        />
        <Grid container spacing={2}>
          <Grid size='grow'>
            <TextField
              fullWidth
              label='Latitud'
              margin='normal'
              required
              name={form.latitude.id}
              value={form.latitude.value}
              onChange={onChange}
              disabled={isSubmitting}
              error={!!form.latitude.error}
              helperText={form.latitude.error}
            />
          </Grid>
          <Grid size='grow'>
            <TextField
              fullWidth
              label='Longitud'
              margin='normal'
              required
              name={form.longitude.id}
              value={form.longitude.value}
              onChange={onChange}
              disabled={isSubmitting}
              error={!!form.longitude.error}
              helperText={form.longitude.error}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Checkbox
              checked={homeDelivery}
              name={form.homeDelivery.id}
              onChange={onChange}
              disabled={isSubmitting}
            />
          }
          label='Entrega a domicilio'
          margin='normal'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={driveThrough}
              name={form.driveThrough.id}
              onChange={onChange}
              disabled={isSubmitting}
            />
          }
          label='Auto servicio'
          margin='normal'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={inStore}
              name={form.inStore.id}
              onChange={onChange}
              disabled={isSubmitting}
            />
          }
          label='Atención en tienda'
          margin='normal'
        />
        {formError && (
          <Typography variant='body2' color='error'>
            {formError}
          </Typography>
        )}
        <Button
          type='submit'
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          Guardar sucursal
        </Button>
      </Box>
    </Paper>
  );
}

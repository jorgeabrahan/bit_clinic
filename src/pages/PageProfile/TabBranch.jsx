import useForm from '@/hooks/useForm';
import useStoreUser from '@/stores/useStoreUser';
import { ServiceBranches } from '@/Services/ServiceBranches';
import { DEPARTMENTS } from '@/lib/constants/departments';
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import DialogMedicines from '@/components/dialogs/DialogMedicines';

export default function TabBranch() {
  const user = useStoreUser((state) => state.user);
  const storeUpdateUserBranch = useStoreUser((state) => state.updateUserBranch);

  const branch = useMemo(() => user?.branch_managers?.branches || {}, [user]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [formError, setFormError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [openMedicinesDialog, setOpenMedicinesDialog] = useState(null);
  const {
    form,
    name,
    department,
    city,
    addressLine,
    latitude,
    longitude,
    homeDelivery,
    driveThrough,
    inStore,
    onChange,
    setValue,
  } = useForm({
    name: branch.name || '',
    department: branch.department || '',
    city: branch.city || '',
    addressLine: branch.address_line || '',
    latitude: branch.latitude || 0,
    longitude: branch.longitude || 0,
    homeDelivery: branch.offers_home_delivery || false,
    driveThrough: branch.offers_drive_through || false,
    inStore: branch.offers_in_store_service ?? true,
  });

  useEffect(() => {
    setValue(form.name.id, branch.name || '');
    setValue(form.department.id, branch.department || '');
    setValue(form.city.id, branch.city || '');
    setValue(form.addressLine.id, branch.address_line || '');
    setValue(form.latitude.id, branch.latitude || 0);
    setValue(form.longitude.id, branch.longitude || 0);
    setValue(form.homeDelivery.id, branch.offers_home_delivery || false);
    setValue(form.driveThrough.id, branch.offers_drive_through || false);
    setValue(form.inStore.id, branch.offers_in_store_service ?? true);
  }, [branch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    form.clearErrors();
    setFormError('');
    setIsUpdating(true);

    const resBranchUpdate = await ServiceBranches.update({
      id: branch.id,
      name,
      department,
      city,
      address_line: addressLine,
      latitude,
      longitude,
      offers_home_delivery: homeDelivery,
      offers_drive_through: driveThrough,
      offers_in_store_service: inStore,
    });
    setIsUpdating(false);
    setHasChanges(false);
    if (resBranchUpdate.ok) {
      storeUpdateUserBranch(resBranchUpdate.data);
      toast.success('Sucursal actualizada exitosamente');
      return;
    }
    const errorMessage = resBranchUpdate.error?.message;
    setFormError(
      typeof errorMessage === 'string'
        ? errorMessage
        : 'Ocurrió un error al actualizar la sucursal',
    );
  };

  useEffect(() => {
    setHasChanges(
      name !== branch.name ||
        department !== branch.department ||
        city !== branch.city ||
        addressLine !== branch.address_line ||
        latitude !== branch.latitude ||
        longitude !== branch.longitude ||
        homeDelivery !== branch.offers_home_delivery ||
        driveThrough !== branch.offers_drive_through ||
        inStore !== branch.offers_in_store_service,
    );
  }, [
    name,
    department,
    city,
    addressLine,
    latitude,
    longitude,
    homeDelivery,
    driveThrough,
    inStore,
    branch,
  ]);

  return (
    <>
      <Box display='flex' justifyContent='flex-end' mb={2}>
        <Button
          variant='contained'
          startIcon={<SettingsIcon />}
          onClick={() => setOpenMedicinesDialog(branch)}
        >
          Administrar medicamentos
        </Button>
      </Box>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label='Nombre de la sucursal'
          margin='normal'
          required
          name={form.name.id}
          value={form.name.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.name.error}
          helperText={form.name.error}
        />

        <FormControl fullWidth margin='normal' required disabled={isUpdating}>
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
          disabled={isUpdating || !form.department.value}
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
          name={form.addressLine.id}
          value={form.addressLine.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.addressLine.error}
          helperText={form.addressLine.error}
        />
        <TextField
          fullWidth
          label='Latitud'
          margin='normal'
          required
          type='number'
          name={form.latitude.id}
          value={form.latitude.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.latitude.error}
          helperText={form.latitude.error}
        />
        <TextField
          fullWidth
          label='Longitud'
          margin='normal'
          required
          type='number'
          name={form.longitude.id}
          value={form.longitude.value}
          onChange={onChange}
          disabled={isUpdating}
          error={!!form.longitude.error}
          helperText={form.longitude.error}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={homeDelivery}
              name={form.homeDelivery.id}
              onChange={onChange}
              disabled={isUpdating}
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
              disabled={isUpdating}
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
              disabled={isUpdating}
            />
          }
          label='Atención en tienda'
          margin='normal'
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
      <DialogMedicines
        metadata={{ branch: openMedicinesDialog }}
        isOpen={openMedicinesDialog != null}
        onClose={() => setOpenMedicinesDialog(null)}
      />
    </>
  );
}

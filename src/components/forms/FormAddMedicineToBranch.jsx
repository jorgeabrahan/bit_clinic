import useForm from '@/hooks/useForm';
import { MEDICINE_UNITS } from '@/lib/constants/medicineUnits';
import { ServiceBranches } from '@/Services/ServiceBranches';
import { ServiceMedicines } from '@/Services/ServiceMedicines';
import useStoreUser from '@/stores/useStoreUser';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import { toast } from 'sonner';

export default function FormAddMedicineToBranch({ onAdded = () => {} }) {
  const user = useStoreUser((s) => s.user);
  const id_branch = user?.branch_managers?.id_branch;

  const { form, medicine, quantity, unit, onChange, setValue, setError } =
    useForm({
      medicine: null,
      quantity: '',
      unit: '',
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [options, setOptions] = useState([]);

  const handleSearchMedicine = async (query) => {
    if (!query) return;
    const res = await ServiceMedicines.searchByName(query);
    if (res.ok) setOptions(res.data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    form.clearErrors();
    setFormError('');

    if (!medicine || !medicine.id)
      setError('medicine', 'Seleccione un medicamento');
    if (!unit) setError('unit', 'Seleccione una unidad');
    if (!quantity || isNaN(quantity) || parseInt(quantity) < 0)
      setError('quantity', 'Cantidad inválida');

    if (!form.isValid()) return;
    setIsSubmitting(true);

    const res = await ServiceBranches.addMedicineToStock({
      id_branch,
      id_medicine: medicine.id,
      unit,
      quantity: parseInt(quantity),
    });

    setIsSubmitting(false);
    if (res.ok) {
      onAdded(res.data);
      toast.success('Medicamento asignado exitosamente');
      form.reset();
      return;
    }
    setFormError(
      typeof res.error === 'string'
        ? res.error
        : res.error?.message ?? 'Error al asignar el medicamento',
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <Autocomplete
          fullWidth
          getOptionLabel={(option) => option.name || ''}
          options={options}
          value={form.medicine.value}
          onInputChange={(e, newInput) => handleSearchMedicine(newInput)}
          onChange={(_, newValue) => setValue('medicine', newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Buscar medicamento'
              margin='normal'
              required
              error={!!form.medicine.error}
              helperText={form.medicine.error}
            />
          )}
        />

        <FormControl fullWidth margin='normal' required>
          <InputLabel id='unit-label'>Unidad</InputLabel>
          <Select
            labelId='unit-label'
            id='unit'
            name={form.unit.id}
            value={form.unit.value}
            onChange={onChange}
            error={!!form.unit.error}
            label='Unidad'
          >
            <MenuItem disabled value=''>
              <em>Seleccione una unidad</em>
            </MenuItem>
            {MEDICINE_UNITS.map((u) => (
              <MenuItem key={u.name} value={u.name}>
                {u.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label='Cantidad'
          margin='normal'
          required
          type='number'
          name={form.quantity.id}
          value={form.quantity.value}
          onChange={onChange}
          error={!!form.quantity.error}
          helperText={form.quantity.error}
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
          Asignar medicamento
        </Button>
      </Box>
    </Paper>
  );
}

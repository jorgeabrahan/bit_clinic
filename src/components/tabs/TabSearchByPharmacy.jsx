import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { supabase } from '@/config/supabase';
import { toast } from 'sonner';
import { MEDICINE_UNITS } from '@/lib/constants/medicineUnits';
import MapIcon from '@mui/icons-material/Map';

export default function TabSearchByPharmacy() {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [results, setResults] = useState([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [openDescription, setOpenDescription] = useState(null);

  useEffect(() => {
    supabase
      .from('pharmacies')
      .select('id, commercial_name')
      .then(({ data }) => setPharmacies(data));
  }, []);

  const handleSearch = async () => {
    setResults([]);
    setIsLoadingResults(true);

    const { data, error } = await supabase
      .from('medicine_stock')
      .select(
        'quantity, unit, branches!inner(id, name, latitude, longitude, pharmacies(commercial_name)), medicines!inner(name, description, pharmaceutical_company)',
      )
      .ilike('medicines.name', `%${medicineName}%`)
      .in('branches.id_pharmacy', [selectedPharmacy]);

    setIsLoadingResults(false);
    if (error) {
      toast.error('Ocurrió un error al buscar el medicamento');
      return;
    }
    setResults(data);
  };

  const getUnitLabel = (unit) =>
    MEDICINE_UNITS.find((u) => u.name === unit)?.label || unit;

  return (
    <Box>
      <FormControl fullWidth margin='normal'>
        <InputLabel>Farmacia</InputLabel>
        <Select
          value={selectedPharmacy}
          label='Farmacia'
          onChange={(e) => setSelectedPharmacy(e.target.value)}
          disabled={isLoadingResults}
        >
          {pharmacies.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.commercial_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label='Nombre del medicamento'
        margin='normal'
        value={medicineName}
        disabled={isLoadingResults}
        onChange={(e) => setMedicineName(e.target.value)}
      />

      <Button
        variant='contained'
        fullWidth
        onClick={handleSearch}
        disabled={!selectedPharmacy || !medicineName || isLoadingResults}
        sx={{ mt: 2, mb: 2 }}
      >
        Buscar medicamento
      </Button>

      <Box overflow='auto'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length > 0 ? (
                results.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.medicines?.name || '-'}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          setOpenDescription(row.medicines?.description)
                        }
                      >
                        {row.medicines.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>{getUnitLabel(row.unit)}</TableCell>
                    <TableCell>{row.branches?.name || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        size='small'
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${row.branches.latitude},${row.branches.longitude}`;
                          window.open(url, '_blank');
                        }}
                      >
                        <MapIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    {isLoadingResults ? 'Cargando...' : 'No hay resultados'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={Boolean(openDescription)}
        onClose={() => setOpenDescription(null)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Descripción completa</DialogTitle>
        <DialogContent>
          <Typography>
            {openDescription || 'No hay descripción disponible.'}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

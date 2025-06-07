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
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { supabase } from '@/config/supabase';
import { toast } from 'sonner';

export default function TabSearchByBranch() {
  const [pharmacies, setPharmacies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [results, setResults] = useState([]);
  const [openDescription, setOpenDescription] = useState(null);

  useEffect(() => {
    supabase
      .from('pharmacies')
      .select('id, commercial_name')
      .then(({ data }) => setPharmacies(data));
  }, []);

  useEffect(() => {
    if (!selectedPharmacy) return setBranches([]);
    supabase
      .from('branches')
      .select('id, name, latitude, longitude')
      .eq('id_pharmacy', selectedPharmacy)
      .then(({ data }) => setBranches(data));
  }, [selectedPharmacy]);

  const handleSearch = async () => {
    setResults([]);
    setIsLoadingResults(true);
    const { data, error } = await supabase
      .from('medicine_stock')
      .select(
        'quantity, unit, medicines!inner(name, description, recommended_dosage, instructions, pharmaceutical_company)',
      )
      .eq('id_branch', selectedBranch)
      .ilike('medicines.name', `%${medicineName}%`);
    console.log(data);
    setIsLoadingResults(false);
    if (error) {
      toast.error('Ocurrió un error al buscar el medicamento');
      return;
    }
    if (data.length === 0) {
      toast.success('No se encontraron resultados.');
    }
    setResults(data);
  };

  const selectedBranchData = branches.find((b) => b.id === selectedBranch);

  return (
    <Box>
      <FormControl fullWidth margin='normal'>
        <InputLabel>Farmacia</InputLabel>
        <Select
          value={selectedPharmacy}
          label='Farmacia'
          onChange={(e) => {
            setSelectedPharmacy(e.target.value);
            setSelectedBranch('');
          }}
          disabled={isLoadingResults}
        >
          {pharmacies.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.commercial_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin='normal' disabled={!selectedPharmacy}>
        <InputLabel>Sucursal</InputLabel>
        <Select
          value={selectedBranch}
          label='Sucursal'
          onChange={(e) => setSelectedBranch(e.target.value)}
          disabled={isLoadingResults}
        >
          {branches.map((b) => (
            <MenuItem key={b.id} value={b.id}>
              {b.name}
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
        disabled={!selectedBranch || !medicineName || isLoadingResults}
        sx={{ mt: 2 }}
      >
        Buscar medicamento
      </Button>

      <Box sx={{ mt: 3, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Farmacéutica</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length > 0 ? (
              results.map((result, idx) => (
                <TableRow key={idx}>
                  <TableCell>{result.medicines.name}</TableCell>
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
                        setOpenDescription(result.medicines?.description)
                      }
                    >
                      {result.medicines.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{result.unit}</TableCell>
                  <TableCell>
                    {result.medicines.pharmaceutical_company}
                  </TableCell>
                  <TableCell>
                    <Button
                      size='small'
                      color='primary'
                      variant='contained'
                      onClick={() => {
                        if (!selectedBranchData) return;
                        const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedBranchData.latitude},${selectedBranchData.longitude}`;
                        window.open(gmapsUrl, '_blank');
                      }}
                      sx={{ mr: 1 }}
                    >
                      <MapIcon />
                    </Button>
                    {/**
                    <Button
                      size='small'
                      color='secondary'
                      variant='contained'
                      startIcon={<ShoppingCartIcon />}
                    >
                      Agregar
                    </Button>
                    **/}
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

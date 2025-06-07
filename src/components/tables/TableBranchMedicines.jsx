import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { supabase } from '@/config/supabase';
import useStoreUser from '@/stores/useStoreUser';
import { MEDICINE_UNITS } from '@/lib/constants/medicineUnits';
import { toast } from 'sonner';

export default function TableBranchMedicines() {
  const user = useStoreUser((state) => state.user);
  const branch = user?.branch_managers?.branches || {};

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStocks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('medicine_stock')
      .select('*, medicines(*)')
      .eq('id_branch', branch.id);

    if (!error) setStocks(data);
    setLoading(false);
  };

  const deleteStock = async (id_stock) => {
    const { error } = await supabase
      .from('medicine_stock')
      .delete()
      .eq('id', id_stock);
    if (!error) {
      setStocks((prev) => prev.filter((s) => s.id !== id_stock));
      toast.success('Medicamento eliminado exitosamente');
    } else {
      toast.error('Error al eliminar el medicamento');
    }
  };

  const getUnitLabel = (unitName) => {
    return MEDICINE_UNITS.find((u) => u.name === unitName)?.label || unitName;
  };

  useEffect(() => {
    if (branch?.id) fetchStocks();
  }, [branch?.id]);

  return (
    <Paper>
      <Box p={2}>
        <Typography variant='h6' gutterBottom>
          Medicamentos de {branch?.name}
        </Typography>

        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Unidad</TableCell>
                  <TableCell>Farmacéutica</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align='center'>
                      No hay medicamentos registrados para esta sucursal.
                    </TableCell>
                  </TableRow>
                ) : (
                  stocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell>{stock.medicines?.name || '-'}</TableCell>
                      <TableCell style={{ maxWidth: 300 }}>
                        <Typography
                          sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                          }}
                        >
                          {stock.medicines?.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>{stock.quantity}</TableCell>
                      <TableCell>{getUnitLabel(stock.unit)}</TableCell>
                      <TableCell>
                        {stock.medicines?.pharmaceutical_company || '-'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title='Eliminar medicamento'>
                          <IconButton
                            onClick={() => deleteStock(stock.id)}
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
}

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { ServiceUserProfiles } from '@/Services/ServiceUserProfiles';
import { toast } from 'sonner';
import { ServiceBranches } from '@/Services/ServiceBranches';

export default function DialogAssignUserToBranch({
  isOpen = false,
  onClose = () => {},
  metadata = {
    branch: {
      address_line: '',
      city: '',
      created_at: '',
      department: '',
      id: '',
      id_pharmacy: '',
      latitude: 0,
      longitude: 0,
      name: '',
      offers_drive_through: false,
      offers_home_delivery: false,
      offers_in_store_service: false,
      updated_at: '',
    },
  },
}) {
  const [userId, setUserId] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  /*
  birthdate: ""
  created_at: ""
  display_name: ""
  id: ""
  phone: ""
  updated_at: ""
  */
  const [user, setUser] = useState(null);
  const searchUser = async () => {
    setFormError('');
    setIsLoading(true);
    const res = await ServiceUserProfiles.getBranchManagerAvailableUserById(
      userId,
    );
    setIsLoading(false);
    if (res.ok) {
      setUser(res.data);
      return;
    }
    setFormError(
      typeof res.error === 'string' ? res.error : 'Error al obtener al usuario',
    );
  };
  const assignUser = async () => {
    setIsLoading(true);
    const res = await ServiceBranches.assignUser({
      id_user: user.id,
      id_branch: metadata.branch.id,
    });
    setIsLoading(false);
    if (res.ok) {
      toast.success(
        `${user.display_name} fue asignado a ${metadata.branch?.name}`,
      );
      setUser(null);
      return;
    }
    toast.error(
      typeof res.error === 'string' ? res.error : 'Error al asignar al usuario',
    );
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          mx: 2,
          width: 'auto',
        },
      }}
      fullWidth
    >
      <DialogTitle fontWeight={600}>
        Asignar usuario a {metadata.branch?.name}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box display='flex' gap={2} alignItems='center' mt={1} mb={1}>
          <TextField
            label='ID del usuario'
            variant='outlined'
            disabled={isLoading}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            fullWidth
            size='small'
          />
          <IconButton
            variant='contained'
            onClick={searchUser}
            disabled={isLoading}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
        {formError && (
          <Typography variant='body2' color='error' sx={{ mb: 2 }}>
            {formError}
          </Typography>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user != null && (
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.id}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {user.display_name}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {user.phone}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton
                    color='primary'
                    disabled={isLoading}
                    onClick={assignUser}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            {user === null && !isLoading && (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  No hay usuario para mostrar. Ingresa un ID para buscar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

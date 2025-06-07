import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { ServiceBranches } from '@/Services/ServiceBranches';
import { toast } from 'sonner';

export default function DialogViewBranchAssignedUsers({
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
  /*
  birthdate: ""
  created_at: ""
  display_name: ""
  id: ""
  phone: ""
  updated_at: ""
  */
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (metadata.branch == null) return;
    setIsLoading(true);
    setUsers([]);
    ServiceBranches.getAssignedUsers(metadata.branch.id)
      .then((res) => {
        if (res.ok) {
          setUsers(res.data);
          return;
        }
        toast.error('Ocurrió un error al obtener los usuarios asignados');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [metadata.branch]);
  const unassignUser = async (userId) => {
    setIsLoading(true);
    const res = await ServiceBranches.unassignUser(userId);
    setIsLoading(false);
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('Usuario desasignado exitosamente');
      return;
    }
    toast.error(
      typeof res.error === 'string'
        ? res.error
        : 'Error al desasignar al usuario',
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
        Usuarios asignados a {metadata.branch?.name}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
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
            {users.length > 0 &&
              users.map((user) => (
                <TableRow key={user.id}>
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
                      onClick={() => unassignUser(user.id)}
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
                  </TableCell>
                </TableRow>
              ))}
            {users.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  Esta sucursal aun no tiene usuarios asignados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

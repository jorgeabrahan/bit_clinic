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
  TablePagination,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ServiceBranches } from '@/Services/ServiceBranches';
import DialogAssignUserToBranch from '../dialogs/DialogAssignUserToBranch';
import DialogViewBranchAssignedUsers from '../dialogs/DialogViewBranchAssignedUsers';

export default function TableBranch() {
  const [branches, setBranches] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(null);
  const [openViewAssignedUsersDialog, setOpenViewAssignedUsersDialog] =
    useState(null);

  const rowsPerPage = 10;

  const fetchBranches = async () => {
    setLoading(true);
    const res = await ServiceBranches.getAll({
      page: page + 1,
      limit: rowsPerPage,
    });
    if (res.ok) {
      setBranches(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, [page]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  return (
    <>
      <Paper>
        <Box>
          {loading ? (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              p={4}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Nombre</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Departamento
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Ciudad</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Dirección
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Entrega a domicilio
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Auto-servicio
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Atención en tienda
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {branch.name}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {branch.department}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {branch.city}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {branch.address_line}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {branch.offers_home_delivery ? 'Sí' : 'No'}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {branch.offers_drive_through ? 'Sí' : 'No'}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {branch.offers_in_store_service ? 'Sí' : 'No'}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title='Asignar usuario'>
                          <IconButton
                            onClick={() => setOpenAssignDialog(branch)}
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                              mr: 1,
                            }}
                          >
                            <PersonAddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Ver usuarios asignados'>
                          <IconButton
                            onClick={() =>
                              setOpenViewAssignedUsersDialog(branch)
                            }
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                            }}
                          >
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            component='div'
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Box>
      </Paper>
      <DialogAssignUserToBranch
        metadata={{ branch: openAssignDialog }}
        isOpen={openAssignDialog != null}
        onClose={() => setOpenAssignDialog(null)}
      />
      <DialogViewBranchAssignedUsers
        metadata={{ branch: openViewAssignedUsersDialog }}
        isOpen={openViewAssignedUsersDialog != null}
        onClose={() => setOpenViewAssignedUsersDialog(null)}
      />
    </>
  );
}

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
} from '@mui/material';
import FormCreateBranch from '../forms/FormCreateBranch';
import TableBranch from '../tables/TableBranch';

export default function DialogBranch({ isOpen = false, onClose = () => {} }) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_, newIndex) => {
    setTabIndex(newIndex);
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
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant='fullWidth'
        indicatorColor='primary'
        textColor='primary'
        sx={{ pt: 1 }}
      >
        <Tab fontSize='small' sx={{ mb: 1.5 }} label='Sucursales registradas' />
        <Tab fontSize='small' sx={{ mb: 1.5 }} label='Agregar sucursal' />
      </Tabs>

      <DialogContent sx={{ p: 0 }}>
        {tabIndex === 0 && <TableBranch />}
        {tabIndex === 1 && (
          <FormCreateBranch onCreated={() => setTabIndex(0)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

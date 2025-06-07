import { Dialog, DialogContent, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import TableBranchMedicines from '../tables/TableBranchMedicines';
import FormAddMedicineToBranch from '../forms/FormAddMedicineToBranch';

export default function DialogMedicines({
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
        <Tab
          fontSize='small'
          sx={{ mb: 1.5 }}
          label='Medicamentos registrados'
        />
        <Tab fontSize='small' sx={{ mb: 1.5 }} label='Agregar medicamento' />
      </Tabs>

      <DialogContent sx={{ p: 0 }}>
        {tabIndex === 0 && <TableBranchMedicines />}
        {tabIndex === 1 && <FormAddMedicineToBranch />}
      </DialogContent>
    </Dialog>
  );
}

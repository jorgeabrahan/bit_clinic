import { Dialog, DialogContent, DialogTitle } from '@mui/material';

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

      <DialogContent sx={{ p: 3 }}></DialogContent>
    </Dialog>
  );
}

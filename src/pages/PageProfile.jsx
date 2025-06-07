import { useMemo, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import TabProfileDetails from './PageProfile/TabProfileDetails';
import useStoreUser from '@/stores/useStoreUser';
import TabPharmacy from './PageProfile/TabPharmacy';
import TabBranch from './PageProfile/TabBranch';

export default function PageProfile() {
  const user = useStoreUser((store) => store.user);
  const [tabIndex, setTabIndex] = useState(0);
  const isPharmacyManager = useMemo(
    () =>
      user?.pharmacy_managers != null &&
      user?.pharmacy_managers?.id_pharmacy &&
      user.id === user.pharmacy_managers.id_user,
    [user],
  );
  const isBranchManager = useMemo(
    () =>
      user?.branch_managers != null &&
      user?.branch_managers?.id_branch &&
      user.id === user.branch_managers.id_user,
    [user],
  );

  const handleChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  const tabs = [
    {
      label: 'Detalles del perfil',
      content: <TabProfileDetails />,
    },
  ];

  if (isPharmacyManager) {
    tabs.push({
      label: 'Administrar farmacia',
      content: <TabPharmacy />,
    });
  }

  if (isBranchManager) {
    tabs.push({
      label: 'Administrar sucursal',
      content: <TabBranch />,
    });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons='auto'
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      <Box sx={{ p: 2 }}>{tabs[tabIndex].content}</Box>
    </Box>
  );
}

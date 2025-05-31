import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import TabProfileDetails from './PageProfile/TabProfileDetails';

export default function PageProfile() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const tabs = [
    {
      label: 'Detalles del perfil',
      content: <TabProfileDetails />,
    },
  ];

  // if (user_has_assigned_pharmacy) {
  //   tabs.push({
  //     label: 'Farmacia asignada',
  //     content: <Typography>Detalles de la farmacia asignada</Typography>,
  //   });
  // }

  // if (user_has_assigned_branch) {
  //   tabs.push({
  //     label: 'Sucursal asignada',
  //     content: <Typography>Detalles de la sucursal asignada</Typography>,
  //   });
  // }

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

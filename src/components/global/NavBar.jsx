import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Box,
  Menu,
  Link,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ServiceAuth } from '@/Services/ServiceAuth';
import useStoreUser from '@/stores/useStoreUser';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const storeSignOutUser = useStoreUser((store) => store.signOutUser);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    ServiceAuth.signOut().then((res) => {
      if (!res.ok) return;
      storeSignOutUser();
      navigate('/sign-in');
    });
    handleClose();
  };

  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          BitClinic
        </Typography>

        <Box>
          <IconButton
            size='large'
            edge='end'
            color='inherit'
            aria-controls={open ? 'menu-navbar' : undefined}
            aria-haspopup='true'
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id='menu-navbar'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem component={RouterLink} to='/' onClick={handleClose}>
              <HomeIcon sx={{ mr: 1 }} />
              Inicio
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to='/profile'
              onClick={handleClose}
            >
              <PersonIcon sx={{ mr: 1 }} />
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

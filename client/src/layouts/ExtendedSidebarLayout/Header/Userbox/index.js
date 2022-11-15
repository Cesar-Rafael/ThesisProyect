import { useRef, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Popover,
  styled,
  Typography
} from '@mui/material';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';

const UserBoxButton = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  padding: 0;
  height: ${theme.spacing(4)};
  margin-left: ${theme.spacing(1)};
  border-radius: ${theme.general.borderRadiusLg};
  
  &:hover {
    background: ${theme.colors.primary.main};
  }
`
);

const UserAvatar = styled(Avatar)(
  ({ theme }) => `
        height: 90%;
        width: 90%;
        border-radius: ${theme.general.borderRadiusLg};
`
);

function HeaderUserbox() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>
        <UserAvatar alt={user.name} src={user.avatar} />
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box ml={3} mt={2} mr={3}>
          <Typography variant="h5" color="text.primary">
            Nombre:
            {` ${user.name || ''}`}
          </Typography>
        </Box>
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            Cerrar Sesión
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;

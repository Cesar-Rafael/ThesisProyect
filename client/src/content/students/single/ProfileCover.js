/* eslint-disable jsx-a11y/label-has-for */
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import { backendUrl } from 'src/config';

import { Box, Typography, Tooltip, IconButton, Button } from '@mui/material';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { useNavigate, useLocation } from 'react-router-dom';
import QrCodeIcon from '@mui/icons-material/QrCode';
import moment from 'moment';

const saveFile = (filename, originalname) => {
  saveAs(`${backendUrl}/qrcodes/${filename}`, originalname);
};

const ProfileCover = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    return navigate(`/${location.pathname.split('/')[1]}/list`);
  };

  return (
    <>
      <Box display="flex" mb={1}>
        <Tooltip arrow placement="top" title="Regresar">
          <IconButton
            onClick={handleBack}
            color="primary"
            sx={{
              p: 2,
              mr: 2
            }}
          >
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            Perfil de {user.fullName}
          </Typography>
          <Typography variant="subtitle2">
            Se muestran datos y certificados del estudiante
          </Typography>
        </Box>
      </Box>
      <Box py={2} pl={2} mb={0}>
        <Typography gutterBottom variant="h4">
          Nombres: {user.firstName}
        </Typography>
        <Typography gutterBottom variant="h4" pt={2}>
          Apellidos: {user.lastName}
        </Typography>
        <Typography gutterBottom variant="h4" pt={2}>
          Tipo de Documento: {user.documentType}
        </Typography>
        <Typography gutterBottom variant="h4" pt={2}>
          Número de Documento: {user.documentNumber}
        </Typography>
        <Typography gutterBottom variant="h4" pt={2} pb={2}>
          Fecha de Nacimiento: {moment.unix(user.birthday).format('DD/MM/YYYY')}
        </Typography>
        <Button
          pt={2}
          variant="contained"
          size="large"
          onClick={() =>
            saveFile(
              `qr_code_${user._id}.png`,
              `qr_code_${user.documentNumber}.png`
            )
          }
          endIcon={<QrCodeIcon fontSize="small" />}
        >
          Descargar Código QR
        </Button>
      </Box>
    </>
  );
};

ProfileCover.propTypes = {
  user: PropTypes.object.isRequired
};

export default ProfileCover;

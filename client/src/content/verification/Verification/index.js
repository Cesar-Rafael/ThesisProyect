import { useState } from 'react';
import axios from 'src/utils/certifyAxios';

import {
  Box,
  Button,
  // Container,
  Grid,
  TextField,
  Typography,
  styled
} from '@mui/material';

// import { Link as RouterLink } from 'react-router-dom';

import Results from './Results';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(35)};
`
);

function Hero() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [students, setStudents] = useState([]);

  const searchStudents = async () => {
    const response = await axios.post('/student/search', {
      firstName,
      lastName,
      dni
    });

    const { studentsFound } = response.data;
    setStudents(studentsFound);
    console.log(students);
  };

  return (
    <>
      <Grid
        sx={{
          px: 2
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <TypographyH1
          sx={{
            mb: 2,
            mt: 0
          }}
          variant="h2"
        >
          Verificación de Certificados Académicos
        </TypographyH1>
        <Grid container xs={12}>
          <Grid item xs={3}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nombres"
                label="Nombres"
                value={firstName}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellidos"
                label="Apellidos"
                value={lastName}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Número de Documento"
                label="Número de Documento"
                value={dni}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box p={1}>
              <Button
                size="large"
                variant="contained"
                onClick={() => searchStudents()}
              >
                Buscar Estudiante
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {students.length >= 1 ? <Results projects={students} /> : ''}
        </Grid>
      </Grid>
    </>
  );
}

export default Hero;

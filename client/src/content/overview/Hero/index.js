import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

function Hero() {

  return (
    <Container maxWidth="lg">
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={6} pr={{ xs: 0, md: 3 }}>
          <LabelWrapper color="success">Versión 1.0</LabelWrapper>
          <TypographyH1
            sx={{
              mb: 2
            }}
            variant="h1"
          >
            Certify: Plataforma de Títulos, Grados y Certificados
          </TypographyH1>
          <TypographyH2
            sx={{
              lineHeight: 1.5,
              pb: 4
            }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            Plataforma de gestión y consulta de títulos universitarios, grados
            académicos y certificados universitarios
          </TypographyH2>
          <Button
            component={RouterLink}
            to="/blockchain-network/list"
            size="large"
            variant="contained"
          >
            Gestionar Certificados
          </Button>
          <Button
            sx={{
              ml: 3
            }}
            component={RouterLink}
            to="/verification"
            size="large"
            variant="contained"
          >
            Consultar Certificados
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;

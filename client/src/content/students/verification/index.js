import { Box, Card, Container, styled } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import Logo from 'src/components/LogoSign';
import Verification from './student';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
    margin-bottom: ${theme.spacing(2)};
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

function Overview() {
  return (
    <OverviewWrapper>
      <Helmet>
        <title>Certify: Verificación de Estudiante</title>
      </Helmet>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
          </Box>
        </Container>
      </HeaderWrapper>
      <Verification />
      <Footer />
    </OverviewWrapper>
  );
}

export default Overview;

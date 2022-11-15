import { useState, useEffect } from 'react';
import axios from 'src/utils/certifyAxios';

import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import useAuth from 'src/hooks/useAuth';

import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
// import useRefMounted from 'src/hooks/useRefMounted';

import PageHeader from './PageHeader';
import Results from './Results';

function ManagementProjects() {
  // const isMountedRef = useRefMounted();
  const { user } = useAuth();
  const contract = user.contract;
  // const account = user.account
  const [certificates, setCertificates] = useState([]);

  // const getMembers = useCallback(async () => {
  //   try {
  //     const response = await axios.get(`${URL}/member/list`)
  //     console.log(response.data.members)

  //     if (isMountedRef.current) {
  //       setMembers(response.data.members);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMountedRef]);

  const getCertificates = async () => {
    try {
      const certificatesCounter = await contract.idCertificate();
      const certificatesCounterNumber = certificatesCounter.toNumber();
      const certificatesPromise = [];

      for (let i = 1; i <= certificatesCounterNumber; i++) {
        const certificate = contract.certificates(i);
        certificatesPromise.push(certificate);
      }

      const certificates = await Promise.all(certificatesPromise);

      const validCertificates = [];
      certificates.forEach((c) => {
        const { id, idStudent, encryptedCertificate, valid } = c;
        if (valid)
          validCertificates.push({
            idCertificate: id.toNumber(),
            idStudent,
            encryptedCertificate
          });
      });

      console.log(validCertificates);

      const response = await axios.post(`/certificate/decrypt/many`, {
        certificates: validCertificates
      });

      const { decryptedCertificates } = response.data;

      console.log(decryptedCertificates);

      setCertificates(decryptedCertificates);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCertificates();
  }, []);

  return (
    <>
      <Helmet>
        <title>Certificados Registrados</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader getCertificates={getCertificates} />
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Results projects={certificates} getCertificates={getCertificates} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementProjects;

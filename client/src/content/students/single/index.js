import { useState, useEffect, useRef } from 'react';

import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'src/utils/certifyAxios';
import useAuth from 'src/hooks/useAuth';

import ProfileCover from './ProfileCover';
import RecentActivity from './RecentActivity';
import Results from './Results';

function ManagementUsersView() {
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();
  const contract = user.contract;
  const [certificates, setCertificates] = useState([]);
  const certificatesReference = useRef([]);

  const { userId } = useParams();

  const getUser = async () => {
    try {
      const response = await axios.get(`/student/search?_id=${userId}`);
      setUserData(response.data.student);
      certificatesReference.current = response.data.student.certificates;
    } catch (err) {
      console.error(err);
    }
  };

  const getCertificates = async () => {
    try {
      const certificatesPromise = [];

      certificatesReference.current.forEach((c) => {
        if (c.valid) {
          const certificateBlockchain = contract.certificates(c.idCertificate);
          certificatesPromise.push(certificateBlockchain);
        }
      });

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

      const response = await axios.post(`/certificate/decrypt/many`, {
        certificates: validCertificates
      });

      const { decryptedCertificates } = response.data;

      setCertificates(decryptedCertificates);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(async () => {
    await getUser();
    getCertificates();
  }, []);

  if (!userData) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{userData.fullName} - Detalle de Perfil</title>
      </Helmet>
      <Box
        sx={{
          mt: 3
        }}
      >
        <Grid
          sx={{
            px: 4
          }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12} md={8}>
            <ProfileCover user={userData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity certificates={userData.certificates} />
          </Grid>
          <Grid item xs={12} md={12}>
            <Results projects={certificates} />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default ManagementUsersView;

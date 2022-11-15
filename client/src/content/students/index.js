import { useState, useEffect } from 'react';
import axios from 'src/utils/certifyAxios';

import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import useRefMounted from 'src/hooks/useRefMounted';

import PageHeader from './PageHeader';

import Results from './Results';

function ManagementProjects() {
  const isMountedRef = useRefMounted();
  const [students, setStudents] = useState([]);

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

  const getStudents = async () => {
    try {
      const response = await axios.get(`/student/list`);

      if (isMountedRef.current) {
        setStudents(response.data.students);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <>
      <Helmet>
        <title>Estudiantes Registrados</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader getStudents={getStudents} />
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
          <Results projects={students} getStudents={getStudents} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementProjects;

import { useState, useRef } from 'react';
import axios from 'src/utils/certifyAxios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
// import { styled } from '@mui/material/styles';
// import wait from 'src/utils/wait';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';

import {
  Grid,
  Dialog,
  DialogTitle,
  // Divider,
  // Alert,
  // Chip,
  DialogContent,
  Box,
  Zoom,
  // ListItem,
  // List,
  // ListItemText,
  Typography,
  TextField,
  CircularProgress,
  // Avatar,
  Autocomplete,
  Button,
  useTheme
  // FormControl
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
// import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import useAuth from 'src/hooks/useAuth';

const types = [
  { title: 'DNI', value: 'DNI' },
  { title: 'CE', value: 'CE' }
];

function PageHeader({ getStudents }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { user } = useAuth();
  const type = useRef();

  const [birthday, setBirthday] = useState(null);

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
  };

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar(t('Se ha registrado al estudiante satisfactoriamente'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Estudiantes Registrados
          </Typography>
        </Grid>
        {user.role === 'MEMBER' ? (
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateProjectOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              Nuevo
            </Button>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Registrar nuevo estudiante
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            documentNumber: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().max(255).required('El nombre es requerido'),
            lastName: Yup.string()
              .max(255)
              .required('El apellido es requerido'),
            documentNumber: Yup.string()
              .min(6)
              .max(20)
              .required('El numero de documento es requerido')
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              let { firstName, lastName, documentNumber } = _values;
              const birthdayNumber = moment(birthday).unix();
              const typeValue = type.current.value;

              console.log({
                firstName,
                lastName,
                documentType: typeValue,
                documentNumber,
                birthday: birthdayNumber
              });

              const response = await axios.post(`/student/register`, {
                firstName,
                lastName,
                documentType: typeValue,
                documentNumber,
                birthday: birthdayNumber
              });

              if (response.status === 200) {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess();
                getStudents();
                setBirthday(null);
              }
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Nombres:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      name="firstName"
                      placeholder="Nombres..."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Apellidos:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(touched.lastName && errors.lastName)}
                      fullWidth
                      helperText={touched.lastName && errors.lastName}
                      name="lastName"
                      placeholder="Apellidos..."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Tipo de documento:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Autocomplete
                      sx={{
                        m: 0
                      }}
                      limitTags={1}
                      options={types}
                      getOptionLabel={(option) => option.title}
                      onChange={(event, value) => {
                        type.current = value;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          placeholder="Seleccione el tipo de documento"
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Número de documento:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <TextField
                      error={Boolean(
                        touched.documentNumber && errors.documentNumber
                      )}
                      fullWidth
                      helperText={
                        touched.documentNumber && errors.documentNumber
                      }
                      name="documentNumber"
                      placeholder="Numero de documento..."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.documentNumber}
                      variant="outlined"
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 20);
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Fecha de nacimiento:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <DatePicker
                      value={birthday}
                      inputFormat="dd/MM/yyyy"
                      onChange={(newValue) => {
                        setBirthday(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          placeholder={t('Elegir la fecha...')}
                          {...params}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    textAlign={{ sm: 'right' }}
                  />
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <Button
                      sx={{
                        mr: 2
                      }}
                      type="submit"
                      startIcon={
                        isSubmitting ? <CircularProgress size="1rem" /> : null
                      }
                      disabled={Boolean(errors.submit) || isSubmitting}
                      variant="contained"
                      size="large"
                    >
                      Registrar
                    </Button>
                    <Button
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={handleCreateProjectClose}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;

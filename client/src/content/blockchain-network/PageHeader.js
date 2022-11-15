import { useRef, useState } from 'react';
import axios from 'src/utils/certifyAxios';
import * as Yup from 'yup';
import { Formik } from 'formik';
// import { styled } from '@mui/material/styles';
// import wait from 'src/utils/wait';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
} from '@mui/material';
// import DatePicker from '@mui/lab/DatePicker';
// import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import useAuth from 'src/hooks/useAuth';

const types = [
  { title: 'Universidad Privada', value: 'PRIVATE' },
  { title: 'Universidad Pública', value: 'PUBLIC' },
  { title: 'Entidad', value: 'PUBLIC' }
];

function PageHeader({ getMembers }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const type = useRef();
  const { user } = useAuth();

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
  };

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar('Se ha registrado al participante satisfactoriamente', {
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
            Participantes de la Red
          </Typography>
          <Typography variant="subtitle2">Participantes registrados</Typography>
        </Grid>
        {user.role === 'ADMIN' ? (
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
            Registrar nuevo participante
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: '',
            abbreviation: '',
            phone: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required('El nombre es requerido')
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              let { name, abbreviation, phone } = _values;
              const password = `${abbreviation}_password`;
              const typeValue = type.current.value;
              abbreviation = abbreviation.toUpperCase();

              const response = await axios.post('/member/register', {
                name,
                type: typeValue,
                abbreviation,
                phone,
                password
              });

              if (response.status === 200) {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess();
                getMembers();
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
                      <b>Nombre:</b>
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
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      name="name"
                      placeholder="Nombre..."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      variant="outlined"
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box
                      pr={3}
                      sx={{
                        pb: { xs: 1, md: 0 }
                      }}
                    >
                      <b>{t('Description')}:</b>
                    </Box>
                  </Grid> */}
                  {/* <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                    sm={8}
                    md={9}
                  >
                    <EditorWrapper>
                      <ReactQuill />
                    </EditorWrapper>
                  </Grid> */}
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
                      <b>Tipo:</b>
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
                          placeholder="Seleccione el tipo de participante"
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
                      <b>Abreviatura:</b>
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
                        touched.abbreviation && errors.abbreviation
                      )}
                      fullWidth
                      helperText={touched.abbreviation && errors.abbreviation}
                      name="abbreviation"
                      placeholder="Abreviatura..."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.abbreviation}
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
                      <b>Teléfono:</b>
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
                      error={Boolean(touched.phone && errors.phone)}
                      fullWidth
                      helperText={touched.phone && errors.phone}
                      name="phone"
                      placeholder="Telefono..."
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      variant="outlined"
                      type="number"
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 9);
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box
                      pr={3}
                      sx={{
                        pb: { xs: 1, md: 0 }
                      }}
                    >
                      <b>{t('Upload files')}:</b>
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
                    <BoxUploadWrapper {...getRootProps()}>
                      <input {...getInputProps()} />
                      {isDragAccept && (
                        <>
                          <AvatarSuccess variant="rounded">
                            <CheckTwoToneIcon />
                          </AvatarSuccess>
                          <Typography
                            sx={{
                              mt: 2
                            }}
                          >
                            {t('Drop the files to start uploading')}
                          </Typography>
                        </>
                      )}
                      {isDragReject && (
                        <>
                          <AvatarDanger variant="rounded">
                            <CloseTwoToneIcon />
                          </AvatarDanger>
                          <Typography
                            sx={{
                              mt: 2
                            }}
                          >
                            {t('You cannot upload these file types')}
                          </Typography>
                        </>
                      )}
                      {!isDragActive && (
                        <>
                          <AvatarWrapper variant="rounded">
                            <CloudUploadTwoToneIcon />
                          </AvatarWrapper>
                          <Typography
                            sx={{
                              mt: 2
                            }}
                          >
                            {t('Drag & drop files here')}
                          </Typography>
                        </>
                      )}
                    </BoxUploadWrapper>
                    {files.length > 0 && (
                      <>
                        <Alert
                          sx={{
                            py: 0,
                            mt: 2
                          }}
                          severity="success"
                        >
                          {t('You have uploaded')} <b>{files.length}</b>{' '}
                          {t('files')}!
                        </Alert>
                        <Divider
                          sx={{
                            mt: 2
                          }}
                        />
                        <List disablePadding component="div">
                          {files}
                        </List>
                      </>
                    )}
                  </Grid> */}
                  {/* <Grid
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
                      <b>{t('Members')}:</b>
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
                      multiple
                      sx={{
                        m: 0
                      }}
                      limitTags={2}
                      options={members}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Avatar
                            sx={{
                              mr: 1
                            }}
                            src={option.avatar}
                          />
                          {option.name}
                        </li>
                      )}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true
                          }}
                          placeholder={t('Select project members...')}
                        />
                      )}
                      renderTags={(members, getTagProps) =>
                        members.map((ev, index) => (
                          <Chip
                            key={ev.name}
                            label={ev.name}
                            {...getTagProps({ index })}
                            avatar={<Avatar src={ev.avatar} />}
                          />
                        ))
                      }
                    />
                  </Grid> */}
                  {/* <Grid
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
                      <b>{t('Due Date')}:</b>
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
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          placeholder={t('Select due date...')}
                          {...params}
                        />
                      )}
                    />
                  </Grid> */}

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

import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Card,
  Grid,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  Zoom,
  Button,
  CircularProgress,
  DialogContent
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import axios from 'src/utils/certifyAxios';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';

const applyFilters = (associated, query, filters) => {
  return associated.filter((associated) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (associated[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && associated.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && associated[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (associated, page, limit) => {
  return associated.slice(page * limit, page * limit + limit);
};

const types = {
  PRIVATE: 'Universidad Privada',
  PUBLIC: 'Universidad Pública',
  ENTITY: 'Entidad'
};

const Results = ({ associated }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const currentId = useRef();
  const { user } = useAuth();

  const handleSetKeyOpen = (_id) => {
    currentId.current = _id;
    setOpen(true);
  };

  const handleSetKeyClose = () => {
    setOpen(false);
  };

  const handleSetKeySuccess = () => {
    enqueueSnackbar('Se ha asignado la llave al miembro satisfactoriamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  const handleSetKeyError = () => {
    enqueueSnackbar('Algo salió mal, intentelo dentro de unos minutos', {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  const [filters] = useState({
    status: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredAssociated = applyFilters(associated, query, filters);
  const paginatedAssociated = applyPagination(filteredAssociated, page, limit);

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder="Busque por nombres"
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              Mostrando:
            </Typography>{' '}
            <b>{paginatedAssociated.length}</b> <b>asociadas</b>
          </Box>
          <TablePagination
            component="div"
            count={filteredAssociated.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>
        <Divider />

        {paginatedAssociated.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              No se encontraron asociadas
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Abreviatura</TableCell>
                    <TableCell>Telefono</TableCell>
                    <TableCell>Certificados Válidos</TableCell>
                    <TableCell>Certificados Anulados</TableCell>
                    {user.role === 'ADMIN' && <TableCell>Acciones</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((project) => (
                    <TableRow hover key={project._id}>
                      <TableCell>
                        <Typography noWrap variant="h5">
                          {project.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap variant="h5">
                          {types[project.type]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap variant="h5">
                          {project.abbreviation}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap variant="h5">
                          {project.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap variant="h5">
                          {project.certificatesNumberValid}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap variant="h5">
                          {project.certificatesNumberAnnulled}
                        </Typography>
                      </TableCell>
                      {user.role === 'ADMIN' && (
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title="Asignar Llave" arrow>
                              <IconButton
                                color="primary"
                                onClick={() => handleSetKeyOpen(project._id)}
                              >
                                <VpnKeyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={filteredAssociated.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleSetKeyClose}>
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Asignar llave a participante
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            publicKey: '',
            privateKey: '',
            email: ''
          }}
          validationSchema={Yup.object().shape({
            publicKey: Yup.string()
              .max(255)
              .required('La llave pública es obligatoria'),
            privateKey: Yup.string()
              .max(255)
              .required('La llave privada es obligatoria'),
            email: Yup.string()
              .email()
              .required('El correo electrónico es obligatorio')
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              let { publicKey, privateKey, email } = _values;

              const responseSaveKey = await axios.post(
                '/member/save-public-key',
                {
                  _id: currentId.current,
                  publicKey
                }
              );

              if (responseSaveKey.status === 200) {
                await axios.post('/member/send-private-key', {
                  privateKey,
                  email
                });
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleSetKeySuccess();
              } else {
                handleSetKeyError();
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
            touched
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
                      <b>Llave pública:</b>
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
                      error={Boolean(touched.publicKey && errors.publicKey)}
                      fullWidth
                      helperText={touched.publicKey && errors.publicKey}
                      name="publicKey"
                      placeholder="Llave pública"
                      onBlur={handleBlur}
                      onChange={handleChange}
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
                      <b>Llave privada:</b>
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
                      error={Boolean(touched.privateKey && errors.privateKey)}
                      fullWidth
                      helperText={touched.privateKey && errors.privateKey}
                      name="privateKey"
                      placeholder="Llave privada"
                      onBlur={handleBlur}
                      onChange={handleChange}
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
                      <b>Correo:</b>
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
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email}
                      name="email"
                      placeholder="Correo electrónico"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
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
                      Enviar
                    </Button>
                    <Button
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={handleSetKeyClose}
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
};

Results.propTypes = {
  associated: PropTypes.array.isRequired
};

Results.defaultProps = {
  associated: []
};

export default Results;

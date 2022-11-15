import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  // Autocomplete,
  Box,
  Card,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  // MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Zoom,
  // ToggleButton,
  // ToggleButtonGroup,
  Typography,
  // FormControl,
  // Select,
  // InputLabel,
  styled,
  useTheme,
  TextField
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import DownloadIcon from '@mui/icons-material/Download';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import BlockIcon from '@mui/icons-material/Block';
import axios from 'src/utils/certifyAxios';
import { backendUrl } from 'src/config';
import { saveAs } from 'file-saver';

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['transform', 'background'])};
    transform: scale(1);
    transform-origin: center;

    &:hover {
        transform: scale(1.1);
    }
  `
);

const types = {
  TITLE: 'Título',
  GRADE: 'Grado',
  CONSTANCIA: 'Constancia'
};

const applyFilters = (projects, query, filters) => {
  return projects.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['fullName'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && project.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && project[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (projects, page, limit) => {
  return projects.slice(page * limit, page * limit + limit);
};

const Results = ({ projects, getCertificates }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [filters] = useState({
    status: null
  });

  const { user } = useAuth();
  const account = user.account;
  const contract = user.contract;
  const [idUser, setIdUser] = useState(-1);

  useEffect(() => {
    setIdUser(user._id);
  }, []);

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

  const filteredProjects = applyFilters(projects, query, filters);
  const paginatedProjects = applyPagination(filteredProjects, page, limit);

  // const downloadFile = async (filename, originalname) => {
  //   const link = document.createElement('a');
  //   link.href = `${backendUrl}/certificates/${filename}`;
  //   link.setAttribute('download', originalname);

  //   document.body.appendChild(link);
  //   link.click();
  // };

  const saveFile = (filename, originalname) => {
    saveAs(`${backendUrl}/certificates/${filename}`, originalname);
  };

  const handleCancelCertificatetSuccess = () => {
    enqueueSnackbar('Se ha anulado el certificado satisfactoriamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const handleCancelCertificatetError = () => {
    enqueueSnackbar('No se pudo anular el certificado, intentelo de nuevo', {
      variant: 'danger',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const cancelCertificate = async (idCertificate) => {
    const certificate = projects.find((c) => c.idCertificate === idCertificate);
    await contract.cancelCertificate(idCertificate, {
      from: account
    });

    const { idsUniversities, idStudent } = certificate;
    const response = await axios.post('/certificate/annul-per-university', {
      idsUniversities
    });

    await axios.post('/certificate/annul-for-student', {
      idCertificate,
      idStudent
    });

    if (response.status === 200) {
      getCertificates();
      handleCancelCertificatetSuccess();
    } else {
      handleCancelCertificatetError();
    }
  };

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
                placeholder="Busque por apellidos y nombres"
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
            <b>{paginatedProjects.length}</b> <b>certificados</b>
          </Box>
          <TablePagination
            component="div"
            count={filteredProjects.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>
        <Divider />

        {paginatedProjects.length === 0 ? (
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
              No se encontraron certificados del estudiante seleccionado
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Apellidos y nombres (DNI / CE)</TableCell>
                    <TableCell>Tipo de Certificado</TableCell>
                    <TableCell>Otorgado por</TableCell>
                    <TableCell>Certificado</TableCell>
                    <TableCell>Fecha de Diploma</TableCell>
                    <TableCell>Fecha de Registro</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProjects.map((project, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {project.fullName}
                          </Typography>
                          <Typography noWrap variant="h6">
                            ({project.documentType}: {project.documentNumber})
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {types[project.type]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {project.universities.map((u) => (
                            <Typography noWrap variant="h5">
                              {u.abbreviation}
                            </Typography>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {project.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {moment
                              .unix(project.diploma_date)
                              .format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {moment
                              .unix(project.createdAt)
                              .format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                          align="center"
                        >
                          <Box>
                            {project.fileName !== '' ? (
                              <Tooltip title="Descargar" arrow>
                                <IconButtonWrapper
                                  sx={{
                                    backgroundColor: `${theme.colors.primary.lighter}`,
                                    color: `${theme.colors.primary.main}`,
                                    transition: `${theme.transitions.create([
                                      'all'
                                    ])}`,

                                    '&:hover': {
                                      backgroundColor: `${theme.colors.primary.main}`,
                                      color: `${theme.palette.getContrastText(
                                        theme.colors.primary.main
                                      )}`
                                    }
                                  }}
                                  onClick={() =>
                                    saveFile(
                                      project.filename,
                                      project.originalname
                                    )
                                  }
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButtonWrapper>
                              </Tooltip>
                            ) : (
                              ''
                            )}
                            {project.idsUniversities.includes(idUser) && (
                              <Tooltip title="Anular" arrow>
                                <IconButtonWrapper
                                  sx={{
                                    ml: 1,
                                    backgroundColor: `${theme.colors.error.lighter}`,
                                    color: `${theme.colors.error.main}`,
                                    transition: `${theme.transitions.create([
                                      'all'
                                    ])}`,

                                    '&:hover': {
                                      backgroundColor: `${theme.colors.error.main}`,
                                      color: `${theme.palette.getContrastText(
                                        theme.colors.error.main
                                      )}`
                                    }
                                  }}
                                  onClick={() =>
                                    cancelCertificate(project.idCertificate)
                                  }
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButtonWrapper>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={filteredProjects.length}
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
    </>
  );
};

Results.propTypes = {
  projects: PropTypes.array.isRequired
};

Results.defaultProps = {
  projects: []
};

export default Results;

import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'src/utils/certifyAxios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Autocomplete,
  Box,
  Card,
  Checkbox,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  // MenuItem,
  Link,
  AvatarGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  // ToggleButton,
  // ToggleButtonGroup,
  LinearProgress,
  TextField,
  Button,
  Typography,
  Dialog,
  // FormControl,
  // Select,
  // InputLabel,
  Zoom,
  CardMedia,
  lighten,
  styled,
  useTheme,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { saveAs } from 'file-saver';
import { backendUrl } from 'src/config';

import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import moment from 'moment';
import Label from 'src/components/Label';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import QrCodeIcon from '@mui/icons-material/QrCode';

import { useSnackbar } from 'notistack';
import { formatDistance, format } from 'date-fns';
import Text from 'src/components/Text';
import BulkActions from './BulkActions';

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

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const CardWrapper = styled(Card)(
  ({ theme }) => `

  position: relative;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    z-index: 1;
    transition: ${theme.transitions.create(['box-shadow'])};
  }
      
    &.Mui-selected::after {
      box-shadow: 0 0 0 3px ${theme.colors.primary.main};
    }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.colors.error.lighter};
     color: ${theme.colors.error.main};
     padding: ${theme.spacing(0.75)};

     &:hover {
      background: ${lighten(theme.colors.error.lighter, 0.4)};
     }
`
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getProjectStatusLabel = (projectStatus) => {
  const map = {
    not_started: {
      text: 'Not started',
      color: 'error'
    },
    in_progress: {
      text: 'In progress',
      color: 'info'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    }
  };

  const { text, color } = map[projectStatus];

  return <Label color={color}>{text}</Label>;
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

const types = [
  { title: 'DNI', value: 'DNI' },
  { title: 'CE', value: 'CE' }
];

const Results = ({ projects, getStudents }) => {
  const [selectedItems, setSelectedProjects] = useState([]);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    status: null
  });
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [documentType, setDocumentType] = useState(null);

  const [idStudentSelected, setIdStudentSelected] = useState(null);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllProjects = (event) => {
    setSelectedProjects(
      event.target.checked ? projects.map((project) => project.id) : []
    );
  };

  const handleSelectOneProject = (_event, projectId) => {
    if (!selectedItems.includes(projectId)) {
      setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedProjects((prevSelected) =>
        prevSelected.filter((id) => id !== projectId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProjects = applyFilters(projects, query, filters);
  const paginatedProjects = applyPagination(filteredProjects, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeProjects =
    selectedItems.length > 0 && selectedItems.length < projects.length;
  const selectedAllProjects = selectedItems.length === projects.length;

  const [toggleView] = useState('table_view');

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
  };

  const saveFile = (filename, originalname) => {
    saveAs(`${backendUrl}/qrcodes/${filename}`, originalname);
  };

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar(t('Se ha actualizado al estudiante satisfactoriamente'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The projects has been deleted successfully'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
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
                placeholder="Busque por nombre"
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {toggleView === 'table_view' && (
        <Card>
          {selectedBulkActions && (
            <Box p={2}>
              <BulkActions />
            </Box>
          )}
          {!selectedBulkActions && (
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
                <b>{paginatedProjects.length}</b> <b>estudiantes</b>
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
          )}
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
                No existen estudiantes con el nombre ingresado
              </Typography>
            </>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Apellidos y nombres</TableCell>
                      <TableCell>Tipo de Documento</TableCell>
                      <TableCell>Número de Documento</TableCell>
                      <TableCell>Fecha de nacimiento</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProjects.map((project) => {
                      const isProjectSelected = selectedItems.includes(
                        project._id
                      );
                      return (
                        <TableRow
                          hover
                          key={project._id}
                          selected={isProjectSelected}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isProjectSelected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isProjectSelected}
                            />
                          </TableCell> */}
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {project.fullName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {project.documentType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {project.documentNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {moment
                                .unix(project.birthday)
                                .format('DD/MM/YYYY')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Editar" arrow>
                              <IconButtonWrapper
                                sx={{
                                  ml: 1,
                                  backgroundColor: `${theme.colors.info.lighter}`,
                                  color: `${theme.colors.info.main}`,
                                  transition: `${theme.transitions.create([
                                    'all'
                                  ])}`,

                                  '&:hover': {
                                    backgroundColor: `${theme.colors.info.main}`,
                                    color: `${theme.palette.getContrastText(
                                      theme.colors.info.main
                                    )}`
                                  }
                                }}
                                onClick={() => {
                                  setIdStudentSelected(project._id);
                                  setFirstName(project.firstName);
                                  setLastName(project.lastName);
                                  setDocumentType({
                                    title: project.documentType,
                                    value: project.documentType
                                  });
                                  setDocumentNumber(project.documentNumber);
                                  setBirthday(
                                    moment.unix(project.birthday).toDate()
                                  );
                                  handleCreateProjectOpen();
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButtonWrapper>
                            </Tooltip>
                            <Tooltip title="Ver Certificados" arrow>
                              <IconButtonWrapper
                                sx={{
                                  ml: 1,
                                  backgroundColor: `${theme.colors.primary.lighter}`,
                                  color: `${theme.colors.info.main}`,
                                  transition: `${theme.transitions.create([
                                    'all'
                                  ])}`,

                                  '&:hover': {
                                    backgroundColor: `${theme.colors.primary.main}`,
                                    color: `${theme.palette.getContrastText(
                                      theme.colors.info.main
                                    )}`
                                  }
                                }}
                                onClick={() => {
                                  navigate(`/students/detail/${project._id}`);
                                }}
                              >
                                <BookIcon fontSize="small" />
                              </IconButtonWrapper>
                            </Tooltip>
                            <Tooltip title="Ver Código QR" arrow>
                              <IconButtonWrapper
                                sx={{
                                  ml: 1,
                                  backgroundColor: `${theme.colors.info.lighter}`,
                                  color: `${theme.colors.info.main}`,
                                  transition: `${theme.transitions.create([
                                    'all'
                                  ])}`,

                                  '&:hover': {
                                    backgroundColor: `${theme.colors.info.main}`,
                                    color: `${theme.palette.getContrastText(
                                      theme.colors.info.main
                                    )}`
                                  }
                                }}
                                onClick={() =>
                                  saveFile(
                                    `qr_code_${project._id}.png`,
                                    `qr_code_${project.documentNumber}.png`
                                  )
                                }
                              >
                                <QrCodeIcon fontSize="small" />
                              </IconButtonWrapper>
                            </Tooltip>
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
      )}
      {toggleView === 'grid_view' && (
        <>
          {paginatedProjects.length !== 0 && (
            <Card
              sx={{
                p: 2,
                mb: 3
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <>
                  <Box display="flex" alignItems="center">
                    <Tooltip
                      arrow
                      placement="top"
                      title={t('Select all projects')}
                    >
                      <Checkbox
                        checked={selectedAllProjects}
                        indeterminate={selectedSomeProjects}
                        onChange={handleSelectAllProjects}
                      />
                    </Tooltip>
                  </Box>
                  {selectedBulkActions && (
                    <Box flex={1} pl={2}>
                      <BulkActions />
                    </Box>
                  )}
                  {!selectedBulkActions && (
                    <TablePagination
                      component="div"
                      count={filteredProjects.length}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleLimitChange}
                      page={page}
                      rowsPerPage={limit}
                      rowsPerPageOptions={[5, 10, 15]}
                    />
                  )}
                </>
              </Box>
            </Card>
          )}
          {paginatedProjects.length === 0 ? (
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t("We couldn't find any projects matching your search criteria")}
            </Typography>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedProjects.map((project) => {
                  const isProjectSelected = selectedItems.includes(project.id);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={project.name}>
                      <CardWrapper
                        className={clsx({
                          'Mui-selected': isProjectSelected
                        })}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: '2'
                          }}
                        >
                          <Box
                            pl={2}
                            py={1}
                            pr={1}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography component="span">
                                <b>{t('Tags')}:</b>{' '}
                              </Typography>
                              {project.tags.map((value) => {
                                return (
                                  <span key={value}>
                                    <Link href="#">{value}</Link>,{' '}
                                  </span>
                                );
                              })}
                            </Box>
                            <Checkbox
                              checked={isProjectSelected}
                              onChange={(event) =>
                                handleSelectOneProject(event, project.id)
                              }
                              value={isProjectSelected}
                            />
                          </Box>
                          <Divider />
                          <CardMedia
                            sx={{
                              minHeight: 180
                            }}
                            image={project.screenshot}
                          />
                          <Divider />
                          <Box p={2}>
                            {getProjectStatusLabel(project.status)}

                            <Typography
                              sx={{
                                mt: 2
                              }}
                              variant="h4"
                              gutterBottom
                            >
                              {project.name}
                            </Typography>

                            <Typography noWrap variant="subtitle2">
                              {project.description}
                            </Typography>
                          </Box>
                          <Box
                            px={2}
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography variant="subtitle2">
                                {t('Started')}:{' '}
                              </Typography>
                              <Typography variant="h5">
                                {format(project.dueDate, 'MMMM dd yyyy')}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2">
                                {t('Due in')}:{' '}
                                <Text color="black">
                                  {formatDistance(
                                    project.startDate,
                                    project.dueDate,
                                    {
                                      addSuffix: true
                                    }
                                  )}{' '}
                                  days
                                </Text>
                              </Typography>
                            </Box>
                          </Box>

                          <Box px={2} pb={2} display="flex" alignItems="center">
                            <LinearProgress
                              sx={{
                                flex: 1,
                                mr: 1
                              }}
                              value={project.progress}
                              color="primary"
                              variant="determinate"
                            />
                            <Typography variant="subtitle1">
                              {project.progress}%
                            </Typography>
                          </Box>
                          <Divider />
                          <Box
                            p={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" justifyContent="flex-start">
                              {project.memberIds.length > 0 && (
                                <AvatarGroup max={4}>
                                  {project.memberIds.map((member) => (
                                    <Tooltip
                                      arrow
                                      placement="top"
                                      key={member.id}
                                      title={member.first_name}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 30,
                                          height: 30
                                        }}
                                        key={member.id}
                                        src={member.avatar}
                                      />
                                    </Tooltip>
                                  ))}
                                </AvatarGroup>
                              )}
                            </Box>
                            <Box>
                              <Button
                                sx={{
                                  mr: 1
                                }}
                                size="small"
                                variant="contained"
                                color="primary"
                              >
                                {t('Edit')}
                              </Button>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButtonError
                                  onClick={handleConfirmDelete}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButtonError>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      </CardWrapper>
                    </Grid>
                  );
                })}
              </Grid>
              <Card
                sx={{
                  p: 2,
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography component="span" variant="subtitle1">
                    Mostrando
                  </Typography>{' '}
                  <b>{limit}</b> {t('of')} <b>{filteredProjects.length}</b>{' '}
                  <b>participantes</b>
                </Box>
                <TablePagination
                  component="div"
                  count={filteredProjects.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  labelRowsPerPage=""
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Card>
            </>
          )}
        </>
      )}
      {!toggleView && (
        <Card
          sx={{
            textAlign: 'center',
            p: 3
          }}
        >
          <Typography
            align="center"
            variant="h4"
            fontWeight="normal"
            color="text.secondary"
            sx={{
              my: 5
            }}
            gutterBottom
          >
            {t(
              'Choose between table or grid views for displaying the projects list.'
            )}
          </Typography>
        </Card>
      )}

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this project')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>

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
            Editar estudiante
          </Typography>
        </DialogTitle>
        <Formik
          enableReinitialize
          initialValues={{
            firstName: '',
            lastName: '',
            documentNumber: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().max(255),
            lastName: Yup.string().max(255),
            dni: Yup.string().min(8).max(8)
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              const birthdayNumber = moment(birthday).unix();
              const typeValue = documentType.value;

              const response = await axios.put(`/student/edit`, {
                _id: idStudentSelected,
                firstName,
                lastName,
                documentNumber,
                documentType: typeValue,
                birthday: birthdayNumber
              });

              if (response.status === 200) {
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess();
                getStudents();
                setBirthday(null);
                setIdStudentSelected(null);
                setFirstName('');
                setLastName('');
                setDocumentNumber('');
              }
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleSubmit, isSubmitting, touched }) => (
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
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
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
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
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
                      <b>Tipo de Documento:</b>
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
                        setDocumentType(value);
                        console.log(value);
                      }}
                      value={documentType}
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
                      <b>Numero de documento:</b>
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
                      fullWidth
                      name="documentNumber"
                      placeholder="Número de documento..."
                      onBlur={handleBlur}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      value={documentNumber}
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
                      Actualizar
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
};

Results.propTypes = {
  projects: PropTypes.array.isRequired
};

Results.defaultProps = {
  projects: []
};

export default Results;

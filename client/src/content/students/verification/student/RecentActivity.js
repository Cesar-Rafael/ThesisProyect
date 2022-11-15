import {
  Box,
  Typography,
  Card,
  CardHeader,
  Divider,
  Avatar,
  styled
} from '@mui/material';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

function RecentActivity({ certificates }) {
  return (
    <Card>
      <CardHeader title="Cantidad de Certificados" />
      <Divider />
      <Box px={2} py={4} display="flex" alignItems="flex-start">
        <AvatarPrimary>
          <CollectionsBookmarkIcon />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography variant="h3">
            {certificates.filter((c) => c.valid).length} certificados
            registrados
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default RecentActivity;

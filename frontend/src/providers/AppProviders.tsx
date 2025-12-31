import { SnackbarProvider, closeSnackbar } from 'notistack'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SnackbarUtilsConfigurator from '../utils/snackbar'

type Props = {
  children: React.ReactNode
}

export default function AppProviders({ children }: Props) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      action={(snackbarId) => (
        <IconButton
          size="small"
          onClick={() => closeSnackbar(snackbarId)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    >
      <SnackbarUtilsConfigurator />
      {children}
    </SnackbarProvider>
  )
}

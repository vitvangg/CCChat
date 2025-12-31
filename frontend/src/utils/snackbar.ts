import { useSnackbar } from 'notistack'

let snackbarRef: any

const SnackbarUtilsConfigurator = () => {
  snackbarRef = useSnackbar()
  return null
}

export const toast = {
  success(msg: string) {
    snackbarRef.enqueueSnackbar(msg, { variant: 'success' })
  },
  error(msg: string) {
    snackbarRef.enqueueSnackbar(msg, { variant: 'error' })
  },
  info(msg: string) {
    snackbarRef.enqueueSnackbar(msg, { variant: 'info' })
  },
}

export default SnackbarUtilsConfigurator

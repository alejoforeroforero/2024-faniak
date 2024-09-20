import { Box, makeStyles, Typography } from '@material-ui/core'
import { useContext } from 'react';
import { StateContext } from '../../store'
import FactoryButton from '../factory/PermanentFactoryButton'

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: "100%",
    minWidth: 0,
    padding: 14,
    boxShadow: "none",
    '& .MuiSvgIcon-root': {
      fontSize: 48,
    },
  },
}))

export default function NoFiles() {
  const classes = useStyles()
  const state = useContext(StateContext)

  const is_home = state.curr_folder_id === state.user.google_root_folder_id

  return (
    <Box display="flex" justifyContent="center" height="100%" alignItems="center">
      <Box textAlign="center">
        {is_home ? (
          <Typography variant="h4">
            This is where the magic starts.
          </Typography>
        ) : (
          <Typography variant="h4">
            This folder is still empty.
          </Typography>
        )}
        <Box mt={1} />
        {is_home ? (
          <Typography variant="h6">
            Click the button!
          </Typography>
        ) : (
          <Typography variant="h6">
            Click this magic button!
          </Typography>
        )}
        <Box mt={2} />
        <FactoryButton buttonClass={classes.button} />
        <Box mt={4} />
      </Box>
    </Box>
  )
}
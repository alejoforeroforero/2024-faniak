import { useContext } from 'react';
import { DispatchContext } from '../../store'
import { Button, Typography } from '@material-ui/core'
import Notice from './Notice'
import { createRootFolder } from '../../utils/authUtils'
import { useSnackbar } from 'notistack'

export default function DeletedNotice({ setDeleted }) {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useContext(DispatchContext)

  const handleClick = async () => {
    const folder_id = await createRootFolder()

    if (folder_id) {
      dispatch({
        type: "UPDATE",
        set: (state) => {
          state.user.google_root_folder_id = folder_id
          return { ...state }
        }
      })
      setDeleted(false)
    } else {
      enqueueSnackbar("We were unable to communicate with Google Drive.", { variant: "error" })
    }
  }

  return (
    <Notice>
      <div style={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="body1">
          Looks like you have permanently deleted "My Music Drive" from your Google Drive account.
        </Typography>
        <Typography variant="body2">
          If you think this is a mistake, please refresh this page or contact the Faniak support.
        </Typography>
      </div>
      <div>
        <Button variant="outlined" color="inherit" onClick={handleClick}>
          Create a new "My Music Drive"
        </Button>
      </div>
    </Notice>
  )
}
import { useContext } from 'react';
import { StateContext, DispatchContext } from '../../store'
import { Button, Typography } from '@material-ui/core'
import Notice from './Notice'
import { useSnackbar } from 'notistack'
import { updateFile } from '../../api/drive/updateFile'

export default function TrashedNotice() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const { enqueueSnackbar } = useSnackbar()
  const google_folder_id = state.user.google_root_folder_id

  const restoreRootFolder = async () => {
    updateFile({
      fileId: google_folder_id,
      resource: {
        trashed: false,
      },
    })
      .then(res => {
        if (res.error) return

        enqueueSnackbar(`"My Music Drive" has been restored.`, { variant: "success" })

        dispatch({
          type: 'UPDATE',
          set: (state) => {
            state.curr_folder.trashed = false
            return { ...state }
          }
        })
      })
  }

  return (
    <Notice>
      <div style={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="body1">
          You have deleted "My Music Drive" from your Google Drive account.
        </Typography>
        <Typography variant="body2">
          If you don't restore it in 30 days it will be permanetly deleted from Faniak.
        </Typography>
      </div>
      <div>
        <Button variant="outlined" color="inherit" onClick={restoreRootFolder}>
          Restore Folder
        </Button>
      </div>
    </Notice>
  )
}
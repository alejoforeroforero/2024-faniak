import { useState, useContext } from 'react';
import {
  Box,
  CircularProgress,
  DialogContent,
} from '@material-ui/core'
import { DispatchContext, StateContext } from '../../../store'
import BaseDialogTitle from '../../BaseDialogTitle'
import { createArtist } from '../../../api/folder/create'
import DialogImportMetadata from '../../DialogImportMetadata'
import getFolder from '../../../api/drive/getFolder'
import { connectionNames } from '../../../dictionary/connection'
import BaseDialog from '../../BaseDialog'
import { useSnackbar } from 'notistack'
import { googleMimeTypes } from '../../../api/google/store'
import { createFile } from '../../../api/drive/createFile'
import { folderTypes } from '../../../dictionary/folder'
import ExternalSearch from '../ExternalSearch'

const defaultSource = connectionNames.SPOTIFY

// callback: (folder_id) => {}
export default function DialogAddArtist({ handleClose, callback, parent_id }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [submitting, setSubmitting] = useState(false)
  const [artistFolder, setArtistFolder] = useState(null)

  const submitName = (name) => {
    submit({
      name: name,
      created_from_scratch: true,
    })
  }

  const submitConnection = (result) => {
    submit({
      name: result.name,
      social_networks: [{
        name: result.source,
        link: result.url,
      }],
      connections: {
        [result.source]: {
          id: result.source_id,
          url: result.url,
          name: result.name,
          picture: result.picture,
        }
      }
    })
  }

  function submit(artist_data) {
    setSubmitting(true)

    createFile({
      resource: {
        name: artist_data.name,
        parents: parent_id ? [parent_id] : [state.user.google_root_folder_id],
        mimeType: googleMimeTypes.FOLDER,
      }
    }).then(res => {
      if (res.error) {
        enqueueSnackbar("File creation failed", { variant: "error" })
        return
      }

      const payload = {
        data: artist_data,
        google_folder_id: res.file.id
      }

      createArtist(payload, dispatch)
        .then(data => {
          setSubmitting(false)

          if (data.error) {
            enqueueSnackbar("Artist creation failed", { variant: "error" })
            return
          }

          enqueueSnackbar("Artist saved", { variant: "success" })
          callback?.(data.folder_id)

          if (artist_data.connections) {
            getFolder({ folder_id: data.folder_id })
              .then(res => {
                if (res.error) return

                setArtistFolder(res.folder)
              })

            return
          }

          handleClose()
        })
    })
  }

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Add new artist
      </BaseDialogTitle>

      <DialogContent style={{ height: 280 }}>
        {submitting ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            pb={5}
          >
            <CircularProgress size={64} />
          </Box>
        ) : (
          <ExternalSearch
            submitConnection={submitConnection}
            submitName={submitName}
            label="Type an artist or band name"
            type={folderTypes.ARTIST}
          />
        )}
      </DialogContent>

      {Boolean(artistFolder) && (
        <DialogImportMetadata
          source={defaultSource}
          handleClose={handleClose}
          folder={artistFolder}
          callback={callback}
        />
      )}
    </BaseDialog >
  )
}
import { useContext } from 'react';
import {
  Button,
  Box,
  Divider,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Dropzone from '../../Dropzone'
import processAudioFiles from '../../../utils/processAudioFiles'
import AttachFile from '@material-ui/icons/AttachFile'
import { StateContext } from '../../../store'
import { useSnackbar } from 'notistack'
import ExternalSearch from '../ExternalSearch'
import { folderTypes } from '../../../dictionary/folder'
import { getSpotifyMetadata } from '../../../api/connections/getSpotifyMetadata'
import { runBackgroundJob } from '../../../utils/backgroundUtils'
import { processSpotify } from '../../DialogImportMetadata/processSpotify'
import { prepareSubmission } from '../../DialogImportMetadata/prepareSubmission'
import { addAlbumsAndSongs } from '../../../api/drive/addAlbumsAndSongs'

const useStyles = makeStyles(theme => ({
  dropzone: {
    height: "100%",
  },
}))

export default function StepOne({
  onDrop,
  handleClose,
  parent_id,
  callback,
  handleSkip,
  setAlbum,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const { user } = useContext(StateContext)

  const handleSelectFiles = files => {
    const unlimited_sm = user.max_smart_folders < 0
    const can_create_sm = unlimited_sm || user.current_smart_folders + files.length <= user.max_smart_folders

    if (!can_create_sm) {
      enqueueSnackbar("You have selected too many songs! Please upgrade your plan.", { variant: "warning" })
      return
    }

    processAudioFiles(files)
      .then(onDrop)
  }

  const importAlbum = (result) => {
    const album_title = result.name

    enqueueSnackbar(`Loading more metadata for "${album_title}"...`, { variant: "info" })
    handleClose()

    runBackgroundJob({
      apiFunction: getSpotifyMetadata,
      apiPayload: { album_ids: [result.source_id] },
      processResponse: async (res) => {
        if (res.error) return

        const [result] = res.results
        result.selected = true

        const albums = await processSpotify({ results: res.results })
        enqueueSnackbar(`Creating "${album_title}"...`, { variant: "info" })
        const payload = await prepareSubmission({ parent_id, albums })

        await runBackgroundJob({
          apiFunction: addAlbumsAndSongs,
          apiPayload: payload,
          processResponse: (res) => {
            if (res.error) {
              enqueueSnackbar(`We were unable to load "${album_title}"...`, { variant: "error" })
              return
            }
            enqueueSnackbar(`"${album_title}" is now in your catalog!`, { variant: "success" })
            callback?.()
          },
          delay: 2000,
        })
      },
      delay: 1500,
    })
  }

  const createFromScratch = (title) => {
    setAlbum(prev => ({ ...prev, title: title }))
    handleSkip()
  }

  return (
    <div>
      <ExternalSearch
        submitConnection={importAlbum}
        submitName={createFromScratch}
        label="Search for a released album..."
        type={folderTypes.ALBUM}
      />
      <Box pt={2} pb={2} display="flex" alignItems={"center"}>
        <Box flexGrow={1} pr={1}>
          <Divider />
        </Box>
        OR
        <Box flexGrow={1} pl={1}>
          <Divider />
        </Box>
      </Box>
      <Dropzone
        onDrop={handleSelectFiles}
        enableClick
        accept="audio/*"
      >
        <Box height={128}>
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            startIcon={<AttachFile />}
            className={classes.dropzone}
          >
            Drop Your Audio Files
          </Button>
        </Box>
      </Dropzone>

    </div>
  )
}
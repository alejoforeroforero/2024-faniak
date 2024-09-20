import {
  Button,
  Box,
  Divider,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Dropzone from '../../Dropzone'
import processAudioFiles from '../../../utils/processAudioFiles'
import AttachFile from '@material-ui/icons/AttachFile'
import ExternalSearch from '../ExternalSearch'
import { folderTypes } from '../../../dictionary/folder'
import { useSnackbar } from 'notistack'
import { getSpotifySong } from '../../../api/connections/getSpotifySong'
import { processTrack } from '../../DialogImportMetadata/processSpotify'
import { createFile } from '../../../api/drive/createFile'
import { googleMimeTypes } from '../../../api/google/store'
import { createSong } from '../../../api/folder/create'
import { createArtistAlbum } from '../../../api/relation/create'

const useStyles = makeStyles(() => ({
  button: {
    height: "100%",
  },
}))

export default function StepOne({
  onDrop,
  handleClose,
  parent_id,
  callback,
  handleSkip,
  setSong,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()

  const handleSelectFiles = files => {
    processAudioFiles(files)
      .then(onDrop)
  }

  const importSong = async (result) => {
    const title = result.name

    enqueueSnackbar(`"${title}" will be ready in a few seconds...`, { variant: "success" })

    handleClose()

    let res = await getSpotifySong({ source_id: result.source_id })

    if (res.error) {
      enqueueSnackbar(`We lost connection...`, { variant: "error" })
      return
    }

    console.log(res.data)

    const song_data = processTrack()(res.data)

    res = await createFile({
      resource: {
        name: song_data.title,
        mimeType: googleMimeTypes.FOLDER,
        parents: [parent_id],
      },
      fields: "id",
    })

    if (res.error) {
      enqueueSnackbar(`We lost connection...`, { variant: "error" })
      return
    }

    const file_id = res.file.id

    res = await createSong({
      google_folder_id: file_id,
      data: song_data,
    })

    if (res.error) {
      enqueueSnackbar(`We lost connection...`, { variant: "error" })
      return
    }

    const song_folder_id = res.folder_id

    const artist_relationships = song_data.artists.filter(artist => artist.id)

    for (const artist of artist_relationships) {
      await createArtistAlbum({
        parent_folder: { folder_id: artist.id },
        child_folder: { folder_id: song_folder_id },
        data: artist,
      })
    }

    enqueueSnackbar(`"${title}" is now in your catalog!`, { variant: "success" })
    callback?.()
  }

  const createFromScratch = (title) => {
    setSong(prev => ({ ...prev, title: title }))
    handleSkip()
  }

  return (
    <div>
      <ExternalSearch
        submitConnection={importSong}
        submitName={createFromScratch}
        label="Search for a released song..."
        type={folderTypes.SONG}
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
            className={classes.button}
          >
            Drop Your Audio File
          </Button>
        </Box>
      </Dropzone>
    </div>
  )
}
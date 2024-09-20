import {
  Box,
  TextField,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Tracklist from './Tracklist'
import Artwork from './Artwork'
import renderJoinedList from '../../../utils/renderJoinedList'

const useStyles = makeStyles(theme => ({
  dropzone: {
    height: "100%",
  },
  form: {
    flexGrow: 1,
  },
  field: {
    marginBottom: 8,
  },
}))

export default function StepTwo({
  album, setAlbum,
  uploadFiles, setUploadFiles,
  tracklist, setTracklist,
  callback
}) {

  const classes = useStyles()

  const handleChangeTitle = e => {
    const title = e.target.value
    setAlbum(prev => ({ ...prev, title }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    callback()
  }

  const filterReadableAlbumData = () => {
    const list = []

    if (album.year) list.push(album.year)
    if (album.genres?.length) list.push(album.genres.join(", "))
    if (album.artists?.length) list.push(album.artists.join(", "))

    return list
  }

  return (
    <>
      <Box display="flex" pb={2}>
        <Artwork album={album} setAlbum={setAlbum} />

        <form id="addAlbum" className={classes.form} onSubmit={handleSubmit}>
          <TextField
            defaultValue={album.title}
            autoFocus
            onChange={handleChangeTitle}
            label="Album Title"
            required
            autoComplete="off"
            fullWidth
            color="primary"
            className={classes.field}
          />

          <Typography variant="body2">
            {renderJoinedList(filterReadableAlbumData())}
          </Typography>
        </form>
      </Box>

      {tracklist.length ? (
        <Tracklist
          tracklist={tracklist}
          setTracklist={setTracklist}
          uploadFiles={uploadFiles}
          setUploadFiles={setUploadFiles}
        />
      ) : null}
    </>
  )
}
import { useRef } from 'react';
import {
  Avatar,
  CardActionArea,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AlbumIcon from '@material-ui/icons/Album'
import FileInput from '../../FileInput'

const artworkSize = 86

const useStyles = makeStyles(theme => ({
  artwork: {
    height: artworkSize,
    width: artworkSize,
    borderRadius: 5,
  },
  artworkWrapper: {
    width: artworkSize,
    flexShrink: 0,
    marginRight: 16,
  }
}))

export default function Artwork({ album, setAlbum }) {

  const classes = useStyles()
  const inputRef = useRef()

  const handleClick = () => {
    inputRef.current.click()
  }

  const handleChange = (event) => {
    const { files } = event.target

    if (!files.length) return (
      setAlbum(prev => ({
        ...prev,
        artwork: null
      }))
    )

    const [file] = files

    const url = window.URL
      ? window.URL.createObjectURL(file)
      : window.webkitURL.createObjectURL(file)

    setAlbum(prev => ({
      ...prev,
      artwork: { file, url }
    }))
  }

  return (
    <CardActionArea onClick={handleClick} className={classes.artworkWrapper}>
      <Avatar
        className={classes.artwork}
        variant="square"
        alt=""
        src={album.artwork?.url}
      >
        <AlbumIcon />
      </Avatar>

      <FileInput
        inputRef={inputRef}
        onChange={handleChange}
        accept="image/*"
      />
    </CardActionArea>
  )
}
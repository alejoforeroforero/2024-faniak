import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import {
  TextField,
  MenuItem,
  Avatar,
  IconButton,
  Typography,
} from '@material-ui/core'
import { folderTypes, folderIcons } from '../../dictionary/folder'
import ar from '../../dictionary/artist_roles'
import { avatarProps } from '../baseProps'
import BaseSearchField, { searchResultTypes } from '../BaseSearchField'
import { searchFiles } from '../../api/drive/getFiles'
import { googleMimeTypes } from '../../api/google/store'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    '&:last-child': {
      marginBottom: 0,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  artist: {
    display: "flex",
    alignItems: "center",
  },
  left: {
    paddingRight: 16,
    minWidth: "50%",
    maxWidth: "50%",
  },
  avatar: {
    marginRight: 12,
  },
  delete: {
    marginLeft: 8,
    marginRight: -8,
  },
}))


export default function Item({ artist, collectionState, index, handleAdd }) {
  const classes = useStyles()

  const [collection, setCollection] = collectionState

  const { folder } = artist

  const handleChangeRole = event => {
    const { value } = event.target

    setCollection(prev => {
      prev[index].role = value
      prev[index].is_touched = true
      return [...prev]
    })
  }

  const handleDelete = event => {
    setCollection(prev => {
      prev[index].is_deleted = true
      return [...prev]
    })

    const totalActiveItems = collection.reduce((total, x) => (!x.is_deleted ? total + 1 : total), 0)

    if (!totalActiveItems) {
      return handleAdd()
    }
  }

  const selectResult = (smart_folder) => {
    setCollection(prev => {
      prev[index].folder = smart_folder
      prev[index].name = smart_folder.name
      prev[index].is_folder_updated = true
      prev[index].is_touched = true

      return [...prev]
    })
  }

  const Icon = folder ? folderIcons[folder.type] : null

  const changeName = (value) => {
    setCollection(prev => {
      prev[index].name = value
      prev[index].is_touched = true
      return [...prev]
    })
  }

  const fetchResults = async (string) => {
    if (string.length < 3) return []

    const files = await searchFiles({
      q: string,
      filters: [`mimeType = '${googleMimeTypes.FOLDER}'`],
    }, {
      includeThumbnails: true
    })
      .then(res => {
        if (res.error) return []
        return res.files
      })

    const results = files
      .filter(x => x.smart_folder && x.smart_folder.type === folderTypes.ARTIST)
      .map(file => ({
        type: searchResultTypes.FOLDER,
        data: file.smart_folder,
        selectData: selectResult,
      }))

    return results
  }

  return (
    <div
      className={classes.root}
      variant="outlined"
    >
      <div className={classes.left}>
        {folder ? (
          <div className={classes.artist}>
            <Avatar
              {...avatarProps}
              variant="square"
              src={folder?.picture}
              className={classes.avatar}
            >
              {Icon ? <Icon /> : "?"}
            </Avatar>
            <Typography noWrap>{folder.name}</Typography>
          </div>
        ) : (
          <BaseSearchField
            label="Artist Name"
            autoFocus={index === collection.length - 1 && !artist.name}
            fullWidth
            initialValue={artist.name}
            fetchResults={fetchResults}
            onChangeValue={changeName}
          />
        )}
      </div>

      <TextField
        value={artist.role}
        label="Role"
        onChange={handleChangeRole}
        autoComplete="off"
        select
        variant="outlined"
        size="small"
        fullWidth
      >
        <MenuItem value={ar.MAIN}>
          Main
        </MenuItem>
        <MenuItem value={ar.FEAT}>
          Featured
        </MenuItem>
        <MenuItem value={ar.REMIX}>
          Remixer
        </MenuItem>
      </TextField>

      <IconButton
        color="primary"
        className={classes.delete}
        onClick={handleDelete}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
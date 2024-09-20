import { useState } from 'react';
import AlbumIcon from '@material-ui/icons/Album'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import DialogAddSong from '../../../../drive/DialogAddSong'
import {
  getInitialMenuState,
  getOpenMenuHandler
} from '../../../../BaseMenu'
import {
  Typography, Box, Button, IconButton,
} from '@material-ui/core'
import { sortableElement } from 'react-sortable-hoc'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import getFolder from '../../../../../api/drive/getFolder'
import { folderTypes } from '../../../../../dictionary/folder'
import MenuFileSelection from '../../../../MenuFileSelection'

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    paddingLeft: spacing(2),
    display: "flex",
    alignItems: "center",
    height: spacing(6),
    borderBottom: `1px solid ${palette.divider}`,
    '&:last-child': {
      borderBottom: "none",
    }
  },
  addTrackBtn: {
    marginRight: ({ show_delete }) => show_delete ? null : spacing(1),
  },
}))

export default sortableElement(({ disk_index, collectionState, onDelete, folder }) => {
  const [collection, setCollection] = collectionState

  const show_delete = Boolean(disk_index)

  const classes = useStyles({ show_delete })

  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())

  const [showAddSong, setShowAddSong] = useState(false)

  const handleCloseAddSong = () => setShowAddSong(false)

  const addFilesFromNavigation = (files) => {
    const smart_folders = files.reduce((acc, curr) => (
      curr.smart_folder ? acc.concat([curr.smart_folder]) : acc
    ), [])

    addSongsToDisk(smart_folders)
  }

  const addSongsToDisk = (folders) => {
    var insertion_index = getInsertionIndex(disk_index, collection)

    setCollection(prev => {
      const tracklist = [...prev]

      const new_songs = folders
        .map(folder => ({
          type: "track",
          data: { folder: folder },
          is_new: true
        }))

      tracklist.splice(insertion_index, 0, ...new_songs)

      return tracklist
    })
  }

  const addSongById = (folder_id) => {
    getFolder({ folder_id })
      .then(data => {
        if (data.error) return
        addSongsToDisk([data.folder])
      })
  }

  return (
    <Box className={classes.root}>
      <AlbumIcon fontSize="small" />
      <Typography style={{ marginLeft: 12 }}>
        {disk_index + 1}
      </Typography>

      <Box flexGrow={1} />

      <Button
        startIcon={<MusicNoteIcon />}
        color="primary"
        className={classes.addTrackBtn}
        onClick={getOpenMenuHandler(setSelectionMenu)}
      >
        Add Track
      </Button>

      {show_delete && (
        <IconButton color="primary" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      )}

      <MenuFileSelection
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={addFilesFromNavigation}
        blacklistedSmartFolderIds={collection
          .filter(x => x.type === 'track')
          .map(x => x.data.folder.id)}
        smartFolderType={folderTypes.SONG}
        multiple
      />

      {showAddSong && (
        <DialogAddSong
          handleClose={handleCloseAddSong}
          callback={addSongById}
          parent_id={folder.google_folder_id}
        />
      )}
    </Box>
  )
})


const getInsertionIndex = (disk_index, collection) => {
  let track_index = 0

  let found_disk = false

  for (const elem of collection) {

    // found last track of the right disk
    if (found_disk && elem.type === "disk") return track_index

    // found the right disk
    if (elem.disk_index === disk_index) {
      found_disk = true
    }

    track_index++
  }

  // right disk was the last disk, and the song will be added after the last song of the disk
  return track_index + 1
}
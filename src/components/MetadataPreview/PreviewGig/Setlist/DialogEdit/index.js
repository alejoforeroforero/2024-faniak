import { useState } from 'react';
import List from './List'
import DeletedSongs from './DeletedSongs'
import {
  DialogContent,
  Button,
  Box,
} from '@material-ui/core'
import {
  getInitialMenuState,
  getOpenMenuHandler
} from '../../../../BaseMenu'
import ContainedButton from '../../../../ContainedButton'
import BaseDialogActions from '../../../../BaseDialogActions'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import getFolder from '../../../../../api/drive/getFolder'
import DialogAddSong from '../../../../drive/DialogAddSong'
import BaseDialogTitle from '../../../../BaseDialogTitle'
import { updateFolder } from '../../../../../api/folder/update'
import { updateRelation } from '../../../../../api/relation/update'
import { createGigSong } from '../../../../../api/relation/create'
import { deleteRelation } from '../../../../../api/relation/delete'
import { folderTypes } from '../../../../../dictionary/folder'
import BaseDialog from '../../../../BaseDialog'
import MenuFileSelection from '../../../../MenuFileSelection'

/*
[
  {type: "encore"},
  {type: "song", data: {
    id,
    title,
    ...
  }},
]
*/

export default function DialogEdit({ handleClose, initial, refreshEvent, event }) {
  const folder = event.smart_folder

  const [collection, setCollection] = useState(getInitialCollection(initial, folder))
  const [deleted, setDeleted] = useState([])
  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())

  const [showAddSong, setShowAddSong] = useState(false)
  const handleCloseAddSong = () => setShowAddSong(false)

  const addSongById = (folder_id) => {
    getFolder({ folder_id: folder_id })
      .then(data => {
        if (data.error) return
        addFoldersToCollection([data.folder])
      })
  }

  const undeleteSongByIndex = (index) => {
    var insertion_index = getIndexOfEncore(collection)

    setCollection(prev => {
      const setlist = [...prev]
      setlist.splice(insertion_index, 0, deleted[index])
      return setlist
    })

    setDeleted(prev => prev.filter((elem, i) => index !== i))
  }

  const addFilesFromNavigation = (files) => {
    const smart_folders = files.reduce((acc, curr) => (
      curr.smart_folder ? acc.concat([curr.smart_folder]) : acc
    ), [])

    addFoldersToCollection(smart_folders)
  }

  const addFoldersToCollection = (folders) => {
    var insertion_index = getIndexOfEncore(collection)

    setCollection(prev => {
      const setlist = [...prev]

      const new_songs = folders
        .map(folder => ({
          type: "song",
          data: { folder: folder },
          is_new: true
        }))

      setlist.splice(insertion_index, 0, ...new_songs)

      return setlist
    })
  }


  const submit = () => {
    const promises = []

    let encore_index = 0
    let n_songs = 0
    let curr_track_index = 0

    for (let item of collection) {
      if (item.type === "encore") {
        encore_index = curr_track_index
        continue
      }

      const song = item.data

      const song_index = curr_track_index

      curr_track_index++
      n_songs++

      if (item.is_new) {
        promises.push(
          createGigSong({
            data: {
              index: song_index
            },
            parent_folder: {
              event_params: {
                eventId: event.id,
                calendarId: "primary",
              }
            },
            child_folder: {
              folder_id: song.folder.id
            },
          })
        )
        continue
      }

      if (song_index === song.relation.data.index) continue

      promises.push(
        updateRelation({
          data: { index: song_index },
          event_params: {
            eventId: event.id,
            calendarId: "primary",
          },
          relation_id: song.relation.id,
        })
      )
    }

    for (let item of deleted) {
      if (item.data.relation) {
        promises.push(
          deleteRelation({
            relation_id: item.data.relation.id,
            event_params: {
              eventId: event.id,
              calendarId: "primary",
            }
          })
        )
      }
    }

    promises.push(
      updateFolder({
        event_params: {
          eventId: event.id,
          calendarId: "primary",
        },
        data: {
          encore_index: encore_index,
          n_songs: n_songs,
        },
      })
    )

    Promise
      .all(promises)
      .then(refreshEvent)

    handleClose()
  }

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Edit setlist
      </BaseDialogTitle>
      <DialogContent>
        <List
          collectionState={[collection, setCollection]}
          setDeleted={setDeleted}
          folder={folder}
        />

        <Box display="flex" pt={1}>
          <Box flexGrow={1} />

          <Button
            startIcon={<MusicNoteIcon />}
            color="primary"
            onClick={getOpenMenuHandler(setSelectionMenu)}
          >
            Add Song
          </Button>
        </Box>

        {!!deleted.length && (
          <DeletedSongs
            list={deleted}
            undeleteSongByIndex={undeleteSongByIndex}
          />
        )}

        <MenuFileSelection
          initialParentId={Boolean(event.artist) && event.artist.google_folder_id}
          menuState={selectionMenu}
          setMenuState={setSelectionMenu}
          callback={addFilesFromNavigation}
          blacklistedSmartFolderIds={collection
            .filter(x => x.type === 'song')
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
      </DialogContent>
      <BaseDialogActions>
        <ContainedButton onClick={submit}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}

const getInitialCollection = (initial, folder) => {
  const new_collection = initial.map(item => ({ type: "song", data: item }))
  new_collection.splice(folder.data.encore_index, 0, { type: "encore" })

  return new_collection
}

const getIndexOfEncore = (collection) => {
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].type === "encore") {
      return i
    }
  }
  return collection.length
}
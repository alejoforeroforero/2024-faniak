import { useEffect, useState } from 'react';
import List from './List'
import DeletedTracks from './DeletedTracks'
import {
  DialogContent,
  Button,
  Box,
} from '@material-ui/core'
import ContainedButton from '../../../../ContainedButton'
import BaseDialogActions from '../../../../BaseDialogActions'
import AlbumIcon from '@material-ui/icons/Album'
import BaseDialogTitle from '../../../../BaseDialogTitle'
import { updateFolder } from '../../../../../api/folder/update'
import { createAlbumSong } from '../../../../../api/relation/create'
import { updateRelation } from '../../../../../api/relation/update'
import { deleteRelation } from '../../../../../api/relation/delete'
import BaseDialog from '../../../../BaseDialog'

/*
[
  {type: "disk", disk_index: 0},
  {type: "track", data: {
    id,
    title,
    ...
  }},
]
*/

export default function DialogEditTracklist({ handleClose, initial, fetchContent, folder }) {

  const [collection, setCollection] = useState(getInitialCollection(initial))
  const [deleted, setDeleted] = useState([])

  const handleUndeleteTrack = (index) => () => {
    setCollection(prev => [...prev, {
      type: "track",
      data: deleted[index]
    }])

    setDeleted(prev => {
      return prev.filter((elem, i) => index !== i)
    })
  }

  const handleAddDisk = () => {
    setCollection(prev => [...prev, {
      type: "disk",
      disk_index: countDisksInCollection(prev)
    }])
  }

  const submit = () => {

    const promises = []

    let curr_disk_index = 0
    let curr_track_index = 0
    let n_songs = 0

    for (let item of collection) {
      if (item.type === "disk") {
        curr_disk_index = item.disk_index
        curr_track_index = 0
        continue
      }

      const song = item.data

      const new_track_stats = {
        disk_n: curr_disk_index + 1,
        track_n: curr_track_index + 1
      }

      curr_track_index++
      n_songs++

      if (item.is_new) {
        promises.push(
          createAlbumSong({
            data: new_track_stats,
            parent_folder: { folder_id: folder.id },
            child_folder: { folder_id: song.folder.id },
          })
        )
        continue
      }

      if (trackStatsMatch(new_track_stats, song.relation.data)) continue

      promises.push(
        updateRelation({
          data: new_track_stats,
          relation_id: song.relation.id,
          folder_id: song.folder.id,
        })
      )
    }

    for (let item of deleted) {
      promises.push(
        deleteRelation({
          relation_id: item.relation.id,
          folder_id: item.folder.id,
        })
      )
    }

    promises.push(
      updateFolder({
        folder_id: folder.id,
        data: {
          n_songs: n_songs
        }
      })
    )

    Promise
      .all(promises)
      .then(fetchContent)

    handleClose()
  }

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Edit tracklist
      </BaseDialogTitle>
      <DialogContent>
        <List
          collectionState={[collection, setCollection]}
          deletedState={[deleted, setDeleted]}
          folder={folder}
        />
        <Box display="flex" pt={1}>
          <Box flexGrow={1} />
          <Button startIcon={<AlbumIcon />} color="primary" onClick={handleAddDisk}>
            Add Disk
          </Button>
          <Box pr={1} />
        </Box>
        {
          deleted.length ? (
            <DeletedTracks
              list={deleted}
              onClick={handleUndeleteTrack}
            />
          ) : null
        }
      </DialogContent>
      <BaseDialogActions>
        <ContainedButton onClick={submit}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}

const getInitialCollection = (initial) => {
  return initial.reduce(reduceDisksIntoCollection, [])
}

const reduceDisksIntoCollection = (acc_songs, curr_disk, disk_index) => (
  acc_songs.concat([
    { type: "disk", disk_index },
    ...curr_disk.map(song => (
      { type: "track", data: song }
    ))
  ])
)

const countDisksInCollection = (collection) => (
  collection.reduce((acc, elem) => (elem.type === "disk" ? acc + 1 : acc), 0)
)

const trackStatsMatch = (new_stats, old_stats) => {
  return new_stats.disk_n === old_stats.disk_n && new_stats.track_n === old_stats.track_n
}
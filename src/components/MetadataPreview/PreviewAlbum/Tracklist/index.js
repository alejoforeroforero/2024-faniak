import { useState, useEffect } from 'react';
import DialogEdit from './DialogEdit'
import Disk from './Disk'
import {
  Card,
} from '@material-ui/core'
import ButtonAdd from './ButtonAdd'
import PreviewSection from '../../PreviewSection'

export default function Tracklist({ fetchContent, albumSongs, folder, canEdit }) {
  const [showDialog, setShowDialog] = useState(false)
  const [disks, setDisks] = useState([])

  useEffect(() => {
    const disks = processDisks(albumSongs)
    setDisks(disks)
  }, [albumSongs])

  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  const show_tracklist = !!disks.filter(d => d.length).length

  return (
    <PreviewSection
      text="Tracklist"
      handleEdit={show_tracklist && canEdit ? handleOpenDialog : null}
    >
      {show_tracklist ? (
        <Card variant="outlined" style={{ paddingTop: 4, paddingBottom: 4 }}>
          {disks.map(
            (disk, index) => (
              <Disk
                canEdit={canEdit}
                key={index}
                disk={disk}
                folder_id={folder.id}
                fetchContent={fetchContent}
                disk_index={index}
              />
            )
          )}
        </Card>
      ) : (
        <ButtonAdd
          canEdit={canEdit}
          onClick={handleOpenDialog}
          fetchContent={fetchContent}
          folder_id={folder.id}
        />
      )}


      {showDialog && (
        <DialogEdit
          initial={disks}
          folder={folder}
          handleClose={handleCloseDialog}
          fetchContent={fetchContent}
        />
      )}
    </PreviewSection>
  )
}


const processDisks = (songs) => {
  const disks = [[]]

  const num_disks = songs.length
    ? songs
      .map(song => getDiskN(song))
      .reduce((s1, s2) => Math.max(s1, s2))
    : 1

  for (let i = 1; i < num_disks; i++) {
    disks.push([])
  }

  songs.forEach(song => {
    disks[getDiskN(song) - 1].push(song)
  })

  return disks
}

const getDiskN = song => song?.relation?.data?.disk_n
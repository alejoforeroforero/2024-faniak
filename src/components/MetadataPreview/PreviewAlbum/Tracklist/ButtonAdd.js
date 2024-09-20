import {
  Button, Card,
} from '@material-ui/core'
import { useDrop } from 'react-dnd'
import { dndTypes } from '../../../../dictionary/dnd'
import { createAlbumSong } from '../../../../api/relation/create'
import { folderTypes } from '../../../../dictionary/folder'
import DropBorder from '../../../DropBorder'
import { useSnackbar } from 'notistack'

export default function ButtonAdd({ fetchContent, folder_id, onClick, canEdit }) {
  const { enqueueSnackbar } = useSnackbar()

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: dndTypes.FILE,
      canDrop: (item) => {
        if (!canEdit) return false
        if (item.folderType !== folderTypes.SONG) return false
        return true
      },
      drop: (item) => {
        createAlbumSong({
          data: {
            disk_n: 1,
            track_n: 1
          },
          parent_folder: { folder_id: folder_id },
          child_folder: { folder_id: item.folderId },
        }).then(res => {
          if (res.error) return
          enqueueSnackbar(`Added ${item.name} to the tracklist.`, { variant: "success" })
          fetchContent()
        })
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      })
    }),
    []
  )

  return (
    <Card variant="outlined">
      <div ref={drop} style={{ position: "relative" }}>
        <DropBorder disabled={!(isOver && canDrop)} />
        <Button
          color="primary"
          fullWidth
          onClick={onClick}
        >
          Add Tracks
        </Button>
      </div>
    </Card>
  )
}
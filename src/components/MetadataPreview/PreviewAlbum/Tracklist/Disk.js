import AlbumIcon from '@material-ui/icons/Album'
import Track from './Track'
import {
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDrop } from 'react-dnd'
import { dndTypes } from '../../../../dictionary/dnd'
import DropBorder from '../../../DropBorder'
import { folderTypes } from '../../../../dictionary/folder'
import { createAlbumSong } from '../../../../api/relation/create'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(({ spacing }) => ({
  title: {
    marginLeft: spacing(1),
  },
  root: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px 8px",
  },
  blankCell: {
    padding: 4,
  },
}))

export default function Disk({ disk, disk_index, folder_id, fetchContent, canEdit }) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: dndTypes.FILE,
      canDrop: (item) => {
        if (!canEdit) return false
        if (item.folderType !== folderTypes.SONG) return false
        if (disk.find(track => track.folder.id === item.folderId)) return false
        return true
      },
      drop: (item) => {
        createAlbumSong({
          data: {
            disk_n: disk_index + 1,
            track_n: disk.length + 1
          },
          parent_folder: { folder_id: folder_id },
          child_folder: { folder_id: item.folderId },
        }).then(res => {
          if (res.error) return
          enqueueSnackbar(`Added "${item.name}" to the tracklist.`, { variant: "success" })
          fetchContent()
        })
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      })
    }),
    [disk]
  )

  return (
    <div ref={drop}>
      <DropBorder disabled={!(isOver && canDrop)} />
      <div className={classes.root}>
        <AlbumIcon fontSize="small" />
        <Typography className={classes.title}>
          {disk_index + 1}
        </Typography>
      </div>
      {disk.map(
        (track, index) => (
          <Track
            key={index}
            track_index={index}
            track={track}
          />
        )
      )}
    </div>
  )
}
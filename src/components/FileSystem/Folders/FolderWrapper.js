import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { folderColors } from '../../../dictionary/folder'
import { canEditFile, getTargetFile } from '../../../api/google/store'
import { useDrag, useDrop } from 'react-dnd'
import { dndBuildFileItem, dndTypes } from '../../../dictionary/dnd'
import DropBorder from '../../DropBorder'
import Folder from '../../Folder'

const useStyles = makeStyles(({ spacing }) => ({
  wrapper: {
    position: "relative",
    zIndex: 1,
  },
  content: {
    position: "relative",
    padding: spacing(1),
    '&::before': {
      content: ({ selected }) => selected ? "''" : "",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.06,
      backgroundColor: ({ color }) => color,
    },
    '& p': {
      position: "relative",
    }
  },
  name: {
    fontWeight: "600",
  },
}))

export default function FolderWrapper({
  index,
  file,
  selected,
  handleSelect,
  handleContextMenu,
  goToFolder,
  moveFileToFolder
}) {
  const [{ dragging }, drag] = useDrag(() => ({
    type: dndTypes.FILE,
    item: dndBuildFileItem(file),
    collect: (monitor) => ({
      dragging: !!monitor.isDragging()
    })
  }))

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: dndTypes.FILE,
      canDrop: (item) => {
        if (!canEditFile(file)) return false
        if (item.id === file.id) return false
        return true
      },
      drop: (item) => {
        moveFileToFolder(item, file)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      })
    }),
    [file.id]
  )

  const { smart_folder } = file

  const type = smart_folder?.type || ""

  const handleRedirect = (event) => {
    event.stopPropagation()
    if (event.ctrlKey || event.shiftKey) return handleSelect(event, index)
    goToFolder(file)
  }

  const handleRightClick = (event) => {
    event.preventDefault()
    if (!selected) handleSelect(event, index)
    handleContextMenu(event)
  }

  const handleClick = (event) => {
    event.stopPropagation()
    handleSelect(event, index)
  }

  const classes = useStyles({
    selected: selected,
    color: folderColors[type],
  })

  return (
    <div
      ref={node => drag(drop(node))}
      className={classes.wrapper}
      style={{ opacity: dragging ? 0.5 : 1 }}
    >
      <DropBorder disabled={!(isOver && canDrop)} />
      <Folder
        folder={smart_folder}
        selected={selected}
        button={selected}
        onClick={selected ? handleRedirect : handleClick}
        onContextMenuCapture={handleRightClick}
      >
        <div className={classes.content}>
          <Typography
            className={classes.name}
            variant="body2"
            noWrap
          >
            {getTargetFile(file).name}
          </Typography>
        </div>
      </Folder>
    </div>
  )
}
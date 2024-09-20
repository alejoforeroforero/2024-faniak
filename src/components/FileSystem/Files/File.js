import { makeStyles } from '@material-ui/core/styles'
import { Card, Box, Typography, CardActionArea } from '@material-ui/core'
import { simplifyDatetime } from '../../../utils/dateUtils'
import { useDrag } from 'react-dnd'
import { dndBuildFileItem, dndTypes } from '../../../dictionary/dnd'
import FileThumbnail from '../../FileThumbnail'
import { splitFileName } from '../../../utils/fileUtils'
import { getTargetFile } from '../../../api/google/store'

const avatarSize = 45

const useStyles = makeStyles(theme => ({
  root: {
    borderColor: ({ selected }) => selected ? theme.palette.primary.main : null,
    position: "relative",
    '&::before': {
      content: ({ selected }) => selected ? "''" : "",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.05,
      backgroundColor: theme.palette.primary.main,
    },
  },
  button: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  stats: {
    maxWidth: `calc(100% - ${avatarSize}px)`,
  },
  subtitle: {
    fontSize: 11,
  },
  fileName: {
    fontWeight: 600,
    fontSize: 14,
    display: "inline-block",
    maxWidth: "100%",
    paddingRight: theme.spacing(4),
    overflow: "hidden",
    textOverflow: "ellipsis",
    position: "relative",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  extension: {
    position: "absolute",
    top: 0,
    right: 0,
    width: theme.spacing(4),
    textAlign: "left",
  },
}))

export default function File({
  index,
  file,
  selected,
  handleSelect,
  handleContextMenu
}) {
  const targetFile = getTargetFile(file)

  const [{ dragging }, drag] = useDrag(() => ({
    type: dndTypes.FILE,
    item: dndBuildFileItem(file),
    collect: (monitor) => ({
      dragging: !!monitor.isDragging()
    })
  }))

  const handleRightClick = (event) => {
    event.preventDefault()
    if (!selected) handleSelect(event, index)
    handleContextMenu(event)
  }

  const handleRedirect = (event) => {
    event.stopPropagation()
    if (event.ctrlKey || event.shiftKey) return handleSelect(event, index)
    window.open(targetFile.webViewLink, '_blank').focus()
  }

  const handleClick = (event) => {
    event.stopPropagation()
    handleSelect(event, index)
  }

  const classes = useStyles({
    selected: selected,
  })

  const [name, extension] = splitFileName(targetFile.name)

  return (
    <Card
      ref={drag}
      variant="outlined"
      className={classes.root}
      onContextMenuCapture={handleRightClick}
      onClick={handleClick}
      style={{ opacity: dragging ? 0.5 : 1 }}
    >
      <CardActionArea
        className={classes.button}
        disabled={!selected}
        onClick={handleRedirect}
      >
        <FileThumbnail file={targetFile} />

        <Box pl={1} pr={1} className={classes.stats}>

          <div style={{ lineHeight: 0 }}>
            <Typography className={classes.fileName}>
              {name}<span className={classes.extension}>{
                extension ? `.${extension}` : ""
              }</span>
            </Typography>
          </div>

          <Typography component="div" noWrap className={classes.subtitle}>
            {/* v{file.version} &#8226;  */}{simplifyDatetime(file.modifiedTime)}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  )
}
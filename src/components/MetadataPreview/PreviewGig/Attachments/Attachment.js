import { makeStyles } from '@material-ui/core/styles'
import { Typography, IconButton } from '@material-ui/core'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import CloseIcon from '@material-ui/icons/Close'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    minHeight: 36,
    paddingLeft: 16,
    paddingRight: 8,
    '& .MuiIconButton-root': {
      display: "none",
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
  stats: {
    paddingLeft: 12,
    paddingRight: 8,
    flexGrow: 1,
    overflow: "hidden",
  },
  fileName: {
    fontSize: 13,
  },
}))

export default function Attachment({ file, openFile, removeFile, isOrganizer, isFolder }) {
  const classes = useStyles()

  const handleOpen = () => {
    openFile(file)
  }

  const handleRemove = () => {
    removeFile(file)
  }

  return (
    <div className={classes.root}>
      <img src={file.iconLink} alt="" />
      <div className={classes.stats}>
        <Typography noWrap className={classes.fileName}>
          {file.title}
        </Typography>
      </div>
      <IconButton color="primary" size="small" onClick={handleOpen} disabled={!file.fileUrl}>
        {isFolder ? (
          <FolderOpenIcon />
        ) : (
          <OpenInNewIcon />
        )}

      </IconButton>
      <IconButton color="primary" size="small" onClick={handleRemove} disabled={!isOrganizer}>
        <CloseIcon />
      </IconButton>
    </div>
  )
}
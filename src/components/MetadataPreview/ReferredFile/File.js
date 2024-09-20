import { makeStyles } from '@material-ui/core/styles'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import FileThumbnail from '../../FileThumbnail'
import { splitFileName } from '../../../utils/fileUtils'
import ClearIcon from '@material-ui/icons/Clear'
import DriveIcon from '../../../svg/DriveIcon'
import { getTargetFile } from '../../../api/google/store'
import { simplifyDatetime } from '../../../utils/dateUtils'

const avatarSize = 45

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    '& .stats': {
      maxWidth: `calc(100% - ${avatarSize}px)`,
      paddingLeft: 8,
      paddingRight: 8,
      flexGrow: 1,
      overflow: "hidden",
      '& .name': {
        lineHeight: 0,
      }
    },
    '& .MuiIconButton-root': {
      display: "none",
      marginRight: 8,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
  subtitle: {
    fontSize: 11,
  },
  fileName: {
    fontSize: 14,
    display: "inline-block",
    maxWidth: "100%",
    paddingRight: theme.spacing(4),
    overflow: "hidden",
    textOverflow: "ellipsis",
    position: "relative",
    whiteSpace: "nowrap",
    textAlign: "center",
    fontWeight: 600,
  },
  extension: {
    position: "absolute",
    top: 0,
    right: 0,
    width: theme.spacing(4),
    textAlign: "left",
  },
}))

export default function File({ file, removeFile, canEdit }) {
  const classes = useStyles()

  const [name, extension] = splitFileName(file.name)

  return (
    <div className={classes.root}>
      <FileThumbnail file={file} />

      <div className="stats">
        <div className="name">
          <Typography className={classes.fileName}>
            {name}<span className={classes.extension}>.{extension}</span>
          </Typography>
        </div>
        <Typography component="div" noWrap className={classes.subtitle}>
          {simplifyDatetime(file.modifiedTime)}
        </Typography>
      </div>

      <Tooltip title="Open in Google Drive">
        <IconButton
          component="a"
          href={getTargetFile(file).webViewLink}
          target="_blank"
          color="primary"
          size="small"
        >
          <DriveIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Clear">
        <IconButton component="div" color="primary" disabled={!canEdit} onClick={removeFile} size="small">
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}
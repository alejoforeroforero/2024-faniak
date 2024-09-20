import { makeStyles } from '@material-ui/core/styles'
import { getMimeType, googleMimeTypes } from '../api/google/store'

const useStyles = makeStyles(theme => ({
  fileIcon: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
  root: {
    height: ({ size }) => size,
    width: ({ size }) => size,
    position: "relative",
    flexShrink: 0,
    borderRight: ({ disabledBorder }) => disabledBorder ? null : "1px solid rgba(140,140,140,0.35)"
  },
  imagePreview: {
    maxHeight: "100%",
    maxWidth: "100%",
    display: "block",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateY(-50%) translateX(-50%)",
  },
}))

const forbiddenThumbnails = [
  googleMimeTypes.SHEETS,
  googleMimeTypes.DOCS,
  googleMimeTypes.SLIDES,
]

export default function FileThumbnail({ file, size = 45, disabledBorder }) {
  const classes = useStyles({ size, disabledBorder })

  return (
    <div className={classes.root}>
      {
        file.hasThumbnail && !forbiddenThumbnails.includes(getMimeType(file)) ?
          <img
            src={file.thumbnailLink}
            alt=""
            referrerPolicy="no-referrer"
            className={classes.imagePreview}
          />
          :
          <div className={classes.fileIcon}>
            <img src={file.iconLink} alt="" />
          </div>
      }
    </div>
  )
}
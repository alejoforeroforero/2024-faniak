import File from './File'
import { makeStyles } from '@material-ui/core/styles'
import { getMimeType, googleMimeTypes } from '../../../api/google/store'
import { FOLDER_WIDTH } from '..'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: spacing(-1, -1),
  },
  file: {
    width: (FOLDER_WIDTH * 2) + spacing(2),
    margin: spacing(1),
  },
}))

export default function Files({
  files,
  selectedIndexes,
  handleSelect,
  handleOpenOptionsMenu,
}) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {files.map((file, index) => (
        getMimeType(file) !== googleMimeTypes.FOLDER
          ? (
            <div key={file.id} className={classes.file}>
              <File
                file={file}
                selected={selectedIndexes.includes(index)}
                index={index}
                handleSelect={handleSelect}
                handleContextMenu={handleOpenOptionsMenu}
              />
            </div>
          )
          : null
      ))}
    </div>
  )
}
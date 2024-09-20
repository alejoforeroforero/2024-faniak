import { makeStyles } from '@material-ui/core/styles'
import FolderWrapper from './FolderWrapper'
import { useHistory } from 'react-router'
import { getId, getMimeType, googleMimeTypes } from '../../../api/google/store'
import { FOLDER_WIDTH } from '..'
import { routes } from '../../../Routes'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: spacing(-1, -1),
  },
  folder: {
    width: FOLDER_WIDTH,
    margin: spacing(1),
  },
}))

export default function Folders({
  files,
  selectedIndexes,
  handleSelect,
  handleOpenOptionsMenu,
  moveFileToFolder,
}) {

  const history = useHistory()
  const classes = useStyles()

  const goToFolder = (file) => {
    const url = routes.folder(getId(file))
    history.push(url)
  }

  return (
    <div className={classes.root}>
      {files.map((file, index) => (
        getMimeType(file) === googleMimeTypes.FOLDER ? (
          <div key={file.id} className={classes.folder}>
            <FolderWrapper
              file={file}
              index={index}
              goToFolder={goToFolder}
              selected={selectedIndexes.includes(index)}
              handleSelect={handleSelect}
              moveFileToFolder={moveFileToFolder}
              handleContextMenu={handleOpenOptionsMenu}
            />
          </div>
        ) : null
      ))}
    </div>
  )
}
import { useContext } from 'react';
import ContainedButton from '../ContainedButton'
import AddIcon from '@material-ui/icons/Add'
import { getOpenMenuHandler, isMenuOpen } from '../BaseMenu'
import Dropzone from '../Dropzone'
import { makeStyles, Tooltip } from '@material-ui/core'
import { DispatchContext, StateContext } from '../../store'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { routes } from '../../Routes'
import { uploadFileStructure } from '../../utils/fileUtils'
import { getChildrenFiles } from '../../api/drive/getFiles'
import { getMimeType, googleMimeTypes } from '../../api/google/store'

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: 14,
  },
  button: {
    borderRadius: "100%",
    minWidth: 0,
    padding: 8,
    boxShadow: "none",
  },
}))

export default function PermanentFactoryButton({ parentId, buttonClass }) {
  const classes = useStyles()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const menu = state.factory_menu
  const setMenu = (coords) => {
    dispatch({
      type: "SET",
      data: { factory_menu: coords }
    })
  }

  const parent_id = parentId || state.curr_folder_id || state.user.google_root_folder_id

  const onDrop = (files) => {
    uploadFileStructure({
      files: files,
      dispatch: dispatch,
      parent_id: parent_id,
      refreshParent: refreshFiles,
    })
  }

  const refreshFiles = async () => {
    const { pathname } = history.location

    if (pathname.includes(routes.calendar())) {
      history.push(routes.folder(parent_id))
    } else {
      await getChildrenFiles({ id: parent_id }, { includeThumbnails: true })
        .then(res => {
          if (res.error) {
            enqueueSnackbar("We were unable to fetch your files...", { variant: "error" })
            return
          }

          const folders = []
          const files = []

          for (const file of res.files) {
            if (getMimeType(file) === googleMimeTypes.FOLDER) {
              folders.push(file)
            } else {
              files.push(file)
            }
          }

          dispatch({
            type: 'UPDATE_CHILDREN',
            data: {
              parent_id: parent_id,
              files: folders.concat(files)
            }
          })
        })
    }
  }

  return (
    <Dropzone onDrop={onDrop}>
      <ContainedButton
        onClick={getOpenMenuHandler(setMenu)}
        disabled={isMenuOpen(menu)}
        className={`${classes.button} ${buttonClass || ""}`}
      >
        <Tooltip
          title="Add new"
          placement="right"
          classes={{ tooltip: classes.tooltip }}
        >
          <AddIcon />
        </Tooltip>
      </ContainedButton>
    </Dropzone>
  )
}
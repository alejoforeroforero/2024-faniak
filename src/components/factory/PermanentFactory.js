import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../store'
import { useHistory, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { routes } from '../../Routes'
import { Views } from 'react-big-calendar'
import { getChildrenFiles } from '../../api/drive/getFiles'
import { getMimeType, googleMimeTypes } from '../../api/google/store'
import FactoryMenu from './FactoryMenu'

export default function PermanentFactory() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const history = useHistory()
  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const menu = state.factory_menu
  const setMenu = (coords) => {
    dispatch({
      type: "SET",
      data: { factory_menu: coords }
    })
  }

  const parent_id = state.curr_folder_id || state.user.google_root_folder_id

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

  const refreshEvents = async (date) => {
    if (date) {
      history.push(routes.calendarViewTime(params.view ?? Views.MONTH, date.getTime()))
    } else {
      history.push(routes.calendar())
    }

    dispatch({
      type: "UPDATE",
      set: (prev) => ({ ...prev, calendar_anchor: {} })
    })
  }

  return (
    <FactoryMenu
      menuState={menu}
      setMenuState={setMenu}
      parentId={parent_id}
      refreshFiles={refreshFiles}
      refreshEvents={refreshEvents}
    />
  )
}
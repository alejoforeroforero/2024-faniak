import { useEffect, useState, useContext } from 'react';
import { StateContext } from '../../store'
import {
  Box,
  Popover,
} from '@material-ui/core'
import Files from './Files'
import useIsMounted from '../../utils/useIsMounted'
import { getInitialMenuState } from '../BaseMenu'
import Header from './Header'
import Footer from './Footer'
import { folderLabels } from '../../dictionary/folder'
import { getMimeType, googleMimeTypes } from '../../api/google/store'
import { useSnackbar } from 'notistack'
import Skeleton from '@material-ui/lab/Skeleton'
import { getChildrenFiles } from '../../api/drive/getFiles'
import { getFile } from '../../api/drive/getFile'

/*
[menuState, setMenuState] = useState
handleClose: function, (event) => {closes the dialog}
callback: ([selected files]) => {}
smartFolderType: string, used to limit the selectable smart folders based on type
mimeType: string, used to limit the selectable files based on type
blacklistedSmartFolderIds: list of fileIds that should not be accepted
*/

export default function MenuFileSelection(props) {
  // to save up some render times :)
  if (props.menuState.mouseY == null) return null
  return <Element {...props} />
}

function Element({
  initialParentId,
  menuState,
  setMenuState,
  blacklistedSmartFolderIds = [],
  callback,
  smartFolderType,
  mimeType,
  multiple = false,
}) {
  const state = useContext(StateContext)

  const isMounted = useIsMounted()
  const { enqueueSnackbar } = useSnackbar()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [curr, setCurr] = useState({
    folder: null,
    children: []
  })

  const handleClose = (event) => {
    if (event) event.stopPropagation()
    setMenuState(getInitialMenuState())
  }

  const setInitialCurr = (file) => {
    setCurr({ folder: validateFile({ ...file }), children: [] })
  }

  const fetchInitialCurr = async (fileId) => {
    return await getFile({ id: fileId }, { includeSmartFolders: true })
      .then(res => {
        if (res.error) return
        return res.file
      })
  }

  const setInitialState = async () => {
    let file = null

    if (initialParentId) {
      file = await fetchInitialCurr(initialParentId)
    } else if (state.curr_folder) {
      file = state.curr_folder
    }
    if (!file) {
      file = await fetchInitialCurr(state.user.google_root_folder_id)
    }

    if (file) {
      setInitialCurr(file)
    } else {
      enqueueSnackbar("Loading failed. Please contact support if error persists.", { variant: "error" })
      handleClose()
    }
  }

  useEffect(() => {
    setInitialState()
  }, [])

  useEffect(() => {
    if (!curr.folder) return
    setLoading(true)
    setSelected([])
    fetchChildren()
  }, [curr.folder])

  function getInvalidFileReason(file) {
    if (smartFolderType === "*" && !file.smart_folder) {
      return "This is not a Smart Folder"
    }
    if (smartFolderType && smartFolderType !== "*" && file.smart_folder?.type !== smartFolderType) {
      return `Looking for ${folderLabels[smartFolderType]} Smart Folders only`
    }
    if (mimeType && !getMimeType(file).includes(mimeType)) {
      return "Invalid file type"
    }
    if (blacklistedSmartFolderIds.includes(file.smart_folder?.id ?? 0)) {
      return "Unavailable"
    }
    return ""
  }

  function validateFile(file) {
    file.disabled_reason = getInvalidFileReason(file)
    return file
  }

  const fetchFolderById = (id) => {
    getFile({ id: id })
      .then(res => {
        if (!isMounted()) return
        if (res.error) return

        changeSelectionFolder(validateFile(res.file))
      })
  }

  const fetchChildren = () => {
    if (!curr.folder) return

    getChildrenFiles({
      id: curr.folder.id,
    })
      .then(res => {
        if (!isMounted()) return
        if (res.error) return

        const folders = []
        const files = []

        for (const file of res.files) {
          const _file = validateFile(file)
          if (getMimeType(file) === googleMimeTypes.FOLDER) {
            folders.push(_file)
          } else {
            files.push(_file)
          }
        }

        setCurr(prev => {
          if (prev.folder.id !== curr.folder.id) return prev

          return { ...prev, children: folders.concat(files) }
        })
        setLoading(false)
      })
  }

  const changeSelectionFolder = (file) => {
    setCurr(prev => ({ children: [], folder: file }))
  }

  const stopPropagation = (event) => {
    event.stopPropagation()
  }

  return (
    <Popover
      open={menuState.mouseY !== null}
      onClick={stopPropagation}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: menuState.mouseY, left: menuState.mouseX }}
    >
      {Boolean(curr.folder) ? (
        <Header
          currentFolder={curr.folder}
          setCurrentFolder={fetchFolderById}
        />
      ) : <HeaderSkeleton />}

      <Files
        files={curr.children}
        loading={loading}
        updateSelection={setSelected}
        changeSelectionFolder={changeSelectionFolder}
        multiple={multiple}
      />

      {Boolean(curr.folder) ? (
        <Footer
          currentFolder={curr.folder}
          callback={callback}
          selected={selected}
          handleClose={handleClose}
          fetchChildren={fetchChildren}
        />
      ) : <FooterSkeleton />}
    </Popover >
  )
}

const HeaderSkeleton = () => (
  <Box pt={2} pr={1.5} pb={1} pl={1.5} display="flex">
    <Skeleton variant='circle' width={32} height={32} />
    <Box pr={2} />
    <Skeleton variant='text' width={160} />
  </Box>
)

const FooterSkeleton = () => (
  <Box p={2} display="flex" justifyContent="end">
    <Skeleton variant='rect' width={112} height={32} />
  </Box>
)
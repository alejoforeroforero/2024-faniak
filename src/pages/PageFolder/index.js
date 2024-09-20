import { useContext, useEffect, useMemo, useState } from 'react';
import { StateContext, DispatchContext } from '../../store'
import Page from '../../components/Page'
import FileSystem from '../../components/FileSystem'
import MetadataPreview from '../../components/MetadataPreview'
import { useParams } from 'react-router-dom'
import { uploadFileStructure } from '../../utils/fileUtils'
import NavBar from '../../components/NavBar'
import Search from '../../components/NavBar/Search'
import NoAccessNotice from './NoAccessNotice'
import useIsMounted from '../../utils/useIsMounted'
import OptionsMenu from '../../components/FileSystem/OptionsMenu'
import Breadcrumbs from '../../components/Breadcrumbs'
import { getInitialMenuState, getOpenMenuHandler } from '../../components/BaseMenu'
import { useSnackbar } from 'notistack'
import { getChildrenFiles, getFiles } from '../../api/drive/getFiles'
import { getMimeType, getTargetFile, googleMimeTypes } from '../../api/google/store'
import { getFile } from '../../api/drive/getFile'
import { createFile } from '../../api/drive/createFile'
import { logUserEvent, userEventNames } from '../../api/metrics/logUserEvent'
import ButtonFreeTrial from '../PageDrive/ButtonFreeTrial'
import { Box } from '@material-ui/core'

const fileIdIsLocked = (fileId, state) => {
  return state.locked_parent_file_ids.includes(fileId)
}

export default function PageFolder() {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const google_folder_id = useParams().google_folder_id
  const folderIsLocked = fileIdIsLocked(google_folder_id, state)

  const isMounted = useIsMounted()
  const [loading, setLoading] = useState(true)
  const [noAccess, setNoAccess] = useState(false)
  const [optionsMenu, setOptionMenu] = useState(getInitialMenuState())

  useEffect(() => {
    setLoading(true)
    dispatch({
      type: 'SET',
      data: { curr_folder_id: google_folder_id }
    })
    fetchFolder()
    fetchChildren()
    return () => {
      dispatch({ type: 'RESET_CURR' })
    }
  }, [google_folder_id, folderIsLocked])

  const fetchFolder = async () => {
    await getFile({
      id: google_folder_id,
    }, {
      includeThumbnails: true,
    })
      .then(res => {
        if (!isMounted()) return
        if (res.error) {
          switch (res.error) {
            case "NOT_FOUND": setNoAccess(true); break;
            default: break;
          }
          return
        }

        // This means the user is opening a folder that was shared with link
        if (isFileBeingSharedWithLink(res.file)) {
          updateDashboardShortcut({
            targetFile: res.file,
            parentId: state.user.google_root_folder_id,
            successCalback: () => {
              enqueueSnackbar("This file has been added to your Music Drive.", { variant: "success" })
            },
          })
        }

        if (res.file.mimeType === googleMimeTypes.FOLDER) {
          dispatch({
            type: 'SET',
            data: { curr_folder: res.file }
          })
        } else {
          let url = getTargetFile(res.file).webViewLink
          window.location.href = url
        }
      })
  }

  const fetchChildren = async () => {
    await getChildrenFiles({ id: google_folder_id }, { includeThumbnails: true })
      .then(res => {
        if (!isMounted()) return
        setLoading(false)

        if (res.error) {
          enqueueSnackbar("We were unable to fetch your files :(", { variant: "error" })
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
            parent_id: google_folder_id,
            files: folders.concat(files)
          }
        })
      })
  }

  const onDrop = (files) => {
    uploadFileStructure({
      files: files,
      dispatch: dispatch,
      parent_id: google_folder_id,
      refreshParent: fetchChildren,
    })
  }

  const selectedFiles = useMemo(() => {
    if (state.curr_folder) return [state.curr_folder]
    return []
  }, [state.curr_folder])

  return (
    <Page>
      {noAccess && <NoAccessNotice />}

      <NavBar />

      <Box display="flex">
        <Search />
        <Box flexGrow={1} />
        <ButtonFreeTrial />
      </Box>

      <Breadcrumbs handleOpenOptionsMenu={getOpenMenuHandler(setOptionMenu)} />

      <OptionsMenu
        redirectOnDeletion
        menuState={[optionsMenu, setOptionMenu]}
        fetchContent={fetchFolder}
        files={selectedFiles}
      />

      {!noAccess && (
        <FileSystem
          onDrop={onDrop}
          loading={loading || folderIsLocked}
          files={state.curr_children}
          fetchChildren={fetchChildren}
        />
      )}

      <MetadataPreview
        loading={loading}
        fetchFolder={fetchFolder}
        fetchChildren={fetchChildren}
      />
    </Page>
  )
}

// Is the file being opened with a share link?
const isFileBeingSharedWithLink = (file) => {
  if (file.ownedByMe) return false
  const params = new URLSearchParams(window.location.search)
  return params.get('usp') === "sharing"
}

const hasShortcutInDashboard = async (fileId) => {
  return await getFiles({
    q: `trashed=false and shortcutDetails.targetId='${fileId}'`,
  }).then(res => {
    if (res.error) return false
    return !!res.files.length
  })
}

const updateDashboardShortcut = async ({ targetFile, parentId, successCalback }) => {
  if (await hasShortcutInDashboard(targetFile.id)) return

  console.log("No shortcuts found! Adding shortcut to dashboard!")

  addShortcutToDashboard({ targetFile, parentId, successCalback })

  const eventName = targetFile.smart_folder
    ? userEventNames.USER_CLICKED_SHARED_FOLDER_LINK
    : userEventNames.USER_CLICKED_SHARED_FILE_LINK

  logUserEvent(eventName)
}


const addShortcutToDashboard = ({ targetFile, parentId, successCalback }) => {
  createFile({
    resource: {
      name: targetFile.name,
      mimeType: googleMimeTypes.SHORTCUT,
      parents: [parentId],
      shortcutDetails: {
        targetId: targetFile.id,
      }
    }
  }).then(res => {
    if (res.error) return
    successCalback()
  })
}
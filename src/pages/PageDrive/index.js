import { useContext, useEffect, useState } from 'react';
import { StateContext, DispatchContext } from '../../store'
import Page from '../../components/Page'
import FileSystem from '../../components/FileSystem'
import Breadcrumbs from '../../components/Breadcrumbs'
import MetadataPreview from '../../components/MetadataPreview'
import { uploadFileStructure } from '../../utils/fileUtils'
import NavBar from '../../components/NavBar'
import Search from '../../components/NavBar/Search'
import TrashedNotice from './TrashedNotice'
import DeletedNotice from './DeletedNotice'
import useIsMounted from '../../utils/useIsMounted'
import { useSnackbar } from 'notistack'
import { getChildrenFiles } from '../../api/drive/getFiles'
import { getMimeType, googleMimeTypes } from '../../api/google/store'
import { getFile } from '../../api/drive/getFile'
import { Box } from '@material-ui/core'
import ButtonFreeTrial from './ButtonFreeTrial'

export default function PageDrive() {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const google_folder_id = state.user.google_root_folder_id

  const isMounted = useIsMounted()
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)

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
  }, [google_folder_id])

  const fetchFolder = async () => {
    await getFile({
      id: google_folder_id,
    })
      .then(res => {
        if (!isMounted()) return
        if (res.error) {
          switch (res.error) {
            case "NOT_FOUND": setDeleted(true); break;
            default: break;
          }
          return
        }

        dispatch({
          type: 'SET',
          data: { curr_folder: res.file }
        })
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

  return (
    <Page>
      {deleted && <DeletedNotice setDeleted={setDeleted} />}

      {state.curr_folder?.trashed && <TrashedNotice />}

      <NavBar />

      <Box display="flex">
        <Search />
        <Box flexGrow={1} />
        <ButtonFreeTrial />
      </Box>

      <Breadcrumbs />

      <FileSystem
        onDrop={onDrop}
        loading={loading}
        files={state.curr_children}
        fetchChildren={fetchChildren}
      />

      <MetadataPreview
        loading={loading}
        fetchFolder={fetchFolder}
        fetchChildren={fetchChildren}
      />
    </Page>
  )
}
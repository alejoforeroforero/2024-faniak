import { useState, useEffect, useContext, useCallback } from 'react';
import Dropzone from '../../Dropzone'
import {
  getInitialMenuState,
  getOpenMenuHandler
} from '../../BaseMenu'
import File from './File'
import { DispatchContext } from '../../../store'
import { getId, getMimeType, getTargetFile, googleMimeTypes } from '../../../api/google/store'
import { useDrop } from 'react-dnd'
import { dndTypes } from '../../../dictionary/dnd'
import DropBorder from '../../DropBorder'
import MenuFileSelection from '../../MenuFileSelection'
import { getFile } from '../../../api/drive/getFile'
import { uploadFile } from '../../../api/drive/createFile'
import { Button, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useIsMounted from '../../../utils/useIsMounted';
import { updateFolder } from '../../../api/folder/update';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    borderBottom: "1px solid " + theme.palette.divider,
    '&:last-child': {
      borderBottom: "none"
    },
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
  },
}))

export default function ReferredFile({
  canEdit,
  folder,
  mimeType = "",
  fileKey,
  fetchContent,
  processFile,
}) {
  const file = folder.data[fileKey]

  const isMounted = useIsMounted()
  const classes = useStyles()
  const dispatch = useContext(DispatchContext)
  const [loading, setLoading] = useState(false)

  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())
  const openSelectionMenu = useCallback(getOpenMenuHandler(setSelectionMenu), [])

  const [fullFile, setFullFile] = useState(null)

  const [main_type] = mimeType.split("/")

  const updateFile = useCallback(async (file) => {
    // processFile enables you to update other metadata fields based on file props
    // ex: read audio file metadata and apply it to a song folder
    const payload = processFile ? processFile(file) : {}
    payload[fileKey] = file

    await updateFolder({
      folder_id: folder.id,
      data: payload,
    })
      .then(res => {
        if (res.error) return
        fetchContent()
      })
  }, [folder, fetchContent])

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: dndTypes.FILE,
      canDrop: (item) => {
        if (!canEdit) return false
        if (getMimeType(item) === googleMimeTypes.FOLDER) return false
        if (main_type) return getMimeType(item).includes(main_type)
        return true
      },
      drop: (item) => {
        getFile({ id: getId(item) })
          .then(res => {
            if (res.error) return
            updateFile(res.file)
          })

      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      })
    }),
    [main_type]
  )

  const handleSelectFile = async (files) => {
    if (!files.length) return
    const [file] = files

    setLoading(true)
    await updateFile(getTargetFile(file))
    setLoading(false)
  }

  useEffect(() => {
    if (!file) return

    setLoading(true)
    getFile({ id: file.id })
      .then(res => {
        if (res.error) return
        if (!isMounted()) return

        setLoading(false)
        setFullFile(res.file)
      })

    return () => setFullFile(null)
  }, [file])

  const uploadFiles = (files) => {
    if (files.length) {
      setLoading(true)

      const [file] = files

      const payload = {
        parent: folder.google_folder_id,
        file: file
      }

      uploadFile(payload, { dispatch })
        .then(res => {
          if (res.error) {
            setLoading(false)
            return
          }

          getFile({ id: res.file.id })
            .then(res => {
              if (res.error) {
                setLoading(false)
                return
              }
              updateFile(res.file)
            })
        })
    }
  }

  const removeFile = useCallback(async () => {
    setLoading(true)
    await updateFile(null)
    setLoading(false)
  }, [updateFile])

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress size={24} />
        </div>
      ) : (
        <div ref={drop}>
          <DropBorder disabled={!(isOver && canDrop)} />
          <Dropzone
            disabled={!canEdit}
            mimeType={mimeType}
            onDrop={uploadFiles}
            parent={folder}
            enableBubbling
          >
            {fullFile ? (
              <File
                file={fullFile}
                canEdit={canEdit}
                removeFile={removeFile}
              />
            ) : (
              <Button
                onClick={openSelectionMenu}
                color="primary"
                fullWidth
              >
                Add file
              </Button>
            )}
          </Dropzone>
        </div>
      )}

      <MenuFileSelection
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={handleSelectFile}
        mimeType={main_type}
      />
    </div>
  )
}
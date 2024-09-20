import { useCallback, useContext, useMemo, useState } from 'react';
import { StateContext, DispatchContext } from '../../store'
import BaseMenu, { getInitialMenuState, getOpenMenuHandler } from '../BaseMenu'
import { fileOptions } from '../../utils/fileOptions'
import { useHistory } from 'react-router-dom'
import DialogRenameFile from '../DialogRenameFile'
import { googleMimeTypes } from '../../api/google/store'
import { moveFilesToGoogleFolder } from '../../utils/fileUtils'
import MenuFileSelection from '../MenuFileSelection'
import { useSnackbar } from 'notistack'
import DialogEditTeam from '../credits/DialogEditTeam'

export default function OptionsMenu({ menuState, fetchContent, files = [], redirectOnDeletion = false }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const history = useHistory()
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())

  const actions = useMemo(() => {
    if (!files.length) return []

    return [
      fileOptions.open(files),
      { divider: true },
      fileOptions.makeSmart(files, {
        fetchContent,
        dispatch,
      }),
      fileOptions.send(files, {
        state,
      }),
      fileOptions.share(files, {
        setShowDialog: setShowShareDialog,
      }),
      fileOptions.shareWithLink(files, {
        setShowDialog: setShowShareDialog,
      }),
      fileOptions.rename(files, {
        setShowDialog: setShowRenameDialog,
      }),
      fileOptions.move(files, {
        state,
        onClick: getOpenMenuHandler(setSelectionMenu),
      }),
      fileOptions.download(files),
      { divider: true },
      fileOptions.delete(files, {
        fetchContent,
        history,
        dispatch,
        enqueueSnackbar,
        closeSnackbar,
        redirectOnDeletion,
      }),
    ]
  }, [files])

  const move = useCallback(([parent]) => {
    if (!files.length) return []

    return moveFilesToGoogleFolder(files, parent, { enqueueSnackbar, closeSnackbar, callback: fetchContent })
  }, [files])

  if (!files.length) return null

  return (
    <>
      <BaseMenu
        items={actions}
        header={getMenuTitle(files)}
        menuState={menuState[0]}
        setMenuState={menuState[1]}
      />
      {showRenameDialog && (
        <DialogRenameFile
          file={files[0]}
          callback={fetchContent}
          handleClose={() => setShowRenameDialog(false)}
        />
      )}
      <MenuFileSelection
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={move}
        mimeType={googleMimeTypes.FOLDER}
      />
      {showShareDialog && (
        <DialogEditTeam
          file={files[0]}
          handleClose={() => setShowShareDialog(false)}
          fetchContent={fetchContent}
        />
      )}
    </>
  )
}

const getMenuTitle = (files) => {
  if (files.length > 1) return "Multiple files"
  if (files[0].mimeType === googleMimeTypes.SHORTCUT) return `Shortcut for ${files[0].name}`
  return files[0].name
}
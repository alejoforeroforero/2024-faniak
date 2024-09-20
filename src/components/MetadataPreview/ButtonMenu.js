import MenuIcon from '@material-ui/icons/Menu'
import { useCallback, useContext, useMemo, useState } from 'react'
import { StateContext } from '../../store'
import { eventOptions } from '../../utils/eventOptions'
import { fileOptions } from '../../utils/fileOptions'
import BaseMenu, { getAnchorMenuHandler } from '../BaseMenu'
import ContainedButton from '../ContainedButton'
import DialogExport from './DialogExport'

export default function ButtonMenu({ file, event, fetchContent, canEdit, defaultParentId, handleOpenTeam }) {
  const state = useContext(StateContext)

  const [exportDialogfileKey, setExportDialogFileKey] = useState(false)
  const closeExportDialog = useCallback(() => setExportDialogFileKey(""), [])

  const [menuAnchor, setMenuAnchor] = useState(null)
  const handleOpenMenu = useCallback(getAnchorMenuHandler(setMenuAnchor), [])

  const actions = useMemo(() => {
    if (file) {
      const files = [file]

      return [
        fileOptions.open(files),
        { divider: true },
        fileOptions.share(files, {
          setShowDialog: handleOpenTeam,
        }),
        fileOptions.send(files, {
          state,
        }),
        fileOptions.export(files, {
          setFileKey: setExportDialogFileKey,
        }),
      ]
    } else {
      return [
        eventOptions.open(event),
        eventOptions.openLocation(event),
        eventOptions.share(event, {
          setShowDialog: handleOpenTeam,
        }),
        eventOptions.export(event, {
          setFileKey: setExportDialogFileKey,
        }),
      ]
    }
  }, [file, event])

  return (
    <>
      <ContainedButton
        onClick={handleOpenMenu}
        startIcon={<MenuIcon />}
        color="primary"
        size="small"
        fullWidth>
        Menu
      </ContainedButton>
      <BaseMenu
        anchored
        items={actions}
        menuState={menuAnchor}
        setMenuState={setMenuAnchor}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      />
      {!!exportDialogfileKey && (
        <DialogExport
          fileKey={exportDialogfileKey}
          defaultParentId={defaultParentId}
          handleClose={closeExportDialog}
          fetchContent={fetchContent}
          file={file}
          event={event}
          canEdit={canEdit}
        />
      )}
    </>
  )
}

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
}

const transformOrigin = {
  vertical: 'top',
  horizontal: 'right',
}
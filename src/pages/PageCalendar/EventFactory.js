import { useCallback, useContext, useMemo, useState } from 'react';
import { DispatchContext } from '../../store'
import BaseMenu from '../../components/BaseMenu'
import { folderTypes, getColoredFolderIcon } from '../../dictionary/folder';
import MuiEventIcon from '@material-ui/icons/Event'
import DialogAddEvent from '../../components/calendar/DialogAddEvent';
import { simplifyDate } from '../../utils/dateUtils';

const BasicEventIcon = (props) => <MuiEventIcon color="action" {...props} />

export default function EventFactory({ menuState, setMenuState }) {
  const dispatch = useContext(DispatchContext)
  const [dialogParams, setDialogParams] = useState(null)

  const openDialog = useCallback((type) => {
    setDialogParams({
      type: type,
      start: menuState.start,
      end: menuState.end,
    })
  }, [menuState])

  const closeDialog = useCallback(() => setDialogParams(null), [])

  const refreshEvents = useCallback(() => {
    dispatch({
      type: "SET",
      data: { calendar_anchor: {} }
    })
  }, [])

  const actions = useMemo(() => {
    return [
      {
        label: "Gig",
        icon: getColoredFolderIcon(folderTypes.GIG),
        callback: () => openDialog(folderTypes.GIG)
      },
      {
        label: "Basic Event",
        icon: BasicEventIcon,
        callback: () => openDialog("")
      }
    ]
  }, [openDialog])

  return (
    <>
      <BaseMenu
        items={actions}
        header={simplifyDate(menuState.start)}
        menuState={menuState}
        setMenuState={setMenuState}
      />
      {!!dialogParams && (
        <DialogAddEvent
          handleClose={closeDialog}
          initialStartDate={dialogParams.start}
          initialEndDate={dialogParams.end}
          folderType={dialogParams.type}
          onDone={refreshEvents}
        />
      )}
    </>
  )
}
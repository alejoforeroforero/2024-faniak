import { useContext, useMemo, useState } from 'react';
import { StateContext, DispatchContext } from '../../store'
import BaseMenu from '../../components/BaseMenu'
import { useSnackbar } from 'notistack'
import { eventOptions } from '../../utils/eventOptions'
import DialogEditTeam from '../../components/credits/DialogEditTeam'

export default function OptionsMenu({ menuState, setMenuState, fetchContent }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [showShareDialog, setShowShareDialog] = useState(false)

  const event = state.selected_event

  const actions = useMemo(() => {
    if (!event) return []

    return [
      eventOptions.open(event),
      eventOptions.openLocation(event),
      { divider: true },
      eventOptions.share(event, {
        setShowDialog: setShowShareDialog,
      }),
      eventOptions.toggleShow(event, {
        enqueueSnackbar,
        fetchContent,
      }),
      eventOptions.cancel(event, {
        enqueueSnackbar,
        closeSnackbar,
        dispatch,
        fetchContent,
      }),
    ]
  }, [event])

  if (!event) return null

  return (
    <>
      <BaseMenu
        items={actions}
        header={event.summary}
        menuState={menuState}
        setMenuState={setMenuState}
      />
      {showShareDialog && (
        <DialogEditTeam
          event={event}
          handleClose={() => setShowShareDialog(false)}
          fetchEvent={fetchContent}
        />
      )}
    </>
  )
}
import { useCallback, useState } from 'react';
import {
  DialogContent,
} from '@material-ui/core'
import ContainedButton from '../../../../ContainedButton'
import BaseDialogActions from '../../../../BaseDialogActions'
import BaseDialogTitle from '../../../../BaseDialogTitle'
import BaseDialog from '../../../../BaseDialog'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'
import Calendar from './Calendar';
import MenuEditEntry from './MenuEditEntry';
import { getInitialMenuState, getOpenMenuHandler } from '../../../../BaseMenu';
import { formParsers, formTrimmers } from '../../../../../utils/formUtils';
import { updateFolder } from '../../../../../api/folder/update';
import { conditionalGigUpdate } from '../../../../../utils/eventUtils';

const useStyles = makeStyles(theme => ({
  content: {
    paddingTop: 0,
  },
}))

const buildEntryList = (event) => {
  const timetable = event.smart_folder.data.timetable
  if (timetable.length) {
    return timetable.map((entry, i) => ({
      key: i,
      title: entry.title || "",
      description: entry.description || "",
      allDay: false,
      start: new Date(entry.start),
      end: new Date(entry.end),
    }))
  }
  if (event.start.dateTime) {
    return [{
      key: 0,
      title: "Showtime!",
      allDay: false,
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
    }]
  }
  return []
}

export default function DialogEdit({
  event,
  handleClose,
  refreshEvent,
}) {
  const classes = useStyles()
  const [entries, setEntries] = useState(() => buildEntryList(event))
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const [menu, setMenu] = useState(getInitialMenuState())
  const editEntry = useCallback((entryKey, x, y) => {
    setMenu({
      entryKey: entryKey,
      mouseX: x,
      mouseY: y,
    })
  }, [setMenu])


  const handleSave = () => {
    setSubmitting(true)

    const payload = {
      timetable: [...entries]
        .filter(entry => entry.title.trim())
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map(entry => ({
          start: formTrimmers.date(entry.start),
          end: formTrimmers.date(entry.end),
          title: entry.title,
          description: entry.description,
        }))
    }

    updateFolder({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      },
      data: payload,
    })
      .then(res => {
        if (res.error) {
          setSubmitting(false)
          enqueueSnackbar("An error occured while saving. Please contact support or try again", { variant: "error" })
          return
        }

        conditionalGigUpdate(event, payload)

        enqueueSnackbar("Timetable saved", { variant: "success" })
        handleClose()
        refreshEvent()
      })
  }

  return (
    <BaseDialog maxWidth="sm">
      <BaseDialogTitle handleClose={handleClose}>
        Timetable for {event.summary}
      </BaseDialogTitle>

      <DialogContent className={classes.content}>
        <Calendar
          event={event}
          entries={entries}
          setEntries={setEntries}
          editEntry={editEntry}
        />
        <MenuEditEntry
          event={event}
          menuState={menu}
          entries={entries}
          setEntries={setEntries}
          setMenuState={setMenu}
        />
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton loading={submitting} onClick={handleSave}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}
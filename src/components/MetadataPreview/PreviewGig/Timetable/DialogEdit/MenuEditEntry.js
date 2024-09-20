import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  IconButton,
  Popover,
  Tooltip,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { getInitialMenuState } from '../../../../BaseMenu';
import CloseIcon from '@material-ui/icons/Close'
import { StateContext } from '../../../../../store';
import { formParsers } from '../../../../../utils/formUtils';
import Form from './Form'
import ContainedButton from '../../../../ContainedButton';
import { DateTime } from "luxon"
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

export default function MenuEditEntry(props) {
  if (props.menuState.mouseY == null) return null
  return <Element {...props} />
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: 24,
    width: 466,
    overflow: "visible",
  },
  header: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
    '& .text': {
      flexGrow: 1,
    },
    '& .MuiIconButton-root': {
      margin: -8,
    },
  },
  footer: {
    marginTop: 16,
    display: "flex",
    justifyContent: "right",
    '& .iconButtonWrapper': {
      marginRight: 16,
      display: "flex",
      alignItems: "center",
    },
  },
}))

function Element({
  event,
  entries,
  setEntries,
  menuState,
  setMenuState,
}) {
  const state = useContext(StateContext)
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [form, setForm] = useState({
    start: "",
    end: "",
    title: "",
    description: "",
  })

  const entry = useMemo(() => {
    return entries.find(entry => entry.key === menuState.entryKey)
  }, [menuState])

  const timeZone = event.start.timeZone || state.time_zone

  useEffect(() => {
    setForm({
      start: formParsers.localeTime(entry.start.toISOString(), timeZone),
      end: formParsers.localeTime(entry.end.toISOString(), timeZone),
      title: formParsers.text(entry.title),
      description: formParsers.text(entry.description),
    })
  }, [timeZone, entry])

  const close = useCallback((e) => {
    setMenuState(getInitialMenuState())
  }, [])

  const handleClose = useCallback((e) => {
    stopPropagation(e)
    close()
  }, [])

  const submit = useCallback(() => {
    setEntries(prev => prev.map(item => {
      if (item.key === menuState.entryKey) {
        const newItem = { ...item }
        newItem.title = form.title.trim()
        newItem.description = form.description.trim()

        if (form.start && form.end) {
          newItem.start = applyValueToLocaleDate(entry.start, form.start, timeZone)
          newItem.end = applyValueToLocaleDate(entry.end, form.end, timeZone)

          // if the end is past muidnight, we must add a day to the end date
          if (newItem.start > newItem.end) {
            newItem.end.setDate(newItem.end.getDate() + 1)
          }
        }
        return newItem
      }
      return item
    }))

    close()
  }, [menuState, form, timeZone])

  const deleteEntry = useCallback(() => {
    setEntries(prev => prev.filter(item => item.key !== menuState.entryKey))
    close()
  }, [menuState])

  return (
    <Popover
      open
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: menuState.mouseY, left: menuState.mouseX }}
      classes={{ paper: classes.paper }}
    >
      <div className={classes.header}>
        <div className="text">
          Edit timetable
        </div>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <Form form={form} setForm={setForm} />

      <div className={classes.footer}>
        <div className="iconButtonWrapper">
          <Tooltip title="Delete entry">
            <IconButton component="div" size="small" color="primary" onClick={deleteEntry}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>
        <ContainedButton onClick={submit}>
          Save
        </ContainedButton>
      </div>
    </Popover>
  )
}

const stopPropagation = (e) => e.stopPropagation()

const applyValueToLocaleDate = (initial, value, timeZone) => {
  const [hh, mm] = value.split(":")

  const luxonInitial = DateTime
    .fromJSDate(initial, { zone: timeZone })
    .set({ hour: parseInt(hh), minute: parseInt(mm) })

  return new Date(luxonInitial.toString())
}
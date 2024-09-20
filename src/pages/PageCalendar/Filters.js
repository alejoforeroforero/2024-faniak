import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../store'
import {
  Box,
  Checkbox,
  MenuItem,
  Popover,
} from '@material-ui/core'
import { updateMyCalendar } from '../../api/calendar/updateMyCalendar'

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
}
const transformOrigin = {
  vertical: 'top',
  horizontal: 'left',
}

export default function Filters({
  anchorEl,
  handleClose,
}) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const toggleCalendar = (index) => (e) => {
    dispatch({
      type: "UPDATE",
      set: (prev) => {
        const calendars = [...prev.calendars]
        const calendar = calendars[index]
        calendar.selected = !calendar.selected
        updateMyCalendar({
          id: calendar.id,
          resource: {
            selected: calendar.selected,
          },
        })
        return { ...prev, calendars }
      }
    })
  }

  const stopPropagation = (event) => {
    event.stopPropagation()
  }

  return (
    <Popover
      open
      getContentAnchorEl={null}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      anchorEl={anchorEl}
      onClick={stopPropagation}
      onClose={handleClose}
    >
      {state.calendars.length ? (
        <Box pt={1} pb={1}>
          {state.calendars.map((c, i) => (
            <MenuItem key={i} dense onClick={toggleCalendar(i)}>
              <Checkbox
                disableRipple
                checked={Boolean(c.selected)}
                style={{
                  color: c.backgroundColor,
                  margin: -8,
                  marginRight: 0,
                }}
              />
              {c.summary}
            </MenuItem>
          ))}
        </Box>
      ) : (
        <Box p={2}>
          We were unable to fetch your calendars...
        </Box>
      )}
    </Popover >
  )
}
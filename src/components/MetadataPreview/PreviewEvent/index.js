import Metadata from './Metadata'
import { useContext } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { PREVIEW_WIDTH, StateContext } from '../../../store'
import EventIcon from '@material-ui/icons/Event'
import Preview from '../Preview'
import ButtonBack from '../ButtonBack'
import ButtonTeam from '../ButtonTeam'

const useStyles = makeStyles((theme) => ({
  backButton: {
    position: "fixed",
    top: 28,
    right: PREVIEW_WIDTH - 32,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(2, 0),
    minHeight: 64,
    justifyContent: 'flex-end',
    '& .MuiTypography-root': {
      fontSize: 18,
    },
  },
}))

export default function PreviewEvent({ event, fetchEvent, handleOpenTeam }) {
  const state = useContext(StateContext)
  const classes = useStyles()

  return (
    <Preview>
      <ButtonBack className={classes.backButton} />

      <div className={classes.header}>
        <Box pl={state.selected_event ? 3.5 : 0} pr={1.5} display="flex">
          <EventIcon />
        </Box>
        <Box flexGrow={1} overflow={"hidden"}>
          <Typography noWrap>
            {event.summary}
          </Typography>
        </Box>

        {!!event.attendees && (
          <ButtonTeam event={event} handleOpenTeam={handleOpenTeam} />
        )}
      </div>

      <Metadata event={event} />
    </Preview>
  )
}
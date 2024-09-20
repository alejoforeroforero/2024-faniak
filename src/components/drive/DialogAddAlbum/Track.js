import {
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import {
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from '@material-ui/core'
import TrackDetails from './TrackDetails'

const useStyles = makeStyles(theme => ({
  handleWrapper: {
    padding: 8,
    width: 56,
    minWidth: 56,
    flexShrink: 0,
    marginRight: 8,
    marginLeft: -8,
  },
  root: {
    width: "100%",
    zIndex: theme.zIndex.modal + 1,
  },
  summary: {
    height: 48,
  },
  field: {
    marginTop: 4,
  },
  details: {
    paddingLeft: 72,
    paddingTop: 0,
  },
}))

const Track = sortableElement(({
  tracklist, setTracklist,
  expanded,
  onExpand,
  track_index
}) => {

  const classes = useStyles()

  const track = tracklist[track_index]

  const handleChangeTitle = (e) => {

    const { value } = e.target

    setTracklist(prev => {
      prev[track_index].title = value
      return prev
    })
  }

  const DragHandle = sortableHandle(() => (
    <Button className={classes.handleWrapper}>
      <DragHandleIcon />
      <Box flexGrow={1} />
      <span>{track_index + 1}.</span>
    </Button>
  ))

  return (
    <Accordion
      className={classes.root}
      expanded={expanded}
      onChange={onExpand}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        className={classes.summary}
        expandIcon={<ExpandMoreIcon />}
      >
        <Box
          display="flex"
          flexGrow={1}
          onClick={e => e.stopPropagation()}
          onFocus={e => e.stopPropagation()}
        >
          <DragHandle />
          <TextField
            className={classes.field}
            defaultValue={track.title}
            fullWidth
            onChange={handleChangeTitle}
            autoComplete="off"
          />
        </Box>

      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <TrackDetails track={track} />
      </AccordionDetails>
    </Accordion>
  )
})

export default Track
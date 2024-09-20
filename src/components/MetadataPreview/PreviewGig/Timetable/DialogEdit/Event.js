import { useCallback } from "react"
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  event: {
    borderLeft: `3px solid ${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.secondary.main,
    padding: "2px 6px",
    height: "100%",
    '& .title': {
      fontWeight: 600,
    },
    '& .description': {
      marginLeft: 4,
      opacity: 0.75,
      fontSize: 13,
    },
  },
}))

export default function Event({ event, editEntry }) {
  const classes = useStyles()

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    editEntry(event.key, e.clientX, e.clientY)
  }, [editEntry, event])

  return (
    <div className={classes.event} onClick={handleClick}>
      <span className='title'>{event.title || "Untitled"}</span>
      {!!event.description && (
        <span className='description'>
          (click to read more)
        </span>
      )}
    </div>
  )
}
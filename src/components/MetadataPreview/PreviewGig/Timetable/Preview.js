import { Card, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useMemo } from 'react'
import { simplifyDate, simplifyTime } from '../../../../utils/dateUtils'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  line: {
    display: "flex",
    alignItems: "flex-end",
    padding: "2px 12px",
  },
  date: {
    padding: "6px 12px 2px",
    fontWeight: 600,
  },
  time: {
    fontSize: 11,
    opacity: 0.75,
    marginLeft: 8,
    flexShrink: 0,
  },
  title: {
    fontSize: 13,
    marginLeft: 6,
  },
}))

export default function Preview({ event }) {
  const folder = event.smart_folder
  const timetable = folder.data.timetable

  const classes = useStyles()

  const content = useMemo(() => {
    let auxDate = null
    let key = 0

    const items = []

    for (const entry of timetable) {
      key++

      const startTime = new Date(entry.start)
      const simplifiedDate = simplifyDate(startTime, options)
      const options = event.start.timeZone ? {
        timeZone: event.start.timeZone
      } : {}

      // decide whether to print the date (events in same day are put in groups)
      if (!auxDate || simplifiedDate !== auxDate) {
        auxDate = simplifiedDate
        items.push(<div key={`${key}#date`} className={classes.date}>
          {simplifiedDate}
        </div>)
      }

      items.push(<div key={key} className={classes.line}>
        <div className={classes.time}>
          {simplifyTime(startTime, options)}
        </div>
        <Typography noWrap className={classes.title}>
          {entry.title || "Untitled"}
        </Typography>
      </div>)
    }

    return items
  }, [timetable, classes])

  return (
    <Card variant="outlined" className={classes.root}>
      {content}
    </Card>
  )
}
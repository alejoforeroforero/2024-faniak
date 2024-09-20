import { useMemo } from 'react';
import {
  Typography,
} from '@material-ui/core'
import { computeStats } from '../DialogAddSong/Metadata'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  label: {
    fontWeight: "600",
    width: "40%",
    minWidth: "40%",
    paddingRight: 4,
    fontSize: 13,
  },
  value: {
    fontSize: 13,
  },
}))

export default function TrackDetails({ track }) {
  const classes = useStyles()
  const stats = useMemo(() => computeStats(track), [track])

  return (
    <div className="fk-flex-grow">
      {stats.length
        ? stats.map(
          (stat, i) => (
            <div className={classes.root} key={i}>
              <Typography noWrap className={classes.label}>
                {stat.label}
              </Typography>
              <Typography noWrap className={classes.value}>
                {stat.value}
              </Typography>
            </div>
          )
        ) : (
          <Typography variant="body2">No extra metadata found.</Typography>
        )}
    </div>
  )
}
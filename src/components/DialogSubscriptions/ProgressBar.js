import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
  LinearProgress, Typography,
} from '@material-ui/core'
import { StateContext } from '../../store'
import { bytesToSize } from '../../utils/fileUtils'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: ({ error }) => error ? theme.palette.error.light : null,
    '& .MuiLinearProgress-bar': {
      backgroundColor: ({ error }) => error ? theme.palette.error.main : null,
    }
  },
  stats: {
    margin: theme.spacing(0.5, 0, 1, 2),
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
  },
}))

export default function ProgressBar({ value, error }) {

  const classes = useStyles({ error: error })

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      className={classes.root}
    />
  )
}

export function ProgressStorage() {

  const { storageQuota } = useContext(StateContext)

  const classes = useStyles()

  const usage = storageQuota.usage ?? 0
  const limit = storageQuota.limit ?? 1
  const is_unlimited = limit === -1
  const progress = is_unlimited ? 0 : calculateProgress(usage, limit)
  const is_valid = progress < 99

  return (
    <div className={classes.stats}>
      <Typography variant="button">
        {is_unlimited ? `${bytesToSize(usage)} Used` : `${bytesToSize(usage)} / ${bytesToSize(limit)}`}
      </Typography>
      <ProgressBar error={!is_valid} value={progress} />
    </div>
  )
}

export function ProgressSmartFolders() {

  const { user } = useContext(StateContext)

  const classes = useStyles()

  const is_unlimited = user.max_smart_folders === -1

  const usage = user.current_smart_folders
  const limit = user.max_smart_folders
  const is_valid = is_unlimited || usage < limit
  const is_progress = is_unlimited ? 0 : calculateProgress(usage, limit)

  return (
    <div className={classes.stats}>
      <Typography variant="button">{
        usage} / {is_unlimited ? <Infinity /> : limit} Smart Folders
      </Typography>
      <ProgressBar error={!is_valid} value={is_progress} />
    </div>
  )
}

const Infinity = () => <>&infin;</>


const calculateProgress = (current, max) => {
  return Math.min(
    100, Math.round((current / max) * 100)
  )
}
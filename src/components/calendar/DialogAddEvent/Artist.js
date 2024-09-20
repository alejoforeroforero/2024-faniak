import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'
import Folder from '../../Folder'
import Contributors from './Contributors'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "flex-start",
    '& > .folder': {
      width: 100,
    },
  },
  right: {
    marginTop: 14,
    flexGrow: 1,
  },
  content: {
    position: "relative",
    padding: 8,
  },
  name: {
    fontWeight: "600",
  },
}))

export default function Artist({ artist, credits, setCredits }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className="folder">
        <Folder
          selected
          folder={artist}
        >
          <div className={classes.content}>
            <Typography
              className={classes.name}
              variant="body2"
              noWrap
            >
              {artist.data.name}
            </Typography>
          </div>
        </Folder>
      </div>
      <Box pl={2} />
      <div variant="outlined" className={classes.right}>
        <Contributors
          artist={artist}
          credits={credits}
          setCredits={setCredits}
        />
      </div>
    </div>
  )
}
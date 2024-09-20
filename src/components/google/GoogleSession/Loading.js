import { Box, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Page from '../../Page'
import Favicon from '../../../svg/Favicon'

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  icon: {
    fontSize: 44,
  },
}))

export default function Loading() {

  const classes = useStyles()

  return (
    <Page disableShift>
      <div className={classes.wrapper}>
        <CircularProgress size={86} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Favicon className={classes.icon} />
        </Box>
      </div>
    </Page>
  )
}
import { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Page from '../../Page'
import NEEDS_AUTH from './Errors/NEEDS_AUTH'
import NEEDS_ID from './Errors/NEEDS_ID'
import GOOGLE_ERROR from './Errors/GOOGLE_ERROR'
import NavBar from '../../NavBar'

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: "100%",
    width: 400,
    maxWidth: "100%",
    padding: theme.spacing(6, 2, 6),
  },
}))

export default function Notice({ error, fetchCredentials }) {

  const classes = useStyles()

  const content = useMemo(() => {
    switch (error) {
      case "NEEDS_AUTH": return <NEEDS_AUTH />
      case "NEEDS_ID": return <NEEDS_ID />
      default: return <GOOGLE_ERROR fetchCredentials={fetchCredentials} />
    }
  }, [error, fetchCredentials])

  return (
    <Page disableShift>
      <NavBar disableRedirects />
      <div className={classes.root}>
        <div className={classes.wrapper}>
          {content}
        </div>
      </div>
    </Page>
  )
}
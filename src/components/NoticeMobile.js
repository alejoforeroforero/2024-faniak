import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import ElementHarmonica from '../svg/ElementHarmonica'
import { Card, Link } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.modal,
    backgroundColor: theme.palette.background.default,
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
    width: 456,
    maxWidth: "100%",
    padding: theme.spacing(6, 2, 6),
    fontSize: 16,
    textAlign: "center",
  },
  list: {
    margin: 0,
    "& li": {
      marginTop: 12,
    },
  },
  card: {
    padding: 16,
  },
}))

export default function NoticeMobile() {
  const classes = useStyles()
  const [show, setShow] = useState(true)
  const handleClose = () => setShow(false)

  return show && (
    <div className={`${classes.root} mobile-only`}>
      <div className={classes.wrapper}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>
          Trying to check Faniak<br /> on your phone?
        </div>
        <div style={{ marginBottom: 16 }}>
          Sorry, we're too much for your phone to handle!
        </div>
        <ElementHarmonica width={180} />
        <div className={classes.card}>
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: 24 }}>
              You can:
            </span>
            <ul className={classes.list}>
              <li>Move to your laptop.</li>
              <li>Upload new material to Faniak directly from your Google Drive App.</li>
              <li>Wait for the Faniak App release. It might take a while so stop staring at the screen and go make some music.</li>
              <li>Ignore the other options and <Link onClick={handleClose}>
                open the desktop app
              </Link>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
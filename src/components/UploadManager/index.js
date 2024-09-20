import { useContext, useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar'
import { StateContext, DispatchContext } from '../../store'
import { Box, Card, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/ArrowForwardIos'
import Item from './Item'
import { counter } from '../../reducer';

const useStyles = makeStyles(({ spacing, palette }) => ({
  card: {
    width: 284,
    borderRadius: spacing(0.5, 0, 0, 0.5),
  },
  anchor: {
    right: spacing(0),
    bottom: spacing(2),
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: spacing(1, 2),
    color: palette.background.default,
    backgroundColor: palette.secondary.main,
    '& .MuiSvgIcon-root': {
      color: palette.background.default,
      fontSize: 18,
    },
  },
  list: {
    maxHeight: 150,
    overflowY: "auto",
    padding: spacing(0.5, 0, 0.5),
  },
}))

const plural = num => num === 1 ? "" : "s"

export default function UploadManager() {
  const classes = useStyles()

  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const queue = state.upload_queue

  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(Boolean(queue.length))
  }, [queue.length])

  const cancelUpload = (item) => {
    item.cancel()
    dispatch({ type: 'CANCEL_UPLOAD', key: item.key })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return

    dispatch({ type: 'SET', data: { upload_queue: [] } })

    setShow(false)
  }

  const items_not_cancelled = queue.filter(x => !x.is_cancelled)

  const n_items_pending = items_not_cancelled.reduce((acc, curr) => (
    curr.percentage < 100 ? (acc + 1) : acc
  ), 0)

  return (
    <Snackbar
      open={show}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      classes={{ anchorOriginBottomRight: classes.anchor }}
    >
      <Card className={classes.card}>
        <div className={classes.header}>
          <Typography noWrap variant="body2">
            {n_items_pending
              ? `${n_items_pending} Upload${plural(n_items_pending)} Pending...`
              : `${items_not_cancelled.length} Upload${plural(items_not_cancelled.length)} Finished`
            }
          </Typography>
          <Box flexGrow={1} />
          <IconButton
            size="small"
            color="primary"
            onClick={handleClose}
            style={{ marginRight: -2 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.list}>
          {queue.map(elem => (
            <Item data={elem} key={elem.key} cancelUpload={cancelUpload} />
          ))}
        </div>
      </Card>
    </Snackbar>
  )
}

export const startUpload = ({ dispatch, file, parent_id, cancel }) => {
  counter.uploadKey++

  dispatch({
    type: "START_UPLOAD",
    key: counter.uploadKey,
    data: {
      parent_id: parent_id,
      name: file.name,
      mime_type: file.type,
      cancel: cancel,
    }
  })

  return counter.uploadKey
}

export const getUploadProgressHandler = (dispatch, key) => (progressEvent) => {
  dispatch({
    type: "UPDATE_UPLOAD",
    key: key,
    data: {
      percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
    }
  })
}

export const uploadReducer = {
  start: (state, action) => {
    const upload = {
      key: action.key,
      percentage: 0,
      name: action.data.name,
      parent_id: action.data.parent_id,
      mime_type: action.data.mime_type,
      cancel: action.data.cancel,
      is_cancelled: false,
    }

    state.upload_queue = [upload].concat(state.upload_queue)
    return { ...state }
  },
  update: (state, action) => {
    console.log("update", state.upload_queue, action)
    const upload = state.upload_queue.find(elem => elem.key === action.key)

    if (upload) upload.percentage = action.data.percentage

    return { ...state }
  },
  cancel: (state, action) => {
    const upload = state.upload_queue.find(elem => elem.key === action.key)

    if (upload) upload.is_cancelled = true

    return { ...state }
  }
}
import { Box, CircularProgress, Typography, ButtonBase } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import { useHistory } from 'react-router'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { routes } from '../../Routes'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: spacing(1, 2, 1),
    width: "100%",
    "& .cancelled": {
      opacity: 0.6,
    },
    "& .MuiSvgIcon-root": {
      fontSize: 20,
    },
    "& .show_onhover": {
      display: "none",
    },
    "&:hover .show_onhover": {
      display: "block",
    },
    "& .hide_onhover": {
      display: "block",
    },
    "&:hover .hide_onhover": {
      display: "none",
    },
  },
}))

export default function Item({ data, cancelUpload }) {
  const classes = useStyles()
  const history = useHistory()

  const is_in_progress = data.percentage < 100

  const openInFolder = () => {
    history.push(data.parent_id ? routes.folder(data.parent_id) : routes.home())
  }

  const cancel = () => cancelUpload(data)

  return (
    <ButtonBase
      component="div"
      onClick={is_in_progress ? cancel : openInFolder}
      disabled={data.is_cancelled}
      className={classes.root}
    >
      <Typography noWrap variant="body2">
        {data.name}
      </Typography>
      <Box flexGrow={1} />
      {
        data.is_cancelled ? (
          <div className="cancelled">(Cancelled)</div>
        ) : (
          is_in_progress ? (
            <>
              <CircularProgress
                size={20}
                variant={data.percentage ? "determinate" : undefined}
                value={data.percentage}
                color="secondary"
                className="hide_onhover"
              />
              <DeleteForeverIcon className="show_onhover" />
            </>
          ) : (
            <>
              <CheckIcon className="hide_onhover" />
              <FolderOpenIcon className="show_onhover" />
            </>
          )
        )
      }
    </ButtonBase>
  )
}
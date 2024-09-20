import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Checkbox,
  IconButton,
  ListItem,
  Typography,
} from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import Tooltip from '@material-ui/core/Tooltip'
import IndeterminateIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined'

const forwardWidth = 44

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  name: {
    paddingLeft: 8,
  },
  itemName: {
    padding: theme.spacing(0, 1),
    width: `calc(100% - ${forwardWidth}px)`,
    flexGrow: 1,
  },
  forward: {
    width: forwardWidth,
    '& .MuiSvgIcon-root': {
      fontSize: 15,
    },
  },
}))

export default function File({ checked, toggleCheckbox, icon, name, onClick, disabled_reason }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Tooltip
        title={disabled_reason ?? ""}
        disableFocusListener={!disabled_reason}
        disableHoverListener={!disabled_reason}
        disableTouchListener={!disabled_reason}
      >
        <ListItem
          button
          onClick={!!disabled_reason ? null : toggleCheckbox}
          className={classes.itemName}
        >
          <Checkbox
            indeterminate={!!disabled_reason}
            indeterminateIcon={<IndeterminateIcon />}
            size="small"
            color="primary"
            checked={checked}
          />
          <div >
            {icon}
          </div>
          <Typography variant="body2" noWrap className={classes.name}>
            {name}
          </Typography>
          <Box flexGrow={1} />
        </ListItem>
      </Tooltip>
      <div className={classes.forward}>
        {onClick ? (
          <IconButton color="primary" onClick={onClick} >
            <ArrowForwardIosIcon />
          </IconButton>
        ) : null}
      </div>
    </div >
  )
}
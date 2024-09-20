import {
  Box,
  Typography,
  Button,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 24,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 40,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    paddingTop: 4,
  },
}))

export default function PreviewSection({ text, handleEdit, children, actions = [] }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="button">
          {text}
        </Typography>

        <Box flexGrow={1} />

        {handleEdit && (
          <Button
            color="primary"
            endIcon={<EditIcon fontSize="small" />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div >
      {children}
      {Boolean(actions.length) && (
        <div className={classes.actions}>
          {actions.map(({ label, icon: Icon, callback, disabled }, index) => (
            <Button
              disabled={disabled}
              size="small"
              key={index}
              onClick={callback}
              color="primary"
              endIcon={<Icon />}
            >
              {label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

import { makeStyles } from '@material-ui/core/styles'
import { Box, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import CreditedPerson from '../../credits/CreditedPerson'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    paddingRight: 8,
    borderRadius: 4,
    '& .MuiIconButton-root': {
      display: "none",
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
}))

export default function Contributor({ person, index, removePerson }) {
  const classes = useStyles()

  const handleRemove = () => {
    removePerson(index)
  }

  return (
    <div className={classes.root}>
      <Box flexGrow={1}>
        <CreditedPerson person={person} padding={"4px"} />
      </Box>
      <IconButton size="small" onClick={handleRemove}>
        <CloseIcon />
      </IconButton>
    </div>
  )
}
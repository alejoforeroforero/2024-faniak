import { withStyles } from '@material-ui/core/styles'
import {
  Button
} from '@material-ui/core'

export default function ChipButton({ value, onClick }) {
  return <StyledButton
    tabIndex={-1}
    variant="outlined"
    size="small"
    onClick={onClick}
  >
    {value}
  </StyledButton>
}

const StyledButton = withStyles((theme) => ({
  root: {
    // lineHeight: 1.5,
    padding: theme.spacing(0, 1),
    textTransform: "none",
    borderRadius: 20,
    margin: 2,
    minWidth: 0,
    fontSize: 14,
    '&:hover': {
      textDecoration: "line-through"
    },
  },
}))(Button)
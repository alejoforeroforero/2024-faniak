import { Button, withStyles } from '@material-ui/core'
import GoogleIcon from '../../svg/GoogleIcon'

export default function ButtonGoogle({ onClick, text = "Sign In With Google" }) {
  return (
    <GoogleButton
      variant="contained"
      size="large"
      onClick={onClick}
      startIcon={<GoogleIcon />}
    >
      {text}
    </GoogleButton>
  )
}

const GoogleButton = withStyles((theme) => ({
  root: {
    color: "#666666",
    borderRadius: 2,
    backgroundColor: "#fff",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    textTransform: "none",
    padding: "8px 12px",
    '&:hover': {
      backgroundColor: "#f7f7f7",
    },
    '& .MuiButton-startIcon': {
      marginLeft: 0,
      marginRight: 16,
    },
  },
}))(Button)
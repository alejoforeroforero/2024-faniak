import { Dialog } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const stopPropagation = e => e.stopPropagation()

const BaseDialog = withStyles(({ palette }) => ({
  root: {
    '& .MuiBackdrop-root': {
      backgroundColor: palette.background.default + "88",
    },
  },
}))(props => <Dialog open fullWidth onClick={stopPropagation} {...props} />)

export default BaseDialog

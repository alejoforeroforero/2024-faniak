import { DialogActions } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const BaseDialogActions = withStyles({
    root: {
        padding: 24,
        '& .MuiButton-root': {
            marginLeft: 8,
            paddingLeft: 16,
            paddingRight: 16,
        },
    },
})(props => <DialogActions {...props} />)

export default BaseDialogActions
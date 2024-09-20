import {
  Box,
  DialogTitle, IconButton, Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

export default function BaseDialogTitle({ children, handleClose }) {
  return (
    <DialogTitle disableTypography>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1} overflow="hidden">
          <Typography variant="h6" noWrap>
            {children}
          </Typography>
        </Box>
        <Box flexShrink={0} m={-2} ml={0}>
          <IconButton onClick={handleClose} tabIndex={-1}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </DialogTitle>
  )
}
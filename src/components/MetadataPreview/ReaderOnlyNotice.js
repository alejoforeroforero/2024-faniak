import { Box } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'

export default function ReaderOnlyNotice() {
  return (
    <Box
      borderRadius={4}
      display="flex"
      alignItems="center"
      bgcolor={"warning.main"}
      color={"white"}
      mt={3}
      mb={3}
      p={1.5}
    >
      <WarningIcon />
      <Box ml={1.5}>
        You were not given permission to edit this Smart Folder.
      </Box>
    </Box>
  )
}
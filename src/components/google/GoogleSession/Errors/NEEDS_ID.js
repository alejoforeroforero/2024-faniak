import { Box, Typography } from '@material-ui/core'
import Identification from '../Identification'

export default function NEEDS_ID() {
  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Great news!
      </Typography>
      <Typography variant="h6" align="center">
        You can now use Docs, Spreadsheets and other Google tools straight from Faniak.
      </Typography>
      <Box pt={2} />
      <Identification />
    </>
  )
}
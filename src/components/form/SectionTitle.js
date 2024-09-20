import {
  Grid,
  Typography,
  Divider,
  Box,
} from '@material-ui/core'

export default function SectionTitle({ label }) {
  return (
    <Grid item lg={12} md={12} sm={12} xs={12}>
      <Box mt={2} mb={1}>
        <Divider />
      </Box>
      <Box mb={-1}>
        <Typography variant="button">{label}</Typography>
      </Box>
    </Grid>
  )
}
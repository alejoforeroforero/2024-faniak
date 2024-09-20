import { Box, Checkbox, Typography } from '@material-ui/core'

export default function BaseCheckbox({ label, name, value, setValue }) {
  function handleChange(e) {
    const { checked } = e.target
    setValue(name, checked)
  }

  return (
    <Box display="flex" alignItems="center" mt={0.75} mb={0.75}>
      <Checkbox
        color="primary"
        checked={value}
        onChange={handleChange}
      />
      <Typography>
        {label}
      </Typography>
    </Box>
  )
}
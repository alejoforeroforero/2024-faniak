import {
  Box,
  CircularProgress,
  Typography,
} from '@material-ui/core'

export default function SplitsWheel(props) {
  const { size, value } = props
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress size={size ?? 36} variant="determinate" color="secondary" style={{ opacity: 0.5 }} {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
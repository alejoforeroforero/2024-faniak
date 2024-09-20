import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core'
import ContainedButton from '../../../ContainedButton'

const MAX_TIMEOUT = 60
const INCREMENT = 10

export default function GOOGLE_ERROR({ fetchCredentials }) {
  const [ctr, setCtr] = useState(INCREMENT)
  const [multiplier, setMultiplier] = useState(2)

  useEffect(() => {
    if (ctr < 1) {
      retry()
      setMultiplier(x => x + 1)
    }
  }, [ctr])

  useEffect(() => {
    const interval = setInterval(() => setCtr(x => x - 1), 1000)

    return () => clearInterval(interval)
  }, [])

  const retry = () => {
    console.log("Retrying...")
    fetchCredentials()
    setCtr(Math.min(multiplier * INCREMENT, MAX_TIMEOUT))
  }

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        We were unable to reach Google...
      </Typography>
      <Box mb={3} mt={1} display="flex" alignItems="center">
        <CircularProgress size={16} />
        <div style={{ marginRight: 8 }} />
        <Typography component="div" variant="body2" align="center">
          Retrying in {ctr} second{ctr === 1 ? "" : "s"}...
        </Typography>
      </Box>
      <ContainedButton onClick={retry}>
        Retry now
      </ContainedButton>
    </>
  )
}
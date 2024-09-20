import { useCallback } from 'react';
import { Box, Button, IconButton, Typography } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import UpdateIcon from '@material-ui/icons/Update'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  toolbar: {
    position: "sticky",
    top: 0,
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  },
  label: {
    paddingLeft: 16,
    paddingRight: 16,
    minWidth: 200,
    textAlign: "center",
  },
}))

export default function Toolbar({ date, label, onNavigate, onView, view, views, centerDate }) {
  const classes = useStyles()

  const goToPrevious = useCallback(() => {
    date.setDate(date.getDate() - 1)
    onNavigate('prev')
  }, [date, onNavigate, view])

  const goToNext = useCallback(() => {
    date.setDate(date.getDate() + 1)
    onNavigate('next')
  }, [date, onNavigate, view])

  const goToCurrent = useCallback(() => {
    date.setTime(centerDate.getTime())
    onNavigate('current')
  }, [date, onNavigate, centerDate])

  return (
    <div className={classes.toolbar}>
      <Box flex={1} display="flex" alignItems="center">
        <Button 
        color="primary" 
        onClick={goToCurrent} 
        startIcon={<UpdateIcon />}
        disabled={centerDate.getTime() === date.getTime()}
        >
          Gig day
        </Button>
      </Box>
      <Box flexShrink={0} display="flex" alignItems="center">
        <IconButton color="primary" onClick={goToPrevious} size="small">
          <ArrowLeftIcon />
        </IconButton>

        <div className={classes.label}>
          <Typography>
            {label}
          </Typography>
        </div>

        <IconButton color="primary" onClick={goToNext} size="small">
          <ArrowRightIcon />
        </IconButton>
      </Box>
      <Box flex={1} />
    </div >
  )
}
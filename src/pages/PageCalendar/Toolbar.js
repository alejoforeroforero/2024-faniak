import { useCallback, useState } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FilterListIcon from '@material-ui/icons/FilterList'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import UpdateIcon from '@material-ui/icons/Update'
import Filters from './Filters'
import { Views } from 'react-big-calendar'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  toolbar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: theme.palette.background.default,
    // to cover the top portion of the page when scrolling down
    marginTop: -24,
    paddingTop: 24,
  },
  spacer: {
    marginLeft: 16,
  },
  label: {
    paddingLeft: 16,
    paddingRight: 16,
    minWidth: 224,
    textAlign: "center",
  },
}))

export default function Toolbar({ date, label, onNavigate, onView, view, views }) {
  const [viewsAnchor, setViewsAnchor] = useState(null)
  const classes = useStyles()
  // const [filtersAnchor, setFiltersAnchor] = useState(null)

  const handleOpenViews = useCallback((event) => {
    setViewsAnchor(event.currentTarget)
  }, [setViewsAnchor])

  const handleCloseViews = useCallback(() => {
    setViewsAnchor(null)
  }, [setViewsAnchor])

  // const handleOpenFilters = useCallback((event) => {
  //   setFiltersAnchor(event.currentTarget)
  // }, [setFiltersAnchor])

  // const handleCloseFilters = useCallback(() => {
  //   setFiltersAnchor(null)
  // }, [setFiltersAnchor])

  const goToPrevious = useCallback(() => {
    if (view === Views.DAY) {
      date.setDate(date.getDate() - 1)
    } else if (view === Views.WEEK) {
      date.setDate(date.getDate() - 7)
    } else {
      date.setMonth(date.getMonth() - 1)
    }
    onNavigate('prev')
  }, [date, onNavigate, view])

  const goToNext = useCallback(() => {
    if (view === Views.DAY) {
      date.setDate(date.getDate() + 1)
    } else if (view === Views.WEEK) {
      date.setDate(date.getDate() + 7)
    } else {
      date.setMonth(date.getMonth() + 1)
    }
    onNavigate('next')
  }, [date, onNavigate, view])

  const goToPreviousYear = useCallback(() => {
    date.setYear(date.getFullYear() - 1)
    onNavigate('prev')
  }, [date, onNavigate])

  const goToNextYear = useCallback(() => {
    date.setYear(date.getFullYear() + 1)
    onNavigate('next')
  }, [date, onNavigate])

  const goToCurrent = useCallback(() => {
    const now = new Date()
    date.setMonth(now.getMonth())
    date.setYear(now.getFullYear())
    onNavigate('current')
  }, [date, onNavigate])

  return (
    <div className={classes.toolbar}>
      <Box flex={1} display="flex" alignItems="center">
        <Button color="primary" onClick={goToCurrent} startIcon={<UpdateIcon />}>
          Today
        </Button>

        <div className={classes.spacer} />

        {/* <Button color="primary" onClick={handleOpenFilters} startIcon={<FilterListIcon />}>
          Filters
        </Button> */}
      </Box>
      <Box flexShrink={0} display="flex" alignItems="center">
        <IconButton color="primary" onClick={goToPreviousYear} size="small">
          <SkipPreviousIcon />
        </IconButton>
        <IconButton color="primary" onClick={goToPrevious} size="small">
          <ArrowLeftIcon />
        </IconButton>

        <div className={classes.label}>
          <Typography variant="h6">
            {label}
          </Typography>
        </div>

        <IconButton color="primary" onClick={goToNext} size="small">
          <ArrowRightIcon />
        </IconButton>
        <IconButton color="primary" onClick={goToNextYear} size="small">
          <SkipNextIcon />
        </IconButton>
      </Box>
      <Box flex={1} display="flex" alignItems="center" justifyContent="flex-end">
        <Button
          color="primary"
          onClick={handleOpenViews}
          endIcon={<ExpandMoreIcon />}
        >
          {view} view
        </Button>
      </Box>

      {Boolean(viewsAnchor) && (
        <Menu
          getContentAnchorEl={null}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          anchorEl={viewsAnchor}
          open
          onClose={handleCloseViews}
        >
          {["month", "day"].map(v => (
            <MenuItem key={v} onClick={() => {
              handleCloseViews()
              onView(v)
            }}>
              <span style={{ textTransform: "capitalize" }}>{v}</span>
            </MenuItem>
          ))}
        </Menu>
      )}

      {/* {Boolean(filtersAnchor) && (
        <Filters
          anchorEl={filtersAnchor}
          handleClose={handleCloseFilters}
        />
      )} */}
    </div >
  )
}

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
}
const transformOrigin = {
  vertical: 'top',
  horizontal: 'right',
}
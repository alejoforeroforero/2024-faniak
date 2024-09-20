import { useMemo } from 'react';
import { Tab, Tooltip } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import TabContext from '@material-ui/lab/TabContext'
import TabList from '@material-ui/lab/TabList'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { routes } from '../../Routes'

const useStyles = makeStyles(theme => ({
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main,
    }
  },
  tooltip: {
    fontSize: 14,
  },
}))

export default function Tabs() {
  const classes = useStyles()
  const history = useHistory()

  const value = useMemo(() => {
    const { pathname } = history.location

    if (pathname.includes(routes.calendar())) return routes.calendar()

    return routes.home()
  }, [history.location])

  const handleChange = (event, newValue) => {
    if (newValue === value) return
    history.push(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList
        onChange={handleChange}
        className={classes.tabs}
        orientation="vertical"
        children={[
          <Tab key={1} value={routes.home()} label={
            <Tooltip title="My Music Drive" placement="right" classes={{ tooltip: classes.tooltip }}>
              <FolderOpenIcon />
            </Tooltip>
          } />,
          <Tab key={2} value={routes.calendar()} label={
            <Tooltip title="My Calendar" placement="right" classes={{ tooltip: classes.tooltip }}>
              <CalendarTodayIcon fontSize="small" />
            </Tooltip>
          } />
        ]}
      />
    </TabContext>
  )
}
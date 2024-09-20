import { makeStyles } from '@material-ui/core/styles'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import DriveIcon from '../../svg/DriveIcon'
import { GOOGLE_SCOPES } from '../../store'
import ContactsIcon from '../../svg/ContactsIcon'
import CalendarIcon from '../../svg/CalendarIcon'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  icon: {
    width: 40,
    fontSize: 36,
    margin: theme.spacing(0, 2),
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
  },
  description: {
    fontSize: 13,
  },
}))

export default function ScopeDescription({ granted, scope }) {
  const classes = useStyles()
  const { Icon, label, description } = dictionary[scope]

  return (
    <div className={classes.root}>
      {granted ? <LockOpenIcon /> : <LockIcon />}
      <Icon className={classes.icon} />
      <div>
        <div className={classes.label}>{label}</div>
        <div className={classes.description}>{description}</div>
      </div>
    </div>
  )
}

const dictionary = {
  [GOOGLE_SCOPES.DRIVE]: {
    Icon: DriveIcon,
    label: "Google Drive",
    description: "All of the files and folders you manage in Faniak will be kept in your Google Drive storage.",
  },
  [GOOGLE_SCOPES.CONTACTS]: {
    Icon: ContactsIcon,
    label: "Google Contacts",
    description: "Faniak will use your contacts to autocomplete your forms and speed up actions like crediting your friends and colleagues.",
  },
  [GOOGLE_SCOPES.OTHER_CONTACTS]: {
    Icon: ContactsIcon,
    label: "Google Other Contacts",
    description: "By default, many of your contacts get stored under this category. This access enables us to find all of your contacts every time you search for a name or an email within Faniak.",
  },
  [GOOGLE_SCOPES.DIRECTORY_CONTACTS]: {
    Icon: ContactsIcon,
    label: "Google Directory Contacts",
    description: "This enables us to fetch a list of all the contacts within your Google Workspace. This can used to automate business related actions.",
  },
  // [GOOGLE_SCOPES.CALENDAR_READ]: {
  //   Icon: CalendarIcon,
  //   label: "Google Calendar",
  //   description: "This is a read only authorization that enables us to show you your list of calendars when needed.",
  // },
  [GOOGLE_SCOPES.CALENDAR_EVENTS]: {
    Icon: CalendarIcon,
    label: "Google Calendar Events",
    description: "All of the events you manage in Faniak will be kept in your Google Calendar. To make this possible, we need full access to your events.",
  },
}
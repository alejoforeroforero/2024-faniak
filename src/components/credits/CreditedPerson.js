import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { stringifyCreditDetails } from '../../utils/creditsUtils'
import SplitsWheel from './SplitsWheel'
import HelpIcon from '@material-ui/icons/Help'
import PersonIcon from '@material-ui/icons/Person'
import { avatarProps } from '../baseProps'

const useStyles = makeStyles(({ spacing, palette }) => ({
  wrapper: {
    maxWidth: "100%",
    padding: ({ padding }) => padding ? padding : spacing(1, 2, 1, 2),
    display: "flex",
    alignItems: "center",
    minHeight: 40,
    '&:nth-child(even)': {
      background: "rgba(150,150,150,0.075)"
    }
  },
  avatar: {
    height: 32,
    width: 32,
    marginRight: 16,
  },
  name: {
    fontWeight: 600,
  },
}))

export default function CreditedPerson({ person, showSplits, padding }) {
  const classes = useStyles({ padding })

  return (
    <div className={classes.wrapper}>
      <Tooltip title={person.member
        ? "In Faniak"
        : person.email
          ? "Not in Faniak"
          : "Unidentified"}>
        <Avatar
          {...avatarProps}
          className={classes.avatar}
          src={person.member?.picture ?? ""}
          alt={person.member?.name ?? ""}
        >
          {person.member || person.email ? <PersonIcon /> : <HelpIcon />}
        </Avatar>
      </Tooltip>

      <div style={{ overflow: "hidden", flexGrow: 1 }}>
        <Typography variant="body2" noWrap className={classes.name}>
          {person.name}
        </Typography>
        <Typography style={{ opacity: 0.6, fontSize: 13, }} noWrap>
          {stringifyCreditDetails(person) || "-"}
        </Typography>
      </div>

      {showSplits && <SplitsWheel value={person.percentage_owned} />}
    </div>
  )
}
import { makeStyles } from '@material-ui/core/styles'
import { creditTypes } from '../../../../utils/creditsUtils'
import { Typography } from '@material-ui/core'
import { getTeamMember } from '../../../../utils/teamUtils'

const useStyles = makeStyles(theme => ({
  closeCredits: {
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    '&>div:nth-child(2)': {
      paddingLeft: 0,
    },
  },
  splits: {
    display: "flex",
    justifyContent: "center",
    width: 26,
    marginRight: 10,
  },
  right: {
    flexGrow: 1,
    paddingRight: 8,
    paddingLeft: 36,
    overflow: "hidden",
  },
  name: {
    fontWeight: 600,
    paddingRight: 4,
  },
  tags: {
    fontSize: 13,
  },
}))

export default function ClosedCredits({ team, tIndex, showSplits }) {
  const classes = useStyles()

  const { credit } = getTeamMember(team, tIndex)
  const types = getCreditTypes(showSplits)

  const tags = types.reduce((list, type) => [...list, ...credit[type]], [])

  return (
    <div className={classes.closeCredits}>
      {showSplits && (
        <div className={classes.splits}>
          {`${credit.percentage_owned}%`}
        </div>
      )}
      <div className={classes.right}>
        <Typography noWrap variant="body1" className={classes.name}>
          {credit.name}
        </Typography>
        <Typography noWrap variant="body2" className={classes.tags}>
          {tags.join(", ")}
        </Typography>
      </div>
    </div>
  )
}

const getCreditTypes = (showSplits) => {
  const types = [
    creditTypes.PLAYED,
    creditTypes.OTHERS,
  ]

  if (showSplits) {
    types.unshift(creditTypes.WROTE)
  }
  return types
}
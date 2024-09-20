import { makeStyles } from '@material-ui/core/styles'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import { Chip, Divider } from '@material-ui/core'
import Line from './Line'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16
  },
  chip: {
    '& .MuiChip-icon': {
      marginLeft: 8,
      fontSize: 14,
    }
  },
}))

export default function Discount() {
  const classes = useStyles()
  return (
    <Line divider>
      <Chip
        className={classes.chip}
        icon={<LocalOfferIcon fontSize="small" />}
        label="Beta Tester"
      />
      <div>25% off</div>
    </Line>
  )
}
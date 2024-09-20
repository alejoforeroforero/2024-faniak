import { makeStyles } from '@material-ui/core/styles'
import {
  Button
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { creditLabels } from '../../../../utils/creditsUtils'
import ChipButton from '../../../ChipButton'
import { getTeamMember } from '../../../../utils/teamUtils'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  button: {
    color: "#fff",
    padding: theme.spacing(0, 1),
    boxShadow: "none",
    margin: 2,
    textTransform: "none",
    borderRadius: 20,
    fontSize: 14,
    '&:hover': {
      boxShadow: "none",
    },
    '& .MuiButton-startIcon': {
      marginRight: 2,
    },
  },
}))

export default function CreditType({ creditType, tIndex, openAddCreditMenu, team, setTeam }) {
  const classes = useStyles()
  const { credit } = getTeamMember(team, tIndex)

  const specifics = credit[creditType]

  const removeValue = (index) => () => {
    setTeam(prev => {
      const { credit } = getTeamMember(prev, tIndex)
      credit.is_touched = true
      credit[creditType] = credit[creditType].filter((value, i) => i !== index)
      return { ...prev }
    })
  }

  const handleOpenMenu = openAddCreditMenu({
    creditType: creditType,
    tIndex: tIndex,
  })

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        onClick={handleOpenMenu}
        // onBlur={handleAddCredit}
        startIcon={<AddIcon />}
      >
        {creditLabels[creditType]}
      </Button>
      {specifics.map((elem, index) => (
        <ChipButton
          key={index}
          value={elem}
          onClick={removeValue(index)}
        />
      ))}
    </div>
  )
}
import { makeStyles } from '@material-ui/core/styles'
import InputPercentageOwned from './InputPercentageOwned'
import InputName from './InputName'
import CreditType from './CreditType'
import { creditTypes } from '../../../../utils/creditsUtils'
import { IconButton, Tooltip } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import { removeCredit } from '../../../../utils/teamUtils'

const useStyles = makeStyles(theme => ({
  openCredits: {
    paddingTop: 8,
    marginBottom: 16,
    display: "flex",
    flexGrow: 1,
  },
  splitsInput: {
    marginLeft: 16,
    width: 144,
    flexShrink: 0,
  },
  creditsHeader: {
    display: "flex",
    marginBottom: 12,
  },
  credits: {
    flexGrow: 1,
    marginLeft: 10,
  },
  flexGrow: {
    flexGrow: 1,
  },
  deleteButton: {
    marginLeft: -3,
    paddingTop: 3,
  },
}))

export default function OpenCredits({ team, setTeam, tIndex, openAddCreditMenu, showSplits }) {
  const classes = useStyles()

  const types = getCreditTypes(showSplits)

  const handleRemove = () => {
    setTeam(prev => {
      removeCredit(prev, tIndex)
      return { ...prev }
    })
  }

  return (
    <div className={classes.openCredits}>
      <div className={classes.deleteButton}>
        <Tooltip title="Remove credits">
          <div>
            <IconButton
              tabIndex={-1}
              color="primary"
              size="small"
              onClick={handleRemove}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </div>
        </Tooltip>
      </div>

      <div className={classes.credits}>
        <div className={classes.creditsHeader}>
          <InputName
            team={team}
            setTeam={setTeam}
            tIndex={tIndex}
          />
          {showSplits && (
            <div className={classes.splitsInput}>
              <InputPercentageOwned
                team={team}
                setTeam={setTeam}
                tIndex={tIndex}
              />
            </div>
          )}
        </div>
        {types.map((type, index) => (
          <CreditType
            key={index}
            showSplits={showSplits}
            team={team}
            setTeam={setTeam}
            creditType={type}
            tIndex={tIndex}
            openAddCreditMenu={openAddCreditMenu}
          />
        ))}
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
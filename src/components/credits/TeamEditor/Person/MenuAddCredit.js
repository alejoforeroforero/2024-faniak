import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Popover,
} from '@material-ui/core'
import { getInitialMenuState } from '../../../BaseMenu'
import { creditLabels, creditValues } from '../../../../utils/creditsUtils'
import ChipButton from '../../../ChipButton'
import CheckIcon from '@material-ui/icons/Check'
import BaseSearchField, { searchResultTypes } from '../../../BaseSearchField'
import { getTeamMember } from '../../../../utils/teamUtils'

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const trimCredit = (s) => capitalize(s.trim())

export default function MenuAddCredit(props) {
  if (props.menuState.mouseY == null) return null
  return <Element {...props} />
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: 16,
    width: 320,
    height: 352,
    overflow: "visible",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    flexGrow: 1,
  },
  button: {
    margin: -8,
  },
  chips: {
    marginTop: 8,
    marginBottom: 16,
  },
}))

function Element({
  menuState,
  setMenuState,
  team,
  setTeam,
  tIndex,
  creditType,
}) {
  const classes = useStyles()
  const { credit } = getTeamMember(team, tIndex)

  const label = creditLabels[creditType]
  const specifics = credit[creditType]

  const handleClose = (event) => {
    if (event) event.stopPropagation()
    setMenuState(getInitialMenuState())
  }

  const addCredit = (value) => {
    const processed_value = capitalize(value.trim())

    setTeam(prev => {
      const { credit } = getTeamMember(prev, tIndex)
      if (credit[creditType].includes(processed_value)) return prev
      credit[creditType].push(processed_value)
      credit.is_touched = true
      return { ...prev }
    })
  }

  const removeCredit = (index) => () => {
    setTeam(prev => {
      const { credit } = getTeamMember(prev, tIndex)
      const section = credit[creditType]
        .filter((credit, i) => i !== index)
      credit.is_touched = true
      credit[creditType] = section
      return { ...prev }
    })
  }

  const fetchResults = async (string) => {
    const results = creditValues[creditType]
      .filter(option => {
        const _option = option.toLowerCase()
        const _string = string.trim().toLowerCase()
        return _option !== _string && _option.includes(_string)
      })
      .map(value => ({
        type: searchResultTypes.ACTION,
        data: { label: value },
        selectData: () => addCredit(value),
      }))

    if (string) {
      results.unshift({
        type: searchResultTypes.ACTION,
        data: { label: trimCredit(string) },
        selectData: () => addCredit(trimCredit(string)),
      })
    }

    return results
  }

  return (
    <Popover
      open
      onClick={stopPropagation}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: menuState.mouseY, left: menuState.mouseX }}
      classes={{ paper: classes.paper }}
    >
      <div className={classes.header}>
        <div className={classes.title}>
          {`${credit.name} ${label !== "Other" ? label.toLowerCase() : "contributed as a"}...`}
        </div>
        <div className={classes.button}>
          <IconButton color="primary" size="small" onClick={handleClose}>
            <CheckIcon />
          </IconButton>
        </div>
      </div>
      <div className={classes.chips}>
        {specifics.map((elem, index) => (
          <ChipButton key={index} value={elem} onClick={removeCredit(index)} />
        ))}
      </div>
      <BaseSearchField
        autoFocus
        delay={0}
        fetchResults={fetchResults}
      />
    </Popover>
  )
}

const stopPropagation = (e) => e.stopPropagation()
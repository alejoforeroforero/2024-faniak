import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import Person from './Person'
import SearchMembers from './SearchMembers'
import { getInitialMenuState, getOpenMenuHandler } from '../../BaseMenu'
import MenuAddCredit from './Person/MenuAddCredit'
import SplitsWheel from '../SplitsWheel'
import { addAttendee, addCredit, addPermission } from '../../../utils/teamUtils'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 172,
  },
  splits: {
    display: "flex",
    alignItems: "center",
    '& > div': {
      paddingLeft: 12,
      display: "flex",
      alignItems: "center"
    },
  },
}))

export default function TeamEditor({ team, setTeam, showSplits, fileMode, disableCredits, canEditPermissions }) {
  const classes = useStyles()

  const [addCreditMenu, setAddCreditMenu] = useState(getInitialMenuState())
  const [addCreditInput, setAddCreditInput] = useState({
    tIndex: 0,
    creditType: "",
  })

  const openAddCreditMenu = (newState) => (event) => {
    setAddCreditInput(newState)
    getOpenMenuHandler(setAddCreditMenu)(event)
  }

  const addPerson = async (person) => {
    setTeam(prev => {
      if (person.email) {
        if (fileMode) {
          addPermission(prev, {
            emailAddress: person.email ?? "",
            role: "reader",
            type: "user",
            displayName: person.name || "",
            photoLink: person.picture || "",
          })
        } else {
          addAttendee(prev, {
            email: person.email ?? "",
          })
        }
      } else {
        addCredit(prev, {
          name: person.name || "",
          is_open: true,
        })
      }
      return { ...prev }
    })
  }

  const total_splits = team.credits.reduce((total, credit) => {
    if (credit.is_deleted) return total
    return total + (parseInt(credit.percentage_owned) || 0)
  }, 0)

  return (
    <div className={classes.root}>
      <Box pb={2} display="flex" justifyContent="space-between">
        <Box width={360}>
          <SearchMembers
            submitMember={addPerson}
            allowName={!disableCredits}
          />
        </Box>

        {!disableCredits && showSplits && (
          <div className={classes.splits}>
            <div>Total Splits</div>
            <div>
              <SplitsWheel
                value={total_splits}
                color={total_splits === 100 ? "primary" : "secondary"}
                style={total_splits === 100 ? null : splitsWheelStyle}
              />
            </div>
          </div>
        )}
      </Box>
      {!!team.indexes.length && (
        <div className={classes.card} variant="outlined">
          {team.indexes.map((person, i) => (
            <Person
              key={i}
              fileMode={fileMode}
              disableCredits={disableCredits}
              team={team}
              setTeam={setTeam}
              tIndex={i}
              showSplits={showSplits}
              openAddCreditMenu={openAddCreditMenu}
              canEditPermissions={canEditPermissions}
            />
          ))}
        </div>
      )}

      <MenuAddCredit
        menuState={addCreditMenu}
        setMenuState={setAddCreditMenu}
        team={team}
        setTeam={setTeam}
        tIndex={addCreditInput.tIndex}
        creditType={addCreditInput.creditType}
      />
    </div>
  )
}

const splitsWheelStyle = { opacity: 0.5 }
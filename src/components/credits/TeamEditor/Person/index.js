import { makeStyles } from '@material-ui/core/styles'
import Header from './Header'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { getMemberByEmail } from '../../../../api/member/getMemberByEmail'
import EditIcon from '@material-ui/icons/Edit'
import OpenCredits from './OpenCredits'
import ClosedCredits from './ClosedCredits'
import { addCredit, getTeamMember } from '../../../../utils/teamUtils'

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 4,
    padding: 8,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  permission: {
    display: "flex",
    alignItems: "center",
    minHeight: 40,
  },
  flexGrow: {
    flexGrow: 1,
  },
}))

export default function Person({
  team,
  setTeam,
  tIndex,
  openAddCreditMenu,
  showSplits,
  fileMode,
  disableCredits,
  canEditPermissions,
}) {
  const classes = useStyles()
  const { credit, email } = getTeamMember(team, tIndex)

  const addCredits = async () => {
    const member = await getMemberByEmail({ email: email })
      .then(res => {
        if (res.error) return null
        return res.member
      })

    setTeam(prev => {
      addCredit(prev, {
        email: email,
        member: member,
        name: member?.artistic_name || member?.name || "",
        played: member?.default_credits.played ?? [],
        wrote: member?.default_credits.wrote ?? [],
        others: member?.default_credits.others ?? [],
        is_open: true,
      })
      return { ...prev }
    })
  }

  const openCredits = () => {
    setTeam(prev => {
      const { credit } = getTeamMember(prev, tIndex)
      credit.is_open = true
      return { ...prev }
    })
  }

  return (
    <div className={classes.root}>
      <div className={classes.permission}>
        <Header
          fileMode={fileMode}
          team={team}
          setTeam={setTeam}
          tIndex={tIndex}
          canEditPermissions={canEditPermissions}
        />

        <div className={classes.flexGrow} />

        {!disableCredits && !credit && (
          <Button
            size="small"
            color="primary"
            startIcon={<AddIcon />}
            onClick={addCredits}
          >
            Add credits
          </Button>
        )}

        {Boolean(!disableCredits && credit && !credit.is_open) && (
          <Button
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={openCredits}
          >
            Edit credits
          </Button>
        )}
      </div>

      {Boolean(!disableCredits && credit) && (
        credit.is_open ? (
          <OpenCredits
            team={team}
            setTeam={setTeam}
            tIndex={tIndex}
            showSplits={showSplits}
            openAddCreditMenu={openAddCreditMenu}
          />
        ) : (
          <ClosedCredits
            team={team}
            tIndex={tIndex}
            showSplits={showSplits}
          />
        )
      )}
    </div>
  )
}
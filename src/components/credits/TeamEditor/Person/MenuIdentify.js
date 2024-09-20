import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Popover,
} from '@material-ui/core'
import { getInitialMenuState } from '../../../BaseMenu'
import CloseIcon from '@material-ui/icons/Close'
import { getMemberByEmail } from '../../../../api/member/getMemberByEmail'
import SearchMembers from '../SearchMembers'
import { mergeArrays } from '../../../../utils/utils'
import { getTeamMember } from '../../../../utils/teamUtils'

export default function MenuIdentify(props) {
  if (props.menuState.mouseY == null) return null
  return <Element {...props} />
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: 16,
    width: 420,
    height: 352,
    overflow: "visible",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    flexGrow: 1,
  },
  button: {
    margin: -8,
  },
}))

function Element({
  menuState,
  setMenuState,
  team,
  setTeam,
  tIndex,
}) {
  const classes = useStyles()

  const handleClose = (event) => {
    if (event) event.stopPropagation()
    setMenuState(getInitialMenuState())
  }

  const submitMember = async (person) => {
    const member = await getMemberByEmail({ email: person.email ?? "" })
      .then(res => {
        if (res.error) return null
        return res.member
      })

    handleClose()

    setTeam(prev => {
      const { credit } = getTeamMember(prev, tIndex)

      const duplicatedIndex = prev.indexes.findIndex(indexing => person.email === indexing.email)

      if (duplicatedIndex !== -1) {
        const { credit: dCredit } = getTeamMember(prev, duplicatedIndex)

        if (dCredit) {
          // merge the current person's credits into the duplicated person
          dCredit.is_touched = true
          dCredit.percentage_owned = dCredit.percentage_owned || credit.percentage_owned
          dCredit.played = mergeArrays(dCredit.played, credit.played)
          dCredit.wrote = mergeArrays(dCredit.wrote, credit.wrote)
          dCredit.others = mergeArrays(dCredit.others, credit.others)
        } else {
          // change the credit's location in the indexing list
          prev.indexes[duplicatedIndex].credit = prev.indexes[tIndex].credit
        }
        // delete the previous indexing item, since it is now empty
        prev.indexes = prev.indexes.filter((c, i) => i !== tIndex)
      }

      else {
        prev.indexes[tIndex].email = person.email
        credit.member = member
        credit.email = person.email
        credit.is_touched = true
        credit.update_identity = true
      }

      return { ...prev }
    })
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
        <div className={classes.label}>
          Find them in your contacts
        </div>
        <div className={classes.button}>
          <IconButton color="primary" size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <SearchMembers submitMember={submitMember} />
    </Popover>
  )
}

const stopPropagation = (e) => e.stopPropagation()
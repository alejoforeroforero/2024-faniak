import { useState } from 'react';
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import { getInitialMenuState, getOpenMenuHandler } from '../../../BaseMenu'
import MenuEditCredits from './MenuEditCredits'

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 12,
    paddingRight: 8,
    display: "flex",
    alignItems: "center",
    height: 30,
    fontSize: 13,
    '& .MuiIconButton-root': {
      display: "none",
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
  label: {
    fontWeight: 600,
    paddingRight: 8,
    minWidth: 100,
    maxWidth: 100,
  },
  list: {
    flexGrow: 1,
  },
}))

export default function CreditsList({ label, default_credits, type, setMember }) {
  const list = default_credits[type]
  const classes = useStyles()
  const [menu, setMenu] = useState(getInitialMenuState())

  const handleOpenMenu = getOpenMenuHandler(setMenu)

  return (
    <div className={classes.root}>
      <div className={classes.label}>{label}</div>
      <div className={classes.list}>
        {list.join(", ") || "-"}
      </div>
      <IconButton onClick={handleOpenMenu} color="primary" size="small">
        <EditIcon fontSize="small" />
      </IconButton>

      <MenuEditCredits
        menuState={menu}
        setMenuState={setMenu}
        default_credits={default_credits}
        setMember={setMember}
        section_key={type}
      />
    </div>
  )
}
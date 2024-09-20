import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Box, Breadcrumbs as MuiBreadcrumbs } from '@material-ui/core'
import { StateContext } from '../../store'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Breadcrumb from './Breadcrumb'
import Current from './Current'
import { routes } from '../../Routes'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  breadcrumbs: {
    marginLeft: -8,
    '& .MuiBreadcrumbs-separator': {
      marginLeft: 0,
      marginRight: 0,
    }
  },
}))

// actions -> actions to display when the last element is clicked
//    [{icon, label, handleClick}, {icon, label, handleClick}]

export default function Breadcrumbs({ handleOpenOptionsMenu, currentFolder, setCurrentFolder }) {
  const state = useContext(StateContext)
  const classes = useStyles()

  if (!state.user) return null

  const home_id = state.user.google_root_folder_id

  const folder = setCurrentFolder ? currentFolder : state.curr_folder

  let parent_crumb = null
  let current_crumb = null

  if (folder && folder.id !== home_id) {

    if (folder.parents?.length && folder.parents[0] !== home_id) {
      parent_crumb = <Breadcrumb
        id={folder.parents[0]}
        to={routes.folder(folder.parents[0])}
        setCurrentFolder={setCurrentFolder}
      />
    }

    current_crumb = <Current
      text={folder.name}
      onClick={handleOpenOptionsMenu}
    />
  }

  return (
    <div className={classes.root}>
      <MuiBreadcrumbs className={classes.breadcrumbs} separator={<NavigateNextIcon />}>
        <Breadcrumb
          id={home_id}
          to={routes.home()}
          text={"My Music Drive"}
          setCurrentFolder={setCurrentFolder}
        />
        {parent_crumb}
        {current_crumb}
      </MuiBreadcrumbs>

      <Box flexGrow={1} />
    </div>
  )
}
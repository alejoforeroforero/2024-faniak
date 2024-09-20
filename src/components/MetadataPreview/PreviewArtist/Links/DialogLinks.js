import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
  DialogContent,
  Button,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import MenuAddLink from './MenuAddLink'
import ContainedButton from '../../../ContainedButton'
import BaseDialogActions from '../../../BaseDialogActions'
import BaseDialogTitle from '../../../BaseDialogTitle'
import { updateFolder } from '../../../../api/folder/update'
import BaseDialog from '../../../BaseDialog'
import { linkTypes } from '../../../../dictionary/links'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  icon: {
    padding: "4px 4px 4px 8px",
    fontSize: theme.spacing(4),
    width: theme.spacing(5),
  },
  divider: {
    height: 28,
    margin: 4,
  },
  button: {
    height: 38,
  },
  iconButton: {
    padding: 8,
  },
}))

export default function DialogLinks({ handleClose, initial, folder, fetchContent }) {
  const [links, setLinks] = useState(initial)

  const [menuAnchor, setMenuAnchor] = useState({
    mouseX: null,
    mouseY: null,
  })

  const classes = useStyles()

  const handleOpenMenu = (event) => {
    setMenuAnchor({
      mouseX: event.clientX,
      mouseY: event.clientY,
    })
  }

  const handleRemoveLink = (name) => () => {
    setLinks(prev => prev.filter(link => link.name !== name))
  }

  const handleChangeLink = (name) => (event) => {
    const { value } = event.target

    setLinks(prev => prev.map(
      link => link.name === name ? { ...link, link: value } : link
    ))
  }

  const handleSave = () => {
    updateFolder({
      folder_id: folder.id,
      data: {
        social_networks: links.filter(item => item.link.trim())
      }
    })
      .then(data => {
        if (data.error) return

        fetchContent()
        handleClose()
      })
  }

  return (
    <BaseDialog maxWidth="sm">
      <BaseDialogTitle handleClose={handleClose}>
        Edit Your Links
      </BaseDialogTitle>

      <DialogContent>
        {
          links.map(link => {
            const dict_info = linkTypes[link.name]

            return (
              <Paper
                key={link.name}
                className={classes.root}
                variant="outlined"
              >
                <dict_info.icon className={classes.icon} />

                <InputBase
                  defaultValue={link.link}
                  className={classes.input}
                  onChange={handleChangeLink(link.name)}
                  placeholder="Paste your URL"
                />
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton
                  color="primary"
                  className={classes.iconButton}
                  onClick={handleRemoveLink(link.name)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Paper>
            )
          })}

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          className={classes.button}
          onClick={handleOpenMenu}
        >
          Add Link
        </Button>

        {
          menuAnchor.mouseY == null ? null : (
            <MenuAddLink
              linksState={[links, setLinks]}
              menuAnchorState={[menuAnchor, setMenuAnchor]}
            />
          )
        }

      </DialogContent>

      <BaseDialogActions>
        <ContainedButton onClick={handleSave}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}
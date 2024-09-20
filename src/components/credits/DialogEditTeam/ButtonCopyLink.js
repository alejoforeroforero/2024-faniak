import { useState } from 'react';
import { Link } from '@material-ui/core'
import ContainedButton from '../../ContainedButton'
import LinkIcon from '@material-ui/icons/Link'
import { routes } from '../../../Routes'
import { getBaseUrl } from '../../../utils/utils'
import { createPermission } from '../../../api/drive/createPermission'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import MenuLinkPermissions from './MenuLinkPermissions'
import { updatePermission } from '../../../api/drive/updatePermission'
import { deletePermission } from '../../../api/drive/deletePermission'
import { getId, getTargetFile, googlePermissionLabels } from '../../../api/google/store'
import { setFileIsShared } from '../../../utils/fileUtils'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    fontSize: 13,
    marginLeft: 24,
    '& .MuiSvgIcon-root': {
      fontSize: 14,
      marginTop: -2,
      marginBottom: -2,
      marginleft: 4,
    },
    '& .MuiLink-root': {
      textTransform: "uppercase",
      '&:hover': {
        cursor: "pointer",
      },
    },
  },
}))

const getInitialPermission = (file) => {
  if (!file.permissions) return null
  const permission = file.permissions.find(p => p.id === "anyoneWithLink")
  return permission ?? null
}

export default function ButtonCopyLink({ enqueueSnackbar, file, canEditPermissions }) {
  const [permission, setPermission] = useState(() => getInitialPermission(getTargetFile(file)))
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

  const [menuAnchor, setMenuAnchor] = useState(null)
  const handleOpenMenu = (event) => setMenuAnchor(event.currentTarget)
  const handleCloseMenu = () => setMenuAnchor(null)

  const handleClickCopy = () => {
    const link = getBaseUrl() + routes.folder(getId(file)) + "?usp=sharing"
    navigator.clipboard.writeText(link)

    enqueueSnackbar("Link copied", { variant: "success" })

    setFileIsShared(getTargetFile(file))

    if (!permission && canEditPermissions) {
      setLoading(true)
      createPermission({
        fileId: getId(file),
        role: "reader",
        type: "anyone",
      }).then(res => {
        setLoading(false)
        if (res.error) {
          enqueueSnackbar("We were unable to update this file's permissions.", { variant: "error" })
          return
        }
        setPermission(res.permission)
      })
    }
  }

  const handleChangeRole = (role) => (event) => {
    if (role) {
      updatePermission({
        fileId: getId(file),
        id: permission.id,
        role: role,
      }).then(res => {
        if (res.error) return
        setPermission(res.permission)
        enqueueSnackbar("Access updated", { variant: "success" })
      })
    } else {
      deletePermission({
        fileId: getId(file),
        id: permission.id,
      }).then(res => {
        if (res.error) return
        setPermission(null)
        enqueueSnackbar("Access updated", { variant: "success" })
      })
    }
    handleCloseMenu()
  }

  return (
    <div className={classes.root}>
      <ContainedButton
        loading={loading}
        startIcon={<LinkIcon />}
        onClick={handleClickCopy}
      >
        Copy link
      </ContainedButton>
      {!!permission && (
        <div className={classes.options}>
          <span>Anyone with the link has</span>
          <Link
            onClick={handleOpenMenu}
            component="span"
            color="primary"
          >
            {googlePermissionLabels[permission.role]} access
            <ExpandMoreIcon />
          </Link>
        </div>
      )}
      {!!menuAnchor && (
        <MenuLinkPermissions
          anchorEl={menuAnchor}
          handleClose={handleCloseMenu}
          permission={permission}
          handleChangeRole={handleChangeRole}
        />
      )}
    </div>
  )
}

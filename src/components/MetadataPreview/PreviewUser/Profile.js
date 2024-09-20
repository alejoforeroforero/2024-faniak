import { useContext, useRef } from 'react';
import { DispatchContext } from '../../../store'
import { Avatar, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { FOLDER_WIDTH } from '../../FileSystem'
import { stringifyCreditDetails } from '../../../utils/creditsUtils'
import Skeleton from '@material-ui/lab/Skeleton'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import FileInput from '../../FileInput'
import { setProfilePicture } from '../../../api/member/setProfilePicture'
import { avatarProps } from '../../baseProps'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
    height: FOLDER_WIDTH,
    width: FOLDER_WIDTH,
    flexShrink: 0,
  },
  avatar: {
    height: "100%",
    width: "100%",
  },
  content: {
    paddingLeft: 12,
    overflow: "hidden",
    flexGrow: 1
  },
  iconButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 8,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))

export default function Profile({ member, picture, fetchUser }) {
  const dispatch = useContext(DispatchContext)
  const classes = useStyles()
  const inputEl = useRef()

  const handleOpenFileSelection = (e) => {
    inputEl.current.click()
  }

  function handleSelectFile(event) {
    const { files } = event.target

    uploadFiles(files)
  }

  const uploadFiles = (files) => {
    if (files.length) {

      const [file] = files

      setProfilePicture({ file }, dispatch)
        .then((data) => {
          if (data.error) return

          fetchUser()
        })
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.avatarWrapper}>
        <Avatar
          {...avatarProps}
          className={classes.avatar}
          src={picture}
        />
        <IconButton
          className={classes.iconButton}
          color="secondary"
          onClick={handleOpenFileSelection}
        >
          <PhotoCameraIcon fontSize="small" />
        </IconButton>
      </div>

      <div className={classes.content}>
        {member ? (
          <Typography style={{ fontSize: 20 }} noWrap>
            {member.artistic_name || member.name}
          </Typography>
        ) : <Skeleton variant="text" />}

        {member ? (
          <div style={{ fontSize: 13, opacity: 0.75 }}>
            {stringifyCreditDetails(member.default_credits) || "Unknown skill set"}
          </div>
        ) : <Skeleton variant="text" />}
      </div>
      <FileInput
        inputRef={inputEl}
        onChange={handleSelectFile}
        accept="image/*"
      />
    </div>
  )
}
import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { DispatchContext, StateContext } from '../../../../store'
import {
  Avatar,
  CardActionArea,
} from '@material-ui/core'
import { setProfilePicture } from '../../../../api/member/setProfilePicture'
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter'
import Dropzone from '../../../Dropzone'

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(6.5),
    height: theme.spacing(6.5),
  },
}))

export default function Picture({ fetchUser }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const classes = useStyles()

  const uploadFiles = (files) => {
    if (files.length) {

      const [file] = files

      setProfilePicture({ file, key: "business_picture" }, dispatch)
        .then((data) => {
          if (data.error) return

          fetchUser()
        })
    }
  }

  return (
    <div>
      <CardActionArea>
        <Dropzone
          mimeType="image/*"
          onDrop={uploadFiles}
          enableClick
        >
          <Avatar
            variant="square"
            src={state.user.business_picture}
            alt=""
            className={classes.avatar}
          >
            <BusinessCenterIcon />
          </Avatar>
        </Dropzone>
      </CardActionArea>
    </div>
  )
}
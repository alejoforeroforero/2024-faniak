import { useContext, useState } from 'react';
import {
  DialogContent,
} from '@material-ui/core'
import ContainedButton from '../../ContainedButton'
import BaseDialogActions from '../../BaseDialogActions'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import submit from './submit'
import { DispatchContext, StateContext } from '../../../store'
import BaseDialogTitle from '../../BaseDialogTitle'
import BaseDialog from '../../BaseDialog'
import { useSnackbar } from 'notistack'
import TeamEditor from '../../credits/TeamEditor'
import { googlePermissionRoles } from '../../../api/google/store'
import { buildPermission, zipTeam } from '../../../utils/teamUtils'

export default function DialogAddAlbum({ handleClose, callback, parent_id }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const [currentStep, setCurrentStep] = useState(0)
  const [tracklist, setTracklist] = useState([])
  const [uploadFiles, setUploadFiles] = useState(true)
  const [album, setAlbum] = useState({ title: "" })
  const [team, setTeam] = useState(() => buildInitialTeam(state))
  const [submitting, setSubmitting] = useState(false)

  const handleSkip = () => setCurrentStep(currentStep + 1)

  const fillInMetadata = ({ album, songs }) => {
    setAlbum(prev => ({
      ...prev,
      ...album,
      title: prev.title || album.title
    }))

    setTracklist(songs)

    handleSkip()
  }

  const handleSubmit = () => {
    setSubmitting(true)
    submit({
      album,
      tracklist,
      upload_files: uploadFiles,
      credits: team.credits,
      permissions: team.permissions,
      parent_id,
      dispatch
    })
      .then(() => {
        setSubmitting(false)
        enqueueSnackbar("Album saved!", { variant: "success" })
        handleClose()
        callback?.()
      })
  }

  return (
    <BaseDialog maxWidth={currentStep == 2 ? "md" : "xs"}>
      <BaseDialogTitle handleClose={handleClose}>
        {getCurrentStepTitle(currentStep)}
      </BaseDialogTitle>

      <DialogContent>
        {currentStep === 0 && (
          <StepOne
            callback={callback}
            parent_id={parent_id}
            setAlbum={setAlbum}
            onDrop={fillInMetadata}
            handleSkip={handleSkip}
            handleClose={handleClose}
          />
        )}
        {currentStep === 1 && (
          <StepTwo
            callback={handleSkip}
            tracklist={tracklist} setTracklist={setTracklist}
            uploadFiles={uploadFiles} setUploadFiles={setUploadFiles}
            album={album} setAlbum={setAlbum}
          />
        )}
        {currentStep === 2 && (
          <TeamEditor
            fileMode
            showSplits
            canEditPermissions
            team={team}
            setTeam={setTeam}
          />
        )}
      </DialogContent >

      <BaseDialogActions>
        {currentStep === 0 && (
          <ContainedButton onClick={handleSkip}>Skip</ContainedButton>
        )}
        {currentStep === 1 && (
          <ContainedButton type="submit" form="addAlbum" disabled={!album.title}>
            Continue
          </ContainedButton>
        )}
        {currentStep === 2 && (
          <ContainedButton onClick={handleSubmit} loading={submitting}>
            {team.credits.length ? "Create Album & Tracks" : "Skip Credits & Finish"}
          </ContainedButton>
        )}
      </BaseDialogActions>
    </BaseDialog >
  )
}

const getCurrentStepTitle = (currentStep) => {
  switch (currentStep) {
    case 0: return "Create album"
    case 1: return "Add titles and artwork?"
    case 2: return "Add credits?"
    default: return null
  }
}

const buildPermissionFromUser = (user) => buildPermission({
  emailAddress: user.email,
  role: googlePermissionRoles.OWNER,
  displayName: user.name,
  photoLink: user.picture,
})

const buildInitialTeam = (state) => zipTeam({
  permissions: [buildPermissionFromUser(state.user)]
})
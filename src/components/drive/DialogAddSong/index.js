import { useState, useContext } from 'react';
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

const initialSongState = {
  title: "",
  submitted_file: false,
  upload_file: true
}

export default function DialogAddSong({ handleClose, callback, parent_id }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [currentStep, setCurrentStep] = useState(0)
  const [song, setSong] = useState(initialSongState)
  const [team, setTeam] = useState(() => buildInitialTeam(state))
  const [submitting, setSubmitting] = useState(false)

  const handleSkip = () => setCurrentStep(currentStep + 1)

  const fillInMetadata = ({ songs }) => {
    const [song] = songs
    setSong(prev => ({ ...prev, ...song, submitted_file: Boolean(song) }))
    handleSkip()
  }

  const handleSubmit = () => {
    setSubmitting(true)
    submit({
      song,
      credits: team.credits,
      permissions: team.permissions,
      parent_id,
      dispatch
    })
      .then(song_id => {
        setSubmitting(false)
        handleClose()
        enqueueSnackbar("Song saved!", { variant: "success" })
        return callback?.(song_id)
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
            setSong={setSong}
            onDrop={fillInMetadata}
            handleSkip={handleSkip}
            handleClose={handleClose}
          />
        )}
        {currentStep === 1 && (
          <StepTwo
            callback={handleSkip}
            songState={[song, setSong]}
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
      </DialogContent>

      <BaseDialogActions>
        {currentStep === 0 && (
          <ContainedButton onClick={handleSkip}>Skip</ContainedButton>
        )}
        {currentStep === 1 && (
          <ContainedButton type="submit" form="addUnsorted" disabled={!song.title}>
            Continue
          </ContainedButton>
        )}
        {currentStep === 2 && (
          <ContainedButton onClick={handleSubmit} loading={submitting}>
            {team.credits.length ? "Finish" : "Skip Credits & Finish"}
          </ContainedButton>
        )}
      </BaseDialogActions>
    </BaseDialog >
  )
}

const getCurrentStepTitle = (currentStep) => {
  switch (currentStep) {
    case 0: return "Import Song Metadata?"
    case 1: return "Add Song Title"
    case 2: return "Add Song Credits?"
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
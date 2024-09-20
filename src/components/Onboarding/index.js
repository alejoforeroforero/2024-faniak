import { useContext, useEffect } from 'react';
import { DispatchContext, ENABLE_ONBOARDING, StateContext } from '../../store'
import Welcome from './steps/Welcome'
import RightClickFolder from './steps/RightClickFolder'
import MagicSync from './steps/MagicSync'
import { updateMember } from '../../api/member/update'

export const onboardingIndexes = {
  WELCOME: 0,
  CREATE_SMART_FOLDER: 1,
  // OPEN_METADATA_PREVIEW: 3,
  CONNECTIONS: 4,
  RIGHT_CLICK_FOLDER: 6,
  MAGIC_SYNC: 8,
  ACCOUNT_SETTINGS: 10,
}

export const onboardingEvents = {
  IMPORT_METADATA: [2],
  LOAD_FILE_SYSTEM: [5, 7, 9],
}

// for steps that got removed over time
const skipList = [3]

export const skipOnboarding = (dispatch, steps = []) => {
  dispatch({
    type: "UPDATE", set: (prev) => {
      if (!steps.length || steps.includes(prev.user.onboarding_step)) {
        prev.user.onboarding_step++

        updateMember({ onboarding_step: prev.user.onboarding_step })
          .catch(console.log)

        return { ...prev }
      }

      return prev
    }
  })
}

export default function Onboarding() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    if (skipList.includes(state.user.onboarding_step)) {
      skipOnboarding(dispatch)
    }
  }, [state.user.onboarding_step])

  if (!ENABLE_ONBOARDING) return null

  const skip = () => skipOnboarding(dispatch)

  switch (state.user.onboarding_step) {
    case onboardingIndexes.WELCOME: return <Welcome skip={skip} />
    case onboardingIndexes.RIGHT_CLICK_FOLDER: return <RightClickFolder skip={skip} />
    case onboardingIndexes.MAGIC_SYNC: return <MagicSync skip={skip} />
    default: return null
  }
}
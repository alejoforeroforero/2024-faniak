
import { createCredit } from '../api/credit/create'
import { updateCredit } from '../api/credit/update'
import { getFolderCredits } from '../api/drive/getFolderCredits'
import instruments from '../dictionary/avs/instruments.json'
import { mergeArrays } from './utils'

export const creditTypes = {
  WROTE: "wrote",
  PLAYED: "played",
  OTHERS: "others",
}

export const creditLabels = {
  [creditTypes.WROTE]: "Wrote",
  [creditTypes.PLAYED]: "Played",
  [creditTypes.OTHERS]: "Other",
}

export const creditValues = {
  [creditTypes.WROTE]: [
    "Lyrics",
    "Song",
  ],
  [creditTypes.PLAYED]: instruments,
  [creditTypes.OTHERS]: [
    "Arranger",
    "Artwork Designer",
    "Assistant Engineer",
    "Booking Agent",
    "Co-Producer",
    "Executive Producer",
    "Manager",
    "Mastering Engineer",
    "Mixing Engineer",
    "Overdub Engineer",
    "Producer",
    "Project Engineer",
    "Promoter",
    "Publisher",
    "Recording Engineer",
    "Remixing Engineer",
    "Sound Designer",
    "Sound Engineer",
    "String Engineer",
    "Tonmeister",
    "Tracking Engineer",
  ],
}

export function stringifyCreditDetails(details) {
  let prepend = ""
  const roles = []

  for (let [key, value] of Object.entries(details)) {
    if (!value?.length) continue
    switch (key) {
      case 'wrote': roles.push("Songwriter"); break;
      case 'played': roles.push("Musician"); break;
      case 'others': roles.push(value.join(", ")); break;
      default: break;
    }
  }

  return prepend + roles.join(", ")
}

// not working for smart events
export async function mergeCreditsIntoFolder(credits, folder) {
  await getFolderCredits({ folder_id: folder.id })
    .then(data => {
      if (data.error) return

      for (const person of credits) {
        const duplicate = data.credits.find(item => {
          if (item.member && item.member.id === person.member?.id) return true
          if (item.email && item.email === person.email) return true
          return item.name === person.name
        })

        if (duplicate) {
          updateCredit({
            ...person,
            folder_id: folder.id,
            id: duplicate.id,
            [creditTypes.WROTE]: mergeArrays(person[creditTypes.WROTE], duplicate[creditTypes.WROTE]),
            [creditTypes.PLAYED]: mergeArrays(person[creditTypes.PLAYED], duplicate[creditTypes.PLAYED]),
            [creditTypes.OTHERS]: mergeArrays(person[creditTypes.OTHERS], duplicate[creditTypes.OTHERS]),
          }, { updateIdentity: true })
        } else {
          createCredit({ folder_id: folder.id, ...person })
        }
      }
    })
}
import { createContext } from 'react'
export const StateContext = createContext({})
export const DispatchContext = createContext({})

const DEVELOPMENT = window.location.hostname === 'localhost'
const STAGING = window.location.hostname === 'faniak-development.herokuapp.com'

export const PREVIEW_WIDTH = 334
export const NAVBAR_WIDTH = 64

const S3_BUCKET = STAGING
  ? "https://faniak-development-static.s3.amazonaws.com"
  : "https://faniak-static.s3.amazonaws.com"
export const STATIC_URL = DEVELOPMENT ? "/static" : `${S3_BUCKET}/static`
export const SERVICE_LOGOS_PATH = `${STATIC_URL}/app/public/services/`

export const ENABLE_SENTRY = !DEVELOPMENT
export const ENABLE_ONBOARDING = !true

export const DRIVE_UPGRADE_URL = "https://one.google.com/about/plans"

export const CHROME_EXTENSION_URL = "https://chrome.google.com/webstore/detail/faniak-magic-sync/knpbhdlnobamacijbipcaclpbhkenmhh"
export const CHROME_EXTENSION_ID = "knpbhdlnobamacijbipcaclpbhkenmhh"

export const GOOGLE_SCOPES = {
  DRIVE: "https://www.googleapis.com/auth/drive",
  CONTACTS: "https://www.googleapis.com/auth/contacts",
  OTHER_CONTACTS: "https://www.googleapis.com/auth/contacts.other.readonly",
  DIRECTORY_CONTACTS: "https://www.googleapis.com/auth/directory.readonly",
  // CALENDAR_READ: "https://www.googleapis.com/auth/calendar.readonly",
  CALENDAR_EVENTS: "https://www.googleapis.com/auth/calendar.events",
  // CALENDAR: "https://www.googleapis.com/auth/calendar",
}

export const REQUIRED_SCOPES = [
  GOOGLE_SCOPES.DRIVE,
]

export const GOOGLE_CLIENT_ID = DEVELOPMENT || STAGING
  ? '785806594009-ekid1a3rk4kibgpcvn5jvco20a3aujjj.apps.googleusercontent.com'
  : '732151628471-g3te6h3tst1vn3nbniiv3iegc6g4760u.apps.googleusercontent.com'
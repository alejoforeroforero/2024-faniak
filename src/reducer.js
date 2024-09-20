import { getInitialMenuState } from "./components/BaseMenu"
import { factoryReducer } from "./components/factory/FactoryMenu"
import { uploadReducer } from "./components/UploadManager"
import { getCurrentTimeZone } from "./utils/dateUtils"

// used to prevent unnecessary state updates
export const counter = {
  fetchEvents: 0, // used to cancel previous event fetching when a new request is made
  uploadKey: 0, // used to keep track of all the current uploads
}

export const initialState = {
  upload_queue: [], // all the uploads that are currently being processed

  locked_parent_file_ids: [], // to stop folder contents from being shown while importing metadata

  magic_sync_installed: false,
  dark_mode: localStorage.getItem("dark_mode") === "true", // dark mode enabled?
  show_subscription_limit: false,

  user: {},
  businesses: [],
  employees: [],
  storageQuota: {},
  credentials: null, // from getMyCredentials
  notifications: {
    seen_at: null,
    updated_at: null,
    items: []
  },

  curr_folder_id: "", // id of the folder that is currently open in the page
  // the id is updated before the curr_folder and curr_children are fetched
  curr_folder: null, // folder that is currently open in the page
  curr_children: [],
  selected_file: null, // file that is currently selected in the metadata preview
  path: [], // path used by the breadcrumbs (pretty sure it's unused now)

  selected_event: null,
  calendars: [],
  events: [],
  calendar_anchor: {},
  time_zone: getCurrentTimeZone(),

  factory_menu: getInitialMenuState(), // used to open or close the factory menu
}

export const reducer = (state, action) => {

  switch (action.type) {

    case 'SET': return { ...state, ...action.data }

    case 'UPDATE': return action.set(state)

    case 'RESET_CURR': {
      state.curr_folder = null
      state.curr_folder_id = ""
      state.curr_children = []
      state.selected_file = null
      state.selected_event = null
      state.calendars = []
      state.events = []
      return { ...state }
    }

    // update file preview data if the fetched file collection contains it
    case 'UPDATE_CHILDREN': {
      const { parent_id, files } = action.data
      if (state.curr_folder_id !== parent_id) return state

      state.curr_children = files

      if (state.selected_file) {
        const new_version = files.find(file => file.id === state.selected_file.id)
        if (!new_version) return { ...state }

        state.selected_file = new_version
      }

      return { ...state }
    }

    case 'TOGGLE_DARK_MODE': {
      localStorage.setItem("dark_mode", !state.dark_mode)
      return { ...state, dark_mode: !state.dark_mode }
    }

    case 'START_UPLOAD': return uploadReducer.start(state, action)
    case 'UPDATE_UPLOAD': return uploadReducer.update(state, action)
    case 'CANCEL_UPLOAD': return uploadReducer.cancel(state, action)

    case 'OPEN_FACTORY_MENU': return factoryReducer.open(state, action)
    case 'CLOSE_FACTORY_MENU': return factoryReducer.close(state, action)

    default: return state
  }
}
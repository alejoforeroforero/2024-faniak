import { Cookies } from "react-cookie"
import { createFile } from "../api/drive/createFile"
import { googleMimeTypes } from "../api/google/store"
import { authorizeGoogleAccount } from "../api/member/authorizeGoogleAccount"
import { getMyProfile } from "../api/member/getMyProfile"
import { updateMember } from "../api/member/update"
import { routes } from "../Routes"
import { GOOGLE_CLIENT_ID } from "../store"

export function signOut() {
  new Cookies().remove("token", { path: '/' })
  window.location.href = routes.home()
}

export function getAuthorizationClient(scope, callback) {
  return google.accounts.oauth2.initCodeClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: scope,
    ux_mode: 'popup',
    callback: (res) => {
      if (res.error) return

      authorizeGoogleAccount({ ...res })
        .then(res => {
          if (res.error === "INVALID_ACCOUNT") {
            alert("You have selected the wrong Google account.")
          }
          if (res.error === "NEEDS_ID") {
            signOut()
          }
          return res
        })
        .then(callback)
    }
  })
}

export function getAccessToken() {
  return gapi.auth.getToken().access_token
}

export function setAccessToken(token) {
  gapi.auth.setToken({ access_token: token })
}

export function openShareClient(file_id_list) {
  const s = new gapi.drive.share.ShareClient()
  s.setOAuthToken(getAccessToken())
  s.setItemIds(file_id_list)
  s.showSettingsDialog()
}

export function scopeIsGranted(scope, string = "") {
  const scopes = string.split(" ")
  return !!scopes.find(s => s === scope)
}

export function refreshUser(dispatch) {
  getMyProfile()
    .then(res => {
      if (res.error) return
      dispatch({ type: 'SET', data: res })
      FM?.associateVisitor(res.user.email)
      window.fcWidget?.user?.setEmail(res.user.email) // for the chat widget
    })
}

export const createRootFolder = async () => {
  console.log("Creating root folder.")

  return await createFile({
    resource: {
      name: "My Music Drive",
      folderColorRgb: "#00B4D5",
      starred: true,
      description: `This is your root folder on the Faniak App. Feel free to move it or rename it. By deleting it you will loose access to your Faniak files and folders from Google Drive.`,
      parents: ["root"],
      mimeType: googleMimeTypes.FOLDER,
    }
  }).then(res => {
    if (res.error) return ""

    updateMember({ google_root_folder_id: res.file.id })

    return res.file.id
  })
}
export const googleMimeTypes = {
  FOLDER: "application/vnd.google-apps.folder",
  SHORTCUT: "application/vnd.google-apps.shortcut",
  SHEETS: "application/vnd.google-apps.spreadsheet",
  DOCS: "application/vnd.google-apps.document",
  SLIDES: "application/vnd.google-apps.presentation",
  DRAWING: "application/vnd.google-apps.drawing",
  FORM: "application/vnd.google-apps.form",
}

const otherMimeTypes = {
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  JPEG: "image/jpeg",
}

export const defaultGoogleExports = {
  [googleMimeTypes.SHEETS]: otherMimeTypes.XLSX,
  [googleMimeTypes.DOCS]: otherMimeTypes.DOCX,
  [googleMimeTypes.SLIDES]: otherMimeTypes.PPTX,
  [googleMimeTypes.DRAWING]: otherMimeTypes.JPEG,
}

export const googleContactMasks = [
  "names",
  "emailAddresses",
  "metadata",
  "photos",
]

export const googlePermissionRoles = {
  OWNER: "owner",
  ORGANIZER: "organizer",
  WRITER: "writer",
  COMMENTER: "commenter",
  READER: "reader",
}

export const googlePermissionLabels = {
  [googlePermissionRoles.OWNER]: "Owner",
  [googlePermissionRoles.ORGANIZER]: "Organizer",
  [googlePermissionRoles.WRITER]: "Editor",
  [googlePermissionRoles.COMMENTER]: "Commenter",
  [googlePermissionRoles.READER]: "Viewer",
}

export const googleFileFields = [
  "mimeType",
  "webViewLink",
  // "starred",
  "permissions",
  "parents",
  "ownedByMe",
  "name",
  "modifiedTime",
  "createdTime",
  // "lastModifyingUser",
  "id",
  "hasThumbnail",
  "thumbnailLink",
  "fileExtension",
  "size",
  "webContentLink",
  "capabilities(canEdit)",
  "trashed",
  "iconLink",
  "shortcutDetails",
  "appProperties",
]

// use these functions if you need to make sure you're getting the real prop
//    of a file, and not the shortcut prop
export const getId = file => file.shortcutDetails?.targetId || file.id
export const getMimeType = file => file.shortcutDetails?.targetMimeType || file.mimeType
export const getTargetFile = file => file.shortcutDetails?.target || file

export const canEditFile = file => Boolean(file.capabilities?.canEdit)

export const getFileProps = {
  isShared: (event) => event.appProperties?.isShared === "1",
}

// const calendarAccess = ["freeBusyReader", "reader", "writer", "owner"]
// const calendarAccessLevel = (event) => calendarAccess.findIndex(access => access === event.accessRole)
// export const isFreeBusy = event => calendarAccessLevel(event) === 0
// export const canReadEvent = event => calendarAccessLevel(event) > 0
// export const canEditEvent = event => calendarAccessLevel(event) > 1
// export const isEventOwner = event => calendarAccessLevel(event) > 2
// export const maxEventAccess = (e1, e2) => calendarAccessLevel(e1) > calendarAccessLevel(e2) ? e1 : e2

export const isEventOrganizer = event => Boolean(event.organizer?.self)

export const getEventProps = {
  faniakShow: (event) => event.extendedProperties?.private?.faniakShow === "1",
  faniakArtist: (event) => {
    const value = event.extendedProperties?.shared?.faniakArtist ?? ""
    if (value.parseInt()) return value.parseInt()
    return null
  },
}
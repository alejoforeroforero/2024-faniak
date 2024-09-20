import { useContext, useState, useRef, useMemo } from 'react';
import { DispatchContext, StateContext } from '../../store'
import FileIcon from '@material-ui/icons/AttachFile'
import BaseMenu from '../BaseMenu'
import DialogAddFolder from '../drive/DialogAddFolder'
import DialogAddArtist from '../drive/DialogAddArtist'
import DialogAddAlbum from '../drive/DialogAddAlbum'
import DialogAddSong from '../drive/DialogAddSong'
import DialogAddEvent from '../calendar/DialogAddEvent'
import { folderTypes, getColoredFolderIcon } from '../../dictionary/folder'
import FileInput from '../FileInput'
import MuiFolderIcon from '@material-ui/icons/Folder'
import { googleMimeTypes } from '../../api/google/store'
import { showSubscriptionLimits } from '../DialogSubscriptions'
import { useSnackbar } from 'notistack'
import MuiEventIcon from '@material-ui/icons/Event'
import { createFile, uploadFile } from '../../api/drive/createFile'

export default function FactoryMenu({ menuState, setMenuState, parentId, refreshFiles, refreshEvents, disableEvents }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const inputEl = useRef()
  const [dialog, setDialog] = useState()

  const handleNewFolder = type => event => {
    const canCreateGigs = state.user.has_paid_plan || state.user.is_free_trial_active

    if (type === folderTypes.GIG && !canCreateGigs) {
      showSubscriptionLimits(dispatch)
      enqueueSnackbar("Upgrade to a paid plan in order to create Smart Events.", { variant: "warning" })
      return
    }

    const unlimited_sm = state.user.max_smart_folders < 0
    const can_create_sm = unlimited_sm || state.user.current_smart_folders < state.user.max_smart_folders

    if (type && !can_create_sm) {
      showSubscriptionLimits(dispatch)
      enqueueSnackbar("You have reached your subscription limit.", { variant: "warning" })
      return
    }
    setDialog(type)
  }

  const handleNewDocument = mimeType => event => {
    createFile({
      resource: {
        name: "New Document",
        mimeType: mimeType,
        parents: [parentId],
      },
      fields: "webViewLink",
    }).then(res => {
      if (res.error) {
        enqueueSnackbar("We were unable to create that file :(", { variant: "error" })
        return
      }

      refreshFiles()

      window.open(res.file.webViewLink, '_blank').focus()
    })
  }

  const getFolderCommon = type => ({
    icon: getColoredFolderIcon(type),
    callback: handleNewFolder(type)
  })
  const getDocumentCommon = mimeType => ({
    icon: getAppIcon(mimeType),
    callback: handleNewDocument(mimeType)
  })

  const actions = [
    {
      label: "Folder",
      icon: FolderIcon,
      items: [
        { ...getFolderCommon(folderTypes.ARTIST), label: "Artist" },
        { ...getFolderCommon(folderTypes.ALBUM), label: "Album" },
        { ...getFolderCommon(folderTypes.SONG), label: "Song" },
        {
          label: "Basic Folder",
          icon: BasicFolderIcon,
          callback: handleNewFolder("")
        },
      ],
    },
    {
      label: "Event",
      icon: EventIcon,
      disabled: disableEvents,
      items: [
        { ...getFolderCommon(folderTypes.GIG), label: "Gig" },
        {
          label: "Basic Event",
          icon: BasicEventIcon,
          disabled: disableEvents,
          callback: handleNewFolder("event")
        },
      ],
    },
    { divider: true },
    { label: "Google Sheets", ...getDocumentCommon(googleMimeTypes.SHEETS) },
    { label: "Google Docs", ...getDocumentCommon(googleMimeTypes.DOCS) },
    { label: "Google Slides", ...getDocumentCommon(googleMimeTypes.SLIDES) },
    { label: "Upload File", icon: FileIcon, callback: () => inputEl.current.click() },
  ]

  const handleUploadFile = (event) => {
    const { files } = event.target

    if (files.length) {
      const [file] = files

      const payload = { file: file }

      payload.parent = parentId

      uploadFile(payload, { dispatch })
        .then(res => {
          if (res.error) return
          refreshFiles()
        })
    }
  }

  const renderedDialog = useMemo(() => {
    const common_props = {
      handleClose: () => setDialog(null),
      callback: refreshFiles,
      parent_id: parentId
    }
    const onEventDone = ({ date }) => refreshEvents(date)

    switch (dialog) {
      case folderTypes.ARTIST: return <DialogAddArtist {...common_props} />
      case folderTypes.ALBUM: return <DialogAddAlbum {...common_props} />
      case folderTypes.SONG: return <DialogAddSong {...common_props} />
      case "":
      case folderTypes.PROMO:
      case folderTypes.FOLDER: return <DialogAddFolder {...common_props} type={dialog} />
      case folderTypes.GIG: return (
        <DialogAddEvent
          {...common_props}
          folderType={dialog}
          onDone={onEventDone}
        />
      )
      case "event": return (
        <DialogAddEvent
          {...common_props}
          folderType=""
          onDone={onEventDone}
        />
      )
      default: return null
    }
  }, [dialog, refreshFiles, parentId])

  return (
    <>
      <BaseMenu
        items={actions}
        menuState={menuState}
        setMenuState={setMenuState}
        header="Add new"
      />

      <div onContextMenu={e => e.stopPropagation()}>
        {renderedDialog}
      </div>

      <FileInput
        inputRef={inputEl}
        onChange={handleUploadFile}
      />
    </>
  )
}

const getAppIcon = mimeType => (props) => {
  return (
    <img
      src={`https://drive-thirdparty.googleusercontent.com/16/type/${mimeType}`}
      alt=""
      style={{ padding: "0px 4px" }}
      {...props} />
  )
}

const BasicEventIcon = (props) => <MuiEventIcon color="action" {...props} />
const BasicFolderIcon = (props) => <MuiFolderIcon color="action" {...props} />
const EventIcon = (props) => <MuiEventIcon color="primary" {...props} />
const FolderIcon = (props) => <MuiFolderIcon color="primary" {...props} />

export const factoryReducer = {
  open: (state, action) => ({
    ...state, factory_menu: {
      mouseX: action.event.clientX,
      mouseY: action.event.clientY,
    }
  }),
  close: (state, action) => ({
    ...state, factory_menu: null
  }),
}
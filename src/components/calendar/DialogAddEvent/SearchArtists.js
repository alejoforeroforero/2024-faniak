import { Box, IconButton, Tooltip } from '@material-ui/core'
import { useState } from 'react';
import { searchFiles } from '../../../api/drive/getFiles'
import { googleMimeTypes } from '../../../api/google/store'
import { folderTypes } from '../../../dictionary/folder'
import { getInitialMenuState, getOpenMenuHandler } from '../../BaseMenu'
import BaseSearchField, { searchResultTypes } from '../../BaseSearchField'
import MenuFileSelection from '../../MenuFileSelection'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'

export default function SearchArtists({ submitArtist, onChangeValue }) {
  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())

  const fetchResults = async (string) => {
    if (string.length < 3) return []

    const files = await searchFiles({
      q: string,
      filters: [`mimeType = '${googleMimeTypes.FOLDER}'`],
    }, {
      includeThumbnails: true
    })
      .then(res => {
        if (res.error) return []
        return res.files
      })

    const results = files
      .filter(x => x.smart_folder && x.smart_folder.type === folderTypes.ARTIST)
      .map(file => ({
        type: searchResultTypes.FOLDER,
        data: file.smart_folder,
        selectData: submitArtist,
      }))

    return results
  }

  const selectArtistFile = (files) => {
    const [file] = files

    submitArtist(file.smart_folder)
  }

  return (
    <Box display="flex" alignItems="center">
      <BaseSearchField
        label="Add artist"
        autoFocus
        fullWidth
        initialValue=""
        fetchResults={fetchResults}
        onChangeValue={onChangeValue}
      />

      <Box pl={1} />

      <Tooltip title="Find in my Drive">
        <IconButton
          color="primary"
          component="div"
          onClick={getOpenMenuHandler(setSelectionMenu)}
        >
          <FolderOpenIcon />
        </IconButton>
      </Tooltip>

      <MenuFileSelection
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={selectArtistFile}
        smartFolderType={folderTypes.ARTIST}
      />
    </Box>
  )
}
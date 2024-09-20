import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { DispatchContext } from '../../store'
import Folders from './Folders'
import Files from './Files'
import { Box, CircularProgress } from '@material-ui/core'
import { getInitialMenuState, getOpenMenuHandler } from '../BaseMenu'
import OptionsMenu from './OptionsMenu'
import { onboardingEvents, skipOnboarding } from '../Onboarding'
import { moveFilesToGoogleFolder } from '../../utils/fileUtils'
import { useSnackbar } from 'notistack'
import NoFiles from './NoFiles'

export const FOLDER_WIDTH = 100

export default function FileSystem({
  files = [],
  fetchChildren,
  loading = false,
}) {
  const dispatch = useContext(DispatchContext)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  useEffect(() => {
    skipOnboarding(dispatch, onboardingEvents.LOAD_FILE_SYSTEM)
  }, [])

  const [optionsMenu, setOptionsMenu] = useState(getInitialMenuState())
  const handleOpenOptionsMenu = getOpenMenuHandler(setOptionsMenu)

  const [selectedIndexes, setSelectedIndexes] = useState([])

  const openFactoryMenu = useCallback(
    getOpenMenuHandler((coords) => {
      dispatch({
        type: "SET",
        data: { factory_menu: coords }
      })
    }), [dispatch])

  useEffect(() => {
    setSelectedIndexes([])
  }, [files])

  const handleSelectItem = (event, item_index) => {
    const { ctrlKey, shiftKey } = event
    const file = files[item_index]

    setSelectedIndexes(prev => {
      const isSelected = prev.includes(item_index)
      if (ctrlKey && isSelected) {
        return prev.filter(x => x !== item_index)
      }
      else if (ctrlKey) {
        return [...prev, item_index]
      }
      else if (shiftKey && prev.length) {
        const indexes = []
        // looks stupid, but it's needed to make sure the first item stays in index 0
        const ascending = prev[0] < item_index
        for (let i = prev[0]; ascending ? i <= item_index : i >= item_index; ascending ? i++ : i--) {
          indexes.push(i)
        }
        return indexes
      }
      else {
        return [item_index]
      }
    })

    // update global state so that the preview can display the right item
    dispatch({
      type: 'SET',
      data: { selected_file: file }
    })
  }

  // deselect all files (when you click the background div)
  const handleClick = (event) => {
    // prevent unnecessary state updates
    if (selectedIndexes.length) setSelectedIndexes([])

    dispatch({
      type: 'SET',
      data: { selected_file: null }
    })
  }

  const moveFileToFolder = async (file, parent) => {
    moveFilesToGoogleFolder([file], parent, { enqueueSnackbar, closeSnackbar, callback: fetchChildren })
  }

  const selectedFiles = useMemo(() => {
    return files.filter((x, index) => selectedIndexes.includes(index))
  }, [selectedIndexes])

  return (
    <div
      onClick={handleClick}
      onContextMenu={openFactoryMenu}
      style={{ flexGrow: 1 }}
    >
      {loading ? (
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {!files.length && <NoFiles />}
          <Folders
            files={files}
            handleOpenOptionsMenu={handleOpenOptionsMenu}
            selectedIndexes={selectedIndexes}
            handleSelect={handleSelectItem}
            moveFileToFolder={moveFileToFolder}
          />

          <Box pt={2} />

          <Files
            files={files}
            selectedIndexes={selectedIndexes}
            handleOpenOptionsMenu={handleOpenOptionsMenu}
            handleSelect={handleSelectItem}
          />

          <OptionsMenu
            files={selectedFiles}
            fetchContent={fetchChildren}
            menuState={[optionsMenu, setOptionsMenu]}
          />
        </>
      )}
    </div>
  )
}
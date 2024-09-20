import { useContext, useState } from 'react';
import ContainedButton from '../ContainedButton'
import AddIcon from '@material-ui/icons/Add'
import { getInitialMenuState, getOpenMenuHandler } from '../BaseMenu'
import Dropzone from '../Dropzone'
import { makeStyles, Tooltip } from '@material-ui/core'
import { DispatchContext } from '../../store'
import { uploadFileStructure } from '../../utils/fileUtils'
import FactoryMenu from './FactoryMenu'

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: 14,
  },
  button: {
    borderRadius: "100%",
    minWidth: 0,
    padding: 8,
    boxShadow: "none",
  },
}))

export default function ControlledFactoryButton({ parentId, buttonClass, refreshContent, disableEvents }) {
  const classes = useStyles()
  const dispatch = useContext(DispatchContext)
  const [menu, setMenu] = useState(getInitialMenuState())

  const onDrop = (files) => {
    uploadFileStructure({
      files: files,
      dispatch: dispatch,
      parent_id: parentId,
      refreshParent: refreshContent,
    })
  }

  return (
    <>
      <Dropzone onDrop={onDrop}>
        <ContainedButton
          onClick={getOpenMenuHandler(setMenu)}
          className={`${classes.button} ${buttonClass || ""}`}
        >
          <Tooltip
            title="Add new"
            placement="right"
            classes={{ tooltip: classes.tooltip }}
          >
            <AddIcon />
          </Tooltip>
        </ContainedButton>
      </Dropzone>

      <FactoryMenu
        menuState={menu}
        setMenuState={setMenu}
        parentId={parentId}
        disableEvents={disableEvents}
        refreshFiles={refreshContent}
        refreshEvents={refreshContent}
      />
    </>
  )
}
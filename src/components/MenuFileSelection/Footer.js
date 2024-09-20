import { makeStyles, Tooltip } from '@material-ui/core'
import ContainedButton from '../ContainedButton'
import ControlledFactoryButton from '../factory/ControlledFactoryButton'

const useStyles = makeStyles((theme) => ({
  buttonAdd: {
    marginTop: -2,
    marginBottom: -2,
  },
}))

export default function Footer({
  callback,
  selected,
  handleClose,
  currentFolder,
  fetchChildren,
}) {
  const classes = useStyles()

  const handleSubmit = (e) => {
    const files = selected.length ? selected : [currentFolder]
    callback(files)
    handleClose(e)
  }

  const disabled = !selected.length && !!currentFolder.disabled_reason

  return (
    <div style={{ display: "flex", padding: 16 }}>
      <ControlledFactoryButton
        disableEvents
        parentId={currentFolder.id}
        buttonClass={classes.buttonAdd}
        refreshContent={fetchChildren}
      />
      <div style={{ flexGrow: 1 }} />
      <Tooltip
        title={currentFolder.disabled_reason}
        disableFocusListener={!disabled}
        disableHoverListener={!disabled}
        disableTouchListener={!disabled}
      >
        <div>
          <ContainedButton
            onClick={handleSubmit}
            disabled={disabled}
          >
            Select
          </ContainedButton>
        </div>
      </Tooltip>
    </div>
  )
}
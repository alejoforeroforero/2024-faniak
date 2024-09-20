import { useDropzone } from 'react-dropzone'
import { makeStyles } from '@material-ui/core/styles'
import DropBorder from './DropBorder'

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    position: "relative",
    flexGrow: 1,
    "&:focus": {
      outline: "none"
    }
  },
}))

export default function Dropzone({
  children,
  onDrop,
  accept,
  disabled = false,
  enableClick = false,
  enableBubbling = false
}) {
  const classes = useStyles()
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    noDragEventsBubbling: !enableBubbling,
    disabled: disabled,
  })

  const rootProps = {}
  if (!enableClick) {
    rootProps.onClick = event => event.stopPropagation()
  }

  return (
    <div
      className={classes.root}
      {...getRootProps(rootProps)}
    >
      <input
        {...getInputProps()}
        accept={accept ?? "*"}
      />
      {children}
      {isDragActive && <DropBorder />}
    </div>
  )
}
import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { folderLabels, folderColors } from '../../dictionary/folder'

const borderRadius = 4

const useStyles = makeStyles(({ palette }) => ({
  tag: {
    backgroundColor: props => props.color || palette.primary.main,
    color: "#fff",
    letterSpacing: 1,
    fontSize: 10,
    border: "0px solid #1C6EA4",
    borderRadius: `${borderRadius}px 0px 0px 0px`,
    width: "min-content",
    padding: `0px 0px ${borderRadius - 2}px 6px`,
    marginBottom: -3,
    marginLeft: ({ selected }) => selected ? 0 : 1,
    position: "relative",
    display: "flex",
  },
  tagTriangle: {
    display: "inline-block",
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "20px 0 0 15px",
    borderColor: ({ color }) => "transparent transparent transparent " + (color ? color : palette.primary.main),
    position: "absolute",
    left: "100%",
  }
}))

const FolderTag = ({ type, selected }) => {

  const classes = useStyles({
    color: folderColors[type],
    selected
  })

  return (
    <div className={classes.tag}>
      {folderLabels[type] ?? "TODO"}
      <div className={classes.tagTriangle}>
      </div>
    </div>
  )
}

export default memo(FolderTag, (prev, next) => {
  if (prev.type !== next.type) return false
  if (prev.selected !== next.selected) return false
  return true
})
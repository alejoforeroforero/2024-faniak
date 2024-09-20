import DragHandleIcon from '@material-ui/icons/DragHandle'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import {
  Box,
  IconButton,
  Typography,
} from '@material-ui/core';
import {
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

const useStyles = makeStyles(({zIndex, palette}) => ({
  root: {
    paddingLeft: 6,
    display: "flex",
    alignItems: "center",
    zIndex: zIndex.modal + 1,
    borderBottom: `1px solid ${palette.divider}`,
    '&:last-child': {
      borderBottom: "none",
    },
    '& .MuiIconButton-root': {
      padding: 8,
      marginRight: 4
    }
  },
}))

const DragHandle = sortableHandle(() => (
  <IconButton>
    <DragHandleIcon />
  </IconButton>
))

export default sortableElement(({ data, track_index, onDelete }) => {
  const classes = useStyles()

  const { folder } = data

  return (
    <Box className={classes.root}>
      <DragHandle />

      <Typography
        variant="body2"
      >
        {`${track_index + 1}. ${folder.name}`}
      </Typography>

      <Box flexGrow={1} />

      <IconButton color="primary" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  )
})
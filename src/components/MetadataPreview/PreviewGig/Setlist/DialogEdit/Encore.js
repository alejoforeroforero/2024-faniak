import DragHandleIcon from '@material-ui/icons/DragHandle'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography, Box, IconButton,
} from '@material-ui/core'
import {
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

const useStyles = makeStyles(({ spacing, palette, zIndex }) => ({
  root: {
    // paddingLeft: spacing(2),
    display: "flex",
    alignItems: "center",
    // height: spacing(6),
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

export default sortableElement(({ section_index }) => {

  const show_delete = Boolean(section_index)

  const classes = useStyles({ show_delete })

  return (
    <Box className={classes.root}>
      <DragHandle />
      <Typography variant="button">
        Encore
      </Typography>
    </Box>
  )
})
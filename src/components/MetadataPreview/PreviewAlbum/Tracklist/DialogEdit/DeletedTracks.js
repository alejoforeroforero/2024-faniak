import {
  Box,
  Typography,
  IconButton,
  Divider,
  Card,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ReturnIcon from '@material-ui/icons/KeyboardReturn'

const useStyles = makeStyles(({ spacing, palette }) => ({
  track: {
    paddingLeft: 6,
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${palette.divider}`,
    '&:last-child': {
      borderBottom: "none",
    },
    '& .MuiIconButton-root': {
      padding: 8,
      marginRight: 4
    }
  },
  header: {
    paddingLeft: 16,
  },
  root: {
    marginTop: spacing(3),
    paddingTop: 8,
    borderColor: palette.error.main,
    backgroundColor: 'rgba(255, 102, 102, 0.04)'
  },
}))

export default function DeletedTracks({ list, onClick }) {
  const classes = useStyles()

  return (
    <Card mt={2} variant="outlined" className={classes.root}>
      <Typography gutterBottom className={classes.header}>
        To Be Removed
      </Typography>
      <Divider />
      {
        list.map((item, index) => (
          <Box key={index} className={classes.track}>
            <IconButton color="primary" onClick={onClick(index)}>
              <ReturnIcon />
            </IconButton>

            <Typography variant="body2">
              {item.folder.name}
            </Typography>
          </Box>
        ))
      }
    </Card>
  )
}
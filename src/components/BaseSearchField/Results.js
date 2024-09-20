import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Card,
  CircularProgress,
  List,
  Typography,
} from '@material-ui/core'
import Result from './Result'

const useStyles = makeStyles(theme => ({
  card: {
    position: "absolute",
    maxHeight: 200,
    overflowY: "auto",
    top: 36,
    left: 8,
    right: 8,
    zIndex: theme.zIndex.modal + 1,
    '& .MuiList-root': {
      paddingTop: 4,
      paddingBottom: 4,
    },
    '& .MuiListItem-root': {
      padding: "3px 12px 3px 12px"
    },
  },
}))

export default function Results({
  resetInput,
  fetching,
  results,
  selected,
  selectedRef,
}) {
  const classes = useStyles()

  // render the progress bar while fetching
  if (fetching) return (
    <Card className={classes.card} variant="outlined">
      <Box display="flex" alignItems="center" justifyContent="center" pt={1} pb={1}>
        <CircularProgress size={32} />
      </Box>
    </Card>
  )

  // hide the paper when there are no results
  if (!results.length) return null

  return (
    <Card className={classes.card} variant="outlined">
      <List>
        {results.length ? (
          results.map((result, index) => (
            <Result
              key={index}
              result={result}
              resetInput={resetInput}
              selectedRef={selected === index ? selectedRef : null}
            />
          ))
        ) : (
          <Typography variant="body2" align='center' color="textSecondary">
            No results...
          </Typography>
        )}
      </List>
    </Card>
  )
}
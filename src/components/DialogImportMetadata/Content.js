import { makeStyles } from '@material-ui/core/styles'
import {
  CircularProgress,
  Grid,
  Card,
  DialogContent,
} from '@material-ui/core'
import Result from './Result'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: 200,
    position: "relative",
    '& .MuiGrid-item': {
      position: "relative"
    }
  },
  updating: {
    height: "100%",
    minHeight: 132,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}))

export default function Content({
  updating,
  results,
  setResults,
}) {
  const classes = useStyles()

  const handleClick = index => e => {
    setResults(prev => {
      return prev.map((res, i) => {
        if (i !== index) return res

        return ({ ...res, selected: !res.selected })
      })
    })
  }

  return (
    <DialogContent>
      <div className={classes.root}>
        <Grid spacing={2} container>
          {
            results.length ? (
              results.map(({ selected, common }, index) => (
                <Grid key={index} item xs={4} sm={3} md={2} lg={2} xl={2}>
                  <Result
                    selected={selected}
                    data={common}
                    onClick={handleClick(index)}
                  />
                </Grid>
              ))
            ) : null
          }
          {
            updating ? (
              <Grid item xs={4} sm={3} md={2} lg={2} xl={2}>
                <Card variant="outlined" className={classes.updating}>
                  <CircularProgress size={32} />
                </Card>
              </Grid>
            ) : null
          }
        </Grid>
      </div >
    </DialogContent>
  )
}
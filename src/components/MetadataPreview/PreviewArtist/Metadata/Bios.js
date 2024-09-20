import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Box,
  IconButton,
  Button,
} from '@material-ui/core'
import BaseTextField from '../../../form/BaseTextField'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  bioLabel: {
    position: "relative",
    '& .MuiInputBase-input': {
      marginRight: 24,
    },
    '& .MuiIconButton-root': {
      position: "absolute",
      top: 8,
      right: 0,
      padding: 8,
    },
  },
}))

export default function Bios({ form, setForm }) {
  const classes = useStyles()

  const setBioValue = (index) => (name, value) => {
    setForm(prev => {
      prev.bios[index][name] = value
      return { ...prev }
    })
  }

  const deleteBio = (index) => (e) => {
    e.stopPropagation()

    setForm(prev => {
      prev.bios = prev.bios.filter((_, i) => i !== index)
      return { ...prev }
    })
  }

  const addBio = () => {
    setForm(prev => {
      prev.bios.push({
        key: prev.bios.reduce((acc, curr) => Math.max(acc, curr.key), 0) + 1,
        label: "",
        text: "",
      })
      return { ...prev }
    })
  }

  return (
    <GridItem lg={12} md={12} sm={12}>
      {form.bios.map((bio, i) => (
        <Grid key={i} container spacing={3}>
          <GridItem>
            <div className={classes.bioLabel}>
              <BaseTextField
                label="Biography Title"
                name="label"
                value={bio.label}
                placeholder="How would you describe this bio?"
                setValue={setBioValue(i)}
              />
              <IconButton
                color="primary"
                disabled={form.bios.length <= 1}
                onClick={deleteBio(i)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          </GridItem>
          <GridItem lg={8} md={8}>
            <BaseTextField
              label="Text"
              name="text"
              value={bio.text}
              multiline
              maxRows={10}
              minRows={3}
              setValue={setBioValue(i)}
            />
          </GridItem>
        </Grid>
      ))}
      <Box display="flex" justifyContent="flex-end">
        <Button
          color="primary"
          onClick={addBio}
          startIcon={<AddIcon />}
        >
          Add Biography
        </Button>
      </Box>
    </GridItem>
  )
}

const GridItem = (props) => <Grid item lg={4} md={4} sm={6} xs={12} {...props} />
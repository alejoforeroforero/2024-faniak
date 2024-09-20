import {
  Button,
  DialogContent,
  Link,
  MenuItem,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { getAllTimeZones, getCurrentTimeZone, getTimeZoneDescription } from '../../utils/dateUtils'
import BaseDialog from '../BaseDialog'
import BaseDialogActions from '../BaseDialogActions'
import BaseDialogTitle from '../BaseDialogTitle'
import ContainedButton from '../ContainedButton'
import BaseTextField from './BaseTextField'


const useStyles = makeStyles(theme => ({
  root: {
    '& > .label': {
      fontSize: 13,
    },
    '& > .link': {
      cursor: "pointer",
      fontSize: 13,
    },
  },
}))


export default function TimeZoneSelector({ name, value, setValue, disabled }) {
  const classes = useStyles()
  const [showDialog, setShowDialog] = useState()
  const openDialog = () => setShowDialog(true)
  const closeDialog = () => setShowDialog(false)

  return (
    <div className={classes.root}>
      <Typography className="label" noWrap>
        {getTimeZoneDescription(value)}
      </Typography>
      <Link className="link" disabled={disabled} onClick={openDialog}>
        Edit time zone
      </Link>
      {showDialog && (
        <DialogEdit value={value} setValue={setValue} name={name} handleClose={closeDialog} />
      )}
    </div>
  )
}


const mapOptions = () => {
  const timeZones = getAllTimeZones()

  const dict = {}

  for (const timeZone of timeZones) {
    const [region, city] = timeZone.split("/")
    if (dict[region]) {
      dict[region].push(city)
    } else {
      dict[region] = [city]
    }
  }

  return dict
}

const options = mapOptions()


const getInitialForm = (value) => {
  const [region, city] = value.split("/")

  if (options[region].includes(city)) return { region, city }

  return { region: "", city: "" }
}


function DialogEdit({ name, value, setValue, handleClose }) {
  const [form, setForm] = useState(() => getInitialForm(value))

  const submitValue = () => {
    setValue(name, `${form.region}/${form.city}`)
    handleClose()
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm(prev => ({ ...prev, city: "", [name]: value }))
  }

  const sharedProps = (name) => ({
    select: true,
    name: name,
    value: form[name],
    onChange: handleChange,
  })

  const setCurrentTimeZone = () => {
    const timeZone = getCurrentTimeZone()

    const [region, city] = timeZone.split("/")

    setForm(({ region, city }))
  }

  const regions = Object.keys(options)
  const cities = options[form.region]

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Event time zone
      </BaseDialogTitle>
      <DialogContent>
        <BaseTextField required label="Region" {...sharedProps("region")}>
          {regions.map((region, i) => (
            <MenuItem value={region} key={i}>
              {region}
            </MenuItem>
          ))}
        </BaseTextField>
        {!!form.region && (
          <BaseTextField required label="City" {...sharedProps("city")}>
            {cities.map((city, i) => (
              <MenuItem value={city} key={i}>
                {city.replaceAll("_", " ")}
              </MenuItem>
            ))}
          </BaseTextField>
        )}
      </DialogContent>
      <BaseDialogActions>
        <Button color="primary" onClick={setCurrentTimeZone}>
          Set current time zone
        </Button>
        <ContainedButton disabled={!form.region || !form.city} onClick={submitValue}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}
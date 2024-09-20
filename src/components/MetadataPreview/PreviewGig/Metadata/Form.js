import { useCallback } from 'react';
import {
  Grid,
  Box,
  Typography,
} from '@material-ui/core'
import BaseTextField from '../../../form/BaseTextField'
import BaseCheckbox from '../../../form/BaseCheckbox'
import SectionTitle from '../../../form/SectionTitle'
import TimeZoneSelector from '../../../form/TimeZoneSelector';

export default function Form({ form, setForm, isOrganizer }) {

  const setValue = useCallback((name, value) => {
    setForm(prev => {
      prev[name] = value
      return { ...prev }
    })
  }, [setForm])

  const sharedProps = (name) => ({
    name: name,
    value: form[name],
    setValue: setValue,
  })

  return (
    <Box minHeight={240}>
      {!isOrganizer && (
        <Box mb={3}>
          <Typography color="error" variant="body2">
            Some fields are disabled due to lack of organizer privilege.
          </Typography>
        </Box>
      )}
      <Grid container spacing={3}>
        <GridItem>
          <BaseTextField label="Date" {...sharedProps("date")} type="date" InputLabelProps={dateOptions} disabled={!isOrganizer} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Time" {...sharedProps("time")} type="time" InputLabelProps={dateOptions} disabled={!isOrganizer} />
        </GridItem>
        {!!form.time && (
          <GridItem>
            <Box display="flex" alignItems="center" height="100%">
              <TimeZoneSelector {...sharedProps("time_zone")} disabled={!isOrganizer} />
            </Box>
          </GridItem>
        )}
        <GridItem>
          <BaseTextField label="Duration (min)" {...sharedProps("duration_min")} type="number" disabled={!isOrganizer} />
        </GridItem>

        <SectionTitle label="Location" />
        <GridItem>
          <BaseTextField label="Location" {...sharedProps("location")} disabled={!isOrganizer} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Venue" {...sharedProps("venue")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Address" {...sharedProps("address")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Postal Code" {...sharedProps("postal_code")} />
        </GridItem>

        <SectionTitle label="Status" />
        <GridItem>
          <BaseTextField label="Tickets URL" {...sharedProps("tickets_url")} />
        </GridItem>
        <GridItem>
          <BaseCheckbox label="Confirmed" {...sharedProps("is_confirmed")} />
        </GridItem>
        {form.is_confirmed && (
          <GridItem>
            <BaseCheckbox label="Sold Out" {...sharedProps("is_sold_out")} />
          </GridItem>
        )}
        {form.is_confirmed && (
          <GridItem>
            <BaseCheckbox label="Paid" {...sharedProps("is_paid")} />
          </GridItem>
        )}
        <GridItem>
          <BaseCheckbox label="Cancelled" {...sharedProps("is_cancelled")} />
        </GridItem>
      </Grid>
    </Box>
  )
}

const GridItem = (props) => <Grid item lg={4} md={4} sm={6} xs={12} {...props} />

const dateOptions = { shrink: true }
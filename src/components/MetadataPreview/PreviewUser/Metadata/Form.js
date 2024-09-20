import { useCallback } from 'react'
import countries from '../../../../dictionary/avs/countries.json'
import {
  Grid,
  Box,
} from '@material-ui/core'
import BaseTextField from '../../../form/BaseTextField'
import SectionTitle from '../../../form/SectionTitle'
import AssistedTextField from '../../../form/AssistedTextField'
import ExternalMemberships from './ExternalMemberships'

export default function Form({ form, setForm }) {

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
      <Grid container spacing={3}>
        <GridItem>
          <BaseTextField label="Artistic name" {...sharedProps("artistic_name")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Birthday" {...sharedProps("birthday")} type="date" InputLabelProps={dateOptions} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Phone" {...sharedProps("phone")} />
        </GridItem>

        <SectionTitle label="My residence" />
        <GridItem>
          <AssistedTextField label="Country" {...sharedProps("country")} options={countries} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Address" {...sharedProps("address")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Postal code" {...sharedProps("postal_code")} />
        </GridItem>

        <SectionTitle label="My identifiers" />
        <GridItem>
          <BaseTextField label="ISNI" {...sharedProps("isni")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="IPN" {...sharedProps("ipn")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="IPI/CAE" {...sharedProps("ipi_cae_number")} />
        </GridItem>

        <ExternalMemberships form={form} setForm={setForm} />
      </Grid>
    </Box>
  )
}

const GridItem = (props) => <Grid item lg={4} md={4} sm={6} xs={12} {...props} />

const dateOptions = { shrink: true }
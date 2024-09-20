import { useCallback } from 'react';
import countries from '../../../../dictionary/avs/countries.json'
import {
  Grid,
  Box,
} from '@material-ui/core'
import BaseTextField from '../../../form/BaseTextField'
import AssistedTextField from '../../../form/AssistedTextField'
import SectionTitle from '../../../form/SectionTitle'
import Bios from './Bios'

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
          <BaseTextField label="Name" {...sharedProps("name")} required />
        </GridItem>
        <GridItem>
          <AssistedTextField label="Country" {...sharedProps("country")} options={countries} />
        </GridItem>

        <SectionTitle label="Biographies" />
        <Bios form={form} setForm={setForm} />
      </Grid>
    </Box>
  )
}

const GridItem = (props) => <Grid item lg={4} md={4} sm={6} xs={12} {...props} />
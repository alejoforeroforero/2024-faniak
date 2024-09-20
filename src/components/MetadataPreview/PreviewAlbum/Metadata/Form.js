import { useCallback } from 'react';
import genres from '../../../../dictionary/avs/genres.json'
import languages from '../../../../dictionary/avs/languages.json'
import {
  Grid,
  Box,
} from '@material-ui/core'
import BaseTextField from '../../../form/BaseTextField'
import AssistedTextField from '../../../form/AssistedTextField'
import ListField from '../../../form/ListField'
import SectionTitle from '../../../form/SectionTitle'

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
          <BaseTextField label="Title" {...sharedProps("title")} required />
        </GridItem>
        <GridItem>
          <AssistedTextField label="Main genre" {...sharedProps("main_genre")} options={genres} />
        </GridItem>
        {!!form.main_genre && (
          <GridItem>
            <ListField label="Secondary genres" {...sharedProps("other_genres")} />
          </GridItem>
        )}
        <GridItem>
          <AssistedTextField label="Main language" {...sharedProps("title_language")} options={languages} />
        </GridItem>

        <SectionTitle label="Release" />
        <GridItem>
          <BaseTextField label="Release date" {...sharedProps("release_date")} type="date" InputLabelProps={dateOptions} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Year" type="number" {...sharedProps("year")} />
        </GridItem>

        <SectionTitle label="Identification" />
        <GridItem>
          <BaseTextField label="UPC" {...sharedProps("upc_code")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Record label" {...sharedProps("record_label")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Catalogue Number" {...sharedProps("catalog_n")} />
        </GridItem>

        <SectionTitle label="Extra" />
        <GridItem>
          <ListField label="Keywords" {...sharedProps("keywords")} />
        </GridItem>
        <GridItem lg={12} md={12} sm={12}>
          <BaseTextField label="Description" {...sharedProps("description")} multiline maxRows={10} minRows={3} />
        </GridItem>
        <GridItem lg={12} md={12} sm={12}>
          <BaseTextField label="Special thanks" {...sharedProps("special_thanks")} multiline maxRows={10} minRows={3} />
        </GridItem>
      </Grid>
    </Box>
  )
}

const GridItem = (props) => <Grid item lg={4} md={4} sm={6} xs={12} {...props} />

const dateOptions = { shrink: true }
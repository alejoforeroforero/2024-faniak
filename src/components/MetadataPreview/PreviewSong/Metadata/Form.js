import { useCallback } from 'react';
import genres from '../../../../dictionary/avs/genres.json'
import songVersions from '../../../../dictionary/avs/songVersions.json'
import languages from '../../../../dictionary/avs/languages.json'
import {
  Grid,
  Box,
} from '@material-ui/core'
import BaseTextField from '../../../form/BaseTextField'
import AssistedTextField from '../../../form/AssistedTextField'
import ListField from '../../../form/ListField'
import BaseCheckbox from '../../../form/BaseCheckbox'
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
          <BaseCheckbox label="It's a cover" {...sharedProps("is_cover")} />
        </GridItem>
        <GridItem>
          <BaseCheckbox label="It's a version" {...sharedProps("is_version")} />
        </GridItem>
        {form.is_version && (
          <GridItem>
            <AssistedTextField label="Version" {...sharedProps("version")} options={songVersions} />
          </GridItem>
        )}

        <SectionTitle label="Identification" />
        <GridItem>
          <BaseTextField label="ISRC" {...sharedProps("isrc_code")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="ISWC" {...sharedProps("iswc_code")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Tunecode" {...sharedProps("tunecode")} />
        </GridItem>

        <SectionTitle label="Lyrics" />
        <GridItem>
          <BaseCheckbox label="It's an instrumental" {...sharedProps("is_instrumental")} />
        </GridItem>
        {!form.is_instrumental && <>
          <GridItem>
            <BaseCheckbox label="Parental warning" {...sharedProps("parental_warning")} />
          </GridItem>
          <GridItem lg={8} md={8} sm={12}>
            <BaseTextField label="Lyrics" placeholder="Paste your lyrics here" {...sharedProps("lyrics")} multiline maxRows={10} minRows={5} />
          </GridItem>
          <GridItem>
            <AssistedTextField label="Main language" {...sharedProps("lyrics_language")} options={languages} />
          </GridItem>
        </>}

        <SectionTitle label="Extra" />
        <GridItem>
          <BaseTextField label="First release date" {...sharedProps("release_date")} type="date" InputLabelProps={dateOptions} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Year" type="number" {...sharedProps("year")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Record label" {...sharedProps("record_label")} />
        </GridItem>
        {Boolean(form.record_label) && (
          <GridItem>
            <BaseCheckbox label="Record label owns master" {...sharedProps("record_label_owns_master")} />
          </GridItem>
        )}
        <GridItem>
          <BaseTextField label="Tempo/BPM" type="number" {...sharedProps("bpm")} />
        </GridItem>
        <GridItem>
          <BaseTextField label="Key" {...sharedProps("key")} />
        </GridItem>
        <GridItem>
          <ListField label="Moods" {...sharedProps("mood")} />
        </GridItem>
        <GridItem>
          <ListField label="Keywords" {...sharedProps("keywords")} />
        </GridItem>
        <GridItem lg={12} md={12} sm={12}>
          <BaseTextField label="Description" {...sharedProps("description")} multiline maxRows={10} minRows={3} />
        </GridItem>
      </Grid>
    </Box>
  )
}

const GridItem = (props) => <Grid item lg={4} md={4} sm={6} xs={12} {...props} />

const dateOptions = { shrink: true }
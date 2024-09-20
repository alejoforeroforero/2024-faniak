import { useCallback } from 'react';
import {
  Box,
} from '@material-ui/core'
import BaseTextField from '../../../../form/BaseTextField';

export default function Form({
  form,
  setForm,
}) {
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
    <Box pt={2}>
      <Box display="flex">
        <BaseTextField label="Local start time" {...sharedProps("start")} type="time" InputLabelProps={dateOptions} />
        <Box pl={2} />
        <BaseTextField label="Local end time" {...sharedProps("end")} type="time" InputLabelProps={dateOptions} />
      </Box>
      <Box pt={0.5} />
      <BaseTextField label="Entry title" autoFocus {...sharedProps("title")} />
      <Box pt={0.5} />
      <BaseTextField label="Notes" {...sharedProps("description")} multiline maxRows={10} minRows={4} />
    </Box>
  )
}

const dateOptions = { shrink: true }
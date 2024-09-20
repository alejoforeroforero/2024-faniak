import { useEffect, useState } from 'react';
import {
  DialogContent,
} from '@material-ui/core'
import ContainedButton from '../../../ContainedButton'
import BaseDialogActions from '../../../BaseDialogActions'
import BaseDialogTitle from '../../../BaseDialogTitle'
import { updateFolder } from '../../../../api/folder/update'
import BaseDialog from '../../../BaseDialog'
import Form from './Form'
import { useSnackbar } from 'notistack'
import { formTrimmers } from '../../../../utils/formUtils'

export default function DialogEdit({
  folder,
  handleClose,
  metadata,
  fetchContent,
}) {
  const [form, setForm] = useState({ ...metadata })
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  // keep the year updated when the release date is changed
  useEffect(() => {
    const date = new Date(form.release_date)
    if (date.getTime()) {
      // date is valid
      setForm(prev => {
        prev.year = date.getFullYear().toString()
        return { ...prev }
      })
    }
  }, [form.release_date])

  const handleSave = () => {
    setSubmitting(true)

    const main_genre = form.main_genre.trim()
    const other_genres = formTrimmers.list(form.other_genres)
    const version = form.is_version ? form.version : ""

    const payload = {
      title: form.title.trim(),
      genres: main_genre ? [main_genre, ...other_genres] : [],
      isrc_code: form.isrc_code.trim(),
      iswc_code: form.iswc_code.trim(),
      tunecode: form.tunecode.trim(),
      parental_warning: form.parental_warning,
      is_cover: form.is_cover,
      version: version.trim(),
      is_instrumental: form.is_instrumental,
      keywords: formTrimmers.list(form.keywords),
      mood: formTrimmers.list(form.mood),
      bpm: form.bpm.trim(),
      key: form.key.trim(),
      lyrics: form.is_instrumental ? "" : form.lyrics.trim(),
      lyrics_language: form.is_instrumental ? "" : form.lyrics_language.trim(),
      release_date: formTrimmers.date(form.release_date),
      year: form.year.trim(),
      record_label: form.record_label.trim(),
      record_label_owns_master: form.record_label_owns_master,
      description: form.description.trim(),
    }

    updateFolder({
      folder_id: folder.id,
      data: payload,
    })
      .then(res => {
        if (res.error) {
          setSubmitting(false)
          enqueueSnackbar("An error occured while saving. Please contact support or try again", { variant: "error" })
          return
        }

        enqueueSnackbar("Metadata saved", { variant: "success" })
        handleClose()
        fetchContent()
      })
  }

  return (
    <BaseDialog maxWidth="md">
      <BaseDialogTitle handleClose={handleClose}>
        Metadata for "{folder.name}"
      </BaseDialogTitle>

      <DialogContent>
        <Form form={form} setForm={setForm} />
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton loading={submitting} onClick={handleSave}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog >
  )
}
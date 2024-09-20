import { Button, Card } from '@material-ui/core'
import { useState } from 'react'
import PreviewSection from '../../PreviewSection'
import DialogEdit from './DialogEdit'
import Preview from './Preview'

export default function Timetable({ event, refreshEvent }) {
  const folder = event.smart_folder
  const [showDialog, setShowDialog] = useState(false)
  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  return (
    <PreviewSection
      text="Timetable"
      handleEdit={folder.data.timetable.length ? handleOpenDialog : null}
    >
      {folder.data.timetable.length ? (
        <Preview event={event} />
      ) : (
        <Card variant="outlined">
          <Button color="primary" fullWidth onClick={handleOpenDialog}>
            Edit timetable
          </Button>
        </Card>
      )}
      {showDialog && (
        <DialogEdit
          event={event}
          handleClose={handleCloseDialog}
          refreshEvent={refreshEvent}
        />
      )}
    </PreviewSection>
  )
}
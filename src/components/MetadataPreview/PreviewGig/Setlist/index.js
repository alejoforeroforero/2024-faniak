import { useState } from 'react';
import DialogEdit from './DialogEdit'
import Song from './Song'
import {
  Card,
  Button,
  Box,
} from '@material-ui/core'
import PreviewSection from '../../PreviewSection'

export default function Setlist({ refreshEvent, gigSongs, event, canEdit }) {
  const folder = event.smart_folder

  const [showDialog, setShowDialog] = useState(false)
  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  return (
    <PreviewSection
      text="Setlist"
      handleEdit={gigSongs.length && canEdit ? handleOpenDialog : null}
    >
      <Card variant="outlined">
        {gigSongs.length ? (
          <Box mt={0.5} mb={0.5}>
            {gigSongs.map(
              (song, index) => (
                <Song
                  key={index}
                  song={song}
                  index={index}
                  show_encore={folder.data.encore_index === index}
                />
              )
            )}
          </Box>
        ) : (
          <Button
            disabled={!canEdit}
            fullWidth
            color="primary"
            onClick={handleOpenDialog}
          >
            Add songs
          </Button>
        )}
      </Card>

      {showDialog && (
        <DialogEdit
          initial={gigSongs}
          event={event}
          handleClose={handleCloseDialog}
          refreshEvent={refreshEvent}
        />
      )}
    </PreviewSection>)
}
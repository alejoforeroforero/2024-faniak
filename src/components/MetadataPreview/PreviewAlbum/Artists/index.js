import { useState } from 'react';
import DialogEditCreditedArtists from '../../../DialogEditCreditedArtists'
import Artist from './Artist'
import {
  Button,
  Card,
} from '@material-ui/core'
import { relationTypes } from '../../../../dictionary/relation'
import PreviewSection from '../../PreviewSection'

export default function Artists({ fetchContent, artists, folder, canEdit }) {
  const [showDialog, setShowDialog] = useState(false)
  const handleEdit = () => setShowDialog(true)

  return (
    <PreviewSection
      text="Artists"
      handleEdit={artists.length && canEdit ? handleEdit : undefined}
    >
      <Card variant="outlined">
        {artists.length ? (
          artists.map((artist, index) => (
            <Artist
              key={index}
              artist={artist}
            />
          ))
        ) : (
          <Button
            fullWidth
            color="primary"
            disabled={!canEdit}
            onClick={handleEdit}
          >
            Add Artist
          </Button>
        )}
      </Card>

      {showDialog && (
        <DialogEditCreditedArtists
          initial={artists}
          folder={folder}
          handleClose={() => setShowDialog(false)}
          fetchContent={fetchContent}
          type={relationTypes.ARTIST_ALBUM}
        />
      )}
    </PreviewSection>)
}
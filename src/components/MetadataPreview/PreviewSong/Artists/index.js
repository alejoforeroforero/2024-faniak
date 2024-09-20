import { useState } from 'react';
import DialogEditCreditedArtists from '../../../DialogEditCreditedArtists'
import Artist from '../../PreviewAlbum/Artists/Artist'
import {
  Button,
  Card,
} from '@material-ui/core'
import { relationTypes } from '../../../../dictionary/relation'
import PreviewSection from '../../PreviewSection'

export default function Artists({ fetchContent, artists, folder, canEdit }) {
  const [showDialog, setShowDialog] = useState(false)
  const handleEdit = () => setShowDialog(true)

  const _artists = artists.map((artist, index) => (
    <Artist
      key={index}
      artist={artist}
    />
  ))

  return (
    <PreviewSection
      text="Artists"
      handleEdit={artists.length && canEdit ? handleEdit : undefined}
    >
      <Card variant="outlined">
        {artists.length
          ? _artists
          : (
            <Button
              fullWidth
              disabled={!canEdit}
              color="primary"
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
          type={relationTypes.ARTIST_SONG}
        />
      )}
    </PreviewSection>
  )
}
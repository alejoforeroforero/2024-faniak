import { useState, useEffect } from 'react';
import Tracklist from './Tracklist'
import Metadata from './Metadata'
import Artists from './Artists'
import { getFolderRelationships } from '../../../api/drive/getFolderRelationships'
import useIsMounted from '../../../utils/useIsMounted'
import { getFolderCredits } from '../../../api/drive/getFolderCredits'
import SmartFolder from '../SmartFolder'
import FolderTeam from '../../credits/FolderTeam'
import ReaderOnlyNotice from '../ReaderOnlyNotice'
import Files from './Files'
import ButtonMenu from '../ButtonMenu';
import Preview from '../Preview';

export default function PreviewAlbum({ file, fetchContent, canEdit, handleOpenTeam }) {
  const { smart_folder } = file

  const [credits, setCredits] = useState([])
  const [albumSongs, setAlbumSongs] = useState([])
  const [artists, setArtists] = useState([])
  const isMounted = useIsMounted()

  useEffect(fetchCredits, [smart_folder])
  useEffect(fetchRelationships, [smart_folder])

  function fetchCredits() {
    getFolderCredits({ folder_id: smart_folder.id })
      .then(data => {
        if (data.error) return
        if (!isMounted()) return

        setCredits(data.credits)
      })
  }

  function fetchRelationships() {
    getFolderRelationships({ folder_id: smart_folder.id }, { includeThumbnails: true })
      .then(data => {
        if (data.error) return
        if (!isMounted()) return

        setAlbumSongs(data.album_song)

        setArtists(
          data.artist_album.map(artist_album => ({
            ...artist_album.relation.data,
            ...artist_album
          })).concat(
            smart_folder.data.artists
          )
        )
      })
  }

  return (
    <Preview>
      <SmartFolder file={file} handleOpenTeam={handleOpenTeam}>
        <ButtonMenu
          defaultParentId={smart_folder.google_folder_id}
          handleOpenTeam={handleOpenTeam}
          fetchContent={fetchContent}
          file={file}
        />
      </SmartFolder>

      {!canEdit && <ReaderOnlyNotice />}

      <FolderTeam
        file={file}
        credits={credits}
        handleOpenTeam={handleOpenTeam}
      />
      <Files
        canEdit={canEdit}
        folder={smart_folder}
        fetchContent={fetchContent}
      />
      <Artists
        canEdit={canEdit}
        folder={smart_folder}
        artists={artists}
        fetchContent={fetchContent}
      />
      <Tracklist
        canEdit={canEdit}
        folder={smart_folder}
        albumSongs={albumSongs}
        fetchContent={fetchRelationships}
      />
      <Metadata
        canEdit={canEdit}
        folder={smart_folder}
        fetchContent={fetchContent}
      />
    </Preview>
  )
}
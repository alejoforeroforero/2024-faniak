import { useEffect, useState } from 'react';
import Metadata from './Metadata'
import Links from './Links'
import { getFolderCredits } from '../../../api/drive/getFolderCredits'
import useIsMounted from '../../../utils/useIsMounted'
import SmartFolder from '../SmartFolder'
import FolderTeam from '../../credits/FolderTeam'
import ReaderOnlyNotice from '../ReaderOnlyNotice'
import Files from './Files'
import ButtonMenu from '../ButtonMenu';
import Preview from '../Preview';

export default function PreviewArtist({ file, fetchContent, canEdit, handleOpenTeam }) {
  const { smart_folder } = file

  const [credits, setCredits] = useState([])
  const isMounted = useIsMounted()

  useEffect(fetchCredits, [smart_folder])

  function fetchCredits() {
    getFolderCredits({ folder_id: smart_folder.id })
      .then(data => {
        if (data.error) return
        if (!isMounted()) return

        setCredits(data.credits)
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
      <Links
        canEdit={canEdit}
        folder={smart_folder}
        fetchContent={fetchContent}
      />
      <Metadata
        canEdit={canEdit}
        folder={smart_folder}
        fetchContent={fetchContent}
      />
    </Preview>
  )
}
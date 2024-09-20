import { useState, useEffect, useCallback } from 'react';
import Metadata from './Metadata'
import ArtistGig from './ArtistGig'
import Setlist from './Setlist'
import { relationTypes } from '../../../dictionary/relation'
import { getFolderRelationships } from '../../../api/drive/getFolderRelationships'
import { getFolderCredits } from '../../../api/drive/getFolderCredits'
import useIsMounted from '../../../utils/useIsMounted'
import Attachments from './Attachments'
import { isEventOrganizer } from '../../../api/google/store'
import SmartEvent from '../SmartEvent'
import FolderTeam from '../../credits/FolderTeam'
import ReaderOnlyNotice from '../ReaderOnlyNotice'
import Timetable from './Timetable';
import ButtonMenu from '../ButtonMenu';
import Preview from '../Preview';

export default function PreviewGig({ event, fetchEvent, handleOpenTeam }) {
  const { smart_folder, artist } = event
  const canEdit = true
  const isOrganizer = isEventOrganizer(event)

  const refreshEvent = useCallback(async () => {
    await fetchEvent(event.id)
  }, [fetchEvent, event.id])

  const [credits, setCredits] = useState([])
  const [artistGig, setArtistGig] = useState(null)
  const [gigSongs, setGigSongs] = useState([])
  const isMounted = useIsMounted()

  useEffect(() => {
    fetchCredits()
    fetchRelationships()
    // cleanup so that stuff doesn't get left behind 
    // if you click another event and the fetching fails
    return () => {
      setCredits([])
      setArtistGig(null)
      setGigSongs([])
    }
  }, [smart_folder])

  function fetchCredits() {
    getFolderCredits({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      }
    })
      .then(data => {
        if (data.error) return
        if (!isMounted()) return

        setCredits(data.credits)
      })
  }

  function fetchRelationships() {
    getFolderRelationships({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      }
    }, {
      includeThumbnails: true
    })
      .then(data => {
        if (data.error) return
        if (!isMounted()) return

        setGigSongs(data[relationTypes.GIG_SONG])
        setArtistGig(data[relationTypes.ARTIST_GIG][0] || null)
      })
  }

  // const title = [smart_folder.data.venue, smart_folder.data.location]
  //   .filter(x => x.trim()).join(", ") || "Unknown Location"

  return (
    <Preview>
      <SmartEvent event={event} handleOpenTeam={handleOpenTeam}>
        <ButtonMenu
          defaultParentId={artistGig?.folder?.google_folder_id || null}
          handleOpenTeam={handleOpenTeam}
          fetchContent={refreshEvent}
          canEdit={isOrganizer}
          event={event}
        />
      </SmartEvent>

      {!canEdit && <ReaderOnlyNotice />}

      <FolderTeam
        event={event}
        credits={credits}
        handleOpenTeam={handleOpenTeam}
      />
      <ArtistGig
        isOrganizer={isOrganizer}
        event={event}
        artistGig={artistGig}
        refreshEvent={refreshEvent}
      />
      <Attachments
        isOrganizer={isOrganizer}
        event={event}
        refreshEvent={refreshEvent}
      />
      <Timetable
        event={event}
        refreshEvent={refreshEvent}
      />
      <Setlist
        canEdit={canEdit}
        event={event}
        gigSongs={gigSongs}
        refreshEvent={refreshEvent}
      />
      <Metadata
        isOrganizer={isOrganizer}
        event={event}
        folder={smart_folder}
        refreshEvent={refreshEvent}
      />
    </Preview>
  )
}
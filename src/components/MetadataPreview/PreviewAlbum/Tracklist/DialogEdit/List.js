import Disk from './Disk'
import Track from './Track'
import {
  Box,
} from '@material-ui/core'
import {
  sortableContainer,
} from 'react-sortable-hoc'

const SortableContainer = sortableContainer(
  ({ children }) => <Box mt={-1}>{children}</Box>
);

export default function List({ collectionState, deletedState, folder }) {

  const [collection, setCollection] = collectionState
  const [deleted, setDeleted] = deletedState

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (newIndex === 0) return

    if (oldIndex !== newIndex) {
      setCollection(prev => {
        const [item] = prev.splice(oldIndex, 1)

        prev.splice(newIndex, 0, item)

        return [...prev]
      })
    }
  }

  const handleDeleteTrack = (index) => (event) => {
    setDeleted(prev => {
      prev.push(collection[index].data)
      return [...prev]
    })

    setCollection(prev => {
      return prev.filter((elem, i) => index !== i)
    })
  }

  const handleDeleteDisk = (disk_index) => (event) => {
    const initialStatus = {
      found_disk: false,
      end_filter: false,
    }

    setDeleted(prev => {
      const status = { ...initialStatus }

      const to_delete = collection
        .filter((elem) => filterTracksOnDisk(elem, status, disk_index))
        .map(elem => elem.data)

      return prev.concat(to_delete)
    })

    setCollection(prev => {
      const status = { ...initialStatus }

      return prev
        .filter((elem) => !filterTracksOnDisk(elem, status, disk_index))
        .filter((elem) => elem.type !== "disk" || elem.disk_index !== disk_index)
    })
  }

  const filterTracksOnDisk = (elem, status, disk_index) => {
    //this means it's included in this disk
    if (status.found_disk && !status.end_filter && elem.type === "track") return true
    // this means this disk is over (found the  next one)
    if (status.found_disk && !status.end_filter) {
      status.end_filter = true
    }
    // this means this disk has been found
    if (!status.found_disk && elem.disk_index === disk_index) {
      status.found_disk = true
    }
    return false
  }



  var track_position_ctr = 0

  const items = collection.map((item, index) => {

    if (item.type === "disk") {
      track_position_ctr = 0
      return <Disk
        key={`${index}#disk`}
        index={index}
        folder={folder}
        disk_index={item.disk_index}
        onDelete={handleDeleteDisk(item.disk_index)}
        collectionState={[collection, setCollection]}
      />
    }

    const track_index = track_position_ctr

    track_position_ctr++

    return <Track
      key={`${item.data.folder.id}#track`}
      index={index}
      track_index={track_index}
      onDelete={handleDeleteTrack(index)}
      data={item.data}
    />
  })

  return (
    <SortableContainer
      lockAxis="y"
      onSortEnd={onSortEnd}
      useDragHandle
    >
      {items}
    </SortableContainer>
  )
}
import Encore from './Encore'
import Song from './Song'
import {
  Box,
} from '@material-ui/core'
import {
  sortableContainer,
} from 'react-sortable-hoc'

const SortableContainer = sortableContainer(
  ({ children }) => <Box mt={-1}>{children}</Box>
);

export default function List({ collectionState, setDeleted }) {

  const [collection, setCollection] = collectionState

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setCollection(prev => {
        const moved_obj = prev[oldIndex]
        const new_array = prev.filter((elem, index) => index !== oldIndex)
        new_array.splice(newIndex, 0, moved_obj)

        return new_array
      })
    }
  }

  const handleDeleteSong = (index) => (event) => {
    setDeleted(prev => {
      prev.push(collection[index])
      return [...prev]
    })

    setCollection(prev => prev.filter((elem, i) => index !== i))
  }

  var song_position_ctr = 0

  const items = collection.map((item, index) => {

    if (item.type === "encore") {
      return <Encore
        key="encore"
        index={index}
      />
    }

    const song_index = song_position_ctr

    song_position_ctr++

    return <Song
      key={index}
      index={index}
      song_index={song_index}
      onDelete={handleDeleteSong(index)}
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
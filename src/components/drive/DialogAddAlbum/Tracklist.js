import { useState } from 'react';
import {
  sortableContainer,
} from 'react-sortable-hoc'
import Track from './Track'

export default function Tracklist({
  tracklist, setTracklist,
}) {
  const [expanded, setExpanded] = useState(null)
  const handleChangeAccordion = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : null)
  }

  const SortableContainer = sortableContainer(
    ({ children }) => <div>{children}</div>
  )

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setTracklist(prev => {
        const [item] = prev.splice(oldIndex, 1)

        prev.splice(newIndex, 0, item)

        return [...prev]
      })
    }
  }

  return (
    <SortableContainer
      lockAxis="y"
      onSortEnd={onSortEnd}
      useDragHandle
      lockToContainerEdges
    >
      {tracklist.map((song, index) => (
        <Track
          key={index}
          track_index={index} //passed down to Track
          index={index} //used by sortable lib
          onExpand={handleChangeAccordion(index)}
          expanded={expanded === index}
          tracklist={tracklist} setTracklist={setTracklist}
        />
      ))}
    </SortableContainer>
  )
}
import { useMemo } from 'react'
import { linkTypes } from '../../../../dictionary/links'
import BaseMenu from '../../../BaseMenu'

export default function MenuAddLink({ linksState, menuAnchorState }) {
  const [links, setLinks] = linksState

  //filter links for sites that have already been added
  const items = useMemo(() => {
    const handleClickItem = (name) => () => {
      setLinks(prev => [...prev, {
        name: name,
        link: "",
      }])
    }

    return Object.keys(linkTypes)
      .filter(key => !links.find(elem => elem.name === key))
      .map(key => {
        const link = linkTypes[key]
        return ({
          label: link.label,
          icon: link.icon,
          callback: handleClickItem(key)
        })
      })
  }, [links])

  return (
    <BaseMenu
      menuState={menuAnchorState[0]}
      setMenuState={menuAnchorState[1]}
      items={items}
    />
  )
}
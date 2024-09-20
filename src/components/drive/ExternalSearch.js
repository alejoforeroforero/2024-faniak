import BaseSearchField, { searchResultTypes } from '../BaseSearchField'
import AddIcon from '@material-ui/icons/Add'
import { searchInternet } from '../../api/connections/searchInternet'

export default function ExternalSearch({ submitConnection, submitName, type, label = "" }) {
  
  const fetchResults = async (string) => {
    if (string.length < 3) return []

    const results = []

    await searchInternet({ name: string, type: type })
      .then(res => {
        if (res.error) return
        results.push(...res.results.map(result => ({
          type: searchResultTypes.SOURCE,
          data: result,
          selectData: submitConnection,
        })))
      })

    results.unshift({
      type: searchResultTypes.ACTION,
      data: {
        label: "Create From Scratch",
        icon: <AddIcon />,
      },
      selectData: () => submitName(string),
    })

    return results
  }

  return (
    <BaseSearchField
      label={label}
      autoFocus
      fetchResults={fetchResults}
      delay={1000}
    />
  )
}
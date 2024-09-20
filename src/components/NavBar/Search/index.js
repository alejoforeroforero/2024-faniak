
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { useHistory } from 'react-router'
import { googleMimeTypes } from '../../../api/google/store'
import { routes } from '../../../Routes'
import BaseSearchField, { searchResultTypes } from '../../BaseSearchField'
import { searchFiles } from '../../../api/drive/getFiles'

const useStyles = makeStyles(theme => ({
  search: {
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    padding: theme.spacing(1, 2, 0, 0),
  },
  searchInput: {
    width: theme.spacing(32),
  }
}))

export default function Search() {
  const classes = useStyles()
  const history = useHistory()

  const selectFolder = (folder) => {
    history.push(routes.folder(folder.google_folder_id))
  }

  const fetchResults = async (string) => {
    if (string.length < 3) return []

    const files = await searchFiles({
      q: string,
      filters: [`mimeType = '${googleMimeTypes.FOLDER}'`],
    }, {
      includeThumbnails: true
    })
      .then(res => {
        if (res.error) return []
        return res.files
      })

    const results = files
      .filter(x => x.smart_folder)
      .map(file => ({
        type: searchResultTypes.FOLDER,
        data: file.smart_folder,
        selectData: selectFolder,
      }))

    return results
  }

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon color="secondary" />
      </div>
      <div className={classes.searchInput}>
        <BaseSearchField
          autoFocus
          variant="standard"
          placeholder="Search Smart Folders…"
          fetchResults={fetchResults}
        />
      </div>
    </div>
  )
}
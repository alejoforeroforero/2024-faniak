import { useMemo } from 'react';
import {
  Link,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { folderTypes, folderColors } from '../../dictionary/folder'
import Folder from '../Folder'

const useStyles = makeStyles(({ spacing, palette }) => ({
  content: {
    position: "relative",
    padding: spacing(1),
    '&::before': {
      content: ({ selected }) => selected ? "''" : "",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.06,
      backgroundColor: ({ color }) => color,
    },
  },
  name: {
    fontWeight: 600,
  },
  textSmall: {
    position: "relative",
    fontSize: 11,
  },
}))

export default function Result({ selected, data, onClick }) {
  const classes = useStyles({
    color: folderColors[folderTypes.ALBUM],
    selected
  })

  const folder = useMemo(() => ({
    type: folderTypes.ALBUM,
    picture: data.picture
  }), [data])

  return (
    <Folder
      selected={selected}
      onClick={onClick}
      folder={folder}
    >
      <div className={classes.content}>
        <Typography noWrap variant="body2" className={classes.name}>
          {data.name}
        </Typography>
        <Typography noWrap className={classes.textSmall}>
          {data.n_tracks} song{data.n_tracks === 1 ? "" : "s"} 
          {/* &#8226; <Link
            href={data.url} target="_blank" rel="noopener">
            See more
          </Link> */}
        </Typography>
      </div>
    </Folder>
  )
}
import { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  Typography,
} from '@material-ui/core'
import { searchResultTypes } from '.'
import { folderIcons, folderColors, getColoredFolderIcon } from '../../dictionary/folder'
import { avatarProps } from '../baseProps'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'

const useStyles = makeStyles(theme => ({
  root: {
    "& .avatar": {
      height: 24,
      width: 24,
    },
    "& .text": {
      paddingLeft: 10,
    },
    "& .small": {
      paddingLeft: 4,
      fontSize: 13,
      opacity: 0.7,
      lineHeight: "normal",
    },
    "& .button": {
      marginTop: -8,
      marginBottom: -8,
      marginRight: -8,
      padding: 8,
    },
    "& .coloredIcon": {
      marginLeft: -8,
      marginRight: 4,
      height: 18,
    },
  },
}))

export default function Result({ resetInput, result, selectedRef }) {
  const classes = useStyles()

  const handleClick = () => {
    result.selectData(result.data)
    resetInput()
  }

  const getResultComponent = (type, data) => {
    switch (type) {
      case searchResultTypes.PERSON: return renderPerson(data)
      case searchResultTypes.FOLDER: return renderFolder(data)
      case searchResultTypes.FILE: return renderFile(data) // unused and unfinished
      case searchResultTypes.ACTION: return renderAction(data)
      case searchResultTypes.SOURCE: return renderSource(data)
      default: return null
    }
  }

  return (
    <ListItem
      button
      selected={!!selectedRef}
      ref={selectedRef}
      onClick={handleClick}
      className={classes.root}
    >
      {getResultComponent(result.type, result.data)}
    </ListItem>
  )
}

const renderPerson = (data) => {
  const first = data.name || data.email
  const second = first === data.email ? "" : data.email
  return <>
    <Avatar
      {...avatarProps}
      src={data.picture ?? ""}
      className={"avatar"}
    />
    <Typography noWrap variant="body2" className={"text"}>
      {first}
      {second && <span className={"small"}>{second}</span>}
    </Typography>
  </>
}

const renderFolder = (data) => {
  const Icon = folderIcons[data.type]
  const ColoredIcon = getColoredFolderIcon(data.type)
  return <>
    <ColoredIcon className={"coloredIcon"} />
    <Avatar
      {...avatarProps}
      variant="square"
      src={data.picture}
      // style={{
      //   borderLeft: `3px solid ${folderColors[data.type]}`,
      // }}
      className={"avatar"}
    >
      <Icon />
    </Avatar>
    <Typography noWrap variant="body2" className={"text"}>
      {data.name}
    </Typography>
  </>
}

const renderFile = (data) => {
  const type = data.smart_folder?.type || ""
  const picture = data.smart_folder?.picture || data.thumbnailLink || ""
  const Icon = folderIcons[type]
  return <>
    <Avatar
      {...avatarProps}
      variant="square"
      src={picture}
      className={"avatar"}
    >
      <Icon />
    </Avatar>
    <Typography noWrap variant="body2" className={"text"}>
      {data.name}
    </Typography>
  </>
}

const renderAction = (data) => {
  return <>
    {data.icon}
    <div className={"text"}>
      {data.label}
    </div>
  </>
}

const renderSource = (data) => {
  const first = data.name || data.email
  return <>
    <Avatar
      {...avatarProps}
      src={data.picture ?? ""}
      variant="square"
      className={"avatar"}
    />
    <Box overflow="hidden" flexGrow={1}>
      <Typography noWrap variant="body2" className={"text"}>
        {first}
      </Typography>
    </Box>
    <IconButton
      onClick={e => e.stopPropagation()}
      className={"button"}
      variant="outlined"
      color="primary"
      size="small"
      href={data.url}
      target="_blank"
      rel="noopener"
    >
      <OpenInNewIcon />
    </IconButton>
  </>
}
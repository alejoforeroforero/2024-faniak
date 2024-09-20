import Metadata from './Metadata'
import { useContext } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { PREVIEW_WIDTH, StateContext } from '../../../store'
import Preview from '../Preview'
import { getTargetFile } from '../../../api/google/store'
import ButtonBack from '../ButtonBack';
import ButtonTeam from '../ButtonTeam';

const useStyles = makeStyles((theme) => ({
  backButton: {
    position: "fixed",
    top: 28,
    right: PREVIEW_WIDTH - 32,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(2, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    '& .MuiTypography-root': {
      fontSize: 18,
    },
  },
}))

export default function PreviewFile({ file, fetchContent, handleOpenTeam }) {
  const state = useContext(StateContext)
  const classes = useStyles()
  const targetFile = getTargetFile(file)
  return (
    <Preview>
      <ButtonBack className={classes.backButton} />

      <div className={classes.header}>
        <Box pl={state.selected_file ? 3.5 : 0} pr={1.5} display="flex">
          <img src={targetFile.iconLink || ""} alt="" />
        </Box>

        <Box flexGrow={1} overflow={"hidden"}>
          <Typography noWrap>
            {targetFile.name || ""}
          </Typography>
        </Box>

        {!!file.permissions && (
          <ButtonTeam
            file={file}
            handleOpenTeam={handleOpenTeam}
          />
        )}
      </div>

      <Metadata file={file} />
    </Preview>
  )
}
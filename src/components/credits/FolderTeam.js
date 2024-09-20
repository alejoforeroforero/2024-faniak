import { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import PreviewSection from '../MetadataPreview/PreviewSection'
import WrapTextIcon from '@material-ui/icons/WrapText'
import { useSnackbar } from 'notistack'
import { mergeCreditsIntoFolder } from '../../utils/creditsUtils'
import MenuFileSelection from '../MenuFileSelection'
import { getInitialMenuState, getOpenMenuHandler } from '../BaseMenu'
import { Button, Card, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  preview: {
    paddingTop: 4,
    paddingBottom: 4,
    "& .item": {
      display: "flex",
      alignItems: "center",
      height: 30,
      paddingLeft: 12,
      paddingRight: 8,
    },
    "& .label": {
      fontSize: 13,
      fontWeight: 600,
      minWidth: 100,
      maxWidth: 100,
      paddingRight: 8,
    },
    "& .value": {
      fontSize: 13,
      flexGrow: 1,
    },
  },
}))

export default function FolderTeam({ file, event, credits, handleOpenTeam }) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()

  const fileMode = !!file
  const folder = fileMode ? file.smart_folder : event.smart_folder

  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())

  const copyCredits = async (files) => {
    const promises = files.map(file => mergeCreditsIntoFolder(credits, folder))

    await Promise.all(promises)

    enqueueSnackbar("Your credits have been copied.", { variant: "success" })
  }

  const actions = useMemo(() => [{
    label: "Copy Credits",
    icon: WrapTextIcon,
    disabled: !credits.length,
    callback: getOpenMenuHandler(setSelectionMenu),
  }], [credits.length])

  return (
    <PreviewSection
      text="Team"
      actions={actions}
      handleEdit={!!credits.length && handleOpenTeam}
    >
      {credits.length ? (
        <Card variant="outlined" className={classes.preview}>
          {credits.map((credit, i) => (
            <div className="item" key={i}>
              <Typography className="label" noWrap>
                {credit.name}
              </Typography>
              <Typography className="value" noWrap>
                {joinCredits(credit) || "-"}
              </Typography>
            </div>
          ))}
        </Card>
      ) : (
        <Card variant="outlined">
          <Button fullWidth color="primary" onClick={handleOpenTeam}>Add credits</Button>
        </Card>
      )}

      <MenuFileSelection
        initialParentId={event?.artist?.google_folder_id}
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={copyCredits}
        smartFolderType="*"
        blacklistedSmartFolderIds={folder ? [folder.id] : null}
        multiple
      />
    </PreviewSection>
  )
}

const joinCredits = (credit) => {
  const list = [...credit.wrote, ...credit.played, ...credit.others]
  return list.join(", ")
}
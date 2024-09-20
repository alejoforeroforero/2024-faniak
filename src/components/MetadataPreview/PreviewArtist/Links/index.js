import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
} from '@material-ui/core'
import DialogLinks from './DialogLinks'
import { linkTypes } from '../../../../dictionary/links'
import Link from './Link'
import PreviewSection from '../../PreviewSection'
import { useSnackbar } from 'notistack';

export default function Links({ folder, fetchContent, canEdit }) {
  const [showDialog, setShowDialog] = useState(false)
  const handleOpenDialog = () => setShowDialog(true)
  const { enqueueSnackbar } = useSnackbar()

  const copy = useCallback((value) => {
    navigator.clipboard.writeText(value)
    enqueueSnackbar("Copied to clipboard!", { variant: "success" })
  }, [])

  const links = folder.data.social_networks

  return (
    <PreviewSection
      text="Socials"
      handleEdit={links.length && canEdit ? handleOpenDialog : null}
    >
      <Card variant="outlined">
        {links.length ? (
          <Box pt={0.5} pb={0.5}>
            {links.map(link => {
              return <Link
                key={link.name}
                icon={linkTypes[link.name]?.icon}
                url={link.link}
                handleCopy={copy}
              />
            })}
          </Box>
        ) : (
          <Button
            fullWidth
            disabled={!canEdit}
            color="primary"
            onClick={() => setShowDialog(true)}
          >
            Add Link
          </Button>
        )}
      </Card>
      {showDialog && (
        <DialogLinks
          handleClose={() => setShowDialog(false)}
          fetchContent={fetchContent}
          folder={folder}
          initial={links}
        />
      )}
    </PreviewSection>
  )
}
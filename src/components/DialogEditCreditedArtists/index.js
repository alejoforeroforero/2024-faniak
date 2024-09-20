import { useState } from 'react';
import {
  DialogContent,
  Button,
  Box,
} from '@material-ui/core'
import Item from './Item'
import AddIcon from '@material-ui/icons/Add'
import ContainedButton from '../ContainedButton'
import BaseDialogActions from '../BaseDialogActions'
import BaseDialogTitle from '../BaseDialogTitle'
import { deleteRelation } from '../../api/relation/delete'
import { createRelation } from '../../api/relation/create'
import { updateRelation } from '../../api/relation/update'
import { updateFolder } from '../../api/folder/update'
import BaseDialog from '../BaseDialog'

const getEmptyItem = () => ({
  folder: null,
  relation: null,
  is_deleted: false,
  is_folder_updated: false,
  name: "",
  role: "main" // main or featured or remixer
})

const getInitialCollection = (initial) => {
  if (!initial.length) return [getEmptyItem()]

  return initial.map(
    (artist) => ({
      ...artist,
      is_deleted: false,
      is_folder_updated: false,
    })
  )
}

export default function DialogEditCreditedArtists({
  handleClose,
  initial = [],
  fetchContent,
  folder,
  type,
}) {
  const [collection, setCollection] = useState(getInitialCollection(initial))
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = event => {
    setCollection(prev => prev.concat([getEmptyItem()]))
  }

  const submit = () => {
    setSubmitting(true)

    const promises = []

    const artists = []

    const createRelationAndSave = (item) => {
      promises.push(
        createRelation(type)({
          parent_folder: { folder_id: item.folder.id }, //artist
          child_folder: { folder_id: folder.id }, //album or song
          data: {
            name: item.name,
            role: item.role,
          }
        })
      )
    }

    const updateRelationAndSave = (item) => {
      promises.push(
        updateRelation({
          relation_id: item.relation.id,
          folder_id: folder.id,
          data: {
            name: item.name || item.folder.name,
            role: item.role,
          }
        })
      )
    }

    const deleteCurrentRelation = (item) => {
      promises.push(
        deleteRelation({
          relation_id: item.relation.id,
          folder_id: folder.id,
        })
      )
    }

    const saveName = (item) => {
      artists.push({
        name: item.name,
        role: item.role,
      })
    }

    for (let item of collection) {

      if (item.is_deleted) {

        if (!item.relation) continue

        deleteCurrentRelation(item)
        continue
      }

      // not deleted
      if (item.relation) {

        if (item.is_folder_updated) {
          deleteCurrentRelation(item)
          createRelationAndSave(item)
          continue
        }

        // folder has not changed
        if (item.is_touched) {
          updateRelationAndSave(item)
        }
        continue
      }

      // no relation
      if (item.name) {

        // new folder
        if (item.is_folder_updated) {
          createRelationAndSave(item)
          continue
        }

        saveName(item)
        continue
      }
    }

    Promise.all(promises)
      .then(() => {
        updateFolder({
          folder_id: folder.id,
          data: { artists: artists }
        })
          .then(() => {
            setSubmitting(false)
            handleClose()
            fetchContent()
          })
      })
  }

  return (
    <BaseDialog maxWidth="sm">
      <BaseDialogTitle handleClose={handleClose}>
        Edit Credited Artists
      </BaseDialogTitle>
      <DialogContent style={{ minHeight: 180 }}>
        <div>
          {collection.map((artist, index) => (
            artist.is_deleted ? null : (
              <Item
                key={index}
                collectionState={[collection, setCollection]}
                index={index}
                artist={artist}
                handleAdd={handleAdd}
              />
            )
          ))}
        </div>

        <Box pt={1.5} display="flex" justifyContent="center">
          <Button
            fullWidth
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Artist
          </Button>
        </Box>
      </DialogContent>
      <BaseDialogActions>
        <ContainedButton onClick={submit} loading={submitting}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}
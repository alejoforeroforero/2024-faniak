import { useCallback, useMemo, useState } from 'react'
import {
  Grid,
  Button,
  Box,
} from '@material-ui/core'
import BaseTextField from '../../../form/BaseTextField'
import BaseMenu, { getInitialMenuState, getOpenMenuHandler } from '../../../BaseMenu'
import { getServiceLabel } from '../../../../dictionary/service'
import AddIcon from '@material-ui/icons/Add'

const allowedServices = ["gda"]

export default function ExternalMemberships({ form, setForm }) {
  const [menu, setMenu] = useState(getInitialMenuState())
  const openMenu = useCallback(getOpenMenuHandler(setMenu), [])

  const addMembership = useCallback((name) => {
    setForm(prev => {
      prev.external_memberships = { ...prev.external_memberships, [name]: "" }
      return { ...prev }
    })
  }, [setForm])

  const handleChangeMembership = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => {
      prev.external_memberships = { ...prev.external_memberships, [name]: value }
      return { ...prev }
    })
  }, [setForm])

  const [fields, options] = useMemo(() => {
    const list = Object
      .entries(form.external_memberships)
      .map(([name, id]) => ({ name, id }))

    const options = allowedServices
      .filter(name => !form.external_memberships.hasOwnProperty(name))
      .map(name => ({
        label: getServiceLabel(name),
        callback: () => addMembership(name)
      }))

    return [list, options]
  }, [form.external_memberships])

  return (
    <>
      {fields.map((membership, i) => (
        <GridItem key={i}>
          <BaseTextField
            fullWidth
            label={getServiceLabel(membership.name) + " member"}
            name={membership.name}
            value={membership.id}
            onChange={handleChangeMembership}
          />
        </GridItem>
      ))}
      {options.length > 0 && (
        <GridItem>
          <Box display="flex" alignItems="center" height="100%">
            <Button
              color="primary"
              onClick={openMenu}
              startIcon={<AddIcon />}
            >
              Add Membership ID
            </Button>
            <BaseMenu
              items={options}
              menuState={menu}
              setMenuState={setMenu}
            />
          </Box>
        </GridItem>
      )}
    </>
  )
}

const GridItem = (props) => <Grid item lg={4} md={4} sm={6} xs={12} {...props} />
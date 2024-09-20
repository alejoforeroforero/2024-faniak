import { useContext, useEffect, useState } from 'react';
import {
  Avatar,
  Checkbox,
  DialogContent,
  Typography,
} from '@material-ui/core'
import BaseDialogTitle from '../BaseDialogTitle'
import { makeStyles } from '@material-ui/core/styles'
import { StateContext } from '../../store'
import BaseDialog from '../BaseDialog'
import BaseDialogActions from '../BaseDialogActions'
import ContainedButton from '../ContainedButton'
import { addEmployee } from '../../api/member/addEmployee'
import urls from '../../api/urls'
import { listDirectoryContacts } from '../../api/people/listDirectoryContacts'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { useSnackbar } from 'notistack'
import { avatarProps } from '../baseProps'

const avatarSize = 28

const useStyles = makeStyles(theme => ({
  person: {
    display: "flex",
    alignItems: "center",
    paddingTop: 8,
    fontWeight: 600,
    '&:first-child': {
      paddingTop: 0,
    },
    '& .email': {
      // paddingLeft: 4,
      opacity: 0.6,
      fontWeight: 500,
    },
  },
  email: {
    opacity: 0.6,
    fontWeight: 500,
  },
  avatar: {
    height: avatarSize,
    width: avatarSize,
    marginRight: 8,
  },
}))

export default function DialogDirectoryPeople({ handleClose, limitTotalEmployees, fetchUser }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const classes = useStyles()
  const [people, setPeople] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const curr_payed_employees = state.employees.length + 1
  const curr_selected = people.filter(person => !person.ignored).length
  const spots_remaining = state.user.subscription_quantity - curr_payed_employees - curr_selected
  const needs_to_upgrade = limitTotalEmployees && spots_remaining < 0

  const handleChangeCheckbox = (index) => (e) => {
    const { checked } = e.target
    setPeople(prev => {
      prev[index].ignored = !checked
      return [...prev]
    })
  }

  useEffect(() => {
    listDirectoryContacts()
      .then(res => {
        if (res.error) {
          enqueueSnackbar("We couldn't connect with Google... Sorry!", { variant: "error" })
          handleClose()
        }
        var spots_left = spots_remaining
        const filtered_people = res.people
          .filter(person => person.email)
          .map(person => {
            const is_me = person.email === state.user.email
            const is_teammate = !!state.employees.find(x => x.member.email === person.email)
            if (is_me || is_teammate) {
              person.ignored = true
              person.disabled = true
            } else {
              if (spots_left <= 0) {
                person.ignored = true
              } else {
                spots_left--
              }
            }
            return person
          })
        setPeople(filtered_people)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    for (const person of people) {
      if (!person.ignored) {
        await addEmployee({ ...person })
      }
    }

    fetchUser()
    handleClose()
  }

  const goToUpdatePlan = () => {
    window.open(urls.openCustomerPortal(), '_blank').focus()
  }

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Add teammates from {state.user.business_domain}
      </BaseDialogTitle>
      <DialogContent>
        {people.map((person, index) => (
          <div className={classes.person} key={index}>
            <Checkbox
              color="primary"
              checked={!person.ignored}
              disabled={person.disabled}
              onChange={handleChangeCheckbox(index)}
              className={classes.checkbox}
              icon={person.disabled ? <IndeterminateCheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            />
            <Avatar
              {...avatarProps}
              alt={person.name}
              src={person.picture}
              className={classes.avatar}
            />
            <div style={{ flexGrow: 1, overflow: "hidden", marginRight: 8 }}>
              <Typography
                variant="body2"
                noWrap
              >{person.name} <span
                className="email"
              >{person.email}</span></Typography>
            </div>
          </div>
        ))}
      </DialogContent>
      <BaseDialogActions>
        {limitTotalEmployees && (
          <div style={{ textTransform: "uppercase" }}>
            {Math.max(0, spots_remaining)} spot{getS(spots_remaining)} remaining
          </div>
        )}
        <div style={{ flexGrow: 1 }} />
        <ContainedButton
          onClick={needs_to_upgrade ? goToUpdatePlan : handleSubmit}
          loading={submitting}
        >
          {needs_to_upgrade ? "Update subscription" : "Confirm"}
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}

const getS = (number) => number === 1 ? "" : "s"
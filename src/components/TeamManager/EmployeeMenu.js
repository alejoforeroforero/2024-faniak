import BaseMenu from '../BaseMenu'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import { removeEmployee } from '../../api/member/removeEmployee'
import { useSnackbar } from 'notistack'

export default function EmployeeMenu({ employee, fetchUser, menuState }) {
  const { enqueueSnackbar } = useSnackbar()
  const { member } = employee
  const identifier = member.name || member.email

  const items = [
    {
      label: "Remove from team",
      icon: DeleteOutlineIcon,
      callback: () => {
        removeEmployee({ id: employee.id })
          .then(res => {
            if (res.error) return
            enqueueSnackbar(`${identifier} has been removed.`, { variant: "success" })
            fetchUser()
          })
      },
    }
  ]

  return <BaseMenu
    header={`Options for ${identifier}`}
    items={items}
    menuState={menuState[0]}
    setMenuState={menuState[1]}
  />
}
import { useContext, useState } from 'react';
import { StateContext } from '../../store'
import Employee from './Employee'
import { getInitialMenuState, getOpenMenuHandler } from '../BaseMenu'
import EmployeeMenu from './EmployeeMenu'

export default function EmployeeList({ fetchUser }) {

  const state = useContext(StateContext)

  const [selected, setSelected] = useState()
  const [menu, setMenu] = useState(getInitialMenuState())
  const handleOpenMenu = (employee) => (event) => {
    setSelected(employee)
    getOpenMenuHandler(setMenu)(event)
  }

  return (
    <div style={{ minHeight: 166 }}>
      <Employee member={state.user} />
      {state.employees.map((employee, index) => (
        <Employee
          key={index}
          member={employee.member}
          handleEdit={handleOpenMenu(employee)}
        />
      ))}
      {selected && <EmployeeMenu
        fetchUser={fetchUser}
        employee={selected}
        menuState={[menu, setMenu]}
      />}
    </div>
  )
}
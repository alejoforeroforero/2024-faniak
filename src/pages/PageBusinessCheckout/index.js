import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Typography,
} from '@material-ui/core'
import ContainedButton from '../../components/ContainedButton'
import Discount from './Discount'
import QuantityInput from './QuantityInput'
import Line from './Line'
import PageCentral from '../../components/PageCentral'
import { getPricePerAccount } from '../../dictionary/user'
import { DispatchContext, StateContext } from '../../store'
import urls from '../../api/urls'
import NavBar from '../../components/NavBar'
import TeamManager from '../../components/TeamManager'
import { refreshUser } from '../../utils/authUtils'

const getFinalPrice = ({ quantity, price, is_beta_tester }) => {
  const discount = 0
  // const discount = is_beta_tester ? 0.25 : 0
  const total = quantity * price
  const final = total * (1 - discount)
  return [Math.round(total * 100) / 100, Math.round(final * 100) / 100]
}

const getSearchQueryData = () => {
  const params = new URLSearchParams(window.location.search)
  const monthly = params.get("cycle") === "MONTHLY"
  const tier = params.get("tier")
  const price = getPricePerAccount(tier, monthly)
  return { monthly, tier, price }
}

const buildSearchQuery = ({ quantity, monthly, tier }) => {
  const params = new URLSearchParams(window.location.search)
  params.set('tier', tier)
  params.set('cycle', monthly ? "MONTHLY" : "ANNUAL")
  params.set('quantity', quantity)
  return params.toString()
}

// http://localhost:8002/app/businessCheckout?tier=INDIE_TIER
export default function PageBusinessCheckout() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    document.title = "Creating Team..."
  }, [])

  const [data, setData] = useState({
    quantity: 3,
    ...getSearchQueryData(),
    is_beta_tester: state.user.is_beta_tester,
  })
  const [subtotal, total] = getFinalPrice(data)

  const fetchUser = () => {
    refreshUser(dispatch)
  }

  const handleSubmit = () => {
    window.location.href = `${urls.createCheckoutSession()}?${buildSearchQuery(data)}`
  }

  return (
    <PageCentral maxWidth={580}>
      <NavBar />
      <div style={{ paddingTop: 32, paddingBottom: 32 }}>
        <Typography variant="h4" gutterBottom align="center">
          How many accounts<br /> do you want for your team?
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          ...or how badly do you want a "best boss" mug.
        </Typography>

        <QuantityInput current={state.employees.length + 1} data={data} setData={setData} />

        <TeamManager fetchUser={fetchUser} />

        <div style={{ paddingTop: 16, }} />
        <Divider />

        <Line divider>
          <div>Subtotal</div>
          <div>€{subtotal}</div>
        </Line>

        {/* {data.is_beta_tester && <Discount />} */}

        <Line>
          <div style={{ alignSelf: "start" }}>
            Total per {data.monthly ? "month" : "year"}
          </div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>
            €{total}
          </div>
        </Line>

        <div style={{ display: "flex", justifyContent: "right", marginTop: 16 }}>
          <ContainedButton
            onClick={handleSubmit}
          >
            Proceed to checkout
          </ContainedButton>
        </div>
      </div>
    </PageCentral >
  )
}
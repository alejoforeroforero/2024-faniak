import { useContext } from 'react';
import { DRIVE_UPGRADE_URL, StateContext } from '../../store'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Button,
  DialogContent,
  Divider,
} from '@material-ui/core'
import { ProgressSmartFolders, ProgressStorage } from './ProgressBar'
import Favicon from '../../svg/Favicon'
import DriveIcon from '../../svg/DriveIcon'
import { getMaxSmartFolders, getSubscriptionLabel, subscriptionTiers } from '../../dictionary/user'

const useStyles = makeStyles((theme) => ({
  service: {
    width: "100%",
    paddingLeft: theme.spacing(2, 0),
    display: "flex",
    alignItems: "center",
  },
  divider: {
    display: "flex",
    marginBottom: 8,
  },
}))

export default function Content() {
  const state = useContext(StateContext)
  const { user, businesses } = state

  const classes = useStyles()

  return (
    <DialogContent>
      {user.free_trial_ends_at ? (
        <Line
          product="Free Trial"
          details=" (Creator Plan)"
          amount={getMaxSmartFolders(subscriptionTiers.CREATOR)}
        />
      ) : (
        <Line
          product={getSubscriptionLabel(user.subscription_tier)}
          details={user.subscription_trial_active ? " (Free Trial)" : ""}
          amount={getMaxSmartFolders(user.subscription_tier)}
        />
      )}
      {businesses.length ? (
        businesses.map(({ business }, index) => (
          <Line
            key={index}
            product={getSubscriptionLabel(business.subscription_tier)}
            details={", paid by " + business.name}
            amount={getMaxSmartFolders(business.subscription_tier)}
          />
        ))
      ) : null}
      {user.is_beta_tester && (
        <Line
          product={""}
          details={"Beta Tester"}
          amount={-1}
        />
      )}

      <Divider className={classes.divider} />

      <Line
        product={""}
        details={"Total Smart Folders Available"}
        amount={user.max_smart_folders}
      />

      <Box mb={2} />

      <div className={classes.service}>
        <Favicon />
        <ProgressSmartFolders />
      </div>

      <Button
        component="a"
        href="/pricing"
        target="_blank"
        color="primary"
        fullWidth
      >
        Upgrade
      </Button>

      <Box pt={1} />

      <div className={classes.service}>
        <DriveIcon />
        <ProgressStorage />
      </div>

      <Button
        component="a"
        href={DRIVE_UPGRADE_URL}
        target="_blank"
        color="primary"
        fullWidth
      >
        Upgrade
      </Button>

      <Box pt={2} />
    </DialogContent>
  )
}

const useStyles2 = makeStyles(theme => ({
  line: { display: "flex", paddingBottom: 8 },
  name: { flexGrow: 1, fontWeight: 600, fontSize: 16 },
  description: { flexGrow: 1, fontWeight: 500, fontSize: 13 },
}))

const Line = ({ product, details, amount }) => {
  const classes = useStyles2()
  return (
    <div className={classes.line}>
      <div className={classes.name}>
        {product}
        <span className={classes.description}>
          {details}
        </span>
      </div>
      <div>{amount == -1 ? "Unlimited" : amount}</div>
    </div >
  )
}
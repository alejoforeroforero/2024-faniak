import { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { DispatchContext, ENABLE_ONBOARDING, StateContext } from '../../store'
import { Popover } from '@material-ui/core'
import { skipOnboarding } from '.'
import MousePressIcon from '../../svg/MousePressIcon'
import Template from './Template'

const useStyles = makeStyles(theme => ({
  popover: {
    // backgroundColor: theme.palette.background.default + "88",
    pointerEvents: "none",
  },
  paper: {
    position: "relative",
    overflow: "visible",
    padding: theme.spacing(3),
    width: theme.spacing(36),
  },
  click: {
    right: -32,
    bottom: -36,
    transform: "rotate(-20deg)",
    position: "absolute",
    pointerEvents: "none",
    fontSize: 69,
  },
}))

export default function AnchoredOnboarding({
  trigger = ENABLE_ONBOARDING,
  step,
  children,
  anchorOrigin,
  transformOrigin,
  title,
  text,
}) {

  const classes = useStyles()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const ref = useRef()
  const [anchor, setAnchor] = useState(false)

  useEffect(() => {
    setAnchor(ref.current)
  }, [])

  const defaultRender = <div ref={ref}>{children}</div>

  if (state.user.onboarding_step !== step) return defaultRender

  if (!anchor) return defaultRender

  const skip = () => skipOnboarding(dispatch)

  return (
    <>
      <div
        onClickCapture={skip}
        ref={ref}
        style={{ position: "relative", zIndex: 1301 }}
      >
        {children}
        <MousePressIcon className={classes.click} />
      </div>

      <Popover
        keepMounted
        open={trigger}
        anchorEl={anchor}
        anchorOrigin={anchorOrigin ?? { vertical: 'center', horizontal: 'right' }}
        transformOrigin={transformOrigin ?? { vertical: 'center', horizontal: 'left' }}
        classes={{ root: classes.popover, paper: classes.paper }}
      >
        <Template skip={skip} title={title} text={text} />
      </Popover>
    </>
  )
}
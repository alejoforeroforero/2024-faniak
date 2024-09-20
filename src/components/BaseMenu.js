import { forwardRef, useCallback } from 'react';
import { Box, Divider, Menu, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import NestedMenuItem from "material-ui-nested-menu-item"
import ArrowRight from '@material-ui/icons/ArrowRight'

const useStyles = makeStyles(theme => ({
  header: {
    opacity: "1 !important",
    maxWidth: 260,
    '& .MuiTypography-root': {
      fontWeight: 600,
    },
  },
  item: {
    minWidth: 188,
    fontSize: 14,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  arrow: {
    marginRight: `-8px !important`,
    marginLeft: `8px !important`,
  },
}))

/*
expecting items format:
[
  {
    label: "Create Song",
    icon: SongIcon,
    disabled: false,
    hidden: false,
    callback: () => {}
    items: []
  }
]

to open menu:
(event) => {
    setMenuState({
      mouseX: event.clientX,
      mouseY: event.clientY,
    })
  }
*/

export default function BaseMenu(props) {
  const { items, menuState, anchored } = props
  if (!items.length) return null // empty
  if (anchored && !menuState) return null // anchored in element
  if (!anchored && menuState.mouseY == null) return null // positioned in x, y
  return <_BaseMenu {...props} />
}

const stopPropagation = (event) => event?.stopPropagation()

function _BaseMenu({ menuState, setMenuState, anchored, items = [], header, anchorOrigin, transformOrigin, className }) {

  const classes = useStyles()

  const handleClose = useCallback((event) => {
    stopPropagation(event)

    if (anchored) {
      setMenuState(null)
    } else {
      setMenuState(getInitialMenuState())
    }
  }, [])

  const handleRightClick = useCallback((event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    handleClose()
  }, [handleClose])

  return (
    <Menu
      open
      onClick={stopPropagation}
      onClose={handleClose}
      onContextMenuCapture={handleRightClick}
      anchorReference={anchored ? "anchorEl" : "anchorPosition"}
      anchorPosition={!anchored ? { top: menuState.mouseY, left: menuState.mouseX } : null}
      anchorEl={!!anchored && menuState}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      getContentAnchorEl={null}
      className={className}
    >
      {header ? (
        <MenuItem
          tabIndex={-1}
          className={classes.header}
          disabled
        >
          <Typography noWrap>
            {header}
          </Typography>
        </MenuItem>
      ) : null}
      {
        items
          .filter(item => !item.hidden)
          .map((item, index) => (
            <Item
              key={index}
              item={item}
              handleClose={handleClose}
            />
          ))
      }
    </Menu >
  )
}

export const getOpenMenuHandler = (setMenuState) => (event) => {
  event.preventDefault()
  event.stopPropagation()
  setMenuState({
    mouseX: event.clientX,
    mouseY: event.clientY,
  })
}

export const getInitialMenuState = () => ({
  mouseX: null,
  mouseY: null,
})

export const getAnchorMenuHandler = (setMenuState) => (event) => {
  event.preventDefault()
  event.stopPropagation()
  setMenuState(event.currentTarget)
}

export const isMenuOpen = (menu) => (menu.mouseY != null)

const Item = forwardRef(({ item, handleClose, tabIndex, autoFocus }, ref) => {
  const classes = useStyles()

  if (item.divider) {
    return (
      <Box mt={1} mb={1}>
        <Divider />
      </Box>
    )
  }

  return item.items?.length && !item.disabled ? (
    <NestedMenuItem
      ref={ref}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      parentMenuOpen={true}
      className={classes.item}
      onClick={stopPropagation}
      rightIcon={<>
        <Box flexGrow={1} />
        <ArrowRight className={classes.arrow} />
      </>}
      label={<>
        {!!item.icon && <item.icon className={classes.icon} />}
        {item.label}
      </>}
    >
      {item.items
        .filter(item => !item.hidden)
        .map((sub_item, index) => (
          <Item
            key={index}
            className={classes.label}
            handleClose={handleClose}
            item={sub_item}
          />
        ))}
    </NestedMenuItem>
  ) : (
    <MenuItem
      ref={ref}
      tabIndex={tabIndex}
      autoFocus={autoFocus}
      disabled={Boolean(item.disabled)}
      className={classes.item}
      onClick={(event) => {
        event.stopPropagation()
        item.callback(event)
        handleClose()
      }}
    >
      {!!item.icon && <item.icon className={classes.icon} />}
      {item.label}
    </MenuItem>
  )
})
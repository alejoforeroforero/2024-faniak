import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  ButtonGroup,
} from '@material-ui/core'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getSubscriptionLabel } from '../../dictionary/user'

const useStyles = makeStyles(theme => ({
  button: {
    padding: 0,
  },
}))

export default function QuantityInput({ current, data, setData }) {
  const classes = useStyles()

  useEffect(() => {
    if (current > data.quantity) {
      setData(prev => {
        prev.quantity = current
        return { ...prev }
      })
    }
  }, [current])

  const moreQuantity = () => {
    setData(prev => {
      prev.quantity++
      return { ...prev }
    })
  }

  const lessQuantity = () => {
    if (data.quantity <= 3) return
    setData(prev => {
      prev.quantity--
      return { ...prev }
    })
  }

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 22, marginRight: 16 }}>
          {getSubscriptionLabel(data.tier)} x
          <span style={{ fontSize: 36, fontWeight: 600 }}>
            {data.quantity}
          </span>
        </div>
        <ButtonGroup
          orientation="vertical"
          color="primary"
          size="small"
        >
          <Button className={classes.button} onClick={moreQuantity}>
            <ExpandLessIcon />
          </Button>
          <Button
            className={classes.button}
            onClick={lessQuantity}
            disabled={data.quantity <= 3 || data.quantity <= current}
          >
            <ExpandMoreIcon />
          </Button>
        </ButtonGroup>
      </div>
    </>
  )
}
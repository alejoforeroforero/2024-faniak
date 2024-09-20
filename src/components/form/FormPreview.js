import { useCallback } from 'react';
import { Card, IconButton, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import EditIcon from '@material-ui/icons/Edit'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 4,
    paddingBottom: 4,
    "& .item": {
      display: "flex",
      alignItems: "center",
      height: 30,
      paddingLeft: 12,
      paddingRight: 8,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '& .MuiIconButton-root': {
        display: "none",
        marginLeft: 8,
      },
      '&:hover .MuiIconButton-root': {
        display: "block",
      },
    },
    "& .label": {
      fontSize: 13,
      fontWeight: 600,
      minWidth: 100,
      maxWidth: 100,
      paddingRight: 8,
    },
    "& .value": {
      fontSize: 13,
      flexGrow: 1,
    },
    "& .MuiDivider-root": {
      marginTop: 4,
      marginBottom: 4,
    },
  },
}))

export default function FormPreview({ children }) {
  const classes = useStyles()

  return (
    <Card variant="outlined" className={classes.root}>
      {children}
    </Card>
  )
}

export function PreviewItem({ label, value, handleCopy, handleEdit }) {
  const copy = useCallback(() => {
    handleCopy?.(value)
  }, [value, handleCopy])

  return (
    <div className="item">
      <Typography className="label" noWrap>
        {label}
      </Typography>
      <Typography className="value" noWrap>
        {value || "-"}
      </Typography>
      <Tooltip title="Copy to clipboard">
        <div>
          <IconButton
            component="div"
            color="primary"
            size="small"
            onClick={copy}
            disabled={!handleCopy || !value}
          >
            <FileCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </div>
      </Tooltip>
      <Tooltip title="Edit">
        <div>
          <IconButton
            component="div"
            color="primary"
            size="small"
            onClick={handleEdit}
            disabled={!handleEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  )
}
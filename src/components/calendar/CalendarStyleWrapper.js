import { makeStyles } from '@material-ui/core/styles'

export default function CalendarStyleWrapper({ onClick, showAllDay, children }) {
  const classes = useStyles({
    showAllDay: showAllDay,
  })

  return (
    <div
      className={classes.calendar}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  calendar: {
    flexGrow: 1,
    '& .rbc-calendar': {
      height: "100%",
    },
    '& .rbc-date-cell': {
      padding: 0,
      textAlign: "center",
      '& button': {
        width: 24,
        height: 24,
        marginTop: 6,
        marginBottom: 6,
        borderRadius: "100%",
      },
      '&.rbc-current button': {
        // backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
      '&.rbc-now button': {
        backgroundColor: theme.palette.primary.main,
        fontWeight: 600,
        color: theme.palette.background.paper,
      },
    },
    '& .rbc-row': {
      alignItems: "center",
    },
    '& .rbc-event': {
      padding: 0,
      '& .rbc-event': {
        color: theme.palette.text.primary,
        borderRadius: 0,
        padding: "4px 6px",
        fontSize: 12,
        transition: "background-color 0.1s",
        height: "100%",
        '& .rbc-event-time': {
          opacity: 0.75,
        },
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        '&.selected': {
          backgroundColor: theme.palette.action.selected,
        },
      },
      '& .rbc-event.hide': {
        '& .rbc-event-time': {
          display: "inline",
        },
        '&:hover .rbc-event-time': {
          display: "none",
        },
        '& .rbc-event-summary': {
          display: "none",
        },
        '&:hover .rbc-event-summary': {
          display: "inline",
        },
      },
      '&:focus': {
        outline: "none",
      },
    },
    '& .rbc-show-more': {
      backgroundColor: "transparent",
    },
    '& .rbc-day-bg, & .rbc-month-row, & .rbc-month-view, & .rbc-header': {
      borderColor: theme.palette.divider,
    },
    '& .rbc-row-segment': {
      padding: 0,
    },
    '& .rbc-header': {
      padding: theme.spacing(0.5, 0.5, 0, 0.5),
      fontWeight: 500,
      fontSize: 16,
      borderBottom: "none",
    },
    '& .rbc-month-view': {
      borderRadius: theme.shape.borderRadius,
      border: "none",
    },
    '& .rbc-day-slot .rbc-event-content': {
      lineHeight: "1.43",
    },
    '& .rbc-time-view': {
      border: "none",
      '& *': {
        borderColor: theme.palette.divider,
      },
      '& .rbc-time-content': {
        border: "none",
      },
      '& .rbc-time-header': {
        display: ({ showAllDay }) => showAllDay ? "flex" : "none",
      },
      '& .rbc-timeslot-group': {
        border: "none",
      },
      '& .rbc-time-gutter .rbc-time-slot': {
        textAlign: "left",
        paddingRight: 4,
        '&:nth-child(odd)': {
          borderTop: `1px solid ${theme.palette.divider}`,
        },
      },
      '& .rbc-day-slot': {
        cursor: "pointer",
      },
      '& .rbc-time-content > * + * > *': {
        border: "none",
      },
      '& .rbc-event': {
        border: "none",
        overflow: "visible",
        '&-label': {
          display: "none",
        },
      },
    },
    '& .rbc-today': {
      backgroundColor: "transparent",
    },
    '& .rbc-off-range-bg': {
      color: theme.palette.divider,
      backgroundColor: theme.palette.background.default,
    },
    '& button': {
      fontFamily: theme.typography.fontFamily,
    },
  },
}))
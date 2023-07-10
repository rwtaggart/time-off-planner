/**
 * Custom Theme for DateCalendar component.
 * @date 2023.Jul.10
 */

import { createTheme, ThemeProvider } from '@mui/material/styles';

const calendarFontSize = '2em'
export const dateCalendarTheme = createTheme({
  components: {
    // Name of the component ⚛️
    MuiButtonBase: {
      defaultProps: {
        // The default props to change
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          width: 'auto',
          // backgroundColor: 'gray',
        },
        day: {
          // backgroundColor: 'blue',
        }
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          // backgroundColor: 'yellow',
          // fontSize: calendarFontSize,
          // width: 'auto',
          // height: 'auto',
          // width: '20px',
          // height: '20px',
        }
      }
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          display: 'none',
          // backgroundColor: 'gray',
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          // visibility: "hidden",  // retains space "invisible"
          // display: "none",       // Removes from view
          margin: '0',
          padding: '0',
        },
        labelContainer: {
          fontSize: calendarFontSize,

        }
      }
    },
    MuiDayCalendar: {
      styleOverrides: {
        // Name of the slot
        slideTransition: {
          height: 'auto',
          'min-height': `${15*6 + 6*2}px`,
        },
        weekDayLabel: {
          // Some CSS
          fontSize: calendarFontSize,
          // backgroundColor: 'blue',
          padding: 0,
          // width: 'auto',
          // height: 'auto',
          // width: '20px',
          // height: '20px',
          // margin: 0,
        },
        day: {
          backgroundColor: 'blue',
        }
      },
    },
  },
});

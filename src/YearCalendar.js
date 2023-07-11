/**
 * Components to render a full year of DateCalendar components.
 * @date 2023.Jul.10
 */
import React, { useState, useReducer, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'

import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import List from '@mui/material/List';

import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import dateCalendarTheme from './DateCalendarTheme';

dayjs.extend(dayOfYear)

// TODO: Add to utils.js file ?
export function condenseDates(dates) {
  return dates.reduce((abbrv, currDateSlot) => {
      if (currDateSlot.isContinuous) {
        return abbrv
      } else if (currDateSlot.isBegin) {
        abbrv.push({
          begin: currDateSlot.date,
          end: null,
        })
      } else if (currDateSlot.isEnd) {
        abbrv.at(-1).end = currDateSlot.date
      } else {
        abbrv.push(currDateSlot.date)
      }
      return abbrv
    }, [])
}

export function DaysInput({ label, defaultValue, updateValue, isEditable, showHours }) {
  const [ value, setValue ] = useState(defaultValue)
  const s = value == 1 ? "" : "s"
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography sx={{color: grey[600]}}>{label}:</Typography>
      <Stack direction="row">
        <TextField
          value={value}
          id="total-input" 
          variant="standard"
          size="small"
          defaultValue={defaultValue}
          onBlur={() => { updateValue(value) }}
          type="number"
          inputProps={{
            // step: 3,
            max:99,
            min: 0,
          }}
          onChange={(e) => {setValue(e.target.value)}}
        />
        <Typography >day{s}</Typography>
        {showHours && <Typography>&nbsp; ({value * 8} hour{s})</Typography>}
      </Stack>
    </Stack>
  )
}

export function DaysDisplay({ label, value, showHours }) {
  const s = value == 1 ? "" : "s"
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography sx={{color: grey[600]}}>{label}:</Typography>
      <Typography>{value} day{s}</Typography>
      {showHours && <Typography>({value * 8} hour{s})</Typography>}
    </Stack>
  )
}

// TODO: Rename to something useful.
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => (
       prop !== 'isHighlight' 
    && prop !== 'isWeekend'
    && prop !== 'isBegin'
    && prop !== 'isEnd'
    && prop !== 'isContinuous'
    && prop !== 'backgroundColor'
    && prop !== 'comment'
    && prop !== 'name'
    && prop !== 'date'
  )
})(({ theme, isHighlight, isWeekend, isHoliday, isOther, isBegin, isEnd, isContinuous, }) => ({
  ...(isHighlight && {
    backgroundColor:  theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
    // fontSize: '0.25em',
  }),
  ...(isHighlight || {
    // fontSize: '0.25em',
  }),
  ...(isWeekend && {
    backgroundColor: grey[100],
  }),
  ...(isHoliday && {
    backgroundColor: grey[300],
    borderStyle: 'solid',
    borderWidth: 2,
    // borderColor: 'green',
    borderColor: grey[700],
    color: grey[700],
    fontWeight: 'bold',
    '&:hover, &:focus': {
      color: theme.palette.common.white,
      backgroundColor: grey[700],
    },
  }),
  ...(isContinuous && {
    borderRadius: 0,
  }),
  ...(isBegin && {
    borderRadius: 0,
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    borderRightStyle: 'none',
    marginRight: -5,
    
  }),
  ...(isEnd && {
    borderRadius: 0,
    borderLeftStyle: 'none',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
    marginLeft: -5,
  }),
}));

const StyledDateCalendar = styled(DateCalendar)
(({theme}) => (
  {
    fontSize: '0.25em',
  }
));


function NullElement() {
  return (
    <></>
  )
}

function Day({ day, selectedDates, holidayDates, ...other }) {
  const selectedDateSlot = selectedDates[day.dayOfYear()]
  const holidayDateSlot = holidayDates[day.dayOfYear()]
  // if (selectedDateSlot != null) { console.log('(D): selectedDateSlot: ', JSON.stringify(selectedDateSlot)) }
  // if (holidayDateSlot != null) { console.log('(D): holidayDateSlot: ', day.isSame(holidayDateSlot && holidayDateSlot.date, 'day'), day.format('YYYY-MM-DD'), JSON.stringify(holidayDateSlot)) }
  let dateSlot = null
  if (selectedDateSlot && selectedDateSlot.date != null) {
    dateSlot = selectedDateSlot
  } else if (holidayDateSlot && holidayDateSlot.date != null) {
    dateSlot = holidayDateSlot
  }
  if ( dateSlot != null ) {
    const highlightedDay = <CustomPickersDay 
      {...other}
      day={day}
      sx={dateSlot.isContinuous ? { px: 2.5, mx: 0 } : {}}
      isHighlight={true}
      isHoliday={holidayDateSlot != null}
      {...dateSlot}
    />
    const title = dateSlot.name || dateSlot.comment || null
    if (title != null) {
      return (
        <Tooltip title={title}>
          {highlightedDay}
        </Tooltip>
      )
    } else {
      return ( highlightedDay )
    }
  } else {
    return (
      <PickersDay day={day} {...other} />
      // <Stack
      //   direction="column"
      //   justifyContent="center"
      //   alignItems="center"
      //   sx={{fontSize: '0.5em'}}
      // >
      // {/* <Typography>&nbsp;</Typography> */}
      // </Stack>
    )
  }
}


export function CalendarGrid({ days, dispatchDays }) {
  return (
    // <ThemeProvider theme={dateCalendarTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={1}>
          { [...Array(12).keys()].map(monthId =>
            <Grid item key={"DC item" + monthId}>
              <DateCalendar
              // defaultCalendarMonth={dayjs().set('month', 0)}
              // minDate={dayjs().set('month', 0).set('day', 20)}
              // defaultCalendarMonth={dayjs().month(1)}
              // monthsPerRow={3}
              key={"DateCalendar_" + monthId}
              sx={{fontSize: '0.5em'}}
              value={null}
              views={['day']}
              minDate={dayjs().month(monthId).date(1)}
              maxDate={dayjs().month(monthId + 1).date(0)}
              // NOTE: day is undefined when onChange is clicked on a holiday for some reason...
              shouldDisableDate={day => !day || (day && (day.day() == 0 || day.day() == 6))}
              slots={{
                // actionBar: NullElement,
                leftArrowIcon: NullElement,
                rightArrowIcon: NullElement,
                day: Day
              }}
              // slots={{ day: renderSelectedDay }}
              slotProps={{
                // toolbar: { hidden: true },
                day: {
                  selectedDates: days.selectedDates,
                  holidayDates: days.holidayDates,
                },
                textField: { size: 'small' },
                shortcuts: {
                  items: [
                    {
                      label: 'Christmas',
                      getValue: () => {
                        return dayjs(new Date(2023, 11, 25));
                      },
                    },
                  ],
                },
                toolbar: {
                  // Customize value display
                  toolbarFormat: 'YYYY',
                  // Change what is displayed given an empty value
                  toolbarPlaceholder: '??',
                  // Show the toolbar
                  hidden: false,
                },
              }}
              onChange={(selDate) => {
                dispatchDays({type: "ChangeSelectedDate", date: selDate})
              }}
            />
            </Grid>
          )}
        </Grid>
      </LocalizationProvider>
    // </ThemeProvider>
  )
}

export function YearCalendar({ days, dispatchDays }) {
  return (
    <Stack direction="row">
      <CalendarGrid days={days} dispatchDays={dispatchDays} />
      <Box>
        {days.nSelected > 0 && <Typography sx={{fontWeight: 'bold', minWidth: 150 }}>Scheduled:</Typography>}
        {/* , minWidth: 100 */}
        <List>
          {/* {days.selectedDates.map((dateSlot, idx) => <Typography key={idx} sx={{textAlign: 'center'}}>{dayjs(dateSlot.date).format('MMM DD')}</Typography>)} */}
          {condenseDates(days.selectedDates).map(((dateRecord, idx) => {
              if (dateRecord.begin != null) {
                return (<Typography key={idx} >{dayjs(dateRecord.begin).format('MMM DD')} &ndash; {dayjs(dateRecord.end).format('MMM DD')}</Typography>)
              } else {
                return (<Typography key={idx} >{dayjs(dateRecord).format('MMM DD')}</Typography>)
              }
            }))}
        </List>
        {days.nHolidays > 0 && <Typography sx={{fontWeight: 'bold', minWidth: 150 }}>Holidays:</Typography>}
        {/* , minWidth: 100 */}
        <List>
          {/* {days.selectedDates.map((dateSlot, idx) => <Typography key={idx} sx={{textAlign: 'center'}}>{dayjs(dateSlot.date).format('MMM DD')}</Typography>)} */}
          {condenseDates(days.holidayDates).map(((dateRecord, idx) => {
              if (dateRecord.begin != null) {
                return (<Typography key={idx} >{dayjs(dateRecord.begin).format('MMM DD')} &ndash; {dayjs(dateRecord.end).format('MMM DD')}</Typography>)
              } else {
                return (<Typography key={idx} >{dayjs(dateRecord).format('MMM DD')}</Typography>)
              }
            }))}
        </List>
        {days.nOther > 0 && <Typography sx={{fontWeight: 'bold', minWidth: 150 }}>Other:</Typography>}
        {/* , minWidth: 100 */}
        <List>
          {/* {days.selectedDates.map((dateSlot, idx) => <Typography key={idx} sx={{textAlign: 'center'}}>{dayjs(dateSlot.date).format('MMM DD')}</Typography>)} */}
          {condenseDates(days.otherDates).map(((dateRecord, idx) => {
              if (dateRecord.begin != null) {
                return (<Typography key={idx} >{dayjs(dateRecord.begin).format('MMM DD')} &ndash; {dayjs(dateRecord.end).format('MMM DD')}</Typography>)
              } else {
                return (<Typography key={idx} >{dayjs(dateRecord).format('MMM DD')}</Typography>)
              }
            }))}
        </List>
      </Box>
    </Stack>
  )
}

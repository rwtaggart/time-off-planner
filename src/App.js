/**
 * Time Off - Planning Hub
 * Year calendar to help track the number of days taken.
 */

import React, { useState, useReducer, useEffect } from 'react';
import './App.css';

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import List from '@mui/material/List';

import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import { CalendarGrid, DaysInput, DaysDisplay } from './YearCalendar';

dayjs.extend(dayOfYear)

function shallowCopyArray(a) {
  // Shallow copy non-empty slots into a new Array
  let b = Array(a.length)
  a.forEach((v, idx) => { b[idx] = v })
  return b
}

const DATE_SLOT_SCHEMA = {
  date: null,
  isBegin: false,
  isEnd: false,
  isContinuous: false,
  comment: null,
  name: null,
}

const DAYS_SCHEMA = {
  nTotal: 25,
  nRemaining: 25,
  nSelected: 0,
  nOther: 0,
  selectedDates: Array(365),
  otherDates: Array(365),
  holidayDates: Array(365),
}

// NOTE: dayjs INDEXING Schemes are inconsistent!!!
// month: 0-11
// date: 1-31

const US_HOLIDAYS = [
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(0).date(1),
    name: "New Year's Day",
    isBegin: true,
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(0).date(2),
    name: "New Year's Day (Observed)",
    isEnd: true,
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(0).date(16),
    name: "Martin Luther King Jr. Day",
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(4).date(16),
    name: "Memorial Day",
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(6).date(4),
    name: "Independence Day",
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(8).date(4),
    name: "Labor Day",
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(10).date(23),
    name: "Thanksgiving Day",
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(10).date(24),
    name: "Day After Thanksgiving",
  },
  {
    ...DATE_SLOT_SCHEMA,
    date: dayjs().month(11).date(25),
    name: "Christmas Day",
  },
]
US_HOLIDAYS.forEach(dateSlot => {
  DAYS_SCHEMA.holidayDates[dateSlot.date.dayOfYear()] = dateSlot
})


function daysReducer(prevDays, action) {
  switch(action.type) {
    case "ChangeTotal": {
      let modDays = {
        ...prevDays,
        nTotal: action.total
      }
      modDays.nRemaining = modDays.nTotal - modDays.nSelected
      return modDays
    }
    case "ChangeSelectedDate": {
      // TODO: May need a "deep copy" for this Array object.
      let modSelectedDates = shallowCopyArray(prevDays.selectedDates)
      let idx = action.date.dayOfYear()
      if (prevDays.holidayDates[idx] != null) {
        // Can't select a holiday!
        return prevDays
      }

      let dateSlot = {
        date: action.date,
        isBegin: (idx-1 >= 0 && idx+1 < 365 && modSelectedDates[idx-1] == null && modSelectedDates[idx+1] != null),
        isEnd:   (idx-1 >= 0 && idx+1 < 365 && modSelectedDates[idx-1] != null && modSelectedDates[idx+1] == null),
        isContinuous:   (idx-1 >= 0 && idx+1 < 365 && modSelectedDates[idx-1] != null && modSelectedDates[idx+1] != null),
      }
      if (modSelectedDates[idx] == null) {
        modSelectedDates[idx] = dateSlot
      } else {
        delete modSelectedDates[idx]
      }
      if (dateSlot.isEnd || dateSlot.isContinuous) {
        let cidx = idx - 1;
        let currDateSlot = modSelectedDates[cidx]
        while (cidx >= 0 && cidx < 365 && currDateSlot != null) {
          let modCurrDateSlot = {
            ...currDateSlot,
            isBegin: (cidx-1 >= 0 && cidx+1 < 365 && modSelectedDates[cidx-1] == null && modSelectedDates[cidx+1] != null),
            isEnd:   (cidx-1 >= 0 && cidx+1 < 365 && modSelectedDates[cidx-1] != null && modSelectedDates[cidx+1] == null),
            isContinuous:   (cidx-1 >= 0 && cidx+1 < 365 && modSelectedDates[cidx-1] != null && modSelectedDates[cidx+1] != null),
          }
          modSelectedDates[cidx] = modCurrDateSlot
          cidx -= 1
          currDateSlot = modSelectedDates[cidx]
        }
      }
      if (dateSlot.isBegin || dateSlot.isContinuous) {
        let cidx = idx + 1;
        let currDateSlot = modSelectedDates[cidx]
        while (cidx >= 0 && cidx < 365 && currDateSlot != null) {
          let modCurrDateSlot = {
            ...currDateSlot,
            isBegin: (cidx-1 >= 0 && cidx+1 < 365 && modSelectedDates[cidx-1] == null && modSelectedDates[cidx+1] != null),
            isEnd:   (cidx-1 >= 0 && cidx+1 < 365 && modSelectedDates[cidx-1] != null && modSelectedDates[cidx+1] == null),
            isContinuous:   (cidx-1 >= 0 && cidx+1 < 365 && modSelectedDates[cidx-1] != null && modSelectedDates[cidx+1] != null),
          }
          modSelectedDates[cidx] = modCurrDateSlot
          cidx += 1
          currDateSlot = modSelectedDates[cidx]
        }
      }
      let modDays = {
        ...prevDays,
        selectedDates: modSelectedDates,
      }
      modDays.nSelected = modDays.selectedDates.reduce(len => len+1, 0)
      modDays.nRemaining = modDays.nTotal - modDays.nSelected
      return modDays
    }
    default: {
      throw Error('Action not supported: ' + action.type)
    }
  }
}


function App() {
  /** TODO: Move all "show" boolean settings into a single object **/
  // TODO: Use a reducer for the "config" app state (isDev, isShowSettings, editMode, cfgCategories, etc.)
  const [ isDev, setIsDev ] = useState(false)
  // const [ days, setDays ] = useState(DAYS_SCHEMA)
  const [ days, dispatchDays ] = useReducer(daysReducer, DAYS_SCHEMA)
  
  const darkTheme = createTheme({
    palette: {
      // mode: 'dark',
    },
    components: {
      // Name of the component ⚛️
      MuiInput: {
        styleOverrides: {
          input: {
            textAlign: 'right',
          }
        }
      },
    }
  });

  // const ShortNumTextField = styled(Input)({ 
  //   // FIXME: need to make this work for a nested component.
  //   textAlign: 'right',
  //   // backgroundColor: 'blue', 
  // })

  return (
    <div className="App">
      <header className="app-header">
        <ThemeProvider theme={darkTheme}>
          {/* TODO: Create a separate "header" component */}
          <CssBaseline />
          <Stack direction="row" spacing={{ xs: 4, sm: 10, md: 20 }}>
            <div>
              <span className="app-title">Time Off</span>
              {/* TODO: Only render "TEST MODE" in "dev" mode!!! */}
              {isDev && 
                <>
                  &nbsp; &nbsp; <span style={{"color":"orange"}}>DEV MODE</span>
                </>
              }
            </div>
          </Stack>
        </ThemeProvider>
      </header>
      <main className="app-content">
      <ThemeProvider theme={darkTheme}>
        <Stack direction="row"  spacing={10} bgcolor={grey[100]} justifyContent="center" alignItems="center" mt={2} mb={2}>
          <DaysInput 
            label="Total"
            updateValue={(v) => {dispatchDays({type: "ChangeTotal", total: v})}}
            defaultValue={days.nTotal}
          />
          <DaysDisplay 
            label="Scheduled"
            value={days.nSelected}
          />
          <DaysDisplay 
            label="Other"
            value={days.nOther}
          />
          <DaysDisplay 
            label="Remaining"
            value={days.nRemaining}
          />
        </Stack>
        {/* <Box>
          <Box component="span" sx={{fontWeight: 'bold'}}>State (days): </Box>
          {JSON.stringify(days.holidayDates)}
        </Box> */}
        <Stack direction="row">
          <CalendarGrid days={days} dispatchDays={dispatchDays} />
          <Box>
            <Typography sx={{fontWeight: 'bold'}}>Scheduled:</Typography>
            {/* , minWidth: 100 */}
            <List>
              {days.selectedDates.map((dateSlot, idx) => <Typography key={idx} sx={{textAlign: 'center'}}>{dayjs(dateSlot.date).format('MMM DD')}</Typography>)}
            </List>
          </Box>
          </Stack>
      </ThemeProvider>
      </main>
    </div>
  );
}

export default App;

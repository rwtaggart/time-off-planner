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
import List from '@mui/material/List';

import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';

import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReplayIcon from '@mui/icons-material/Replay';

import { YearCalendar, DaysInput, DaysDisplay } from './YearCalendar';
import { US_HOLIDAYS } from './us-holidays';
import { writeCondensedDayRecords, loadCondensedDayRecords } from './dataStore.js'

dayjs.extend(dayOfYear)

function shallowCopyArray(a) {
  // Shallow copy non-empty slots into a new Array
  let b = Array(a.length)
  a.forEach((v, idx) => { b[idx] = v })
  return b
}

const DATE_SLOT_SCHEMA = {
  // TODO: rename 'date' => 'day' for consistency with dayjs library?
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
  nHolidays: 0,
  nOther: 0,
  selectedDates: Array(365),
  otherDates: Array(365),
  holidayDates: Array(365),
}

US_HOLIDAYS.forEach(dateSlot => {
  DAYS_SCHEMA.holidayDates[dateSlot.date.dayOfYear()] = {...DATE_SLOT_SCHEMA, ...dateSlot}
})
DAYS_SCHEMA.nHolidays = DAYS_SCHEMA.holidayDates.reduce(l => l+=1, 0)

function daysReducer(prevDays, action) {
  switch(action.type) {
    case "ChangeTotal": {
      let modDays = {
        ...prevDays,
        nTotal: action.total
      }
      modDays.nRemaining = modDays.nTotal - modDays.nSelected
      writeCondensedDayRecords(modDays)
      return modDays
    }
    case "ReloadDayRecords": {
      console.log('(D): ReloadDayRecords: ', action.dayRecords)
      return action.dayRecords
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
      writeCondensedDayRecords(modDays)
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
  const [ isDev, setIsDev ] = useState(true)
  const [ isShowHours, setIsShowHours ] = useState(false)
  // const [ days, setDays ] = useState(DAYS_SCHEMA)
  // TODO: rename "days" to something like "timeOffRecords" or "dayRecords" ?
  const [ days, dispatchDays ] = useReducer(daysReducer, DAYS_SCHEMA)

  useEffect(() => {
    handleReloadData()
    return
    // async function loadAndSetInitialStates () {
    // }
    // loadAndSetInitialStates()
  }, [])


  const handleReloadData = (e) => {
    const data = loadCondensedDayRecords()
    dispatchDays({
      type: "ReloadDayRecords",
      dayRecords: data,
    })
    // TODO: use dispatchTimeLog() instead of setTimesLog() and setDayRating()
    // const data = await loadData(session_id)
    // console.log('(D): handleReloadData: ', `${data.length}`, `${data}`)
    // // FIXME: handle multiple versions of data...
    // // TODO: Handle this in the utils.js "api" part...
    // if (data && typeof data === 'object') {
    //   if (Array.isArray(data)) {
    //     // OLD - deprecated. TODO: TAKE OUT.
    //     // settimesLog(data)
    //     setNextTimeRecordId(data.reduce(timeRecordsMaxId, 0) + 1)
    //     dispatchTimeLog({
    //       type: "ReloadTimeLog_v0.1.0",
    //       timeslogArray: data,
    //     })
    //   } else if (data && data.v === "0.2.0") {
    //     // TODO: Support multiple versions ?
    //     // setDayRating(data.rating)
    //     // settimesLog(data.timeslog)
    //     setNextTimeRecordId(data.timeslog.reduce(timeRecordsMaxId, 0) + 1)
    //     dispatchTimeLog({
    //       type: "ReloadTimeLog",
    //       timeLogData: data,
    //     })
    //   } else {
    //     throw Error("Unable to load data - version mismatch")
    //   }
    // } else {
    //   throw Error("Unable to load data")
    // }
  }
  
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

  const lightTheme = createTheme({
    palette: {
      // mode: 'light',
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
          <Stack direction="row" justifyContent="space-around" alignItems="center" spacing={{ xs: 4, sm: 10, md: 20 }}>
            <div>
              <span className="app-title">Time Off</span>
              {/* TODO: Only render "TEST MODE" in "dev" mode!!! */}
              {isDev && 
                <>
                  &nbsp; &nbsp; <span style={{"color":"orange"}}>DEV MODE</span>
                </>
              }
            </div>
            <Stack direction="row" spacing={3} justifyContent="center">
              <Chip variant="filled" label="Calendar" color="primary" sx={{ fontSize: '1em' }}/>
              <Chip variant="outlined" label="Holidays" sx={{ fontSize: '1em', color: darkTheme.palette.common.white, backgroundColor: null, borderColor: darkTheme.palette.primary.light, borderWidth: 2}}/>
              <Chip variant="outlined" label="BLARGDS" sx={{ fontSize: '1em', }}/>
              {/* <Chip variant="outlined" label="Holidays" color={darkTheme.palette.primary.light} sx={{ fontSize: '1em', }}/> */}
              <Chip variant="outlined" label="Settings" color='secondary' sx={{ fontSize: '1em' }}/>
            </Stack>
            <FormControlLabel control={<Switch onChange={() => setIsShowHours(!isShowHours)} />} label="Show Hours" />
            <Tooltip title="Reload Data">
              <IconButton onClick={handleReloadData}>
                <ReplayIcon sx={{ color: darkTheme.palette.common.white }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </ThemeProvider>
      </header>
      <main className="app-content">
      {/* <ThemeProvider theme={lightTheme}> */}
        <Stack direction="row"  spacing={10} bgcolor={grey[100]} justifyContent="center" alignItems="center" pt={1} mb={2} pb={1} sx={{borderBottomStyle: 'solid', borderWidth: 2, borderColor: grey[600]}}>
          <DaysInput 
            label="Total"
            updateValue={(v) => {dispatchDays({type: "ChangeTotal", total: v})}}
            defaultValue={days.nTotal}
            showHours={isShowHours}
          />
          <DaysDisplay 
            label="Scheduled"
            value={days.nSelected}
            showHours={isShowHours}
          />
          <DaysDisplay 
            label="Holidays"
            value={days.nHolidays}
            showHours={isShowHours}
          />
          <DaysDisplay 
            label="Other"
            value={days.nOther}
            showHours={isShowHours}
          />
          <DaysDisplay 
            label="Remaining"
            value={days.nRemaining}
            showHours={isShowHours}
          />
        </Stack>
        <YearCalendar days={days} dispatchDays={dispatchDays} />
        {/* <Box>
          <Box component="span" sx={{fontWeight: 'bold'}}>State (days): </Box>
          {JSON.stringify(days)}
        </Box> */}

      {/* </ThemeProvider> */}
      <Box>
      </Box>
      </main>
    </div>
  );
}

export default App;

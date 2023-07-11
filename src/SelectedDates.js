/**
 *  Scheduled Records
 *  View & Modify Selected Time Off Records
 *  TODO: Merge this file with HolidayDates.
 *  THERE'S A LOT OF DUPLICATED CODE!!!
 */

import React, { useState, useReducer, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'

import { grey } from '@mui/material/colors';
import { orange } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { condenseDates } from './YearCalendar'


dayjs.extend(dayOfYear)

const NULL_RECORD = {
  name: "",
  date: null,
}

const CondensedDate = (idx, dateRecord) => {
  if (dateRecord.begin != null) {
    return (<Typography key={idx} >{dayjs(dateRecord.begin).format('MMM DD')} &ndash; {dayjs(dateRecord.end).format('MMM DD')}</Typography>)
  } else {
    return (<Typography key={idx} >{dayjs(dateRecord).format('MMM DD')}</Typography>)
  }
}

export function SelectedDates({ days, dispatchDays }) {
  const [ selectedRecord, setSelectedRecord ] = useState(NULL_RECORD)
  return (
    // pl={6}
    <Box label="CONSTRUCTION">
    <Typography variant="h2" color={orange[800]} className="crossed" backgroundColor={grey[200]} sx={{textAlign: "center", fontWeight: "bold" }}>UNDER CONSTRUCTION</Typography>
    <Divider />
    <Stack direction="row" spacing={20} pt={3} justifyContent="center">
      <Box dividers>
        <Paper>
          <Typography variant="h6" p={2} color={grey[800]} sx={{textAlign: 'center'}} >Scheduled Time Off</Typography>
          <Divider />
          <table className="US-Holiday-Table" >
            <thead>
              <th label="icon"></th>
              <th >Name</th>
              <th >Date</th>
            </thead>
            {condenseDates(days.selectedDates).map(((dateRecord, idx) => {
              console.log('(D): ScheduledDates: ', JSON.stringify(dateRecord))
              return (
                <tr key={"tr-"+idx}>
                  <td key={"td_icon_"+idx}>
                    <Tooltip title="Remove Selected Date">
                      <IconButton onClick={() => {dispatchDays({type: 'ChangeSelectedDate', date: dateRecord.date})}}>
                        <DeleteIcon color="gray" />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td key={"td_name_"+idx}><Typography key={"Type_name_"+idx} mr={2} >{dateRecord.name}</Typography></td>
                  <td key={"td_date_"+idx}>
                    <CondensedDate idx={idx} dateRecord={dateRecord} />
                    {/* <Typography key={"Type_date_"+idx} >{dateRecord.date.format('MMM DD')}</Typography> */}
                  </td>
                </tr>
              )
            }))}
            {/* {days.selectedDates.map((dateRecord, idx) => 
            )} */}
          </table>
        </Paper>
      </Box>
      <Box>
        <Paper>
          {/* fontWeight="bold" */}
          <Typography variant="h6" p={2} color={grey[800]} sx={{textAlign: "center"}}>Add Day</Typography>
          <Divider />
          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DateCalendar
                  views={['month', 'day']}
                  openTo='month'
                  shouldDisableDate={day => (day.day() == 0 || day.day() == 6)}
                  onChange={(selDate) => {
                    setSelectedRecord({...SelectedDates, date: selDate})
                  }}
                  />
          </LocalizationProvider>
          <Stack direction="row" justifyContent="space-around" alignItems="flex-end" spacing={2} p={2}>
            <TextField label="Comment" variant="standard" value={selectedRecord.name} onChange={(e) => setSelectedRecord({...selectedRecord, name: e.target.value})} />
            <Button 
              variant="outlined" 
              disabled={selectedRecord.date == null}
              onClick={() => { dispatchDays({type: 'ChangeSelectedDate', date: selectedRecord.date}); setSelectedRecord(NULL_RECORD) }}
            >
              <AddIcon />Add
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
    </Box>
  )
}

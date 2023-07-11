/**
 *  Holiday Records
 *  View & Modify US Holiday Records
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


dayjs.extend(dayOfYear)

const NULL_HOLIDAY_RECORD = {
  name: "",
  date: null,
}

export function HolidayDates({ days, dispatchDays }) {
  const [ holidayRecord, setHolidayRecord ] = useState(NULL_HOLIDAY_RECORD)
  return (
    // pl={6}
    <Stack direction="row" spacing={20} pt={3} justifyContent="center">
      <Box dividers>
        <Paper>
          <Typography variant="h6" p={2} color={grey[800]} sx={{textAlign: 'center'}} >US Holidays</Typography>
          <Divider />
          <table className="US-Holiday-Table" >
            <thead>
              <td label="icon"></td>
              <th >Name</th>
              <th >Date</th>
            </thead>
            {days.holidayDates.map((dateRecord, idx) => 
              <tr key={"tr-"+idx}>
                <td key={"td_icon_"+idx}>
                  <Tooltip title="Delete Holiday">
                    <IconButton onClick={() => {dispatchDays({type: 'DeleteHoliday', day: dateRecord.date})}}>
                      <DeleteIcon color="gray" />
                    </IconButton>
                  </Tooltip>
                </td>
                <td key={"td_name_"+idx}><Typography key={"Type_name_"+idx} mr={2} >{dateRecord.name}</Typography></td>
                <td key={"td_date_"+idx}><Typography key={"Type_date_"+idx} >{dateRecord.date.format('MMM DD')}</Typography></td>
              </tr>
            )}
          </table>
        </Paper>
      </Box>
      <Box>
        <Paper>
          {/* fontWeight="bold" */}
          <Typography variant="h6" p={2} color={grey[800]} sx={{textAlign: "center"}}>Add Holiday</Typography>
          <Divider />
          <Stack direction="row" justifyContent="space-around" alignItems="flex-end" spacing={2}>
            <TextField label="Name" variant="standard" value={holidayRecord.name} onChange={(e) => setHolidayRecord({...holidayRecord, name: e.target.value})} />
            <Button 
              variant="outlined" 
              disabled={holidayRecord.date == null || holidayRecord.name == null || holidayRecord.name == ""} 
              onClick={() => { dispatchDays({type: 'AddHoliday', holidayRecord: holidayRecord}); setHolidayRecord(NULL_HOLIDAY_RECORD) }}
            >
              <AddIcon />Add
            </Button>
          </Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DateCalendar
                  views={['month', 'day']}
                  openTo='month'
                  shouldDisableDate={day => (day.day() == 0 || day.day() == 6)}
                  onChange={(selDate) => {
                    setHolidayRecord({...holidayRecord, date: selDate})
                  }}
                  />
          </LocalizationProvider>
        </Paper>
      </Box>
    </Stack>
  )
}

/**
 * Data Store Interface
 * Utility functions for loading and writing the application state.
 */
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
dayjs.extend(dayOfYear)


const APP_ID = "TimeOff-DayRecords"

function fillArrayDaySlots(daySlots) {
  return daySlots.reduce((arr, daySlot) => {
    const day = dayjs(daySlot.date)
    const idx = day.dayOfYear()
    arr[idx] = {...daySlot, date: day}
    return arr
  }, Array(365))
}

/** Expecting schema defined in App.js */
export function writeCondensedDayRecords(year, dayRecords) {
  const record_key = APP_ID + "_" + year;
  console.log('(D): Storing: ' + record_key)
  let modDayRecords = {
    ...dayRecords,
    selectedDates: dayRecords.selectedDates.reduce((list, dateSlot) => list.concat(dateSlot), []),
    holidayDates: dayRecords.holidayDates.reduce((list, dateSlot) => list.concat(dateSlot), []),
    otherDates: dayRecords.otherDates.reduce((list, dateSlot) => list.concat(dateSlot), []),
  }
  window.localStorage.setItem(record_key, JSON.stringify(modDayRecords))
}

/** Expecting schema defined in App.js */
export function loadCondensedDayRecords(year) {
  const record_key = APP_ID + "_" + year;
  console.log('(D): Loading: ' + record_key)
  let loadedDayRecords = JSON.parse(window.localStorage.getItem(record_key))
  if (loadedDayRecords == null) { 
    return null 
  }
  let modDayRecords = {
    ...loadedDayRecords,
    selectedDates: fillArrayDaySlots(loadedDayRecords.selectedDates),
    holidayDates: fillArrayDaySlots(loadedDayRecords.holidayDates),
    otherDates: fillArrayDaySlots(loadedDayRecords.otherDates),
  }
  return modDayRecords
}

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
export function writeCondensedDayRecords(dayRecords) {
  let modDayRecords = {
    ...dayRecords,
    selectedDates: dayRecords.selectedDates.reduce((list, dateSlot) => list.concat(dateSlot), []),
    holidayDates: dayRecords.holidayDates.reduce((list, dateSlot) => list.concat(dateSlot), []),
    otherDates: dayRecords.otherDates.reduce((list, dateSlot) => list.concat(dateSlot), []),
  }
  window.localStorage.setItem(APP_ID, JSON.stringify(modDayRecords))
}

/** Expecting schema defined in App.js */
export function loadCondensedDayRecords() {
  let loadedDayRecords = JSON.parse(window.localStorage.getItem(APP_ID))
  console.log("(D): loadedDayRecords: ", JSON.stringify(loadedDayRecords))
  let modDayRecords = {
    ...loadedDayRecords,
    selectedDates: fillArrayDaySlots(loadedDayRecords.selectedDates),
    holidayDates: fillArrayDaySlots(loadedDayRecords.holidayDates),
    otherDates: fillArrayDaySlots(loadedDayRecords.otherDates),
  }
  return modDayRecords
}

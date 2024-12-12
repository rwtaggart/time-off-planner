/**
 * US Holidays
 *
 * Initialize the initial list of US Holidays.
 * @date 10.Jul.2023
*/

import dayjs from 'dayjs';


// NOTE: dayjs INDEXING Schemes are inconsistent!!!
// month: 0-11
// date: 1-31
export const US_HOLIDAYS = (year) => {
  return [
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(0).date(1),
      name: "New Year's Day",
      isBegin: true,
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(0).date(2),
      name: "New Year's Day (Observed)",
      isEnd: true,
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(0).date(16),
      name: "Martin Luther King Jr. Day",
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(4).date(16),
      name: "Memorial Day",
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(6).date(4),
      name: "Independence Day",
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(8).date(4),
      name: "Labor Day",
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(10).date(23),
      name: "Thanksgiving Day",
      isBegin: true,
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(10).date(24),
      name: "Day After Thanksgiving",
      isEnd: true,
    },
    {
      // ...DATE_SLOT_SCHEMA,
      date: dayjs().year(year).month(11).date(25),
      name: "Christmas Day",
    },
  ]
}

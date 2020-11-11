// year, month, day
export type TDate = [number, number, number];
export type TCalendarDay = {
  date: TDate;
  isFromPreviousMonth: boolean;
  isFromNextMonth: boolean;
};
export type TCalendar = Array<Array<TCalendarDay>>;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(date: TDate): number {
  const year = date[0];
  const month = date[1];
  let numberOfDays: number;
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    numberOfDays = 30;
  } else if (month === 1) {
    if (isLeapYear(year)) {
      numberOfDays = 29;
    } else {
      numberOfDays = 28;
    }
  } else {
    numberOfDays = 31;
  }

  return numberOfDays;
}

export function newDate(date: TDate): Date {
  return new Date(date[0], date[1], date[2]);
}

export function dateEqual(a?: TDate, b?: TDate): boolean {
  if (!a || !b) return false;
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

export function getNextMonth(date: TDate): TDate {
  let newMonth = date[1] + 1;
  let newYear = date[0];
  if (newMonth === 12) {
    newYear++;
    newMonth = 0;
  }
  return [newYear, newMonth, date[2]];
}

export function getPreviousMonth(date: TDate): TDate {
  let newMonth = date[1] - 1;
  let newYear = date[0];
  if (newMonth === -1) {
    newYear--;
    newMonth = 11;
  }
  return [newYear, newMonth, date[2]];
}

export function getCalendarDaysForMonth(date: TDate): TCalendar {
  const firstOfMonth = newDate(date).getDay();
  const isFirstOfMonth = firstOfMonth === 0;
  const calendar: Array<Array<TCalendarDay>> = [];
  if (!isFirstOfMonth) {
    // if the day of the week is past sunday we need to count back in the previous month
    // to get the dates
    const previousMonth = getPreviousMonth(date);
    const daysInPreviousMonth = getDaysInMonth(previousMonth);
    calendar.push([]);
    // push previous months days
    for (
      let i = daysInPreviousMonth - firstOfMonth + 1;
      i <= daysInPreviousMonth;
      i++
    ) {
      calendar[0].push({
        date: [previousMonth[0], previousMonth[1], i],
        isFromPreviousMonth: true,
        isFromNextMonth: false
      });
    }
    // push remaining days in week
    for (let i = 1; i <= 7 - firstOfMonth; i++) {
      calendar[0].push({
        date: [date[0], date[1], i],
        isFromPreviousMonth: false,
        isFromNextMonth: false
      });
    }
  }
  const daysInMonth = getDaysInMonth(date);
  const nextMonth = getNextMonth(date);

  let leftoverWeeks = !isFirstOfMonth ? 5 : 6;
  for (let i = 0; i < leftoverWeeks; i++) {
    // get the remaining dates for this month and next
    calendar.push([]);
    const location = !isFirstOfMonth ? i + 1 : i;
    for (let j = 1; j <= 7; j++) {
      let day = 7 * i - firstOfMonth + j;
      day += !isFirstOfMonth ? 7 : 0;
      if (day > daysInMonth) {
        // if past the end of the month then start counting the new month
        // if you don't want the next month break here instead;
        const dayOfNextMonth = day - daysInMonth;
        calendar[location].push({
          date: [nextMonth[0], nextMonth[1], dayOfNextMonth],
          isFromPreviousMonth: false,
          isFromNextMonth: true
        });
      } else {
        calendar[location].push({
          date: [date[0], date[1], day],
          isFromPreviousMonth: false,
          isFromNextMonth: false
        });
      }
    }
  }

  return calendar;
}

import * as React from "react";
import "./styles.css";
import {
  getNextMonth,
  getPreviousMonth,
  getCalendarDaysForMonth,
  newDate,
  dateEqual,
  TDate
} from "./utils";

export default function App() {
  const [activeMonth, setActiveMonth] = React.useState<TDate>([2020, 0, 1]);
  const [selectedDate, setSelectedDate] = React.useState<TDate>();

  const changeMonth = (val: number) => {
    const newDate =
      val > 0 ? getNextMonth(activeMonth) : getPreviousMonth(activeMonth);
    setActiveMonth(newDate);
  };

  const days = getCalendarDaysForMonth(activeMonth).map((week, i) => {
    return (
      <div className="week" key={`week-${i}`}>
        {week.map((day, j) => {
          const selected = dateEqual(day.date, selectedDate);
          return (
            <div
              key={`day-${i}-${j}`}
              className={`day ${day.isFromNextMonth && "day-next-month"} ${
                day.isFromPreviousMonth && "day-previous-month"
              } ${selected && "day-selected"}`}
              onClick={() => {
                if (selected) {
                  setSelectedDate(undefined);
                } else {
                  setSelectedDate(day.date);
                }
              }}
            >
              {day.date[2]}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className="App">
      <div className="calendar">
        <div className="controls">
          <div className="controls-button" onClick={() => changeMonth(-1)}>
            {"<"}
          </div>
          <div>
            {newDate(activeMonth).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long"
            })}
          </div>
          <div className="controls-button" onClick={() => changeMonth(1)}>
            {">"}
          </div>
        </div>

        <div className="days">{days}</div>
      </div>

      <div className="selected-date">
        {selectedDate && newDate(selectedDate).toLocaleDateString()}
      </div>
    </div>
  );
}

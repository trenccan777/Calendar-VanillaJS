let recordRed = () => {
    let tableWidth = document.getElementById('calendar-table').offsetWidth;
    const record = document.getElementById('01012020');
    record.style.width = (((tableWidth - 2) / 7) * 2 ) + 'px';
}

let recordBlue = () => {
    let tableWidth = document.getElementById('calendar-table').offsetWidth;
    const record = document.getElementById('01022020');
    record.style.width = (((tableWidth - 2) / 7) * 5 ) + 'px';
}

window.addEventListener('resize', () => {
    
    recordRed();
    recordBlue();
});

window.addEventListener('DOMContentLoaded', () => {
    
    recordRed();
    recordBlue();
});



const events = [
  { date: "2019-12-31", days: 2, title: "Prvý nadpis" },
  { date: "2020-01-01", days: 4, title: "Prvý nadpis" },
  { date: "2020-01-01", days: 2, title: "Prvý nadpis" },
  { date: "2020-01-01", days: 2, title: "Prvý nadpis" },
  { date: "2020-01-02", days: 1, title: "Prvý nadpis" },
  { date: "2020-01-03", days: 1, title: "Prvý nadpis" },
  { date: "2020-01-04", days: 3, title: "Prvý nadpis" },
  { date: "2020-01-04", days: 1, title: "Prvý nadpis" },
  { date: "2020-01-05", days: 1, title: "Prvý nadpis" },
  { date: "2020-01-05", days: 1, title: "Prvý nadpis" },
  //New week
  { date: "2020-01-06", days: 1, title: "Prvý nadpis" },
  { date: "2020-01-07", days: 2, title: "Prvý nadpis" },
  { date: "2020-01-08", days: 2, title: "Prvý nadpis" },

];

/**
 * Get week Number
 * @returns {number} - weekNumber
 */
Date.prototype.getWeekNumber = function () {
  var d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

function createRenderMatrix() {
  let prevWeekNumber = false;
  let rowsInWeek = [];
  let output = [];

  events.forEach((event) => {
    let weekNumber = new Date(event.date).getWeekNumber();
    let dayInWeek = (new Date(event.date).getDay() === 0) ? 7 : new Date(event.date).getDay();
    let eventLength = event.days;

    //Init first week in loop
    prevWeekNumber = prevWeekNumber ? prevWeekNumber : weekNumber;

    //Each new week reset array of rows in week
    if (prevWeekNumber < weekNumber) {
      rowsInWeek = [];
      prevWeekNumber = weekNumber;
    }

    if (rowsInWeek.length === 0) {
      //Add first array with first row array
      rowsInWeek.push({
        day: [dayInWeek],
        eventLength: [dayInWeek + eventLength],
      });
      output.push({ date: event.date, days: eventLength, row: 0 });
      return;
    }

    //Row array
    for (let i = 0; i < rowsInWeek.length; i++) {
      //x1 exists in array?
      if (rowsInWeek[i].day.includes(dayInWeek)) {
        //Next array exists?
        if (rowsInWeek[i + 1] !== undefined) {
          continue;
        }
        //Create array
        else {
          rowsInWeek.push({
            day: [dayInWeek],
            eventLength: [dayInWeek + eventLength],
          });
          output.push({ date: event.date, days: eventLength, row: i + 1 });
          return;
        }
      } else {
        let lengths = rowsInWeek[i].eventLength.sort();
        if (lengths[lengths.length - 1] <= dayInWeek) {
          rowsInWeek[i].day.push(dayInWeek);
          rowsInWeek[i].eventLength.push(dayInWeek + eventLength);
          output.push({ date: event.date, days: eventLength, row: i });
          return;
        } else {
          //Next array exists?
          if (rowsInWeek[i + 1] !== undefined) {
            continue;
          }
          //Create array
          else {
            rowsInWeek.push({
              day: [dayInWeek],
              eventLength: [dayInWeek + eventLength],
            });
            output.push({
              date: event.date,
              days: eventLength,
              row: i + 1,
            });
            return;
          }
        }
      }
    }
  });

  return output;
}


console.log(createRenderMatrix());

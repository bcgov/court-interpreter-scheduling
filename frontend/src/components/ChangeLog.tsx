import React from 'react';
import moment, { Moment } from 'moment';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { BookingEvent } from 'constants/interfaces';

type EventWithMoment = BookingEvent & {
  _moment: Moment
};

type Day = {
  title: string;
  updates: EventWithMoment[];
}

export default function ChangeLog ({ events }: { events: BookingEvent[] }) {

  const sortedEvents = events.map(e => ({
    ...e,
    stamp: moment(e.createdAt).format(),
    _moment: moment(e.createdAt),
    unix: moment(e.createdAt).unix()
  })).sort((a, b) => a.unix > b.unix ? -1 : a.unix < b.unix ? 1 : 0)

  const groupedByDay = sortedEvents.reduce(function (grouped: any, event: EventWithMoment) {
    const eventDate = event._moment.format('YYYY-MM-DD')
    if (grouped[eventDate]) {
      grouped[eventDate].push(event)
    } else {
      grouped[eventDate] = [event]
    }
    return grouped
  }, {})

  let days = []

  for (let date in groupedByDay) {
    days.push({
      title: moment(date, 'YYYY-MM-DD').fromNow(),
      updates: groupedByDay[date]
    })
  }

  return (
    <>
      {days.map((day: Day) => (
        <div key={day.title}>
          <h4 style={{ textTransform: "capitalize" }}>{day.title}</h4>
          {day.updates.map((e: EventWithMoment, index: number, arr: EventWithMoment[]) => (
            <Grid container key={index} style={{ margin: "0.5rem 0" }}>
              <Grid item xs={2} md={1} style={{ paddingTop: "1rem" }}>
                {/* Render null for now, TODO: render a vertical line */}
                {arr[index - 1] && arr[index - 1]._moment.format("H:mm A") === e._moment.format("H:mm A") ? null : e._moment.format("H:mm A")}
              </Grid>
              <Grid item xs={10} md={11}>
                <Grid container>
                  <Grid item xs={1} style={{ display: "flex" }} alignContent="center" alignItems="center" justify="center">
                    {e.user ? <Avatar>{e.user[0]}{e.user[e.user.indexOf(" ") + 1]}</Avatar> : null}
                  </Grid>
                  <Grid item>
                    <p className="flat" style={{ marginBottom: "4px", fontSize: "0.8rem" }}><b>{e.user}</b> changed <b>{e.field}</b></p>
                    <p className="flat" style={{ marginBottom: "4px", display: "flex" }}>
                      <span style={{ color: "#999999", marginRight: "4px" }}>{e.previous}</span> <ArrowRightAltIcon /> <span style={{ marginLeft: "4px" }}>{e.updated}</span>
                    </p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </div>
      ))}
    </>
  )
};

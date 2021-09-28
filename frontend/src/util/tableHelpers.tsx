import React from 'react';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Alert from '@material-ui/icons/ErrorOutline';
import { Language, Event, Booking, BookingDate, BookingPeriod, SearchParams, Conflict } from 'constants/interfaces';
import moment from 'moment';

const StyledBox = withStyles(() => ({
  root: {
    fontSize: '14px',
    padding: '1rem 0.5rem 0 0.5rem',
  },
}))(Box);

function comments (comment?: string, languages?: Language[], row?: any) {
  return (
    comment || languages?.some((language: Language) => language.commentOnLevel)
  ) ? (
    <div className='commentList'>
      {comment ? <span>{comment}</span> : null}
      {languages
        ?.filter((language: Language) => language.commentOnLevel)
        .map((language: Language) => (
          <span>
            {language.languageName} ({language.level}): {language.commentOnLevel}
            {row ? withLanguageEvent(language.languageName, 'commentOnLevel', row.events) : null}
          </span>
        ))}
    </div>
  ) : null
}

/**
 * return full name with format: **LastName**, FirstName
 * @param firstName
 * @param lastName
 * @param Event[]
 * @returns string
 */
function fullName(firstName: string, lastName: string, events: Event[] = []) {
  return (
    <p>
      <strong>{lastName}</strong>{`, ${firstName}`}
      {withEvent(['lastName', 'firstName'], events)}
    </p>
  )
}

const TooltipContent = ({ previous }: { previous: string }) => (
  <StyledBox>
    <b>
      Recently Updated
    </b>
    <p>
      Original: {previous}
    </p>
  </StyledBox>
);

function withEvent (fields: Array<string> | string, events: Array<Event>) {
  const fieldEvents = typeof fields === 'string' ? events.filter(e => e.field === fields) : events.filter(e => fields.includes(e.field))
  return fieldEvents.length ? (
    <Tooltip title={<TooltipContent previous={fieldEvents[fieldEvents.length - 1]?.previous} />}>
      <Alert className="cellAlertIcon" />
    </Tooltip>
  ) : null
}

function withLanguageEvent (language: string, field: string, events: Array<Event>) {
  const languageEvents = events.filter(e => e.field === 'language');
  if (!languageEvents.length) return null;
  const fieldEvents = languageEvents.filter(e => e.subfield === field);
  return fieldEvents.length ? (
    <Tooltip title={<TooltipContent previous={fieldEvents[fieldEvents.length - 1]?.previous} />}>
      <Alert className="cellAlertIcon" />
    </Tooltip>
  ) : null
}

function checkInterpreterAvailability (bookings: Booking[], dates: SearchParams['dates']): Array<Conflict> {
  const conflicts = bookings.reduce((list: Conflict[], booking: Booking) => {
    const sameDateAsSearch = booking.dates
      .filter(
        (bookingDate: BookingDate) => dates.some(
          (d: BookingDate) => {
            const bookingMoment = moment(bookingDate.date)
            const searchMoment = moment(d.date)
            const isSameDay = bookingMoment.isSame(searchMoment, 'day')
            return isSameDay ? (
              d.period === BookingPeriod.WHOLE_DAY ||
              bookingDate.period === BookingPeriod.WHOLE_DAY ||
              d.period === bookingDate.period
            ) : false
          }
        )
      )
    if (sameDateAsSearch.length) {
      return [
        ...list,
        ...sameDateAsSearch.map((date: BookingDate) => ({ file: booking.file, location: booking.location?.name }))
      ]
    } else return list
  }, [])
  return conflicts
}

export {
  comments,
  fullName,
  withEvent,
  withLanguageEvent,
  checkInterpreterAvailability,
}

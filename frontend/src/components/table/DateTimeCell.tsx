import React from 'react';
import moment from 'moment';
import { BookingDate } from 'constants/interfaces';

export default function DateTimeCell({
  date,
  arrival,
}: {
  date: string;
  arrival: string;
}) {
  return (
    <div>
      <b>{moment(date).format('ddd, MMM DD')}</b>
      <br />
      <span>
        {moment(arrival || date, ['hh:mm:ss', moment.ISO_8601]).format(
          'hh:mm A'
        )}
      </span>
    </div>
  );
}

export function DatesCell({ dates }: { dates: BookingDate[] }) {
  const first = dates[0];
  const last = dates[dates.length - 1];
  return (
    <div style={{ fontSize: '0.85rem', minWidth: 'max-content' }}>
      <div style={{ marginBottom: '4px' }}>
        <b>{moment(first.date).format('ddd, MMM DD')}</b>
        <span>
          {' '}
          {moment(first.arrivalTime, ['hh:mm:ss', moment.ISO_8601]).format(
            'h:mm A'
          )}
          {dates.length > 1 ? ' -' : null}
        </span>
      </div>
      {dates.length > 1 ? (
        <div style={{ marginBottom: '4px' }}>
          <b>{moment(last.date).format('ddd, MMM DD')}</b>
          <span>
            {' '}
            {moment(last.arrivalTime, ['hh:mm:ss', moment.ISO_8601]).format(
              'h:mm A'
            )}
          </span>
        </div>
      ) : null}
      {dates.length > 1 ? (
        <div>
          <span>({dates.length} Days)</span>
        </div>
      ) : null}
    </div>
  );
}

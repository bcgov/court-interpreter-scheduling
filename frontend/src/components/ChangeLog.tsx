import React from 'react';
import { Event } from 'constants/interfaces'

export default function ChangeLog ({ events }: { events: Event[] }) {
  return <>
    {events.map(e => <p>{e.field} - {e.createdAt} - by: {e.user?.firstName}</p>)}
  </>
};

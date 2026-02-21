import { useState, useEffect, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery } from '@tanstack/react-query';
import { PopeEvent } from '@/types';
import { MOCK_EVENTS } from '@/mocks/events';
import { getCurrentEvent, getNextEvent, getTodaysEvents, getUpcomingEvents, getPastEvents } from '@/lib/utils';

export const [PopeEventsProvider, usePopeEvents] = createContextHook(() => {
  const eventsQuery = useQuery<PopeEvent[]>({
    queryKey: ['pope-events'],
    queryFn: async () => {
      return MOCK_EVENTS;
    },
    refetchInterval: 5 * 60 * 1000,
  });

  const events = eventsQuery.data ?? [];

  const currentEvent = useMemo(() => getCurrentEvent(events), [events]);
  const nextEvent = useMemo(() => getNextEvent(events), [events]);
  const todaysEvents = useMemo(() => getTodaysEvents(events), [events]);
  const upcomingEvents = useMemo(() => getUpcomingEvents(events), [events]);
  const pastEvents = useMemo(() => getPastEvents(events), [events]);

  return {
    events,
    currentEvent,
    nextEvent,
    todaysEvents,
    upcomingEvents,
    pastEvents,
    isLoading: eventsQuery.isLoading,
    refetch: eventsQuery.refetch,
  };
});

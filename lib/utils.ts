import { PopeEvent } from '@/types';
import { format, parseISO, isToday, isFuture, isPast, differenceInSeconds } from 'date-fns';

export function getEventDateTime(event: PopeEvent): Date {
  const [hours, minutes] = event.time.split(':').map(Number);
  const date = parseISO(event.date);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getTodaysEvents(events: PopeEvent[]): PopeEvent[] {
  return events
    .filter(e => isToday(parseISO(e.date)))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getUpcomingEvents(events: PopeEvent[]): PopeEvent[] {
  const now = new Date();
  return events
    .filter(e => {
      const dt = getEventDateTime(e);
      return dt > now;
    })
    .sort((a, b) => getEventDateTime(a).getTime() - getEventDateTime(b).getTime());
}

export function getPastEvents(events: PopeEvent[]): PopeEvent[] {
  const now = new Date();
  return events
    .filter(e => {
      const dt = getEventDateTime(e);
      return dt <= now;
    })
    .sort((a, b) => getEventDateTime(b).getTime() - getEventDateTime(a).getTime());
}

export function getNextEvent(events: PopeEvent[]): PopeEvent | null {
  const upcoming = getUpcomingEvents(events);
  return upcoming.length > 0 ? upcoming[0] : null;
}

export function getCurrentEvent(events: PopeEvent[]): PopeEvent | null {
  const live = events.find(e => e.isLive);
  if (live) return live;
  const todayEvents = getTodaysEvents(events);
  if (todayEvents.length > 0) return todayEvents[0];
  return null;
}

export function getSecondsUntil(event: PopeEvent): number {
  const dt = getEventDateTime(event);
  return Math.max(0, differenceInSeconds(dt, new Date()));
}

export function formatEventDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEEE, MMMM d, yyyy');
}

export function formatEventDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function getEventsForDate(events: PopeEvent[], dateStr: string): PopeEvent[] {
  return events
    .filter(e => e.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getUniqueEventDates(events: PopeEvent[]): string[] {
  return [...new Set(events.map(e => e.date))].sort();
}

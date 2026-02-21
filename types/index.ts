export interface PopeEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationDetail?: string;
  latitude: number;
  longitude: number;
  category: EventCategory;
  isLive?: boolean;
}

export type EventCategory =
  | 'audience'
  | 'mass'
  | 'angelus'
  | 'visit'
  | 'speech'
  | 'meeting'
  | 'prayer';

export interface LocationEntry {
  name: string;
  latitude: number;
  longitude: number;
}

export interface DayEvents {
  date: string;
  events: PopeEvent[];
}

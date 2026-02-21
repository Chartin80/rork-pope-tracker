import { LocationEntry } from '@/types';

export const LOCATION_DICTIONARY: Record<string, LocationEntry> = {
  "st. peter's square": { name: "St. Peter's Square", latitude: 41.9022, longitude: 12.4539 },
  "st. peter's basilica": { name: "St. Peter's Basilica", latitude: 41.9022, longitude: 12.4536 },
  "apostolic palace": { name: "Apostolic Palace", latitude: 41.9029, longitude: 12.4572 },
  "clementine hall": { name: "Clementine Hall", latitude: 41.9029, longitude: 12.4572 },
  "sala regia": { name: "Sala Regia", latitude: 41.9029, longitude: 12.4572 },
  "paul vi audience hall": { name: "Paul VI Audience Hall", latitude: 41.8986, longitude: 12.4526 },
  "casa santa marta": { name: "Casa Santa Marta", latitude: 41.9016, longitude: 12.4516 },
  "sistine chapel": { name: "Sistine Chapel", latitude: 41.9031, longitude: 12.4545 },
  "vatican city": { name: "Vatican City", latitude: 41.9029, longitude: 12.4534 },
  "rome": { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
  "ostia lido": { name: "Ostia Lido", latitude: 41.7325, longitude: 12.2758 },
  "assisi": { name: "Assisi", latitude: 43.0707, longitude: 12.6196 },
  "pompeii": { name: "Pompeii", latitude: 40.7502, longitude: 14.5010 },
  "naples": { name: "Naples", latitude: 40.8518, longitude: 14.2681 },
  "florence": { name: "Florence", latitude: 43.7696, longitude: 11.2558 },
  "milan": { name: "Milan", latitude: 45.4642, longitude: 9.1900 },
  "bari": { name: "Bari", latitude: 41.1171, longitude: 16.8719 },
  "loreto": { name: "Loreto", latitude: 43.4407, longitude: 13.6078 },
  "castel gandolfo": { name: "Castel Gandolfo", latitude: 41.7477, longitude: 12.6508 },
  "lateran basilica": { name: "Lateran Basilica", latitude: 41.8859, longitude: 12.5057 },
};

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    audience: '#D4AF37',
    mass: '#B71C1C',
    angelus: '#7C3AED',
    visit: '#059669',
    speech: '#2563EB',
    meeting: '#EA580C',
    prayer: '#8B5CF6',
  };
  return map[category] ?? '#D4AF37';
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    audience: 'Audience',
    mass: 'Holy Mass',
    angelus: 'Angelus',
    visit: 'Pastoral Visit',
    speech: 'Address',
    meeting: 'Meeting',
    prayer: 'Prayer',
  };
  return map[category] ?? 'Event';
}

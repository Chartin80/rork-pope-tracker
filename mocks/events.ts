import { PopeEvent } from '@/types';

function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const today = new Date();
const todayStr = formatDate(today);

function offsetDate(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export const MOCK_EVENTS: PopeEvent[] = [
  {
    id: '1',
    title: 'General Audience',
    description: 'Pope Leo XIV holds the weekly General Audience in St. Peter\'s Square, addressing the faithful gathered from around the world. His Holiness reflects on the theme of mercy and reconciliation in modern society, drawing from the Gospel of Matthew. The catechesis continues the cycle on Christian hope, emphasizing that hope is not passive waiting but an active engagement with the world.',
    date: todayStr,
    time: '10:00',
    location: "St. Peter's Square",
    locationDetail: 'Vatican City',
    latitude: 41.9022,
    longitude: 12.4539,
    category: 'audience',
    isLive: true,
  },
  {
    id: '2',
    title: 'Angelus Prayer',
    description: 'The Holy Father leads the faithful in the traditional Angelus prayer from the window of the Apostolic Palace. Following the prayer, Pope Leo XIV offers brief reflections on the Sunday readings and greets pilgrims from various nations.',
    date: todayStr,
    time: '12:00',
    location: 'Apostolic Palace',
    locationDetail: 'Vatican City',
    latitude: 41.9029,
    longitude: 12.4572,
    category: 'angelus',
  },
  {
    id: '3',
    title: 'Meeting with Italian Bishops',
    description: 'Pope Leo XIV receives the members of the Italian Episcopal Conference for their annual plenary assembly. Discussions focus on synodality, youth ministry, and the Church\'s response to social challenges in Italy.',
    date: todayStr,
    time: '16:30',
    location: 'Clementine Hall',
    locationDetail: 'Apostolic Palace, Vatican City',
    latitude: 41.9029,
    longitude: 12.4572,
    category: 'meeting',
  },
  {
    id: '4',
    title: 'Pastoral Visit to Ostia Lido',
    description: 'His Holiness makes a pastoral visit to the Parish of "Mary Queen of Peace" in Ostia Lido, celebrating Holy Mass and meeting with the local community. The visit highlights the Church\'s commitment to suburban parishes.',
    date: offsetDate(-1),
    time: '09:30',
    location: 'Ostia Lido',
    locationDetail: 'Rome, Italy',
    latitude: 41.7325,
    longitude: 12.2758,
    category: 'visit',
  },
  {
    id: '5',
    title: 'Address to Diplomatic Corps',
    description: 'Pope Leo XIV delivers his annual address to the Diplomatic Corps accredited to the Holy See. The address covers themes of peace, disarmament, climate stewardship, and the protection of religious freedom worldwide.',
    date: offsetDate(1),
    time: '11:00',
    location: 'Sala Regia',
    locationDetail: 'Apostolic Palace, Vatican City',
    latitude: 41.9029,
    longitude: 12.4572,
    category: 'speech',
  },
  {
    id: '6',
    title: 'Holy Mass for World Day of Peace',
    description: 'The Supreme Pontiff celebrates a solemn Holy Mass in St. Peter\'s Basilica for the World Day of Peace, concelebrating with cardinals and bishops from around the globe.',
    date: offsetDate(1),
    time: '10:00',
    location: "St. Peter's Basilica",
    locationDetail: 'Vatican City',
    latitude: 41.9022,
    longitude: 12.4536,
    category: 'mass',
  },
  {
    id: '7',
    title: 'Visit to Basilica of St. Francis',
    description: 'Pope Leo XIV makes a pilgrimage to the Basilica of Saint Francis in Assisi, praying at the tomb of the Poverello and meeting with the Franciscan community.',
    date: offsetDate(-3),
    time: '10:00',
    location: 'Assisi',
    locationDetail: 'Umbria, Italy',
    latitude: 43.0707,
    longitude: 12.6196,
    category: 'visit',
  },
  {
    id: '8',
    title: 'Prayer Vigil for Migrants',
    description: 'His Holiness leads a prayer vigil in memory of migrants and refugees who have lost their lives. The solemn ceremony includes testimonies, songs, and the lighting of candles.',
    date: offsetDate(-5),
    time: '18:00',
    location: "St. Peter's Square",
    locationDetail: 'Vatican City',
    latitude: 41.9022,
    longitude: 12.4539,
    category: 'prayer',
  },
  {
    id: '9',
    title: 'Audience with Youth Delegates',
    description: 'Pope Leo XIV meets with youth delegates from five continents in preparation for the upcoming Synod on Young People.',
    date: offsetDate(2),
    time: '10:30',
    location: 'Paul VI Audience Hall',
    locationDetail: 'Vatican City',
    latitude: 41.8986,
    longitude: 12.4526,
    category: 'audience',
  },
  {
    id: '10',
    title: 'Visit to Shrine of Pompeii',
    description: 'The Holy Father visits the Pontifical Shrine of the Blessed Virgin of the Rosary of Pompeii, joining in the traditional Supplication prayer.',
    date: offsetDate(4),
    time: '09:00',
    location: 'Pompeii',
    locationDetail: 'Campania, Italy',
    latitude: 40.7502,
    longitude: 14.5010,
    category: 'visit',
  },
  {
    id: '11',
    title: 'Consistory for Creation of New Cardinals',
    description: 'Pope Leo XIV presides over an Ordinary Public Consistory for the creation of new Cardinals in St. Peter\'s Basilica.',
    date: offsetDate(6),
    time: '10:00',
    location: "St. Peter's Basilica",
    locationDetail: 'Vatican City',
    latitude: 41.9022,
    longitude: 12.4536,
    category: 'mass',
  },
  {
    id: '12',
    title: 'Morning Mass at Santa Marta',
    description: 'The Holy Father celebrates morning Mass at the Chapel of Casa Santa Marta, offering his homily on the day\'s readings.',
    date: offsetDate(-7),
    time: '07:00',
    location: 'Casa Santa Marta',
    locationDetail: 'Vatican City',
    latitude: 41.9016,
    longitude: 12.4516,
    category: 'mass',
  },
];

export const NEWS_HEADLINES: string[] = [
  'Pope Leo XIV calls for peace in Eastern Europe during General Audience',
  'Vatican announces new encyclical on digital ethics expected in Spring',
  'Holy Father to visit Assisi for Feast of St. Francis celebrations',
  'Synod on Synodality enters final phase with global consultations',
  'Pope creates 15 new Cardinals from five continents',
  'Vatican Gardens opened to public for special charity event',
  'Pope Leo XIV sends message of solidarity to earthquake victims',
];

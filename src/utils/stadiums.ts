export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number;
  image: string;
}

// Default stadium image
export const DEFAULT_STADIUM_IMAGE = 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80';

export const stadiums: Stadium[] = [
  {
    id: 'signal-iduna-park',
    name: 'Signal Iduna Park',
    city: 'Dortmund',
    capacity: 81365,
    image: 'https://interactive.zeit.de/2019/sportdaten/stadien/dortmund.jpg'
  },

  
  // ... rest of the stadiums remain unchanged
];
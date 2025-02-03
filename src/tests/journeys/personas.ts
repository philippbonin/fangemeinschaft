interface Persona {
  name: string;
  description: string;
  goals: string[];
  tasks: string[];
}

export const personas: Record<string, Persona> = {
  casualFan: {
    name: 'Casual Fan',
    description: 'Gelegentlicher Besucher, der hauptsächlich an Spielen interessiert ist',
    goals: [
      'Spieltermine finden',
      'Tickets kaufen',
      'News lesen'
    ],
    tasks: [
      'Nächstes Spiel finden',
      'Ticket-Verfügbarkeit prüfen',
      'Aktuelle News checken'
    ]
  },

  dedicatedFan: {
    name: 'Dedicated Fan',
    description: 'Regelmäßiger Besucher und Fanclub-Mitglied',
    goals: [
      'Fanclub-Aktivitäten verfolgen',
      'Team-Updates erhalten',
      'Mit anderen Fans interagieren'
    ],
    tasks: [
      'Fanclub-Termine prüfen',
      'Team-News lesen',
      'Chat-Support nutzen'
    ]
  },

  newFan: {
    name: 'New Fan',
    description: 'Neuer Interessent, der mehr über den Verein erfahren möchte',
    goals: [
      'Verein kennenlernen',
      'Mitglied werden',
      'Community finden'
    ],
    tasks: [
      'Über uns Seite lesen',
      'Mitgliedsantrag stellen',
      'Fanclubs durchsuchen'
    ]
  },

  seasonTicketHolder: {
    name: 'Season Ticket Holder',
    description: 'Dauerkarteninhaber mit hohem Engagement',
    goals: [
      'Spielplan im Blick behalten',
      'Team-Performance verfolgen',
      'Community-Events finden'
    ],
    tasks: [
      'Spielplan checken',
      'Statistiken ansehen',
      'Event-Kalender prüfen'
    ]
  }
};
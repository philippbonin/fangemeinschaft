import React, { useState, useEffect } from 'react';
import Button from './Button';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: {
    name: string;
    provider: string;
    purpose: string;
    expiry: string;
  }[];
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Technisch notwendige Cookies',
    description: 'Diese Cookies sind für den Betrieb der Seite unbedingt notwendig.',
    required: true,
    cookies: [
      {
        name: 'session',
        provider: 'Fangemeinschaft',
        purpose: 'Sitzungsverwaltung',
        expiry: 'Sitzung'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analyse Cookies',
    description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
    required: false,
    cookies: [
      {
        name: '_ga',
        provider: 'Google Analytics',
        purpose: 'Besucherstatistiken',
        expiry: '2 Jahre'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Diese Cookies werden verwendet, um Besuchern relevante Werbung zu zeigen.',
    required: false,
    cookies: [
      {
        name: 'ads',
        provider: 'Google Ads',
        purpose: 'Personalisierte Werbung',
        expiry: '1 Jahr'
      }
    ]
  },
  {
    id: 'functional',
    name: 'Funktionale Cookies',
    description: 'Diese Cookies ermöglichen erweiterte Funktionalitäten und Personalisierung.',
    required: false,
    cookies: [
      {
        name: 'preferences',
        provider: 'Fangemeinschaft',
        purpose: 'Benutzereinstellungen',
        expiry: '1 Jahr'
      }
    ]
  }
];

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [hasInteracted, setHasInteracted] = useState(false);
  const [consentInfo, setConsentInfo] = useState<{
    date: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    // Check if user has already made cookie choices
    const savedConsents = localStorage.getItem('cookie-consents');
    const savedConsentInfo = localStorage.getItem('cookie-consent-info');
    
    if (savedConsents) {
      setConsents(JSON.parse(savedConsents));
      setHasInteracted(true);
    } else {
      setIsOpen(true);
    }

    if (savedConsentInfo) {
      setConsentInfo(JSON.parse(savedConsentInfo));
    }
  }, []);

  const generateConsentId = () => {
    return btoa(crypto.getRandomValues(new Uint8Array(32)).toString());
  };

  const handleAcceptAll = () => {
    const allConsents = cookieCategories.reduce((acc, category) => {
      acc[category.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setConsents(allConsents);
    saveConsents(allConsents);
    setIsOpen(false);
    setHasInteracted(true);
  };

  const handleAcceptSelected = () => {
    const updatedConsents = {
      ...consents,
      essential: true // Essential cookies are always required
    };
    saveConsents(updatedConsents);
    setIsOpen(false);
    setHasInteracted(true);
  };

  const handleRejectAll = () => {
    const minimalConsents = {
      essential: true // Only accept required cookies
    };
    setConsents(minimalConsents);
    saveConsents(minimalConsents);
    setIsOpen(false);
    setHasInteracted(true);
  };

  const handleRevokeConsent = () => {
    // Clear all consents except essential
    const minimalConsents = {
      essential: true // Only keep required cookies
    };
    
    // Clear stored consents and info
    localStorage.removeItem('cookie-consents');
    localStorage.removeItem('cookie-consent-info');
    
    // Reset state
    setConsents(minimalConsents);
    setConsentInfo(null);
    setHasInteracted(false);
    setShowDetails(false);
    
    // Show the initial overlay again
    setIsOpen(true);
    
    // Apply minimal consents
    applyConsents(minimalConsents);
  };

  const toggleConsent = (categoryId: string) => {
    if (hasInteracted || categoryId === 'essential') return; // Cannot toggle if already interacted or essential
    setConsents(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const saveConsents = (newConsents: Record<string, boolean>) => {
    const now = new Date();
    const newConsentInfo = {
      date: now.toLocaleString('de-DE', { 
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }),
      id: generateConsentId()
    };

    localStorage.setItem('cookie-consents', JSON.stringify(newConsents));
    localStorage.setItem('cookie-consent-info', JSON.stringify(newConsentInfo));
    setConsentInfo(newConsentInfo);
    applyConsents(newConsents);
  };

  const applyConsents = (newConsents: Record<string, boolean>) => {
    // Example implementation - in production, you would:
    // 1. Enable/disable Google Analytics
    if (newConsents.analytics) {
      console.log('Enabling analytics...');
    }
    
    // 2. Enable/disable marketing pixels
    if (newConsents.marketing) {
      console.log('Enabling marketing...');
    }
    
    // 3. Enable/disable functional features
    if (newConsents.functional) {
      console.log('Enabling functional features...');
    }
  };

  if (!isOpen) {
    return (
      <button
  onClick={() => setIsOpen(true)}
  className="fixed bottom-4 left-4 bg-secondary hover:bg-secondary/90 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
  aria-label="Cookie-Einstellungen öffnen"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6 group-hover:scale-110 transition-transform"
  >
    <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3.003-2.937.005-.034.016-.136.017-.17a.998.998 0 0 0-1.254-1.006A2.963 2.963 0 0 1 15 7c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.716a1 1 0 0 0-1.067-1.236A9.956 9.956 0 0 0 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-.049-.003-.097-.007-.16a1.004 1.004 0 0 0-.395-.776zM12 20c-4.411 0-8-3.589-8-8a7.962 7.962 0 0 1 6.006-7.75A5.006 5.006 0 0 0 15 9l.101-.001a5.007 5.007 0 0 0 4.837 4.837c.003.055.009.109.013.164.024.248.046.495.046.75 0 2.673-1.04 5.197-2.929 7.088A9.936 9.936 0 0 1 12 20zm4-11.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm-3.5 2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-2 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </svg>
</button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cookie-Einstellungen</h2>
              <p className="mt-1 text-sm text-gray-500">
                Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.
              </p>
            </div>
            {hasInteracted && (
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Schließen</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current Consent Status */}
          {hasInteracted && consentInfo && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Ihr aktueller Zustand</h3>
              <div className="space-y-2 mb-4">
                {cookieCategories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <svg 
                      className={`w-4 h-4 ${consents[category.id] ? 'text-green-500' : 'text-gray-400'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{category.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <span className="font-medium">Einwilligungsdatum:</span>
                  <br />
                  {consentInfo.date}
                </div>
                <div>
                  <span className="font-medium">Ihre Einwilligungs-ID:</span>
                  <br />
                  <span className="font-mono text-xs">{consentInfo.id}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {showDetails ? (
              // Detailed view
              cookieCategories.map(category => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                    </div>
                    <div className="ml-4">
                      {!hasInteracted ? (
                        <button
                          onClick={() => toggleConsent(category.id)}
                          className={`w-11 h-6 rounded-full relative ${consents[category.id] ? 'bg-secondary' : 'bg-gray-200'}`}
                          disabled={category.required}
                          aria-checked={consents[category.id]}
                          role="switch"
                        >
                          <div 
                            className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                              consents[category.id] ? 'translate-x-full border-white' : ''
                            }`}
                          ></div>
                        </button>
                      ) : (
                        <div className={`w-11 h-6 rounded-full relative ${consents[category.id] ? 'bg-secondary' : 'bg-gray-200'}`}>
                          <div 
                            className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                              consents[category.id] ? 'translate-x-full border-white' : ''
                            }`}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cookie details table */}
                  <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cookie</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Anbieter</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Zweck</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Laufzeit</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {category.cookies.map(cookie => (
                          <tr key={cookie.name}>
                            <td className="px-3 py-2 text-sm text-gray-900">{cookie.name}</td>
                            <td className="px-3 py-2 text-sm text-gray-500">{cookie.provider}</td>
                            <td className="px-3 py-2 text-sm text-gray-500">{cookie.purpose}</td>
                            <td className="px-3 py-2 text-sm text-gray-500">{cookie.expiry}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              // Simple view
              cookieCategories.map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                  {!hasInteracted ? (
                    <button
                      onClick={() => toggleConsent(category.id)}
                      className={`w-11 h-6 rounded-full relative ${consents[category.id] ? 'bg-secondary' : 'bg-gray-200'}`}
                      disabled={category.required}
                      aria-checked={consents[category.id]}
                      role="switch"
                    >
                      <div 
                        className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                          consents[category.id] ? 'translate-x-full border-white' : ''
                        }`}
                      ></div>
                    </button>
                  ) : (
                    <div className={`w-11 h-6 rounded-full relative ${consents[category.id] ? 'bg-secondary' : 'bg-gray-200'}`}>
                      <div 
                        className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                          consents[category.id] ? 'translate-x-full border-white' : ''
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {showDetails ? 'Details ausblenden' : 'Details anzeigen'}
            </button>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {hasInteracted ? (
                <button
                  onClick={handleRevokeConsent}
                  className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  Widerrufen Sie Ihre Einwilligung
                </button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                  >
                    Alle ablehnen
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAcceptSelected}
                  >
                    Auswahl bestätigen
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAcceptAll}
                  >
                    Alle akzeptieren
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
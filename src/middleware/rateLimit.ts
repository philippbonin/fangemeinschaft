const rateLimits = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(limit: number, window: number) {
  return async (params: any, next: (params: any) => Promise<any>) => {
    const token = extractToken(params.request) || 'anonymous';
    
    const entry = rateLimits.get(token) || { count: 0, resetTime: Date.now() + window };
    if (entry.count >= limit && Date.now() < entry.resetTime) {
      throw new Error('Rate limit exceeded');
    }

    entry.count++;
    rateLimits.set(token, entry);

    return next(params);
  };
  
}

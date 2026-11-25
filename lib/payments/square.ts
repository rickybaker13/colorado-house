import { SquareClient, SquareEnvironment } from 'square';

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
});

export function squareLocationId(): string {
  return process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
}

/** Turn a Square SDK error into a guest-friendly message. */
export function squareErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'errors' in err) {
    const first = (err as { errors?: Array<{ detail?: string }> }).errors?.[0];
    if (first?.detail) return first.detail;
  }
  return fallback;
}

'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Loader2, Lock } from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

// Square Web Payments SDK types (loaded from CDN)
interface SquarePayments {
  card: (options?: Record<string, unknown>) => Promise<SquareCard>;
}

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<SquareTokenResult>;
  destroy: () => Promise<void>;
}

interface SquareTokenResult {
  status: 'OK' | 'ERROR';
  token?: string;
  errors?: Array<{ message: string }>;
}

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}

export interface SquareCardFormHandle {
  tokenize: () => Promise<{ token: string } | { error: string }>;
}

interface SquareCardFormProps {
  /** Whether the form is in a loading/submitting state */
  disabled?: boolean;
}

/* ─────────────────────── config ─────────────────────── */

const SQUARE_APP_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID || '';
const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';

// Determine SDK URL based on app ID prefix (sandbox IDs start with "sandbox-")
const SQUARE_SDK_URL = SQUARE_APP_ID.startsWith('sandbox-')
  ? 'https://sandbox.web.squareup.com/v1/square.js'
  : 'https://web.squareup.com/v1/square.js';

/* ─────────────────────── component ─────────────────────── */

const SquareCardForm = forwardRef<SquareCardFormHandle, SquareCardFormProps>(
  function SquareCardForm({ disabled = false }, ref) {
    const cardRef = useRef<SquareCard | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const initAttempted = useRef(false);

    // Expose tokenize method to parent via ref
    useImperativeHandle(ref, () => ({
      async tokenize() {
        if (!cardRef.current) {
          return { error: 'Card form not initialized. Please wait and try again.' };
        }
        try {
          const result = await cardRef.current.tokenize();
          if (result.status === 'OK' && result.token) {
            return { token: result.token };
          }
          const errorMsg =
            result.errors?.map((e) => e.message).join('; ') ||
            'Card verification failed. Please check your card details.';
          return { error: errorMsg };
        } catch (err) {
          return {
            error: err instanceof Error ? err.message : 'Failed to process card.',
          };
        }
      },
    }));

    const initializeCard = useCallback(async () => {
      if (!window.Square) {
        setError('Square payments SDK failed to load.');
        setLoading(false);
        return;
      }

      if (!SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
        setError('Payment configuration is missing. Please contact the property owner.');
        setLoading(false);
        return;
      }

      try {
        const payments = await window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);

        const card = await payments.card({
          style: {
            '.input-container': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            },
            '.input-container.is-focus': {
              borderColor: '#c4956a',
            },
            '.input-container.is-error': {
              borderColor: '#ef4444',
            },
            '.message-text': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
            '.message-icon': {
              color: '#ef4444',
            },
            '.message-text.is-error': {
              color: '#ef4444',
            },
            input: {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#f5f0eb',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
            },
            'input::placeholder': {
              color: 'rgba(255, 255, 255, 0.2)',
            },
            'input.is-error': {
              color: '#ef4444',
            },
          },
        });

        await card.attach('#square-card-container');
        cardRef.current = card;
        setLoading(false);
      } catch (err) {
        console.error('Square card initialization error:', err);
        setError('Failed to load payment form. Please refresh and try again.');
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      if (initAttempted.current) return;
      initAttempted.current = true;

      // Load the Square Web Payments SDK script
      const existingScript = document.querySelector(
        `script[src="${SQUARE_SDK_URL}"]`
      );

      if (existingScript) {
        // Script already loaded
        if (window.Square) {
          initializeCard();
        } else {
          existingScript.addEventListener('load', initializeCard);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = SQUARE_SDK_URL;
      script.async = true;
      script.onload = initializeCard;
      script.onerror = () => {
        setError('Failed to load payment SDK. Please check your connection and refresh.');
        setLoading(false);
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup: destroy card instance on unmount
        if (cardRef.current) {
          cardRef.current.destroy().catch(() => {});
          cardRef.current = null;
        }
      };
    }, [initializeCard]);

    if (error) {
      return (
        <div className="mt-3 ml-7 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm font-sans text-red-300">{error}</p>
        </div>
      );
    }

    return (
      <div className="mt-3 ml-7">
        <div
          className={`rounded-xl border border-white/10 p-4 transition-opacity ${
            disabled ? 'opacity-50 pointer-events-none' : ''
          }`}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
        >
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={20} className="animate-spin text-stone" />
              <span className="ml-2 text-sm font-sans text-white/40">
                Loading secure payment form...
              </span>
            </div>
          )}
          <div
            id="square-card-container"
            ref={containerRef}
            style={{ minHeight: loading ? 0 : '89px', display: loading ? 'none' : 'block' }}
          />
          {!loading && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
              <Lock size={11} className="text-white/25" />
              <span className="text-[11px] font-sans text-white/25">
                Secured by Square. Card details never touch our servers.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default SquareCardForm;

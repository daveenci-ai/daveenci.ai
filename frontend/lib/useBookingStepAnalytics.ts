import { useCallback, useRef } from 'react';
import { track } from './analytics';

/** Track a prospect reaching booking details once per mounted funnel. */
export const useBookingStepAnalytics = (bookingType: string): (() => void) => {
  const detailsTracked = useRef(false);

  return useCallback(() => {
    if (detailsTracked.current) return;
    detailsTracked.current = true;
    track('booking_step_viewed', { booking_type: bookingType, step: 'details' });
  }, [bookingType]);
};

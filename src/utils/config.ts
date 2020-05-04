// Don't forget these APIs are experimental and can change.
export const suspenseConfig = {
  timeoutMs: 6000,
  busyDelayMs: 500, // Before we show the inline spinner
  busyMinDurationMs: 100, // If we show it, force it to stick for a bit
};
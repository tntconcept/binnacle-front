export const SUSPENSE_CONFIG = {
  timeoutMs: 6000,
  busyDelayMs: 500, // Before we show the inline spinner <- Deprecated now is done using css.
  busyMinDurationMs: 100 // If we show it, force it to stick for a bit
}

import { untrack } from "svelte";

let liveTimestamp = $state(Date.now());
const liveMinutes = $derived(new Date(liveTimestamp).getMinutes());
const minuteTimestamp = $derived.by(() => {
  liveMinutes;
  return untrack(() => liveTimestamp);
});

function updateClockTimer(): ReturnType<typeof setTimeout> {
  return setTimeout(updateClock, 1000 - (liveTimestamp % 1000));
}

let clockTimer = updateClockTimer();

function updateClock() {
  liveTimestamp = Date.now();
  clockTimer = updateClockTimer();
}

export function liveTicker(): number {
  return liveTimestamp;
}

export function minuteTicker(): number {
  return minuteTimestamp;
}

let liveTimestamp = $state(Date.now());
const minuteTimestamp = $derived(Math.floor(liveTimestamp / 60000.0) * 60000.0);

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

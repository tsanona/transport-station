import { onDestroy, onMount } from "svelte";

let timestamp = $state(Date.now());
let clockTimer = updateClockTimer();

function updateClockTimer(): ReturnType<typeof setTimeout> {
  return setTimeout(updateClock, 1000 - (timestamp % 1000))
}

function updateClock() {
  timestamp = Date.now();
  clockTimer = updateClockTimer();
}

export function now(): number {
  return timestamp
}
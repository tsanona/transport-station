export class Clock {
  currentTime = $state(Date.now());
  clockTimer: ReturnType<typeof setTimeout>;
  private updateClockTimer = () =>
    setTimeout(this.updateClock, 1000 - (this.currentTime % 1000));
  private updateClock = () => {
    this.currentTime = Date.now();
    this.clockTimer = this.updateClockTimer();
  };

  constructor() {
    this.clockTimer = this.updateClockTimer();
  }
}
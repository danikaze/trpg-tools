export const htmlHeader = ``;
export const cssHeader = `
/*
* strings as
*   url(#NAME#)
* will be replaced by uploaded images for the associated Widget Definition
*/`;
export const jsHeader = `
/*
 * Two global functions are available to receive events:
 * - onDataLoad((type, data) => void);
 * - onDataUpdate((type, data) => void);
 *
 * Parameters are the same for both:
 * - type: string with the type of the event
 * - data: object with the data of the event
 */`;

export const tweenClass = `
class Tween {
  constructor(value, duration = Tween.EASE_TIME) {
    const numericValue = Number(value);
    this.duration = duration;
    this.value = numericValue;
    this.current = numericValue;
    this.startValue = numericValue;
    this.range = 0;
    this.startTime = 0;
    this.update = this.update.bind(this);
    this.onChangeCallback = undefined;
    this.transformCallback = (x) => x;
  }

  onChange(callback) {
    this.onChangeCallback = callback;
    return this;
  }

  transform(callback) {
    this.transformCallback = callback;
    return this;
  }

  tweenTo(value) {
    const numericValue = Number(value);
    if (this.interval || numericValue === this.current) return this;

    this.range = numericValue - this.current;
    this.startValue = this.current;
    this.startTime = Date.now();
    this.interval =
      (typeof window !== 'undefined' &&
        window.setInterval(this.update, Tween.INTERVAL)) ||
      undefined;

    return this;
  }

  // private
  stop() {
    if (!this.interval) return this;
    clearInterval(this.interval);
    this.interval = undefined;

    return this;
  }

  // private
  update() {
    const x = (Date.now() - this.startTime) / this.duration;
    const progress = Math.min(1, Math.max(0, x));
    const value = this.startValue + this.range * Tween.easeInOutCubic(progress);

    if (progress >= 1) {
      this.stop();
    }

    this.current = value;
    const transformedValue = this.transformCallback(value);
    if (this.value === transformedValue) return;
    this.value = transformedValue;
    this.onChangeCallback && this.onChangeCallback(this.value);

    return this;
  }
}
Tween.EASE_TIME = 2000;
Tween.INTERVAL = 1000 / 60;
Tween.easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
`;

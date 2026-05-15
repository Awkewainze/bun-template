/**
 * !(DANGER) This should not be used with real Dates. Not every day has 24 hours for example, time is weird. This is just a simple abstraction.
 * If you want real time adding on Dates, use [Luxon](https://github.com/moment/luxon).
 *
 * Can be used for simple conversions, I recommend going from bigger to smaller because of floating point errors
 */
class Duration {
	constructor(private readonly milliseconds: number) {
	}
	/**
	 * Converts this duration to milliseconds.
	 * @returns number of milliseconds representing this duration.
	 */
	get inMilliseconds(): number {
		return this.milliseconds;
	}
	/**
	 * Converts this duration to seconds.
	 * @returns number of seconds representing this duration.
	 */
	get inSeconds(): number {
		return this.milliseconds / 1000;
	}
	/**
	 * Converts this duration to minutes.
	 * @returns number of minutes representing this duration.
	 */
	get inMinutes(): number {
		return this.inSeconds / 60;
	}
	/**
	 * Converts this duration to hours.
	 * @returns number of hours representing this duration.
	 */
	get inHours(): number {
		return this.inMinutes / 60;
	}
	/**
	 * Converts this duration to days.
	 * @returns number of days representing this duration.
	 */
	get inDays(): number {
		return this.inHours / 24;
	}

	/**
	 * Creates a new duration with length equal to the sum of this duration and provided duration.
	 * @param duration duration to add to this one.
	 * @returns the new duration that is the sum of this duration and duration in parameter.
	 */
	add(duration: Duration): Duration {
		return new Duration(this.milliseconds + duration.inMilliseconds);
	}
	/**
	 * Creates a new duration that is equal to this duration multiplied by provided number.
	 * @param times times to multiple this duration by.
	 * @returns the new duration that is the multiplication of this duration and number in parameter.
	 */
	multiplyBy(times: number): Duration {
		return new Duration(this.milliseconds * times);
	}
}

export function milliseconds(milliseconds: number) {
	return new Duration(milliseconds);
}
export function seconds(seconds: number) {
	return milliseconds(seconds * 1000);
}
export function minutes(minutes: number) {
	return seconds(minutes * 60);
}
export function hours(hours: number) {
	return minutes(hours * 60);
}
export function days(days: number) {
	return hours(days * 24);
}

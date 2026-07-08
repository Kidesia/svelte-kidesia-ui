/**
 * Represents a date string in YYYY-mm-DD format.
 * This is a "branded" type to distinguish it from a regular string.
 *
 * Use `isValidDateString` and `toDateString` for safe conversion.
 *
 * @pattern ^\d{4}-\d{2}-\d{2}$
 * @example "2025-08-09"
 */
export type DateString = string & { readonly __brand: unique symbol };

/**
 * Checks if a string conforms to the YYYY-mm-DD date string format.
 * @param s The string to validate.
 * @returns True if the string is a valid DateString, false otherwise.
 */
export function isValidDateString(s: string): s is DateString {
	return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/**
 * Converts a string to a DateString type, throwing an error if the format is invalid.
 * @param s The string to convert.
 * @returns The string as a DateString.
 * @throws Error if the string does not match the YYYY-mm-DD format.
 */
export function toDateString(s: string | Date): DateString {
	let ds: string;

	if (s instanceof Date) {
		const year = s.getFullYear().toString().padStart(4, '0');
		const month = (s.getMonth() + 1).toString().padStart(2, '0');
		const day = s.getDate().toString().padStart(2, '0');
		ds = `${year}-${month}-${day}`;
	} else {
		ds = s;
	}

	if (!isValidDateString(ds)) {
		throw new Error(`Invalid DateString format: "${ds}". Expected YYYY-mm-DD.`);
	}

	return ds as DateString;
}

/**
 * Converts a string or Date to a DateString, returning an empty string for null/undefined/empty input.
 * Useful for binding to form inputs that accept empty values.
 * @param s The string or Date to convert.
 * @returns The DateString or an empty string.
 */
export function maybeToDateString(s: string | Date | null | undefined): DateString | '' {
	if (s === null || s === undefined || s === '') {
		return '';
	}

	return toDateString(s);
}

/**
 * Converts a DateString back to a Date object.
 * @param s The DateString to convert.
 * @returns The Date object with time set to 00:00:00 in the local timezone.
 */
export function fromDateString(s: DateString): Date {
	const [year, month, day] = s.split('-').map(Number);
	return new Date(year, month - 1, day);
}

import { isSameDay, isSameYear } from 'date-fns';

import i18n from '$lib/i18n/index.svelte';

import { type DateString, fromDateString } from './date-string';

/**
 * Helper function to convert DateString to Date if needed.
 */
function getDate(date: Date | DateString): Date {
	return typeof date === 'string' ? fromDateString(date) : date;
}

/**
 * Returns the locale string for the current language.
 */
function getLocale() {
	return `${i18n.language}-CH`;
}

/**
 * Formats a date to a short month+day string, e.g. "März 2".
 */
export function formatMonthDay(date: Date | DateString) {
	return new Intl.DateTimeFormat(getLocale(), { month: 'short', day: 'numeric' }).format(
		getDate(date)
	);
}

/**
 * Formats a date to an abbreviated weekday name, e.g. "Mo.".
 */
export function formatWeekday(date: Date | DateString) {
	return new Intl.DateTimeFormat(getLocale(), { weekday: 'short' }).format(getDate(date));
}

/**
 * Formats a date to a string in the format "dd.MM.yyyy".
 */
export function formatDateDDMMYYYY(date: Date | DateString) {
	const d = getDate(date);
	const year = d.getFullYear();
	const month = d.getMonth() + 1; // getMonth() returns a 0-based month
	const day = d.getDate();

	return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
}

/**
 * Formats a date to a string with long month name and year.
 */
export function formatDayLongWithYear(date: Date | DateString) {
	const d = getDate(date);
	const dayShortFormatter = new Intl.DateTimeFormat(getLocale(), {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	return dayShortFormatter.format(d);
}

/**
 * Formats a date to a string with long weekday, month name, day, and year.
 */
export function formatWeekdayLongWithYear(date: Date | DateString) {
	return new Intl.DateTimeFormat(getLocale(), {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}).format(getDate(date));
}

/**
 * Formats a duration given in minutes to "H:MMh" format (the trailing "h"
 * distinguishes a duration from a clock time like "12:30").
 * If the input is null, returns an empty string.
 * @param minutes The duration in minutes (negative renders with a leading "-").
 * @param showPositiveSign When true, non-negative values render with a leading "+".
 * @returns The formatted duration, or "" when minutes is null.
 */
export function formatDuration(minutes: number | null, showPositiveSign = false) {
	if (minutes == null) return '';

	const isNegative = minutes < 0;
	const absMinutes = Math.abs(minutes);
	const hrs = Math.floor(absMinutes / 60);
	const formattedHrs = new Intl.NumberFormat(getLocale()).format(hrs);
	const mins = absMinutes % 60;
	return `${isNegative ? '-' : showPositiveSign ? '+' : ''}${formattedHrs}:${mins.toString().padStart(2, '0')}h`;
}

/**
 * Formats a duration given in minutes to "X hr Y min" format.
 * If the input is null, returns an empty string.
 */
export function formatDurationLong(minutes: number | null) {
	if (minutes == null) return '';
	const hrs = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hrs === 0) {
		return `${mins} ${i18n.t('common.minutesShort')}`;
	} else {
		return `${hrs} ${i18n.t('common.hoursShort')} ${mins.toString()} ${i18n.t('common.minutesShort')}`;
	}
}

/**
 * Formats a date to a string in the format "dd. MMM yy, ddd" for the "de-CH" locale.
 */
export function formatDate(date: Date | DateString) {
	const d = getDate(date);
	return d.toLocaleDateString(getLocale(), {
		year: '2-digit',
		month: 'short',
		day: 'numeric',
		weekday: 'short'
	});
}

/**
 * Formats a date range. If both dates are the same, returns a single date.
 * If both dates are in the same year, omits the year from the first date.
 * Otherwise, returns both dates in full format.
 */
export function formatDateRange(dateFrom: Date | DateString, dateTo: Date | DateString) {
	const from = getDate(dateFrom);
	const to = getDate(dateTo);

	if (isSameDay(from, to)) {
		return formatDate(from);
	}

	if (isSameYear(from, to)) {
		return `${from.toLocaleDateString(getLocale(), {
			weekday: 'short',
			day: 'numeric',
			month: 'short'
		})} - ${formatDate(to)}`;
	}

	return `${formatDate(from)} - ${formatDate(to)}`;
}

/**
 * Formats a date to a string with date and time in the "de-CH" locale.
 */
export function formatDateTime(date: Date | DateString) {
	const d = getDate(date);
	return d.toLocaleDateString(getLocale(), {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/**
 * Formats a date to a time string in "HH:MM" format in the "de-CH" locale.
 */
export function formatTime(date: Date | DateString) {
	const d = getDate(date);
	return d.toLocaleTimeString(getLocale(), {
		hour: '2-digit',
		minute: '2-digit'
	});
}

/**
 * Formats a time range from two dates to "HH:MM - HH:MM" format.
 */
export function formatTimeRange(from: Date | DateString, to: Date | DateString) {
	return `${formatTime(from)} - ${formatTime(to)}`;
}

/**
 * Formats a work-time range (raw "HH:mm" strings) with a pause suffix:
 * "06:45 - 16:15 (51' Pause)".
 */
export function formatWorkTimeRange(
	startTime: string,
	endTime: string,
	pauseMinutes: number | null | undefined
): string {
	return `${startTime} - ${endTime} (${pauseMinutes ?? 0}' ${i18n.t('common.pause')})`;
}

/**
 * Returns a string with the first letter capitalized.
 * @param str The input string.
 * @returns The input string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str: string) {
	if (str.length === 0) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a day fraction to "X.X d" format.
 * If the input is null/undefined or 0, returns "0.0 d".
 */
export function formatDaysFraction(daysFraction: number | null | undefined) {
	const formatted = daysFraction ? daysFraction.toFixed(1) : '0.0';
	return `${formatted} ${i18n.t('common.daysShort')}`;
}

/**
 * Formats a date to a short format with weekday, day, and month.
 */
export function formatDayShort(date: Date | DateString) {
	const d = getDate(date);
	const dayShortFormatter = new Intl.DateTimeFormat(getLocale(), {
		weekday: 'short',
		day: 'numeric',
		month: 'numeric'
	});

	return dayShortFormatter.format(d).replace('.,', ',');
}

/**
 * Formats a date to a short format with  day, and month.
 */
export function formatDateDDMM(date: Date | DateString) {
	const d = getDate(date);
	const dayShortFormatter = new Intl.DateTimeFormat(getLocale(), {
		day: 'numeric',
		month: 'numeric'
	});

	return dayShortFormatter.format(d);
}

/**
 * Calculates the net duration of a shift in minutes.
 * Handles over-midnight shifts (e.g. 23:00 to 01:00).
 */
export function calculateDurationInMinutes(start: string, end: string, pause: number): number {
	const timeToMinutes = (time: string) => {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	};

	const startMins = timeToMinutes(start);
	const endMins = timeToMinutes(end);

	let duration = endMins - startMins;

	// Handle over-midnight shifts
	if (duration < 0) {
		duration += 24 * 60;
	}

	return duration - pause;
}

/**
 * Formats an ESR/QR reference number into blocks of five digits from the right.
 * @param value - The raw reference number, with or without spaces
 * @returns The grouped reference number
 */
export function formatReferenceNumber(value: string): string {
	const digits = value.replace(/\s+/g, '');
	const groups: string[] = [];
	for (let end = digits.length; end > 0; end -= 5) {
		groups.unshift(digits.slice(Math.max(0, end - 5), end));
	}
	return groups.join(' ');
}

/**
 * Formats a date's weekday as its short name (e.g. "Sa").
 * @param date - The date to format
 * @returns The translated short weekday name
 */
export function formatDateWeekday(date: Date): string {
	return i18n.t(`weekdays.short.${date.getDay()}`);
}

/**
 * Formats a date as "08.07." (day and month only).
 * @param date - The date to format
 * @returns The formatted date string
 */
export function formatDateShortDM(date: Date): string {
	return new Intl.DateTimeFormat('de-CH', { day: '2-digit', month: '2-digit' }).format(date);
}

/**
 * Formats a date as "08.07.23".
 * @param date - The date to format
 * @returns The formatted date string
 */
export function formatDateMedium(date: Date): string {
	return new Intl.DateTimeFormat('de-CH', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit'
	}).format(date);
}

/**
 * Formats a date as "Sa, 08.07.23" (short weekday plus medium date).
 * @param date - The date to format
 * @returns The formatted date string
 */
export function formatDateMediumWithWeekday(date: Date): string {
	return `${formatDateWeekday(date)}, ${formatDateMedium(date)}`;
}

/**
 * Formats a CHF amount with two decimals in the "de-CH" locale (without
 * currency prefix).
 * @param amount - The amount
 * @returns The formatted amount, e.g. "1'234.50"
 */
export function formatAmount(amount: number): string {
	return amount.toLocaleString('de-CH', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

/**
 * Formats a byte count as a short human-readable size.
 * @param bytes - The size in bytes
 * @returns The formatted size, e.g. "1.2 MB" or "340 KB"
 */
export function formatFileSize(bytes: number): string {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Formats a date as a long month name with year, e.g. "Juli 2026".
 * @param date - The date
 * @returns The formatted month label
 */
export function formatMonthYear(date: Date): string {
	return new Intl.DateTimeFormat(getLocale(), { month: 'long', year: 'numeric' }).format(date);
}

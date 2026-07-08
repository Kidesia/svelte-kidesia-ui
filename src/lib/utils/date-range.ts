import {
	addWeeks,
	differenceInCalendarWeeks,
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfWeek
} from 'date-fns';

import { type DateString, fromDateString, toDateString } from './date-string';

export type DateRange = {
	date: DateString;
	period: 'day' | 'week' | '2-week' | 'month' | 'year';
	fullWeeks: boolean;
};

/**
 * Changes the date by a given amount of periods.
 * @param date The original date as a string (YYYY-MM-DD).
 * @param amount The number of periods to change (positive or negative).
 * @param period The type of period to change (day, week, 2-week, month, year).
 * @returns The new date as a string (YYYY-MM-DD).
 */
export function changeDate(date: DateString, amount: number, period: DateRange['period']) {
	const newDate = fromDateString(date);

	switch (period) {
		case 'day':
			newDate.setDate(newDate.getDate() + amount);
			break;
		case 'week':
			newDate.setDate(newDate.getDate() + amount * 7);
			break;
		case '2-week':
			newDate.setDate(newDate.getDate() + amount * 14);
			break;
		case 'month':
			// Use day 1 to avoid overflow when the current day exceeds the target month's length
			// (e.g. March 31 + 1 month would otherwise land on May 1 instead of April)
			newDate.setDate(1);
			newDate.setMonth(newDate.getMonth() + amount);
			break;
		case 'year':
			newDate.setFullYear(newDate.getFullYear() + amount);
			break;
		default:
			throw new Error(`Unsupported period: ${period}`);
	}

	return toDateString(newDate);
}

function normalizeDate(date: Date | DateString) {
	return date instanceof Date ? new Date(date) : fromDateString(date);
}

/**
 * Snaps an arbitrary date to the canonical start date for a scheduler period.
 * For 2-week ranges, the current reference date is used to preserve the existing cadence.
 */
export function snapDateToPeriod(
	date: Date | DateString,
	period: DateRange['period'],
	referenceDate: Date | DateString = date
) {
	const actualDate = normalizeDate(date);

	switch (period) {
		case 'day':
			return toDateString(actualDate);
		case 'week':
			return toDateString(startOfWeek(actualDate, { weekStartsOn: 1 }));
		case '2-week': {
			const referenceStart = startOfWeek(normalizeDate(referenceDate), { weekStartsOn: 1 });
			const targetWeekStart = startOfWeek(actualDate, { weekStartsOn: 1 });
			const weekOffset = differenceInCalendarWeeks(targetWeekStart, referenceStart, {
				weekStartsOn: 1
			});
			const alignedWeekOffset = weekOffset % 2 === 0 ? weekOffset : weekOffset - 1;
			return toDateString(addWeeks(referenceStart, alignedWeekOffset));
		}
		case 'month':
			return toDateString(startOfMonth(actualDate));
		case 'year':
			return toDateString(new Date(actualDate.getFullYear(), 0, 1));
		default:
			throw new Error(`Unsupported period: ${period}`);
	}
}

/**
 * Returns the bounding dates of the range that should be fetched from the API.
 *
 * Always rounds month ranges to full weeks (regardless of `fullWeeks`) so toggling
 * the option doesn't change the request URL and force a refetch. The backend
 * extends to full weeks of overlapping versions anyway, so this returns the same
 * payload either way. Consumers that need to clamp to the user-visible period
 * should call `getBoundingDates(dateRange)` separately.
 */
export function getFetchBoundingDates(dateRange: DateRange) {
	return getBoundingDates({ ...dateRange, fullWeeks: true });
}

/**
 * Calculates the start and end dates of a given date range.
 * @param dateRange The date range to calculate.
 * @returns The start and end dates of the range.
 */
export function getBoundingDates(dateRange: DateRange) {
	const { date, period, fullWeeks } = dateRange;

	const actualDate = fromDateString(date);
	let startDate: Date;
	let endDate: Date;

	switch (period) {
		case 'day':
			startDate = new Date(actualDate);
			endDate = new Date(actualDate);
			break;
		case 'week':
			startDate = startOfWeek(actualDate, { weekStartsOn: 1 });
			endDate = endOfWeek(actualDate, { weekStartsOn: 1 });
			break;
		case '2-week':
			startDate = startOfWeek(actualDate, { weekStartsOn: 1 });
			endDate = new Date(startDate);
			endDate.setDate(endDate.getDate() + 13);
			break;
		case 'month':
			startDate = fullWeeks
				? startOfWeek(startOfMonth(actualDate), { weekStartsOn: 1 })
				: startOfMonth(actualDate);
			if (fullWeeks) {
				endDate = endOfWeek(endOfMonth(actualDate), { weekStartsOn: 1 });
			} else {
				endDate = endOfMonth(actualDate);
			}
			break;
		case 'year':
			startDate = new Date(actualDate.getFullYear(), 0, 1);
			endDate = new Date(actualDate.getFullYear() + 1, 0, 1);
			break;
		default:
			throw new Error(`Unsupported period: ${period}`);
	}

	return { start: startDate, end: endDate };
}

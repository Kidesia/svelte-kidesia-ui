import { describe, expect, it } from 'vitest';

import { fromDateString, isValidDateString, toDateString } from './date-string';

describe('date-string', () => {
	it('round-trips a date', () => {
		const date = new Date(2026, 6, 8);
		expect(fromDateString(toDateString(date)).getTime()).toBe(date.getTime());
	});

	it('validates the date string format', () => {
		expect(isValidDateString('2026-07-08')).toBe(true);
		expect(isValidDateString('08.07.2026')).toBe(false);
		expect(isValidDateString('not a date')).toBe(false);
	});
});

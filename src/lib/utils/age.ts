import { differenceInMonths } from 'date-fns';

/**
 * Calculates a person's age in full months.
 * @param birthdate - The date of birth
 * @returns The number of full months since the birthdate
 */
export function getAgeInMonths(birthdate: Date): number {
	return differenceInMonths(new Date(), birthdate);
}

<script lang="ts">
	import { addMonths, subMonths } from 'date-fns';
	import ExpandMore from '~icons/material-symbols/expand-more-rounded';

	import i18n from '$lib/i18n/index.svelte';

	import StepperSelector from './StepperSelector.svelte';

	type Props = {
		monthDate: Date;
		minDate?: Date;
		maxDate?: Date;
		onChange?: (date: Date) => void;
	};

	let {
		monthDate = $bindable(),
		minDate = new Date(2020, 0, 1),
		maxDate = new Date(new Date().getFullYear() + 2, 11, 31),
		onChange
	}: Props = $props();

	const currentMonth = $derived(monthDate.getMonth());
	const currentYear = $derived(monthDate.getFullYear());

	const yearOptions = $derived.by(() => {
		const years: number[] = [];
		const minYear = minDate.getFullYear();
		const maxYear = maxDate.getFullYear();
		for (let i = minYear; i <= maxYear; i++) {
			years.push(i);
		}
		return years;
	});

	const monthOptions = $derived(
		Array.from({ length: 12 }, (_, i) => {
			const date = new Date(2024, i, 1);
			const label = new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(date);
			return { value: i, label };
		})
	);

	const previousMonthAllowed = $derived(monthDate > minDate);
	const nextMonthAllowed = $derived(monthDate < maxDate);

	function decrementMonth() {
		if (previousMonthAllowed) {
			const newDate = subMonths(monthDate, 1);
			monthDate = newDate;
			onChange?.(newDate);
		}
	}

	function incrementMonth() {
		if (nextMonthAllowed) {
			const newDate = addMonths(monthDate, 1);
			monthDate = newDate;
			onChange?.(newDate);
		}
	}

	function handleMonthChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newMonth = parseInt(target.value, 10);
		const newDate = new Date(currentYear, newMonth, 1);
		monthDate = newDate;
		onChange?.(newDate);
	}

	function handleYearChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newYear = parseInt(target.value, 10);
		const newDate = new Date(newYear, currentMonth, 1);
		monthDate = newDate;
		onChange?.(newDate);
	}
</script>

<StepperSelector
	onPrev={decrementMonth}
	onNext={incrementMonth}
	prevDisabled={!previousMonthAllowed}
	nextDisabled={!nextMonthAllowed}
	prevLabel={i18n.t('common.previousMonth')}
	nextLabel={i18n.t('common.nextMonth')}
>
	<div class="select-wrapper">
		<select value={currentMonth} onchange={handleMonthChange}>
			{#each monthOptions as month (month.value)}
				<option value={month.value}>{month.label}</option>
			{/each}
		</select>
		<span class="select-chevron" aria-hidden="true">
			<ExpandMore />
		</span>
	</div>

	<div class="select-wrapper">
		<select value={currentYear} onchange={handleYearChange}>
			{#each yearOptions as year (year)}
				<option value={year}>{year}</option>
			{/each}
		</select>
		<span class="select-chevron" aria-hidden="true">
			<ExpandMore />
		</span>
	</div>
</StepperSelector>

<style>
	.select-wrapper {
		position: relative;
		display: flex;
		align-items: center;

		&:focus-within {
			z-index: 1;
		}
	}

	select {
		appearance: none;
		color: var(--color-text-primary);
		background: transparent;
		padding: 0.25rem 1.5rem 0.25rem 0.5rem;
		border: none;
		font-size: 0.875rem;
		cursor: pointer;
		border-radius: 0;

		&:focus-visible {
			position: relative;
			z-index: 1;
		}
	}

	.select-chevron {
		position: absolute;
		right: 0.1rem;
		pointer-events: none;
		color: var(--color-text-primary);
		font-size: 1.25rem;
	}
</style>

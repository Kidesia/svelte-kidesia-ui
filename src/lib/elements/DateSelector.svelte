<script lang="ts">
	import { addDays, format } from 'date-fns';

	import i18n from '$lib/i18n/index.svelte';

	import StepperSelector from './StepperSelector.svelte';

	type Props = {
		date: Date;
		step?: number;
		minDate?: Date;
		maxDate?: Date;
		prevLabel?: string;
		nextLabel?: string;
		onChange?: (date: Date) => void;
	};

	let {
		date = $bindable(new Date()),
		step = 1,
		minDate,
		maxDate,
		prevLabel = i18n.t('common.previousDay'),
		nextLabel = i18n.t('common.nextDay'),
		onChange
	}: Props = $props();

	const previousAllowed = $derived(!minDate || addDays(date, -step) >= minDate);
	const nextAllowed = $derived(!maxDate || addDays(date, step) <= maxDate);
	const inputValue = $derived(date && !isNaN(date.getTime()) ? format(date, 'yyyy-MM-dd') : '');

	function navigatePrev() {
		if (previousAllowed) {
			const newDate = addDays(date, -step);
			date = newDate;
			onChange?.(newDate);
		}
	}

	function navigateNext() {
		if (nextAllowed) {
			const newDate = addDays(date, step);
			date = newDate;
			onChange?.(newDate);
		}
	}

	function handleInputChange(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		if (!value) return;
		const [year, month, day] = value.split('-').map(Number);
		const newDate = new Date(year, month - 1, day);
		if (!isNaN(newDate.getTime())) {
			date = newDate;
			onChange?.(newDate);
		}
	}
</script>

<StepperSelector
	onPrev={navigatePrev}
	onNext={navigateNext}
	prevDisabled={!previousAllowed}
	nextDisabled={!nextAllowed}
	{prevLabel}
	{nextLabel}
>
	<div class="input-wrapper">
		<input
			type="date"
			value={inputValue}
			min={minDate ? format(minDate, 'yyyy-MM-dd') : undefined}
			max={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
			onchange={handleInputChange}
		/>
	</div>
</StepperSelector>

<style>
	.input-wrapper {
		display: flex;
		align-items: center;

		&:focus-within {
			z-index: 1;
		}
	}

	input[type='date'] {
		appearance: none;
		color: var(--color-text-primary);
		background: transparent;
		padding: 0.25rem 0.5rem;
		border: none;
		font-size: 0.875rem;
		cursor: pointer;

		&:focus-visible {
			position: relative;
			z-index: 1;
		}
	}
</style>

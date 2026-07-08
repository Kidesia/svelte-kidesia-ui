<script lang="ts">
	import ExpandMore from '~icons/material-symbols/expand-more-rounded';

	import i18n from '$lib/i18n/index.svelte';

	import StepperSelector from './StepperSelector.svelte';

	type Props = {
		year: number;
		minYear?: number;
		maxYear?: number;
		onChange?: (year: number) => void;
	};

	let {
		year = $bindable(),
		minYear = 2020,
		maxYear = new Date().getFullYear() + 2,
		onChange
	}: Props = $props();

	const yearOptions = $derived.by(() => {
		const years: number[] = [];
		for (let i = minYear; i <= maxYear; i++) {
			years.push(i);
		}
		return years;
	});

	function decrementYear() {
		if (year > minYear) {
			const newYear = year - 1;
			year = newYear;
			onChange?.(newYear);
		}
	}

	function incrementYear() {
		const max = maxYear ?? new Date().getFullYear() + 2;
		if (year < max) {
			const newYear = year + 1;
			year = newYear;
			onChange?.(newYear);
		}
	}

	function handleSelectChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newYear = parseInt(target.value, 10);
		year = newYear;
		onChange?.(newYear);
	}
</script>

<StepperSelector
	onPrev={decrementYear}
	onNext={incrementYear}
	prevDisabled={year <= minYear}
	nextDisabled={year >= maxYear}
	prevLabel={i18n.t('common.previousYear')}
	nextLabel={i18n.t('common.nextYear')}
>
	<div class="select-wrapper">
		<select value={year} onchange={handleSelectChange}>
			{#each yearOptions as yearOption (yearOption)}
				<option value={yearOption}>{yearOption}</option>
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
		font-size: 1rem;
		cursor: pointer;

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

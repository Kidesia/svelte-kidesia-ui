<script lang="ts" generics="T extends string | number">
	import Chip from './Chip.svelte';
	import Checkbox from './form/Checkbox.svelte';

	type Props = {
		options: { label: string; value: T }[];
		selectedValues: T[];
		asChips?: boolean;
	};

	let { options, selectedValues = $bindable(), asChips = false }: Props = $props();

	function handleChange(value: T, checked: boolean) {
		if (checked) {
			selectedValues = [...selectedValues, value];
		} else {
			selectedValues = selectedValues.filter((v) => v !== value);
		}
	}
</script>

<div class="checkbox-group" class:chips={asChips}>
	{#each options as option (option.value)}
		{#if asChips}
			<Chip
				label={option.label}
				bind:checked={
					() => selectedValues.includes(option.value),
					(checked) => handleChange(option.value, checked)
				}
			/>
		{:else}
			<Checkbox
				label={option.label}
				checked={selectedValues.includes(option.value)}
				onchange={() => handleChange(option.value, !selectedValues.includes(option.value))}
			/>
		{/if}
	{/each}
</div>

<style>
	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		&.chips {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}
</style>

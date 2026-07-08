<script module lang="ts">
	export type SortDirection = 'asc' | 'desc';

	export type SortOption = {
		id: string;
		label: string;
	};
</script>

<script lang="ts">
	import ArrowDownIcon from '~icons/material-symbols/arrow-downward-rounded';
	import ArrowUpIcon from '~icons/material-symbols/arrow-upward-rounded';
	import CheckIcon from '~icons/material-symbols/check-rounded';

	import i18n from '$lib/i18n/index.svelte';

	import DropDown from './DropDown.svelte';

	type Props = {
		options: SortOption[];
		sortId: string;
		direction: SortDirection;
		onChange: (sortId: string, direction: SortDirection) => void;
	};

	const { options, sortId, direction, onChange }: Props = $props();

	const activeOption = $derived(options.find((option) => option.id === sortId));

	// Selecting the active option again flips the direction.
	function select(optionId: string) {
		if (optionId === sortId) {
			onChange(optionId, direction === 'asc' ? 'desc' : 'asc');
		} else {
			onChange(optionId, 'asc');
		}
	}
</script>

<DropDown
	triggerStyle="filter"
	labelPrefix={i18n.t('list.sort')}
	label={`${activeOption?.label ?? ''} ${direction === 'asc' ? '↑' : '↓'}`}
	ariaLabel={i18n.t('list.sort')}
	showCloseButton={false}
>
	<div class="options">
		{#each options as option (option.id)}
			{@const selected = option.id === sortId}
			<button
				class="option"
				class:selected
				onclick={() => {
					select(option.id);
				}}
			>
				<span class="check">
					{#if selected}
						<CheckIcon />
					{/if}
				</span>
				<span class="label">{option.label}</span>
				<span class="direction">
					{#if selected}
						{#if direction === 'asc'}
							<ArrowUpIcon />
						{:else}
							<ArrowDownIcon />
						{/if}
					{/if}
				</span>
			</button>
		{/each}
	</div>
</DropDown>

<style>
	.options {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 12rem;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.5rem;
		border-radius: 0.375rem;
		background: none;
		border: none;
		font: inherit;
		font-size: 0.875rem;
		color: var(--color-text-primary);
		text-align: left;
		cursor: pointer;
		transition: background-color 0.15s ease;

		&:hover {
			background-color: var(--color-interactive-hover-bg);
		}

		&.selected {
			font-weight: 600;
		}
	}

	.label {
		flex: 1;
	}

	.check,
	.direction {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
		color: var(--color-icon-active);
	}

	.check :global(svg),
	.direction :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>

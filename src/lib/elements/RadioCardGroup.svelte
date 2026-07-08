<script lang="ts" generics="T extends unknown">
	import CheckedIcon from '~icons/material-symbols/check-circle';
	import UncheckedIcon from '~icons/material-symbols/radio-button-unchecked';

	type Props = {
		/** The currently selected value (two-way bindable) */
		value: T | undefined;
		/** The items to display */
		items: { value: T; label: string; description?: string; disabled?: boolean }[];
		/** Render the options "inline" (wrapping grid) instead of stacked (vertical) */
		inline?: boolean;
		/** Optional hook for side-effects when the user selects a new value */
		onChange?: (next: T) => void;
	};

	let { value = $bindable(), items, inline, onChange }: Props = $props();
</script>

<div class="choice-tiles direction-{inline ? 'horizontal' : 'vertical'}">
	{#each items as item (item.value)}
		<label class="choice-tile" class:disabled={item.disabled}>
			<input
				type="radio"
				bind:group={value}
				value={item.value}
				disabled={item.disabled}
				onchange={() => onChange?.(item.value)}
			/>

			<div class="icon" class:checked={value === item.value}>
				{#if value === item.value}
					<CheckedIcon />
				{:else}
					<UncheckedIcon />
				{/if}
			</div>

			<div class="text">
				<div class="title">{item.label}</div>
				{#if item.description}
					<div class="description">{item.description}</div>
				{/if}
			</div>
		</label>
	{/each}
</div>

<style>
	.choice-tiles {
		&.direction-horizontal {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 0.5rem;
		}

		&.direction-vertical {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	.choice-tile {
		display: flex;
		flex: 1 1 45%;
		gap: 0.25rem;
		cursor: pointer;
		border-radius: 0.5rem;
		background-color: var(--color-bg-surface);
		border: 1px solid var(--color-border-primary);
		padding: 1rem;
		color: var(--color-text-primary);

		&.disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		&:has(input:checked) {
			border-color: var(--color-primary);
			background-color: var(--color-primary-subtle);
			color: var(--color-on-primary-subtle);

			.title,
			.description {
				color: var(--color-on-primary-subtle);
			}
		}

		.title {
			font-weight: 600;
			color: var(--color-text-primary);
		}

		.description {
			color: var(--color-text-secondary);
		}

		.icon {
			width: 1.5rem;
			height: 1.5rem;
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--color-icon-primary);
			flex-shrink: 0;

			&.checked {
				color: var(--color-on-primary-subtle);
			}
		}

		input {
			display: none;
		}
	}
</style>

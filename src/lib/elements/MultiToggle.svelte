<script lang="ts" generics="TKey extends string">
	type Props = {
		value: TKey;
		options: { value: TKey; label: string }[];
		onChange: (key: TKey) => void;
	};

	// TODO: make bindable
	const { options, value, onChange }: Props = $props();
</script>

<div class="toggle control-surface">
	{#each options as item (item.value)}
		<button
			type="button"
			class="item tight-focus"
			class:active={item.value === value}
			onclick={() => {
				onChange(item.value);
			}}
		>
			{item.label}
		</button>
	{/each}
</div>

<style>
	.toggle {
		display: flex;
		width: fit-content;
		max-width: 100%;
		user-select: none;
		overflow: hidden;
		flex-shrink: 1;
		flex-wrap: wrap;
	}

	.item {
		position: relative;
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		white-space: nowrap;
		color: var(--color-text-secondary);
		transition:
			background-color 0.15s ease,
			color 0.15s ease;

		&:focus-visible {
			z-index: 1;
		}

		&:first-child {
			border-radius: calc(0.5rem - 1px) 0 0 calc(0.5rem - 1px);
		}

		&:last-child {
			border-radius: 0 calc(0.5rem - 1px) calc(0.5rem - 1px) 0;
		}
	}

	.item + .item {
		border-left: 1px solid var(--color-border-primary);
	}

	.item:hover:not(.active) {
		background-color: var(--color-interactive-hover);
	}

	.item.active {
		background-color: var(--color-interactive-active-bg);
		color: var(--color-interactive-active-fg);
		font-weight: 600;
	}
</style>

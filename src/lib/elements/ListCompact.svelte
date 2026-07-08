<script lang="ts" generics="T extends { id: number | string }">
	import type { Snippet } from 'svelte';

	type Props = {
		items: T[];
		Item: Snippet<[T]>;
		noItemsLabel?: string;
		getSubtitle?: (item: T, prevItem: T | undefined) => string | undefined;
		onClick?: (item: T) => void;
	};

	const { items, Item, noItemsLabel, getSubtitle, onClick }: Props = $props();
</script>

<div class="list-compact">
	{#if !items.length}
		<div class="no-entries">
			{noItemsLabel ?? ''}
		</div>
	{/if}

	{#each items as item, index (item.id)}
		{@const subtitle = getSubtitle?.(item, items[index - 1])}
		{#if subtitle}
			<div class="subtitle">{subtitle}</div>
		{/if}

		{#if onClick}
			<button
				class="item clickable"
				onclick={() => {
					onClick(item);
				}}
			>
				{@render Item(item)}
			</button>
		{:else}
			<div class="item">
				{@render Item(item)}
			</div>
		{/if}
	{/each}
</div>

<style>
	.list-compact {
		display: flex;
		flex-direction: column;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.25rem;
		padding: 0.625rem 0;
		border-bottom: 1px solid var(--color-divider);
		border-radius: 0;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
	}

	.item:last-child {
		border-bottom: none;
	}

	button.item {
		border-left: none;
		border-right: none;
		border-top: none;
		cursor: pointer;
		transition: background-color 0.15s ease;

		&:hover {
			background-color: var(--color-interactive-hover-bg);
		}
	}

	.subtitle {
		padding: 0.75rem 0 0.25rem;
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-tertiary);
	}

	.no-entries {
		padding: 0.75rem 0;
		color: var(--color-text-muted);
	}
</style>

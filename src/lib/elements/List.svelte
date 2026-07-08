<script lang="ts" generics="T extends { id: number | string }">
	import type { Snippet } from 'svelte';
	import ChevronRight from '~icons/material-symbols/chevron-right-rounded';

	import i18n from '$lib/i18n/index.svelte';

	import Spinner from './Spinner.svelte';

	type Props = {
		items?: T[];
		loading?: boolean;
		itemComponent: Snippet<[T]>;
		nestedItemComponent?: Snippet<[T]>;
		emptyMessage?: string;
		onItemClick?: (item: T) => void;
		/** Double-click shortcut, typically jumping to the item's full page. */
		onItemDoubleClick?: (item: T) => void;
		groupBy?: (item: T) => string;
	};

	let {
		items,
		loading = false,
		itemComponent,
		nestedItemComponent,
		emptyMessage = i18n.t('common.noEntries'),
		onItemClick,
		onItemDoubleClick,
		groupBy
	}: Props = $props();

	// Consecutive items with the same group label form one titled block;
	// items are expected to arrive already sorted by group.
	const groups = $derived.by(() => {
		if (!items || items.length === 0) return [];
		if (!groupBy) return [{ label: undefined as string | undefined, items }];
		const result: { label: string | undefined; items: T[] }[] = [];
		for (const item of items) {
			const label = groupBy(item);
			const current = result[result.length - 1];
			if (current && current.label === label) {
				current.items.push(item);
			} else {
				result.push({ label, items: [item] });
			}
		}
		return result;
	});
</script>

<div class="list-container" class:grouped={!!groupBy}>
	{#if groups.length > 0}
		{#each groups as group, groupIndex (group.label ?? groupIndex)}
			{#if group.label !== undefined}
				<div class="group-title">{group.label}</div>
			{/if}
			<div class="group-block">
				{#each group.items as item (item.id)}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<svelte:element
						this={onItemClick ? 'button' : 'div'}
						class="list-item"
						type={onItemClick ? 'button' : undefined}
						onclick={onItemClick
							? () => {
									onItemClick(item);
								}
							: undefined}
						ondblclick={onItemDoubleClick
							? () => {
									onItemDoubleClick(item);
								}
							: undefined}
					>
						<div class="list-item-content">
							{@render itemComponent(item)}
						</div>
						{#if onItemClick}
							<span class="chevron" aria-hidden="true">
								<ChevronRight />
							</span>
						{/if}
					</svelte:element>
					{#if nestedItemComponent}
						<div class="nested-item">
							{@render nestedItemComponent(item)}
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	{:else if !loading}
		<div class="no-entries">{emptyMessage}</div>
	{/if}

	{#if loading}
		<div class="loading">
			<Spinner />
		</div>
	{/if}
</div>

<style>
	.list-container {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-lg);
		background-color: var(--color-bg-surface);
		min-height: 100px;
	}

	.list-container.grouped {
		background-color: transparent;
		gap: 0;
	}

	.group-block {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-lg);
		background-color: var(--color-bg-surface);
	}

	.group-title {
		padding: 1rem 0.25rem 0.375rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-tertiary);
	}

	.list-container > .group-title:first-child {
		padding-top: 0;
	}

	.list-item {
		padding: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid var(--color-border-subtle);
		background-color: var(--color-bg-surface);
		user-select: none;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.group-block .list-item:first-child {
		border-top-left-radius: 0.7rem;
		border-top-right-radius: 0.7rem;
	}

	.group-block .list-item:last-child {
		border-bottom-left-radius: 0.7rem;
		border-bottom-right-radius: 0.7rem;
	}

	.group-block .list-item:not(:last-child) {
		border-bottom: none;
	}

	button.list-item {
		width: 100%;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	button.list-item:hover {
		background-color: var(--color-interactive-hover-bg);
	}

	.chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		font-size: 1.25rem;
		color: var(--color-text-tertiary);
	}

	button.list-item:hover .chevron {
		color: var(--color-text-secondary);
	}

	.list-item-content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		/* Kill the auto minimum so nowrap row content can shrink and ellipsize. */
		min-width: 0;
	}

	.nested-item {
		padding-left: 1rem;
		padding-top: 3px;
	}

	.no-entries {
		padding: 1rem;
		text-align: center;
		color: var(--color-text-muted);
	}

	.loading {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-lg);
	}
</style>

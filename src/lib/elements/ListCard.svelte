<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import ChevronRight from '~icons/material-symbols/chevron-right-rounded';

	import i18n from '$lib/i18n/index.svelte';

	import Card from './Card.svelte';
	import QueryWrapper from './QueryWrapper.svelte';

	const ROW_ANIM_MS = 220;

	let rowsHeight = $state(0);
	let pinnedHeight = $state(0);
	$effect(() => {
		if (rowsHeight > pinnedHeight) pinnedHeight = rowsHeight;
	});
	// Release the pin once the list legitimately empties so the empty
	// state doesn't hold a stale tall slot.
	$effect(() => {
		if (items.length === 0) pinnedHeight = 0;
	});

	type Props = {
		title: string;
		titleInfo?: string;
		href?: string;
		items: T[];
		total?: number;
		loading?: boolean;
		error?: unknown;
		reload?: () => void;
		emptyText: string;
		itemsAlign?: 'center' | 'start';
		onItemClick?: (item: T) => void;
		itemKey: (item: T) => string | number | undefined;
		item: Snippet<[T]>;
	};

	const {
		title,
		titleInfo,
		href,
		items,
		total,
		loading = false,
		error,
		reload,
		emptyText,
		itemsAlign = 'center',
		onItemClick,
		itemKey,
		item
	}: Props = $props();

	const effectiveTotal = $derived(total ?? items.length);
	const hasMore = $derived(total !== undefined && items.length < total);
	// Drive QueryWrapper's spinner only while there's nothing to show yet.
	const wrapperQuery = $derived({
		loading,
		error,
		data: items.length > 0 ? items : undefined,
		reload: reload ?? (() => {})
	});
</script>

<Card {title} {titleInfo} padded={false}>
	{#snippet action()}
		{#if href && effectiveTotal > 0}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="link" {href}>{i18n.t('common.showAll')} →</a>
		{/if}
	{/snippet}

	<div class="body">
		<QueryWrapper queries={[wrapperQuery]}>
			{#if !error}
				{#if effectiveTotal > 0}
					<div class="count">
						{#if hasMore}
							{i18n.t('common.showingNOfTotal', { n: items.length, total: effectiveTotal })}
						{:else}
							{i18n.t('common.openCount', { n: effectiveTotal })}
						{/if}
					</div>
				{/if}

				{#if items.length}
					<div
						class="rows"
						class:align-start={itemsAlign === 'start'}
						bind:offsetHeight={rowsHeight}
						style:min-height={pinnedHeight ? `${pinnedHeight}px` : null}
					>
						{#each items as it (itemKey(it))}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<svelte:element
								this={onItemClick ? 'button' : 'div'}
								class="row"
								type={onItemClick ? 'button' : undefined}
								animate:flip={{ duration: ROW_ANIM_MS }}
								transition:slide={{ duration: ROW_ANIM_MS }}
								onclick={onItemClick
									? () => {
											onItemClick(it);
										}
									: undefined}
							>
								{@render item(it)}
								{#if onItemClick}
									<span class="chevron" aria-hidden="true">
										<ChevronRight />
									</span>
								{/if}
							</svelte:element>
						{/each}
					</div>
				{:else if !loading}
					<div class="muted">{emptyText}</div>
				{/if}
			{/if}
		</QueryWrapper>
	</div>
</Card>

<style>
	.body {
		position: relative;
		min-height: 4rem;
	}

	.count {
		padding: 0.75rem 1rem 0;
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.muted {
		padding: 1rem;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.rows {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--color-divider);
	}
	.row:first-child {
		border-top: none;
	}

	.align-start .row {
		align-items: flex-start;
	}

	button.row {
		width: 100%;
		background: none;
		border-left: none;
		border-right: none;
		border-bottom: none;
		text-align: left;
		font: inherit;
		color: inherit;
		cursor: pointer;
	}
	button.row:hover {
		background-color: var(--color-interactive-hover-bg);
	}

	.chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		align-self: center;
		flex-shrink: 0;
		font-size: 1.25rem;
		color: var(--color-text-tertiary);
	}
	button.row:hover .chevron {
		color: var(--color-text-secondary);
	}

	.link {
		color: var(--color-text-secondary);
		text-decoration: none;
		white-space: nowrap;
	}
	.link:hover {
		color: var(--color-primary);
	}
</style>

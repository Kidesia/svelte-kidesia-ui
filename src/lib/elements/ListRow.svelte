<script module lang="ts">
	export type ListRowMetaItem = {
		label: string;
		value: string;
		align?: 'start' | 'end';
		tone?: 'negative';
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		subtitle?: string;
		meta?: ListRowMetaItem[];
		leading?: Snippet;
		indicators?: Snippet;
		badges?: Snippet;
	};

	const { title, subtitle, meta, leading, indicators, badges }: Props = $props();
</script>

<div class="list-row">
	{#if leading}
		{@render leading()}
	{/if}

	<div class="identity">
		<span class="title">{title}</span>
		{#if subtitle}
			<span class="subtitle">{subtitle}</span>
		{/if}
	</div>

	{#if indicators}
		<div class="indicators">
			{@render indicators()}
		</div>
	{/if}

	{#if meta && meta.length > 0}
		<div class="meta">
			{#each meta as item (item.label)}
				<div class="meta-item" class:align-end={item.align === 'end'}>
					<span class="meta-label">{item.label}</span>
					<span class="meta-value" class:negative={item.tone === 'negative'}>{item.value}</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if badges}
		<div class="badges">
			{@render badges()}
		</div>
	{/if}
</div>

<style>
	.list-row {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		min-width: 0;
	}

	.identity {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 10rem;
	}

	.title {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.subtitle {
		font-size: 0.8125rem;
		color: var(--color-text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.meta {
		flex: 1;
		display: flex;
		gap: 2rem;
		/* Kill the auto minimum: nowrap values must never size the column grid. */
		min-width: 0;
	}

	.meta-item {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 6rem;
		max-width: 20rem;
	}

	.meta-item.align-end {
		align-items: flex-end;
	}

	.meta-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-tertiary);
		white-space: nowrap;
	}

	.meta-value {
		font-size: 0.875rem;
		color: var(--color-text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.meta-item.align-end .meta-value {
		font-variant-numeric: tabular-nums;
	}

	.meta-value.negative {
		color: var(--color-error-text);
	}

	.indicators {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		flex-shrink: 0;
	}

	.badges {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.375rem;
		flex-shrink: 0;
		min-width: 8rem;
	}

	.badges:empty {
		display: none;
	}

	@media (max-width: 900px) {
		.meta {
			display: none;
		}
	}
</style>

<script lang="ts">
	export type NameValueRow = {
		label: string;
		value: string;
		href?: string;
		// Middle-truncate the value when it overflows, keeping the tail visible
		// (useful for file names, where the extension matters).
		middleEllipsis?: boolean;
	};

	type Props = {
		rows: (NameValueRow | false | undefined | null)[];
	};

	const { rows }: Props = $props();

	const visibleRows = $derived(rows.filter((row): row is NameValueRow => !!row));
</script>

<div class="name-value-list">
	{#each visibleRows as row, index (index)}
		<div class="name-value">
			<span class="name">{row.label}</span>
			{#if row.href}
				<a href={row.href}>{row.value}</a>
			{:else if row.middleEllipsis}
				<span class="value truncated" title={row.value}>
					<span class="truncated-head">{row.value.slice(0, -8)}</span><span class="truncated-tail"
						>{row.value.slice(-8)}</span
					>
				</span>
			{:else}
				<span class="value">{row.value}</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.name-value {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.25rem 0;
	}

	.name {
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.value {
		text-align: right;
	}

	.truncated {
		display: flex;
		justify-content: flex-end;
		overflow: hidden;
		min-width: 0;
	}

	.truncated-head {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.truncated-tail {
		white-space: nowrap;
		flex-shrink: 0;
	}

	a {
		text-align: right;
		color: var(--color-link);
	}
</style>

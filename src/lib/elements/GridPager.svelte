<script lang="ts">
	import ChevronLeft from '~icons/material-symbols/chevron-left-rounded';
	import ChevronRight from '~icons/material-symbols/chevron-right-rounded';

	import i18n from '$lib/i18n/index.svelte';

	import Button from './Button.svelte';
	import Select from './form/Select.svelte';

	type Props = {
		page: number;
		lastPage: number;
		pageSize: number;
		totalCount: number;
		pageSizeOptions?: number[];
		onPageChange: (page: number) => void;
		onPageSizeChange: (pageSize: number) => void;
	};

	const {
		page,
		lastPage,
		pageSize,
		totalCount,
		pageSizeOptions = [30, 50, 100],
		onPageChange,
		onPageSizeChange
	}: Props = $props();

	const effectiveLastPage = $derived(Math.max(1, lastPage));
</script>

<div class="pager">
	<div class="pager-count">
		{i18n.t('common.pagination.results', { count: totalCount })}
	</div>

	<div class="pager-nav">
		<Button
			icon={ChevronLeft}
			tooltip={i18n.t('common.pagination.previous')}
			disabled={page <= 1}
			onClick={() => onPageChange(page - 1)}
		/>
		<span class="pager-label">
			{i18n.t('common.pagination.pageOf', { page, lastPage: effectiveLastPage })}
		</span>
		<Button
			icon={ChevronRight}
			tooltip={i18n.t('common.pagination.next')}
			disabled={page >= effectiveLastPage}
			onClick={() => onPageChange(page + 1)}
		/>
	</div>

	<label class="pager-size">
		<Select
			value={pageSize}
			onchange={(e) => onPageSizeChange(Number((e.target as HTMLSelectElement).value))}
		>
			{#each pageSizeOptions as option (option)}
				<option value={option}>{option}</option>
			{/each}
		</Select>
		<span class="pager-size-label">{i18n.t('common.pagination.perPage')}</span>
	</label>
</div>

<style>
	.pager {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.5rem 0.25rem;
		flex-wrap: wrap;
	}

	.pager-count {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.pager-nav {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.pager-label {
		font-size: 0.875rem;
		color: var(--color-text-primary);
		font-variant-numeric: tabular-nums;
		min-width: 7rem;
		text-align: center;
	}

	.pager-size {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.pager-size-label {
		white-space: nowrap;
	}
</style>
